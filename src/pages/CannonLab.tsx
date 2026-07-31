import React, { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { Play, RotateCcw, Settings2, Info, Crosshair, Bomb, ShieldAlert } from "lucide-react"
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

// SFX Generator (Menggunakan pola yang sama dengan CatapultLab tapi disesuaikan)
const playSfx = (type: 'boom' | 'hit' | 'crumble', intensity: number = 1) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (type === 'boom') {
      // White noise explosion
      const bufferSize = audioCtx.sampleRate * 0.5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100 + intensity * 500, audioCtx.currentTime); // Lebih keras = lebih bright
      filter.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.5);
      
      noise.connect(filter);
      filter.connect(gainNode);
      
      gainNode.gain.setValueAtTime(Math.min(1.0, 0.5 + intensity * 0.5), audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      noise.start();
    } else if (type === 'hit') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(Math.min(0.5, intensity * 0.05), audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'crumble') {
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

export default function CannonLab() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const rockRef = useRef<Matter.Body | null>(null)
  const stackRef = useRef<Matter.Composite | null>(null)

  // Konstanta Layout
  const CANNON_X = 100;
  const CANNON_Y = 400; // Dasar roda meriam

  // Variabel Fisika Utama (Sesuai Permintaan)
  const [gunpowder, setGunpowder] = useState<number>(50); // Banyak Mesiu (1-100)
  const [barrelWidth, setBarrelWidth] = useState<number>(30); // Kesempitan laras (10-50 px)
  const [elevation, setElevation] = useState<number>(30); // Sudut (0-90 derajat)
  const [projectileMass, setProjectileMass] = useState<number>(5); // Massa proyektil (1-50 kg)
  const [wallDensity, setWallDensity] = useState<number>(0.005); // Kerapatan Dinding (0.001 - 0.05)
  const [gravityY, setGravityY] = useState<number>(1.0); // Multiplier
  
  // Telemetri
  const [isFired, setIsFired] = useState<boolean>(false);
  const [calculatedPressure, setCalculatedPressure] = useState<number>(0);
  const [muzzleVelocity, setMuzzleVelocity] = useState<number>(0);

  // Efek Partikel Custom
  const particles = useRef<{x: number, y: number, vx: number, vy: number, life: number}[]>([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Composites, Events, Composite } = Matter;

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
    // Wall Kiri, Kanan (agak tebal agar bola tidak tembus), Ceiling tinggi
    const wallLeft = Bodies.rectangle(-20, 250, 40, 500, { isStatic: true });
    const wallRight = Bodies.rectangle(820, 250, 40, 500, { isStatic: true });
    const ceiling = Bodies.rectangle(400, -1000, 810, 40, { isStatic: true }); 

    World.add(engine.world, [ground, wallLeft, wallRight, ceiling]);

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

    // Mencegah peluru tembus tembok (Tunneling Effect)
    Events.on(engine, 'beforeUpdate', () => {
      if (rockRef.current) {
        const MAX_SPEED = 25; // Maksimal pindah 25px per frame agar tidak lompat tembus bata (lebar bata 40px)
        if (rockRef.current.speed > MAX_SPEED) {
          Matter.Body.setSpeed(rockRef.current, MAX_SPEED);
        }
      }
    });

    // Custom Render untuk Menggambar Meriam secara Dinamis!
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      if (!ctx) return;

      // Ambil nilai terbaru dari state secara langsung (menggunakan ref atau closure trick)
      // Karena ini dalam useEffect closure, kita harus hati-hati dengan state stale.
      // Kita akan membaca state via referensi langsung kalau bisa, tapi karena bereaksi re-render,
      // Render object akan di-patch setiap ada re-render, atau kita gunakan ref untuk state.
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    buildWall();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []); // Run once

  // Closure trap avoidance: Use ref to store latest state for the render loop
  const stateRef = useRef({ elevation, barrelWidth, gunpowder, isFired });
  useEffect(() => {
    stateRef.current = { elevation, barrelWidth, gunpowder, isFired };
  }, [elevation, barrelWidth, gunpowder, isFired]);

  // Hook Custom Render
  useEffect(() => {
    if (!renderRef.current) return;
    const render = renderRef.current;
    const { Events } = Matter;

    const afterRenderListener = () => {
      const ctx = render.context;
      if (!ctx) return;

      const { elevation, barrelWidth, isFired } = stateRef.current;
      const angleRad = -elevation * (Math.PI / 180); // Negatif karena Y membesar ke bawah
      
      const barrelLength = 80;

      ctx.save();
      // Translate ke engsel meriam
      ctx.translate(CANNON_X, CANNON_Y);

      // Gambar Roda Meriam (Belakang)
      ctx.beginPath();
      ctx.arc(0, 40, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Rotasi sesuai sudut elevasi
      ctx.rotate(angleRad);

      // Gambar Laras Dinamis (Tebal tergantung Kesempitan Laras)
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.strokeStyle = '#334155'; // slate-800
      ctx.lineWidth = 3;
      
      // Menggambar bentuk laras menyempit di ujung
      ctx.beginPath();
      ctx.moveTo(-20, -30); // Pangkal atas
      ctx.lineTo(barrelLength, -barrelWidth / 2); // Ujung atas
      ctx.lineTo(barrelLength, barrelWidth / 2); // Ujung bawah
      ctx.lineTo(-20, 30); // Pangkal bawah
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gambar lubang ujung laras
      ctx.beginPath();
      ctx.moveTo(barrelLength, -barrelWidth / 2);
      ctx.lineTo(barrelLength, barrelWidth / 2);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();

      // Draw Custom Particles
      const dt = 0.016;
      ctx.save();
      for (let i = particles.current.length - 1; i >= 0; i--) {
        let p = particles.current.length ? particles.current[i] : null;
        if (!p) continue;

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 2;
        
        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * (Math.random() * 15 + 5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${250}, ${Math.floor(p.life * 150)}, 0, ${p.life})`; // Fire color
        ctx.fill();
      }
      ctx.restore();
    };

    Events.on(render, 'afterRender', afterRenderListener);

    return () => {
      Events.off(render, 'afterRender', afterRenderListener);
    };
  }, []);

  // Update Fisika saat State Berubah
  useEffect(() => {
    if (engineRef.current) engineRef.current.world.gravity.y = gravityY;
  }, [gravityY]);

  // Kalkulasi Real-Time Pressure
  useEffect(() => {
    // P = E / V ~ Mesiu / Diameter (Pendekatan pseudo-physics untuk game edukasi)
    const pressure = (gunpowder * 10) / barrelWidth;
    setCalculatedPressure(pressure);
  }, [gunpowder, barrelWidth]);

  const buildWall = () => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const { World, Bodies, Composites } = Matter;

    // Hapus tembok lama & proyektil
    const bodiesToRemove = engine.world.bodies.filter(b => b.label === 'brick' || b.label === 'rock');
    World.remove(engine.world, bodiesToRemove);
    if (stackRef.current) World.remove(engine.world, stackRef.current);

    // Bikin Tembok Baru
    const stack = Composites.stack(550, 100, 5, 8, 0, 0, (x: number, y: number) => {
      return Bodies.rectangle(x, y, 40, 45, {
        label: 'brick',
        density: wallDensity,
        friction: 0.8,
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
    setIsFired(false);
    setMuzzleVelocity(0);
  };

  const handleFire = () => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const { World, Bodies, Body } = Matter;

    // Jika ada batu lama, hapus
    const oldRock = engine.world.bodies.find(b => b.label === 'rock');
    if (oldRock) World.remove(engine.world, oldRock);

    // Hitung posisi tembak (Ujung laras)
    const barrelLength = 80;
    const angleRad = -elevation * (Math.PI / 180);
    const startX = CANNON_X + barrelLength * Math.cos(angleRad);
    const startY = CANNON_Y + barrelLength * Math.sin(angleRad);

    // Buat Peluru (Proyektil)
    // Radius bola disesuaikan dengan massa agar visual lebih masuk akal, atau tetap sama. Kita buat tetap tapi berat.
    const rock = Bodies.circle(startX, startY, Math.min(15, barrelWidth/2 - 2), { 
      density: projectileMass / 500, // Skala massa relatif terhadap bata
      restitution: 0.4,
      friction: 0.1,
      label: 'rock',
      render: { fillStyle: '#1e293b', strokeStyle: '#cbd5e1', lineWidth: 2 } // Bola besi gelap
    });
    rockRef.current = rock;
    World.add(engine.world, rock);

    // Aplikasikan Gaya Pelontar (F = P * A pseudo-formula)
    // Pressure tinggi -> Gaya lenting tinggi
    // Massa proyektil -> Mempengaruhi akselerasi (a = F/m otomatis diurus engine)
    const forceMagnitude = calculatedPressure * 0.005; 
    
    Body.applyForce(rock, rock.position, {
      x: forceMagnitude * Math.cos(angleRad),
      y: forceMagnitude * Math.sin(angleRad)
    });

    setMuzzleVelocity(rock.speed * 60); // px/frame -> estimasi speed

    // SFX & VFX Partikel Meledak di ujung laras
    playSfx('boom', gunpowder / 100);
    
    // Fire particles
    for(let i=0; i<20; i++) {
      particles.current.push({
        x: startX,
        y: startY,
        vx: (Math.random() * 500 + 200) * Math.cos(angleRad) + (Math.random()-0.5)*200,
        vy: (Math.random() * 500 + 200) * Math.sin(angleRad) + (Math.random()-0.5)*200,
        life: 1.0
      });
    }

    setIsFired(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Bomb size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Meriam & Dinding</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              Balistik & Tekanan Gas
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Uji bagaimana volume laras (Kesempitan), bahan peledak, dan gravitasi mempengaruhi tumbukan benda tegar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* PANEL KENDALI */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-4 dark:border-slate-800">
              <Settings2 size={20} className="text-rose-500" /> Parameter Meriam
            </div>

            <div className="space-y-6">
              
              {/* Banyak Mesiu */}
              <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <label className="text-sm font-bold text-rose-700 dark:text-rose-400 flex justify-between mb-2">
                  Banyak Mesiu (Energi) <span>{gunpowder} unit</span>
                </label>
                <input
                  type="range" min="1" max="100" step="1"
                  value={gunpowder}
                  onChange={(e) => setGunpowder(parseInt(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              {/* Kesempitan Laras */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Diameter Laras (Pengekang Gas) <span>{barrelWidth} cm</span>
                </label>
                <input
                  type="range" min="10" max="50" step="1"
                  value={barrelWidth}
                  onChange={(e) => setBarrelWidth(parseInt(e.target.value))}
                  className="w-full accent-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1 flex justify-between">
                  <span>Sempit (Tekanan Tinggi)</span>
                  <span>Lebar (Bocor)</span>
                </p>
              </div>

              {/* Sudut Elevasi */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Sudut Elevasi (Tembak) <span>{elevation}°</span>
                </label>
                <input
                  type="range" min="0" max="90" step="1"
                  value={elevation}
                  onChange={(e) => setElevation(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>

              {/* Massa Proyektil */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Massa Proyektil (Bola Besi) <span>{projectileMass} kg</span>
                </label>
                <input
                  type="range" min="1" max="100" step="1"
                  value={projectileMass}
                  onChange={(e) => setProjectileMass(parseInt(e.target.value))}
                  className="w-full accent-slate-700"
                />
              </div>

              {/* Kepadatan Dinding */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Kerapatan Tembok Bata <span>{(wallDensity * 1000).toFixed(1)} unit</span>
                </label>
                <input
                  type="range" min="0.001" max="0.05" step="0.001"
                  value={wallDensity}
                  onChange={(e) => {
                    setWallDensity(parseFloat(e.target.value));
                    buildWall(); // Rebuild tembok otomatis
                  }}
                  className="w-full accent-red-600"
                />
              </div>

              {/* Gravitasi */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Gravitasi Area <span>{gravityY.toFixed(1)} G</span>
                </label>
                <input
                  type="range" min="0.1" max="3" step="0.1"
                  value={gravityY}
                  onChange={(e) => setGravityY(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

            </div>
          </div>

          {/* CANVAS & TELEMETRY */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 relative h-[530px] flex flex-col">
              
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex gap-2">
                  <button onClick={buildWall} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <RotateCcw size={16} /> Susun Ulang Bata
                  </button>
                </div>
                
                <button
                  onClick={handleFire}
                  className="px-8 py-2 rounded-full font-black text-white flex items-center gap-2 bg-rose-600 hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95"
                >
                  <Bomb size={20} /> TEMBAK!
                </button>
              </div>

              <div 
                ref={sceneRef} 
                className="w-full flex-1 bg-slate-900 rounded-2xl shadow-inner border border-slate-800 overflow-hidden relative"
              />
            </div>

            {/* Telemetri */}
            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border-2 border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div className="col-span-2 md:col-span-1 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Tekanan Laras (P)</p>
                <p className="font-mono font-bold text-3xl text-rose-400">
                  {calculatedPressure.toFixed(0)} <span className="text-sm">kPa</span>
                </p>
              </div>
              
              <div className="col-span-2 md:col-span-1 bg-slate-800 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Kec. Moncong (v₀)</p>
                <p className="font-mono font-bold text-3xl text-sky-400">
                  {muzzleVelocity.toFixed(0)} <span className="text-sm">m/s</span>
                </p>
              </div>
              
              <div className="col-span-2 md:col-span-2 bg-rose-950/30 p-4 rounded-xl border border-rose-900/50 flex gap-3 items-start">
                <Info size={24} className="text-rose-400 shrink-0" />
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  <strong className="text-rose-300">Konsep Fisika:</strong> Tekanan ($P = F/A$) berbanding terbalik dengan luas penampang laras. Semakin sempit laras, gas memampat, menghasilkan gaya tolak ekstrim yang melontarkan bola peluru jauh lebih cepat!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
