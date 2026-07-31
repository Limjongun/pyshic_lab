import React, { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Play, RotateCcw, Crosshair, Zap, Activity, Info, StopCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Fisika Konstan dan Skala Visal
const SCALE = 50; // 50 pixels = 1 unit fisika (meter)
const DT = 0.016; // Asumsi 60fps (~16ms)

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  q: number; // Muatan
  m: number; // Massa
  color: string;
  path: {x: number, y: number}[];
  active: boolean;
}

export default function MagnetLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // State UI Controls
  const [B, setB] = useState<number>(2.0); // Medan Magnet (Tesla) (-5 hingga 5)
  const [v, setV] = useState<number>(5.0); // Kecepatan (m/s) (1 hingga 10)
  const [qType, setQType] = useState<'proton' | 'electron'>('proton'); // Jenis Partikel
  
  // State Telemetri
  const [r, setR] = useState<number>(0);
  const [F, setF] = useState<number>(0);

  const particlesRef = useRef<Particle[]>([]);

  // Update telemetri saat parameter berubah
  useEffect(() => {
    const qVal = qType === 'proton' ? 1 : -1;
    const mVal = 1; // Simplifikasi massa = 1 unit
    const F_mag = Math.abs(qVal * v * B);
    const radius = Math.abs(B) > 0.01 ? (mVal * v) / Math.abs(qVal * B) : Infinity;
    
    setF(F_mag);
    setR(radius);
  }, [B, v, qType]);

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, currentB: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Warna dasar layar CRT
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    if (Math.abs(currentB) < 0.1) return; // Medan magnet mendekati nol

    const step = 40;
    // B Positif (Masuk Layar) = Biru/Indigo, B Negatif (Keluar Layar) = Merah/Pink
    ctx.fillStyle = currentB > 0 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 63, 94, 0.3)';
    ctx.strokeStyle = currentB > 0 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 63, 94, 0.3)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';

    // Opacity relatif terhadap kekuatan medan B (max 5)
    const opacity = Math.max(0.1, Math.min(1.0, Math.abs(currentB) / 5.0));
    ctx.globalAlpha = opacity;

    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        if (currentB > 0) {
          // Masuk Layar (Cross / X)
          ctx.fillText('×', x, y);
        } else {
          // Keluar Layar (Dot / .)
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1.0;
  };

  const drawGun = (ctx: CanvasRenderingContext2D, height: number) => {
    const gunY = height / 2;
    ctx.fillStyle = '#475569'; // slate-600
    ctx.fillRect(0, gunY - 15, 40, 30);
    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.fillRect(40, gunY - 5, 20, 10);
    
    // Tanda positif/negatif pada gun sesuai partikel
    ctx.fillStyle = qType === 'proton' ? '#ef4444' : '#3b82f6';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(qType === 'proton' ? '+' : '-', 20, gunY);
  };

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      if (!p.active) continue;

      // 1. Fisika Update (Euler)
      // F = q(v x B)
      // v = (vx, vy, 0), B = (0, 0, B_z)
      // v x B = (vy*B_z, -vx*B_z, 0)
      const ax = (p.q * p.vy * B) / p.m;
      const ay = (-p.q * p.vx * B) / p.m;

      p.vx += ax * DT;
      p.vy += ay * DT;
      
      p.x += p.vx * DT * SCALE;
      p.y += p.vy * DT * SCALE;

      p.path.push({ x: p.x, y: p.y });

      // Matikan jika keluar layar terlalu jauh
      if (p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100 || p.path.length > 2000) {
        p.active = false;
      }

      // 2. Menggambar Jejak Lintasan (Trail)
      if (p.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.path[0].x, p.path[0].y);
        for (let j = 1; j < p.path.length; j++) {
          ctx.lineTo(p.path[j].x, p.path[j].y);
        }
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        // Efek glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        
        ctx.shadowBlur = 0; // reset
      }

      // 3. Menggambar Partikel
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = p.color;
      ctx.stroke();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBackground(ctx, canvas.width, canvas.height, B);
    drawGun(ctx, canvas.height);
    updateAndDrawParticles(ctx, canvas.width, canvas.height);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [B]); // Re-bind saat B berubah agar update loop pakai nilai B terbaru

  const fireParticle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const qVal = qType === 'proton' ? 1 : -1;
    const newParticle: Particle = {
      x: 60, // Di ujung pistol
      y: canvas.height / 2,
      vx: v, // Kecepatan awal horizontal
      vy: 0,
      q: qVal,
      m: 1, // unit
      color: qType === 'proton' ? '#ef4444' : '#3b82f6', // red for proton, blue for electron
      path: [{ x: 60, y: canvas.height / 2 }],
      active: true
    };

    particlesRef.current.push(newParticle);
  };

  const clearParticles = () => {
    particlesRef.current = [];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Crosshair size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Magnet & Gaya Lorentz</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
              <Info size={16} /> Bantuan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2">
                  <Zap size={18} className="text-indigo-500" /> Tabung Sinar Partikel
                </h2>
                <div className="flex gap-2">
                  <button onClick={clearParticles} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <RotateCcw size={16} /> Bersihkan
                  </button>
                  <button onClick={fireParticle} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95">
                    <Play size={16} className="fill-white" /> Tembakkan Partikel
                  </button>
                </div>
              </div>
              <div className="relative aspect-video w-full bg-[#0f172a] overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  width={800} 
                  height={450} 
                  className="w-full h-full cursor-crosshair"
                />
              </div>
            </div>

            {/* Teori Singkat */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Info size={18} className="text-indigo-500" /> Penjelasan Rumus
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Gaya Lorentz terjadi ketika partikel bermuatan bergerak memotong garis medan magnet. Arah gayanya dapat ditentukan menggunakan Kaidah Tangan Kanan. Partikel akan menempuh lintasan melingkar karena gaya ini selalu tegak lurus dengan kecepatan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Rumus Gaya Lorentz</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">F = q · v · B</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Jari-jari Lintasan (r)</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">r = m · v / (q · B)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            
            {/* Telemetry Display */}
            <div className="bg-indigo-600 dark:bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500 dark:bg-indigo-800 rounded-full blur-2xl opacity-50"></div>
              <h2 className="font-bold flex items-center gap-2 mb-6 relative z-10">
                <Activity size={18} /> Telemetri Fisika
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end pb-3 border-b border-indigo-500/30">
                  <span className="text-indigo-100 text-sm">Gaya Lorentz (F)</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{F.toFixed(1)}</span>
                    <span className="text-indigo-200 ml-1">N</span>
                  </div>
                </div>
                <div className="flex justify-between items-end pb-3 border-b border-indigo-500/30">
                  <span className="text-indigo-100 text-sm">Jari-jari (r)</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{r === Infinity ? '∞' : r.toFixed(2)}</span>
                    <span className="text-indigo-200 ml-1">m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              
              {/* Jenis Partikel */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jenis Partikel (q)</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setQType('proton')}
                    className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${qType === 'proton' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    + Proton
                  </button>
                  <button 
                    onClick={() => setQType('electron')}
                    className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${qType === 'electron' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    - Elektron
                  </button>
                </div>
              </div>

              {/* Medan Magnet */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Medan Magnet Eksternal (B)</label>
                  <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                    {B > 0 ? '+' : ''}{B.toFixed(1)} Tesla
                  </span>
                </div>
                <input 
                  type="range" 
                  min="-5" max="5" step="0.1"
                  value={B} 
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Keluar Layar (Negatif)</span>
                  <span>Masuk Layar (Positif)</span>
                </div>
              </div>

              {/* Kecepatan Partikel */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kecepatan Tembak (v)</label>
                  <span className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                    {v.toFixed(1)} m/s
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" max="10" step="0.1"
                  value={v} 
                  onChange={(e) => setV(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
