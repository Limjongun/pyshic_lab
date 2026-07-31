import React, { useState, useEffect, useRef } from "react"
import { Play, RotateCcw, Wrench, Settings, ChevronUp, ChevronDown, Power, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react"
import Matter from "matter-js"
import { useStore } from "@/store/useStore"

type ComponentType = "box" | "wheel" | "fan" | "ball" | "empty";
type ComponentDirection = "up" | "down" | "left" | "right";

interface VehicleComponent {
  id: string;
  type: ComponentType;
  x: number; // Grid X (0-4)
  y: number; // Grid Y (0-4)
  props: {
    mass: number;
    friction: number;
    force?: number;
    duration?: number;
    direction?: ComponentDirection;
    isStatic?: boolean;
  };
}

const GRID_COLS = 5;
const GRID_ROWS = 5;
const CELL_SIZE = 60;
const START_X = 200; 
const START_Y = 150;
const MAP_SEGMENTS = 20;
const SEGMENT_WIDTH = 200;

export default function ChallengeVehicle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<ComponentType>("box");
  const [grid, setGrid] = useState<Record<string, VehicleComponent>>({});
  const [terrainHeights, setTerrainHeights] = useState<number[]>(Array(MAP_SEGMENTS + 1).fill(450));
  const [selectedItem, setSelectedItem] = useState<VehicleComponent | null>(null);
  
  // Kontrol In-Game
  const [fanOn, setFanOn] = useState(false);
  
  // Tipe Konstruksi
  const [chassisMode, setChassisMode] = useState<"solid" | "lentur">("solid");

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  const fanActiveRef = useRef(false);

  const { setLastLab, addActivity, updateChallengeScore } = useStore();

  useEffect(() => { fanActiveRef.current = fanOn; }, [fanOn]);

  useEffect(() => {
    setLastLab({
      name: "Tantangan Builder Kendaraan",
      desc: "Rakit kendaraan dari balok dan turbin untuk melewati rintangan",
      url: "/challenges/vehicle"
    });
    addActivity({
      title: "Membuka Tantangan Builder Kendaraan",
      type: "challenge"
    });
  }, [setLastLab, addActivity]);

  const getSmoothPoints = (heights: number[]) => {
    const pts: {x: number, y: number}[] = [];
    const SUBDIVISIONS = 10;
    
    for (let i = 0; i < heights.length - 1; i++) {
        const p0 = heights[Math.max(i - 1, 0)];
        const p1 = heights[i];
        const p2 = heights[i + 1];
        const p3 = heights[Math.min(i + 2, heights.length - 1)];

        for (let j = 0; j < SUBDIVISIONS; j++) {
            const t = j / SUBDIVISIONS;
            const t2 = t * t;
            const t3 = t2 * t;
            const y = 0.5 * (
                (2 * p1) +
                (-p0 + p2) * t +
                (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
                (-p0 + 3 * p1 - 3 * p2 + p3) * t3
            );
            pts.push({ x: (i * SEGMENT_WIDTH) + (t * SEGMENT_WIDTH), y });
        }
    }
    pts.push({ x: (heights.length - 1) * SEGMENT_WIDTH, y: heights[heights.length - 1] });
    return pts;
  }

  const changeTerrain = (index: number, delta: number) => {
    const newH = [...terrainHeights];
    newH[index] = Math.min(700, Math.max(100, newH[index] - delta));
    setTerrainHeights(newH);
  }

  const handleGridClick = (x: number, y: number) => {
    if (isPlaying) return;
    const key = `${x},${y}`;
    if (activeTool === "empty") {
      const newGrid = { ...grid };
      delete newGrid[key];
      setGrid(newGrid);
      setSelectedItem(null);
    } else {
      const isExist = grid[key];
      if (isExist && isExist.type === activeTool) {
        setSelectedItem(isExist);
      } else {
        const newItem: VehicleComponent = {
          id: key,
          type: activeTool,
          x, y,
          props: {
            mass: activeTool === "ball" ? 1 : activeTool === "wheel" ? 0.5 : 2,
            friction: activeTool === "wheel" ? 0.8 : 0.2,
            force: activeTool === "fan" ? 0.1 : undefined,
            duration: undefined,
            direction: activeTool === "fan" ? "right" : undefined,
            isStatic: activeTool === "box" ? false : undefined
          }
        };
        setGrid({ ...grid, [key]: newItem });
        setSelectedItem(newItem);
      }
    }
  }

  const updateSelectedProp = (key: keyof VehicleComponent["props"], value: any) => {
    if (!selectedItem) return;
    const updated = { ...selectedItem, props: { ...selectedItem.props, [key]: value } };
    setGrid({ ...grid, [selectedItem.id]: updated });
    setSelectedItem(updated);
  }

  const startSimulation = () => {
    if (Object.keys(grid).length === 0) return;
    setIsPlaying(true);
    setFanOn(false);

    updateChallengeScore("vehicle_builder", "Tantangan Builder Kendaraan", "Berjalan");
    addActivity({ title: "Menjalankan Simulasi Kendaraan", type: "lab" });

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Composite = Matter.Composite,
          Bodies = Matter.Bodies,
          Constraint = Matter.Constraint,
          Events = Matter.Events,
          Body = Matter.Body;

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: MAP_SEGMENTS * SEGMENT_WIDTH,
        height: 600,
        wireframes: false,
        background: 'transparent',
      }
    });
    renderRef.current = render;

    // 1. BUAT TERRAIN
    const smoothPoints = getSmoothPoints(terrainHeights);
    const terrainBodies = [];
    for (let i = 0; i < smoothPoints.length - 1; i++) {
      const p1 = smoothPoints[i];
      const p2 = smoothPoints[i + 1];
      
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      terrainBodies.push(Bodies.rectangle(cx, cy + 25, length + 4, 50, { 
        isStatic: true, 
        angle: angle,
        friction: 0.8,
        render: { visible: false }
      }));
    }
    terrainBodies.push(Bodies.rectangle(-25, 300, 50, 1000, { isStatic: true, render: { visible: false } }));
    terrainBodies.push(Bodies.rectangle(MAP_SEGMENTS * SEGMENT_WIDTH + 25, 300, 50, 1000, { isStatic: true, render: { visible: false } }));
    Composite.add(engine.world, terrainBodies);

    const thrusters: any[] = [];
    const allBodiesToRender: Matter.Body[] = [];

    // 2. BUAT KENDARAAN
    if (chassisMode === "solid") {
       // --- MODE SOLID (COMPOUND BODY) ---
       const nonWheels = Object.values(grid).filter(i => i.type !== "wheel");
       const wheels = Object.values(grid).filter(i => i.type === "wheel");
       const visited = new Set<string>();
       const clusters: VehicleComponent[][] = [];

       // Cari cluster yang saling terhubung
       nonWheels.forEach(item => {
          if (visited.has(item.id)) return;
          const cluster: VehicleComponent[] = [];
          const queue = [item];
          visited.add(item.id);

          while(queue.length > 0) {
             const curr = queue.shift()!;
             cluster.push(curr);
             nonWheels.forEach(other => {
                if (!visited.has(other.id)) {
                   const dx = Math.abs(curr.x - other.x);
                   const dy = Math.abs(curr.y - other.y);
                   if (dx + dy === 1) { // adjacent
                      visited.add(other.id);
                      queue.push(other);
                   }
                }
             });
          }
          clusters.push(cluster);
       });

       const chassisBodies: Matter.Body[] = [];
       clusters.forEach(cluster => {
          const parts: Matter.Body[] = [];
          cluster.forEach(item => {
             const px = START_X + (item.x * CELL_SIZE) + (CELL_SIZE / 2);
             const py = START_Y + (item.y * CELL_SIZE) + (CELL_SIZE / 2);
             let pBody: any;
             if (item.type === "box") {
                pBody = Bodies.rectangle(px, py, CELL_SIZE, CELL_SIZE, { render: { fillStyle: item.props.isStatic ? '#52525b' : '#b45309' }, label: "box_part" });
             } else if (item.type === "ball") {
                pBody = Bodies.circle(px, py, CELL_SIZE/2 - 4, { render: { fillStyle: '#22c55e' }, label: "ball_part" });
             } else if (item.type === "fan") {
                pBody = Bodies.rectangle(px, py, CELL_SIZE, CELL_SIZE, { render: { fillStyle: '#cbd5e1' }, label: `fan_part_${item.props.direction}` });
                thrusters.push({ item, body: null, part: null, force: item.props.force || 0.1, dir: item.props.direction, type: "fan" });
             }
             if(pBody) {
                pBody.itemRef = item;
                parts.push(pBody);
             }
          });

          const totalMass = cluster.reduce((s, i) => s + i.props.mass, 0);
          const avgFriction = cluster.reduce((s, i) => s + i.props.friction, 0) / cluster.length;
          const isStatic = cluster.some(i => i.props.isStatic);

          const chassis = Body.create({
             parts: parts,
             mass: totalMass,
             friction: avgFriction,
             isStatic: isStatic,
             label: "chassis"
          });

          // Link thrusters to this chassis
          chassis.parts.forEach((p: any) => {
             if (p.itemRef) {
                const th = thrusters.find(t => t.item.id === p.itemRef.id);
                if (th) { th.body = chassis; th.part = p; }
             }
          });

          chassisBodies.push(chassis);
          allBodiesToRender.push(chassis);
       });
       Composite.add(engine.world, chassisBodies);

       // Pasang Roda ke Chassis terdekat
       wheels.forEach(wItem => {
          const px = START_X + (wItem.x * CELL_SIZE) + (CELL_SIZE / 2);
          const py = START_Y + (wItem.y * CELL_SIZE) + (CELL_SIZE / 2);
          const wBody = Bodies.circle(px, py, CELL_SIZE/2 - 2, { 
             mass: wItem.props.mass, friction: wItem.props.friction,
             restitution: 0.1, label: "wheel",
             render: { fillStyle: '#334155' }
          });
          allBodiesToRender.push(wBody);
          Composite.add(engine.world, wBody);

          const neighbors = [
             `${wItem.x+1},${wItem.y}`, `${wItem.x-1},${wItem.y}`,
             `${wItem.x},${wItem.y+1}`, `${wItem.x},${wItem.y-1}`
          ];

          let attachedChassis = null;
          for(const ch of chassisBodies) {
             if (ch.parts.some((p: any) => p.itemRef && neighbors.includes(p.itemRef.id))) {
                attachedChassis = ch; break;
             }
          }

          if (attachedChassis) {
             const localPointA = {
                x: px - attachedChassis.position.x,
                y: py - attachedChassis.position.y
             };
             Composite.add(engine.world, Constraint.create({
                bodyA: attachedChassis, pointA: localPointA,
                bodyB: wBody, pointB: { x: 0, y: 0 },
                stiffness: 1, length: 0,
                render: { strokeStyle: '#475569', lineWidth: 4 }
             }));
          }
       });

    } else {
       // --- MODE LENTUR (FULL PHYSICS CONSTRAINTS) ---
       const bodyMap: Record<string, Matter.Body> = {};
       
       Object.values(grid).forEach(item => {
          const px = START_X + (item.x * CELL_SIZE) + (CELL_SIZE / 2);
          const py = START_Y + (item.y * CELL_SIZE) + (CELL_SIZE / 2);
          let body;

          if (item.type === "box") {
            body = Bodies.rectangle(px, py, CELL_SIZE-2, CELL_SIZE-2, { 
              mass: item.props.mass, friction: item.props.friction,
              isStatic: item.props.isStatic,
              label: "box", render: { fillStyle: item.props.isStatic ? '#52525b' : '#b45309' }
            });
          } else if (item.type === "wheel") {
            body = Bodies.circle(px, py, CELL_SIZE/2 - 2, { 
              mass: item.props.mass, friction: item.props.friction,
              restitution: 0.1, label: "wheel", render: { fillStyle: '#334155' }
            });
          } else if (item.type === "ball") {
            body = Bodies.circle(px, py, CELL_SIZE/2 - 4, { 
              mass: item.props.mass, friction: item.props.friction,
              restitution: 0.5, label: "ball", render: { fillStyle: '#22c55e' }
            });
          } else if (item.type === "fan") {
            body = Bodies.rectangle(px, py, CELL_SIZE-2, CELL_SIZE-2, { 
              mass: item.props.mass, friction: item.props.friction,
              label: `fan_${item.props.direction}`, render: { fillStyle: '#cbd5e1' }
            });
            thrusters.push({ body, force: item.props.force || 0.1, dir: item.props.direction, type: "fan" });
          }

          if (body) {
             bodyMap[item.id] = body;
             allBodiesToRender.push(body);
          }
       });

       const constraints = [];
       const keys = Object.keys(grid);
       
       for (let i = 0; i < keys.length; i++) {
         for (let j = i + 1; j < keys.length; j++) {
           const a = grid[keys[i]];
           const b = grid[keys[j]];
           const dx = Math.abs(a.x - b.x);
           const dy = Math.abs(a.y - b.y);

           if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
             if (a.type === "wheel" || b.type === "wheel") {
                constraints.push(Constraint.create({
                   bodyA: bodyMap[a.id], bodyB: bodyMap[b.id],
                   stiffness: 1, length: CELL_SIZE,
                   render: { strokeStyle: '#475569', lineWidth: 4 }
                }));
             } else {
                constraints.push(Constraint.create({
                   bodyA: bodyMap[a.id], bodyB: bodyMap[b.id],
                   stiffness: 1, length: CELL_SIZE, render: { visible: false }
                }));
             }
           }
           
           if (dx === 1 && dy === 1 && a.type !== "wheel" && b.type !== "wheel") {
               constraints.push(Constraint.create({
                   bodyA: bodyMap[a.id], bodyB: bodyMap[b.id],
                   stiffness: 1, length: CELL_SIZE * Math.SQRT2, render: { visible: false }
               }));
           }
         }
       }
       Composite.add(engine.world, Object.values(bodyMap));
       Composite.add(engine.world, constraints);
    }

    // 4. LOGIKA GAYA DORONG
    Events.on(engine, 'beforeUpdate', () => {
      thrusters.forEach(t => {
        let isActive = false;

        if (t.type === "fan" && fanActiveRef.current) {
           isActive = true;
        } else if (t.type === "fan" && !fanActiveRef.current) {
           if (t.part) t.part.label = t.part.label.replace('_spinning', '');
           else if (t.body) t.body.label = t.body.label.replace('_spinning', '');
        }

        if (isActive && t.body) {
          const targetLabel = t.part ? t.part : t.body;
          if (t.type === "fan" && !targetLabel.label.includes('_spinning')) {
             targetLabel.label += '_spinning';
          }
          
          const angle = t.body.angle; 
          let lx = 0, ly = 0;
          
          // MULTIPLY FORCE BY 5 FOR BETTER GAMEPLAY
          const appliedForce = t.force * 5; 
          
          if (t.dir === "right") lx = appliedForce;
          if (t.dir === "left") lx = -appliedForce;
          if (t.dir === "up") ly = -appliedForce;
          if (t.dir === "down") ly = appliedForce;

          const fx = lx * Math.cos(angle) - ly * Math.sin(angle);
          const fy = lx * Math.sin(angle) + ly * Math.cos(angle);
          
          const pos = t.part ? t.part.position : t.body.position;
          Matter.Body.applyForce(t.body, pos, { x: fx, y: fy });
        }
      });
    });

    // 5. CUSTOM EMOJI RENDERER
    Events.on(render, 'afterRender', () => {
       const ctx = render.context;
       ctx.font = "34px Arial";
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       
       const drawPart = (p: any, bAngle: number) => {
          ctx.save();
          ctx.translate(p.position.x, p.position.y);
          ctx.rotate(bAngle); // Rotate with the main body
          
          if (p.label.startsWith("fan")) {
             const labelParts = p.label.split("_");
             const dir = labelParts[labelParts.length - 1]; // "up" or "spinning"
             const actualDir = (dir === "spinning") ? labelParts[labelParts.length - 2] : dir;
             const aOff = actualDir === "up" ? -Math.PI/2 : actualDir === "down" ? Math.PI/2 : actualDir === "left" ? Math.PI : 0;
             ctx.rotate(aOff);
             if (p.label.includes("_spinning")) {
                 ctx.rotate((Date.now() % 1000) / 50); // Fast spin animation
             }
             ctx.fillText("🌀", 0, 0);
          } else if (p.label.startsWith("ball")) {
             ctx.fillText("🐷", 0, 0);
          } else if (p.label.startsWith("wheel")) {
             ctx.fillText("⚙️", 0, 0);
          }
          ctx.restore();
       };

       allBodiesToRender.forEach(b => {
          if (b.label === "chassis") {
             b.parts.forEach(p => {
                if (p === b) return; 
                drawPart(p, b.angle);
             });
          } else {
             drawPart(b, b.angle);
          }
       });
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  }

  const stopSimulation = () => {
    setIsPlaying(false);
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
    }
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    setSelectedItem(null);
  }

  const getRotationClass = (dir?: string) => {
    if (dir === "up") return "-rotate-90";
    if (dir === "down") return "rotate-90";
    if (dir === "left") return "rotate-180";
    return "";
  }

  const smoothPointsSVG = getSmoothPoints(terrainHeights);

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Wrench className="text-amber-500" />
            Physics Vehicle Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Rakit kendaraan, pasang turbin dan roket, lalu taklukkan jalur buatanmu sendiri!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow border border-slate-200 dark:border-slate-800 space-y-6 lg:col-span-1">
          
          <div className="space-y-3">
            <p className="font-bold text-slate-700 dark:text-slate-300">Toolbox (Pilih & Taruh)</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setActiveTool("box")} className={`p-3 rounded-xl border-2 font-bold transition-colors ${activeTool === "box" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/40 dark:text-amber-300" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>🟫 Rangka</button>
              <button onClick={() => setActiveTool("wheel")} className={`p-3 rounded-xl border-2 font-bold transition-colors ${activeTool === "wheel" ? "border-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-300" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>⚙️ Roda</button>
              <button onClick={() => setActiveTool("fan")} className={`p-3 rounded-xl border-2 font-bold transition-colors ${activeTool === "fan" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>🌀 Kipas</button>
              <button onClick={() => setActiveTool("ball")} className={`p-3 rounded-xl border-2 font-bold transition-colors ${activeTool === "ball" ? "border-green-500 bg-green-50 dark:bg-green-900/40 dark:text-green-300" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>🐷 Babi</button>
              <button onClick={() => setActiveTool("empty")} className={`col-span-2 p-3 rounded-xl border-2 font-bold transition-colors ${activeTool === "empty" ? "border-red-500 bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400" : "border-slate-200 dark:border-slate-700 text-red-500 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>🗑️ Hapus</button>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          <div className="min-h-[220px]">
            {selectedItem && !isPlaying ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="text-slate-500"/>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 capitalize">{selectedItem.type} Settings</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">Massa (kg) <span>{selectedItem.props.mass}</span></label>
                  <input type="range" min="0.1" max="10" step="0.1" value={selectedItem.props.mass} onChange={(e) => updateSelectedProp("mass", parseFloat(e.target.value))} className="w-full" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex justify-between">Friksi <span>{selectedItem.props.friction}</span></label>
                  <input type="range" min="0" max="1" step="0.05" value={selectedItem.props.friction} onChange={(e) => updateSelectedProp("friction", parseFloat(e.target.value))} className="w-full" />
                </div>

                {selectedItem.props.force !== undefined && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-500 dark:text-rose-400 flex justify-between">Gaya Dorong <span>{selectedItem.props.force.toFixed(2)}</span></label>
                    <input type="range" min="0.05" max="2" step="0.05" value={selectedItem.props.force} onChange={(e) => updateSelectedProp("force", parseFloat(e.target.value))} className="w-full accent-rose-500" />
                  </div>
                )}
                
                {selectedItem.props.isStatic !== undefined && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500">Tipe Balok</label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <button onClick={() => updateSelectedProp("isStatic", false)} className={`flex-1 py-1 text-sm font-bold rounded-md ${!selectedItem.props.isStatic ? 'bg-amber-500 text-white shadow' : 'text-slate-500'}`}>Dinamis (Jatuh)</button>
                      <button onClick={() => updateSelectedProp("isStatic", true)} className={`flex-1 py-1 text-sm font-bold rounded-md ${selectedItem.props.isStatic ? 'bg-slate-600 text-white shadow' : 'text-slate-500'}`}>Terpaku (Statis)</button>
                    </div>
                  </div>
                )}

                {selectedItem.props.direction !== undefined && (
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-sky-500 dark:text-sky-400">Arah Dorongan (Nozzle)</label>
                     <div className="flex gap-2">
                        <button onClick={() => updateSelectedProp("direction", "up")} className={`p-2 rounded border transition-colors ${selectedItem.props.direction === 'up' ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-500 text-sky-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><ArrowUp size={16}/></button>
                        <button onClick={() => updateSelectedProp("direction", "down")} className={`p-2 rounded border transition-colors ${selectedItem.props.direction === 'down' ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-500 text-sky-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><ArrowDown size={16}/></button>
                        <button onClick={() => updateSelectedProp("direction", "left")} className={`p-2 rounded border transition-colors ${selectedItem.props.direction === 'left' ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-500 text-sky-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><ArrowLeft size={16}/></button>
                        <button onClick={() => updateSelectedProp("direction", "right")} className={`p-2 rounded border transition-colors ${selectedItem.props.direction === 'right' ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-500 text-sky-600 dark:text-sky-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><ArrowRight size={16}/></button>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center mt-10">
                {isPlaying ? "Variabel terkunci saat simulasi berjalan." : "Klik komponen di Grid untuk mengubah variabel fisika-nya."}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
             <label className="text-xs font-bold text-slate-500 mb-2 block text-center">Tipe Kekakuan Kendaraan</label>
             <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-4 shadow-inner">
               <button onClick={() => setChassisMode("solid")} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${chassisMode === "solid" ? 'bg-amber-500 text-white shadow' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>🧱 Solid (Compound)</button>
               <button onClick={() => setChassisMode("lentur")} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${chassisMode === "lentur" ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>🔗 Lentur (Physics)</button>
             </div>
             {!isPlaying ? (
                <button onClick={startSimulation} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                  <Play size={24}/> JALANKAN SIMULASI
                </button>
             ) : (
                <button onClick={stopSimulation} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow flex items-center justify-center gap-2 transition-all">
                  <RotateCcw size={24}/> KEMBALI MERAKIT
                </button>
             )}
          </div>

        </div>

        {/* WORKSPACE AREA */}
        <div className="lg:col-span-3 bg-[#87CEEB] rounded-2xl border border-slate-800 relative overflow-hidden h-[600px] flex flex-col">
          
          <div className="w-full flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar">
            {/* SVG Terrain (Selalu tampil di z-0) */}
            <svg className="absolute top-0 left-0 h-full pointer-events-none" style={{ width: `${MAP_SEGMENTS * SEGMENT_WIDTH}px`, zIndex: 0 }}>
               <polygon 
                 points={`${smoothPointsSVG.map(p => `${p.x},${p.y}`).join(' ')} ${MAP_SEGMENTS * SEGMENT_WIDTH},1000 0,1000`} 
                 fill="#4ade80" 
               />
               <polyline 
                 points={smoothPointsSVG.map(p => `${p.x},${p.y}`).join(' ')} 
                 fill="none" stroke="#22c55e" strokeWidth="6" 
               />
            </svg>

            {/* Matter JS Canvas (z-10, background transparent) */}
            <div ref={sceneRef} className="h-full absolute top-0 left-0 pointer-events-none" style={{ width: `${MAP_SEGMENTS * SEGMENT_WIDTH}px`, zIndex: 10 }}>
            </div>

            {/* Controls & Grid (Hanya Build Mode, z-20) */}
            {!isPlaying && (
              <div className="h-full absolute top-0 left-0 pointer-events-auto" style={{ width: `${MAP_SEGMENTS * SEGMENT_WIDTH}px`, zIndex: 20 }}>
                  {terrainHeights.map((h, i) => (
                    <div key={`terrain-${i}`} className="absolute flex flex-col items-center justify-center gap-1 -translate-x-1/2" style={{ left: i * SEGMENT_WIDTH, top: h - 35 }}>
                       <button onClick={() => changeTerrain(i, 25)} className="bg-slate-800 text-white p-1 rounded-full hover:bg-slate-700 shadow border border-slate-600 z-10"><ChevronUp size={16}/></button>
                       <button onClick={() => changeTerrain(i, -25)} className="bg-slate-800 text-white p-1 rounded-full hover:bg-slate-700 shadow border border-slate-600 z-10"><ChevronDown size={16}/></button>
                    </div>
                  ))}

                  <div className="absolute" style={{ left: START_X, top: START_Y, width: GRID_COLS * CELL_SIZE, height: GRID_ROWS * CELL_SIZE }}>
                    {Array.from({length: GRID_ROWS}).map((_, y) => (
                      <div key={y} className="flex">
                        {Array.from({length: GRID_COLS}).map((_, x) => {
                          const key = `${x},${y}`;
                          const item = grid[key];
                          const isSelected = selectedItem?.id === key;
                          
                          return (
                            <div 
                              key={x} 
                              onClick={() => handleGridClick(x, y)}
                              className={`w-[60px] h-[60px] border border-slate-800 border-dashed cursor-pointer relative hover:bg-white/10 transition-colors flex items-center justify-center ${isSelected ? 'ring-2 ring-amber-500 z-10 bg-white/5' : ''}`}
                            >
                               {item?.type === "box" && <div className={`w-[56px] h-[56px] ${item.props.isStatic ? 'bg-slate-600' : 'bg-[#b45309]'} rounded-sm`}></div>}
                               {item?.type === "wheel" && <div className="text-4xl text-slate-400 drop-shadow-md">⚙️</div>}
                               {item?.type === "ball" && <div className="text-4xl drop-shadow-md">🐷</div>}
                               {item?.type === "fan" && <div className={`text-4xl drop-shadow-md transition-transform ${getRotationClass(item.props.direction)}`}>🌀</div>}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>

          {isPlaying && (
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/80 p-4 rounded-2xl backdrop-blur border border-slate-700 z-50 shadow-2xl">
                <button 
                  onClick={() => setFanOn(!fanOn)}
                  className={`px-6 py-3 rounded-xl font-black text-lg flex items-center gap-2 transition-all ${fanOn ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-slate-800 text-slate-400'}`}
                >
                   <Power size={24} /> {fanOn ? "KIPAS ON" : "KIPAS OFF"}
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
