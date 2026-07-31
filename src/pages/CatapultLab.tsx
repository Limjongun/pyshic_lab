import React, { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { Play, RotateCcw, Settings2, Info, Crosshair } from "lucide-react"

// SFX Generator
const playSfx = (type: 'pull' | 'release' | 'hit' | 'crumble', intensity: number = 1) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (type === 'pull') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'release') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'hit') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(Math.min(0.5, intensity * 0.05), audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'crumble') {
      // Noise
      const bufferSize = audioCtx.sampleRate * 0.2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.gain.setValueAtTime(Math.min(0.2, intensity * 0.02), audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      noise.start();
    }

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  } catch (e) {}
}

export default function CatapultLab() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const catapultRef = useRef<Matter.Constraint | null>(null)
  const rockRef = useRef<Matter.Body | null>(null)
  const stackRef = useRef<Matter.Composite | null>(null)

  // Variabel Fisika
  const [stiffness, setStiffness] = useState(0.05) // Konstanta Pegas (k)
  const [rockMass, setRockMass] = useState(5) // kg
  const [brickDensity, setBrickDensity] = useState(0.002) 
  const [gravity, setGravity] = useState(1) // multiplier
  const [isFired, setIsFired] = useState(false)

  // Telemetri
  const [energy, setEnergy] = useState(0)
  const [speed, setSpeed] = useState(0)

  // Setup Engine Matter.js
  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Constraint, Composites, Events, Composite } = Matter;

    const engine = Engine.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 500,
        wireframes: false,
        background: '#0f172a' // slate-900
      }
    });

    engineRef.current = engine;
    renderRef.current = render;

    // Ground & Boundaries
    const ground = Bodies.rectangle(400, 480, 810, 40, { 
      isStatic: true, 
      render: { fillStyle: '#334155' } 
    });

    const wallLeft = Bodies.rectangle(-20, 250, 40, 500, { isStatic: true });
    const wallRight = Bodies.rectangle(820, 250, 40, 500, { isStatic: true });
    const ceiling = Bodies.rectangle(400, -500, 810, 40, { isStatic: true }); // High ceiling

    // Catapult Base (Pillar)
    const pillar = Bodies.rectangle(150, 410, 30, 100, {
      isStatic: true,
      render: { fillStyle: '#78350f' } // amber-900
    });

    World.add(engine.world, [ground, wallLeft, wallRight, ceiling, pillar]);

    // Mouse Controls
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Tumbukan Event for SFX
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        const velocityDiff = Math.abs(bodyA.speed - bodyB.speed);
        
        if (velocityDiff > 2) {
          if (bodyA.label === 'rock' || bodyB.label === 'rock') {
            playSfx('hit', velocityDiff);
          } else if (bodyA.label === 'brick' && bodyB.label === 'brick') {
            playSfx('crumble', velocityDiff);
          }
        }
      }
    });

    // Telemetri Update
    Events.on(engine, 'beforeUpdate', () => {
      if (rockRef.current && catapultRef.current && !isFired) {
        // Calculate Spring Energy E = 0.5 * k * x^2
        const dist = Matter.Vector.magnitude(Matter.Vector.sub(rockRef.current.position, catapultRef.current.pointA!));
        const k = catapultRef.current.stiffness;
        const ep = 0.5 * k * dist * dist;
        setEnergy(ep);
      }

      if (rockRef.current) {
        setSpeed(rockRef.current.speed);

        // Auto-release mechanism: if rock moves right of the pillar after being pulled
        if (catapultRef.current && mouseConstraint.mouse.button === -1) {
          const rx = rockRef.current.position.x;
          // If released and moving forward past anchor
          if (rx > 150) {
            World.remove(engine.world, catapultRef.current);
            catapultRef.current = null;
            setIsFired(true);
            playSfx('release');
          }
        }
      }
    });

    Events.on(mouseConstraint, 'startdrag', (e: any) => {
      if (e.body && e.body.label === 'rock') playSfx('pull');
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Initial Setup
    setupScene();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  // Update Properties when state changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.world.gravity.y = gravity;
    }
  }, [gravity]);

  useEffect(() => {
    if (catapultRef.current) {
      catapultRef.current.stiffness = stiffness;
    }
  }, [stiffness]);

  useEffect(() => {
    if (rockRef.current) {
      Matter.Body.setMass(rockRef.current, rockMass);
    }
  }, [rockMass]);

  const setupScene = () => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const { World, Bodies, Constraint, Composites, Composite } = Matter;

    // Clear previous dynamic bodies and composites
    const bodiesToRemove = engine.world.bodies.filter(b => b.label === 'rock');
    World.remove(engine.world, bodiesToRemove);
    if (catapultRef.current) World.remove(engine.world, catapultRef.current);
    if (stackRef.current) World.remove(engine.world, stackRef.current);

    // Rock
    const rock = Bodies.circle(150, 350, 15, { 
      density: 0.05, 
      restitution: 0.5,
      friction: 0.1,
      label: 'rock',
      render: { fillStyle: '#94a3b8' } // slate-400
    });
    Matter.Body.setMass(rock, rockMass);
    rockRef.current = rock;

    // Catapult Constraint (Elastic Band)
    const catapult = Constraint.create({
      pointA: { x: 150, y: 350 },
      bodyB: rock,
      stiffness: stiffness,
      length: 0,
      render: { strokeStyle: '#fbbf24', lineWidth: 4 } // amber-400
    });
    catapultRef.current = catapult;

    World.add(engine.world, [rock, catapult]);
    setIsFired(false);

    // Bricks Pyramid
    const stack = Composites.pyramid(500, 150, 9, 10, 0, 0, (x: number, y: number) => {
      return Bodies.rectangle(x, y, 30, 40, {
        label: 'brick',
        density: brickDensity,
        friction: 0.5,
        restitution: 0.1,
        render: {
          fillStyle: '#b91c1c', // red-700
          strokeStyle: '#7f1d1d',
          lineWidth: 2
        }
      });
    });
    stackRef.current = stack;
    World.add(engine.world, stack);
  };

  const handleReset = () => {
    playSfx('pull');
    setupScene();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Crosshair className="text-red-500" />
            Catapult & Susunan Bata
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Hukum Hooke pada Ketapel, Gerak Proyektil, dan Tumbukan Benda Tegar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} /> Parameter Ketapel
          </div>

          <div className="space-y-5">
            {/* Kekuatan Pegas */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Kekakuan Tali Ketapel (k) <span>{stiffness.toFixed(3)}</span>
              </label>
              <input
                type="range" min="0.01" max="0.2" step="0.01"
                value={stiffness}
                onChange={(e) => setStiffness(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-xs text-slate-500 mt-1">Semakin kaku, tolakan semakin ganas.</p>
            </div>

            {/* Massa Batu */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Massa Proyektil (m₁) <span>{rockMass.toFixed(1)} kg</span>
              </label>
              <input
                type="range" min="1" max="50" step="1"
                value={rockMass}
                onChange={(e) => setRockMass(parseFloat(e.target.value))}
                className="w-full accent-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">Batu berat butuh pegas lebih kuat.</p>
            </div>

            {/* Kepadatan Bata */}
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <label className="text-sm font-bold text-red-700 dark:text-red-400 flex justify-between mb-2">
                Kepadatan Bata Tembok <span>{(brickDensity * 1000).toFixed(1)} unit</span>
              </label>
              <input
                type="range" min="0.001" max="0.01" step="0.001"
                value={brickDensity}
                onChange={(e) => {
                  setBrickDensity(parseFloat(e.target.value));
                  setupScene(); // Rebuild tembok
                }}
                className="w-full accent-red-600"
              />
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Mengubah ini mereset simulasi bata.</p>
            </div>

            {/* Gravitasi */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Gravitasi Planet (g) <span>{gravity.toFixed(1)}x Bumi</span>
              </label>
              <input
                type="range" min="0.1" max="3" step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <RotateCcw size={20} /> Susun Ulang & Isi Peluru
            </button>
            <p className="text-xs text-center text-slate-500 mt-3 italic">
              *Tarik bola abu-abu ke belakang dengan mouse, lalu lepaskan untuk menembak!
            </p>
          </div>
        </div>

        {/* CANVAS & TELEMETRY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div 
            ref={sceneRef} 
            className="w-full bg-slate-900 rounded-2xl shadow-inner border-2 border-slate-800 overflow-hidden cursor-crosshair relative"
          >
            {/* Target Label Background */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-20">
              <Crosshair size={120} className="text-slate-500" />
            </div>
            
            {!isFired && (
              <div className="absolute top-1/2 left-10 transform -translate-y-1/2 pointer-events-none animate-pulse bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
                &larr; Tarik Bola
              </div>
            )}
          </div>

          {/* Telemetri */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <p className="text-amber-700 dark:text-amber-400 text-xs font-bold mb-1">Energi Pegas Tarikan</p>
              <p className="font-mono font-bold text-2xl text-amber-600 dark:text-amber-300">
                {isFired ? "0" : energy.toFixed(0)} <span className="text-sm">J</span>
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-blue-700 dark:text-blue-400 text-xs font-bold mb-1">Kecepatan Proyektil</p>
              <p className="font-mono font-bold text-2xl text-blue-600 dark:text-blue-300">
                {speed.toFixed(1)} <span className="text-sm">m/s</span>
              </p>
            </div>
            
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-slate-400 mt-0.5" />
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">Fisika Ketapel:</strong> Energi potensial yang tersimpan pada tali ketapel (½ k x²) ditransfer sepenuhnya menjadi energi kinetik (½ m v²) proyektil saat dilepas. Jika bata lebih berat dari proyektil, momentum proyektil tak cukup meruntuhkan tembok!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
