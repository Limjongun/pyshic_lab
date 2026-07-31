import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { Card, CardContent } from '@/components/ui/card';
import { Settings2, Cpu, Zap, Pause, Play, RotateCcw, ThermometerSun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdvanceLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const graphicsRef = useRef<PIXI.Graphics | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const [heat, setHeat] = useState(0); // 0 to 100
  const heatRef = useRef(heat);
  useEffect(() => { heatRef.current = heat; }, [heat]);

  const [autoMotor, setAutoMotor] = useState(false);
  const autoMotorRef = useRef(autoMotor);
  useEffect(() => { autoMotorRef.current = autoMotor; }, [autoMotor]);

  // Fungsi helper untuk membuat Roda Gigi (Gear) menggunakan Matter.js Parts
  const createGear = (x: number, y: number, radius: number, teethCount: number, teethDepth: number, color: string, isStatic = false) => {
    const parts = [
      Matter.Bodies.circle(x, y, radius, { render: { fillStyle: color } })
    ];
    
    const teethWidth = (radius * Math.PI * 2) / teethCount * 0.4;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const tx = x + (radius) * Math.cos(angle);
      const ty = y + (radius) * Math.sin(angle);
      
      const tooth = Matter.Bodies.rectangle(tx, ty, teethDepth, teethWidth, {
        angle: angle,
        render: { fillStyle: color }
      });
      parts.push(tooth);
    }
    
    return Matter.Body.create({
      parts: parts,
      isStatic: isStatic,
      friction: 0.1,
      restitution: 0.1,
      density: 0.05,
      label: 'gear',
      render: { fillStyle: color }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Inisialisasi Matter.js Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    });
    engineRef.current = engine;
    const world = engine.world;

    const width = containerRef.current.clientWidth;
    const height = 700;

    // 2. Inisialisasi Pixi.js (WebGL Renderer)
    const app = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 0x0f172a, // slate-900
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true
    });
    
    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    pixiAppRef.current = app;

    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
    graphicsRef.current = graphics;

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 1.5;
    graphics.filters = [blurFilter];

    // 3. Bangun Arsitektur Mesin Uap
    const bodiesToAdd: (Matter.Body | Matter.Constraint)[] = [];
    const cx = width / 2;

    // --- BOILER (Ruang Pemanas) ---
    const boilerColor = '#334155';
    // Dinding ditebalkan ekstrim (width 100) untuk mencegah efek Quantum Tunneling dari partikel uap berkecepatan tinggi.
    // Inner gap tetap 140 (cx-70 ke cx+70). Center = cx-120 dan cx+120.
    const leftWall = Matter.Bodies.rectangle(cx - 120, 400, 100, 450, { isStatic: true, render: { fillStyle: boilerColor }, label: 'wall' });
    const rightWall = Matter.Bodies.rectangle(cx + 120, 400, 100, 450, { isStatic: true, render: { fillStyle: boilerColor }, label: 'wall' });
    const bottomWall = Matter.Bodies.rectangle(cx, 625, 200, 40, { isStatic: true, render: { fillStyle: '#94a3b8' }, label: 'heater' });
    // Stopper agar piston tidak jatuh sampai ke dasar jika rod terputus
    const leftStopper = Matter.Bodies.rectangle(cx - 60, 450, 20, 10, { isStatic: true, render: { fillStyle: boilerColor }, label: 'stopper' });
    const rightStopper = Matter.Bodies.rectangle(cx + 60, 450, 20, 10, { isStatic: true, render: { fillStyle: boilerColor }, label: 'stopper' });
    bodiesToAdd.push(leftWall, rightWall, bottomWall, leftStopper, rightStopper);

    // --- STEAM PARTICLES (Uap Air) ---
    const particles: Matter.Body[] = [];
    for(let i = 0; i < 60; i++) {
        const p = Matter.Bodies.circle(cx + (Math.random() * 100 - 50), 550 + Math.random() * 50, 6, {
            restitution: 0.8,
            friction: 0.0,
            frictionAir: 0.01,
            density: 0.001,
            label: 'steam',
            render: { fillStyle: '#38bdf8' } // Warna biru air muda
        });
        particles.push(p);
    }
    bodiesToAdd.push(...particles);

    // --- PISTON ---
    // Lebar piston HARUS 138 karena jarak ruang antar dinding (inner gap) adalah persis 140px.
    // Jika lebih dari 140, piston akan bertabrakan dengan dinding dan macet (glitch)!
    const piston = Matter.Bodies.rectangle(cx, 400, 138, 40, {
        restitution: 0.1,
        friction: 0.0,
        density: 0.05, // Cukup berat agar butuh tekanan tinggi
        inertia: Infinity, // KUNCI ROTASI: Piston tidak akan bisa miring/terguling
        label: 'piston',
        render: { fillStyle: '#cbd5e1' } // Silver
    });
    bodiesToAdd.push(piston);

    // Roda Gigi Utama (Merah) yang bertindak sebagai Flywheel
    const flywheel = createGear(cx, 180, 80, 16, 30, '#ef4444');
    Matter.Body.setDensity(flywheel, 0.05); // Turunkan massa agar lebih mudah diputar uap
    const pivotFlywheel = Matter.Constraint.create({
      pointA: { x: cx, y: 180 },
      bodyB: flywheel,
      length: 0,
      stiffness: 1
    });
    
    // Connecting Rod (Batang Penghubung Piston ke Flywheel)
    const rodLength = 160;
    const rod = Matter.Bodies.rectangle(cx, 280, 15, rodLength, {
        density: 0.05,
        label: 'rod',
        render: { fillStyle: '#94a3b8' }
    });

    // Sendi Piston ke Bawah Rod
    const constraintPistonRod = Matter.Constraint.create({
        bodyA: piston,
        pointA: { x: 0, y: -15 },
        bodyB: rod,
        pointB: { x: 0, y: rodLength/2 },
        length: 0,
        stiffness: 1,
        render: { visible: false }
    });

    // Sendi Flywheel ke Atas Rod (Off-center & Miring agar tidak stuck di Dead Center)
    const constraintRodFlywheel = Matter.Constraint.create({
        bodyA: rod,
        pointA: { x: 0, y: -rodLength/2 },
        bodyB: flywheel,
        pointB: { x: 40, y: 30 }, // Off-center miring (x:40, y:30)
        length: 0,
        stiffness: 1,
        render: { visible: false }
    });

    bodiesToAdd.push(flywheel, pivotFlywheel, rod, constraintPistonRod, constraintRodFlywheel);

    // --- GEAR SISTEM TRANSMISI ---
    // Roda Gigi Biru telah dihapus sesuai permintaan.
    
    // Gear 3 (Kuning)
    // Jarak ideal = (Radius Luar Merah 95) + (Radius Dalam Kuning 45) = 140.
    // Posisi Y = 90 (selisih dy = 90). Berdasarkan rumus pitagoras dx = sqrt(140^2 - 90^2) = 107.2
    const gear3 = createGear(cx - 107, 90, 45, 9, 30, '#eab308');
    const pivot3 = Matter.Constraint.create({
      pointA: { x: cx - 107, y: 90 },
      bodyB: gear3,
      length: 0,
      stiffness: 1
    });

    bodiesToAdd.push(gear3, pivot3);

    // Dinding Pembatas Kanvas Kiri/Kanan agar partikel uap yang lolos tidak hilang
    const wallLeft = Matter.Bodies.rectangle(0, height/2, 20, height, { isStatic: true });
    const wallRight = Matter.Bodies.rectangle(width, height/2, 20, height, { isStatic: true });
    const wallTop = Matter.Bodies.rectangle(width/2, 0, width, 20, { isStatic: true });
    bodiesToAdd.push(wallLeft, wallRight, wallTop);

    Matter.World.add(world, bodiesToAdd);

    // 4. Interaksi Mouse
    const mouse = Matter.Mouse.create(app.view as HTMLCanvasElement);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Matter.World.add(world, mouseConstraint);

    // 5. Game Loop (Fisika + Render)
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      // Delta time
      const dt = time - lastTime;
      lastTime = time;

      if (engineRef.current && isPlayingRef.current) {
          
          // --- LOGIKA TERMODINAMIKA MESIN UAP ---
          const currentHeat = heatRef.current;
          if (currentHeat > 0) {
              particles.forEach(p => {
                  // Berikan energi kinetik konstan ke uap air (Upward Force)
                  // Hanya jika partikel berada di dalam boiler atau sekitarnya
                  if (p.position.y > 380) {
                      // Force = base + random * heat level. Diperbesar 30x lipat agar kuat mengangkat piston
                      const upwardForce = (0.003 + Math.random() * 0.004) * (currentHeat / 100);
                      Matter.Body.applyForce(p, p.position, { 
                          x: (Math.random() - 0.5) * 0.001 * (currentHeat/100), 
                          y: -upwardForce 
                      });
                      
                      // Batasi kecepatan maksimal partikel uap agar tidak terjadi Tunneling (menembus piston)
                      if (p.velocity.y < -15) {
                          Matter.Body.setVelocity(p, { x: p.velocity.x, y: -15 });
                      }
                  }
              });
          }

          // Mode Motor Otomatis (menggerakkan flywheel langsung tanpa uap)
          if (autoMotorRef.current) {
              Matter.Body.setAngularVelocity(flywheel, 0.08); // Putar roda gila secara paksa konstan
          } else {
              // Tambahkan gesekan statis ke semua gear agar tidak berputar sendiri bagai gasing
              Matter.Body.setAngularVelocity(flywheel, flywheel.angularVelocity * 0.995);
              Matter.Body.setAngularVelocity(gear3, gear3.angularVelocity * 0.995);
          }

          Matter.Engine.update(engineRef.current, 1000 / 60);
      }

      // --- RENDER PIXI.JS ---
      if (graphicsRef.current && engineRef.current) {
        const g = graphicsRef.current;
        g.clear();

        const allBodies = Matter.Composite.allBodies(engineRef.current.world);

        allBodies.forEach(body => {
          // Khusus efek uap air
          if (body.label === 'steam') {
              const currentHeat = heatRef.current;
              // Jika sangat panas, uap berubah putih. Jika dingin, tetap biru air.
              const isHot = currentHeat > 50;
              const hexColor = isHot ? 0xe2e8f0 : 0x38bdf8;
              const alpha = isHot ? (0.4 + Math.random() * 0.4) : 0.8;
              
              g.beginFill(hexColor, alpha);
              g.drawCircle(body.position.x, body.position.y, 6);
              g.endFill();
              return; // Selesai gambar steam
          }

          // Render body kompleks (berisi banyak parts seperti gear)
          const partsToRender = body.parts.length > 1 ? body.parts.slice(1) : [body];

          partsToRender.forEach(part => {
            let hexColor = 0xffffff;
            if (part.render && part.render.fillStyle && typeof part.render.fillStyle === 'string' && part.render.fillStyle.startsWith('#')) {
              hexColor = parseInt(part.render.fillStyle.replace('#', ''), 16);
            } else if (body.render && body.render.fillStyle && typeof body.render.fillStyle === 'string' && body.render.fillStyle.startsWith('#')) {
              hexColor = parseInt(body.render.fillStyle.replace('#', ''), 16);
            }

            // Pemanas menyala oranye kemerahan jika heat tinggi
            if (body.label === 'heater' && heatRef.current > 0) {
                hexColor = 0xf97316; // Orange
                g.beginFill(hexColor, 0.5 + (heatRef.current/200));
            } else {
                g.beginFill(hexColor, 1);
            }
            
            const path = [];
            for (let i = 0; i < part.vertices.length; i++) {
              path.push(part.vertices[i].x, part.vertices[i].y);
            }
            g.drawPolygon(path);
            g.endFill();
          });
          
          // Center dot untuk gear
          if (body.label === 'gear') {
            g.beginFill(0x000000, 0.5);
            g.drawCircle(body.position.x, body.position.y, 4);
            g.endFill();
          }
        });
        
        // --- GAMBAR CONSTRAINT (Batang Besi) ---
        // Karena constraint tidak terdaftar sebagai body, kita gambar secara manual
        const allConstraints = Matter.Composite.allConstraints(engineRef.current.world);
        allConstraints.forEach(c => {
            if (c.render && c.render.visible === false) return;
            // Jika constraint memiliki bodyA dan bodyB (seperti batang penghubung/joints)
            if (c.bodyA && c.bodyB && !c.pointA && !c.pointB) {
                // Gambar garis
                g.lineStyle(4, 0x64748b, 1);
                g.moveTo(c.bodyA.position.x, c.bodyA.position.y);
                g.lineTo(c.bodyB.position.x, c.bodyB.position.y);
                g.lineStyle(0);
            }
        });
        // Kita telah merepresentasikan Rod sebagai Body, jadi tidak perlu menggambar garisnya secara manual, 
        // tapi kita bisa menggambar Pivot titik sambungan.
        g.beginFill(0x334155, 1);
        // Pin Piston
        g.drawCircle(piston.position.x, piston.position.y - 15, 5);
        // Pin Flywheel (Posisi lokal {x: 40, y: 30} dirotasi sesuai rotasi roda gigi)
        const pinPos = {
            x: flywheel.position.x + 40 * Math.cos(flywheel.angle) - 30 * Math.sin(flywheel.angle),
            y: flywheel.position.y + 40 * Math.sin(flywheel.angle) + 30 * Math.cos(flywheel.angle)
        };
        g.drawCircle(pinPos.x, pinPos.y, 6);
        g.endFill();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <Cpu className="text-blue-500" />
          Advance Lab: Steam Engine Mechanics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Simulasi spektakuler di mana <strong>Termodinamika</strong> dikonversi menjadi <strong>Mekanika Klasik</strong>.
          Tingkatkan suhu kompor uap (Boiler) untuk memberikan energi kinetik pada partikel air, yang mana akan menekan piston ke atas dan menggerakkan seluruh sistem roda gigi lokomotif raksasa!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Panel Kontrol Kiri */}
        <div className="space-y-4">
          <Card className="border-orange-100 dark:border-orange-900/50 shadow-sm dark:bg-slate-900">
            <CardContent className="p-5 space-y-6">
              <h3 className="font-bold text-lg dark:text-white flex items-center gap-2 border-b pb-3 dark:border-slate-800">
                <ThermometerSun size={20} className="text-orange-500" /> Pengatur Suhu Boiler
              </h3>
              
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
                 <div className="text-4xl font-black text-orange-500">
                    {heat}°C
                 </div>
                 <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
                    {heat === 0 ? "Mesin Mati" : heat < 40 ? "Air Hangat" : heat < 80 ? "Menguap Kuat" : "Tekanan Maksimum (Kritis!)"}
                 </div>
              </div>

              <div>
                <input 
                  type="range" 
                  min="0" max="100" step="1" 
                  value={heat} 
                  onChange={(e) => setHeat(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 font-bold mt-1">
                    <span>0°C</span>
                    <span>100°C</span>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-slate-800 flex gap-2">
                <Button 
                  className={`flex-1 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <><Pause size={16} className="mr-2" /> Jeda Simulasi</> : <><Play size={16} className="mr-2" /> Lanjutkan</>}
                </Button>
                <Button variant="outline" size="icon" onClick={() => window.location.reload()} title="Reset Sistem">
                  <RotateCcw size={18} />
                </Button>
              </div>

              <div className="pt-2 border-t dark:border-slate-800">
                  <Button 
                    variant={autoMotor ? "default" : "outline"} 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setAutoMotor(!autoMotor)}
                  >
                      <Cpu size={16} className={autoMotor ? "text-white" : "text-blue-500"} />
                      {autoMotor ? "Matikan Motor Elektrik" : "Aktifkan Motor Elektrik (Tanpa Uap)"}
                  </Button>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">
                      Mode Elektrik akan memutar roda gigi secara langsung, yang otomatis menarik/mendorong piston secara mekanis.
                  </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100 dark:border-blue-900/50 shadow-sm dark:bg-slate-900">
            <CardContent className="p-5">
               <h3 className="font-bold text-md dark:text-white flex items-center gap-2 mb-2">
                <Zap size={18} className="text-yellow-500" /> Analisis Konversi Energi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mesin ini membuktikan Hukum Kekekalan Energi. Energi panas (Kalor) ditransfer menjadi gaya angkat partikel gas, yang kemudian menciptakan Tekanan *(Pressure)*. Tekanan mendorong area Piston, menghasilkan Usaha *(Work)*. Usaha ini disalurkan via batang engkol menjadi Gerak Rotasi Torsi pada roda gigi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Layar Simulasi PixiJS Kanan */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-900 relative">
            <div className="bg-slate-950 text-white px-4 py-2 flex items-center justify-between text-sm border-b border-slate-800 z-10 relative">
              <span className="font-mono flex items-center gap-2 text-orange-400 font-bold">
                <Settings2 size={14} />
                ADVANCE LAB: STEAM ENGINE THERMODYNAMICS
              </span>
              <div className="flex gap-4">
                  <span className="font-mono text-xs text-green-400 animate-pulse">PHYSICS ACTIVE</span>
                  <span className="font-mono text-xs opacity-50">PixiJS v7</span>
              </div>
            </div>
            
            {/* Warning Layer jika terlalu panas */}
            {heat > 85 && (
                <div className="absolute top-12 left-0 right-0 p-2 text-center pointer-events-none z-20">
                    <span className="bg-red-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded animate-pulse">
                        ⚠️ CAUTION: CRITICAL STEAM PRESSURE!
                    </span>
                </div>
            )}

            {/* Kontainer Pixi.js */}
            <div ref={containerRef} className="w-full h-[700px] cursor-crosshair"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
