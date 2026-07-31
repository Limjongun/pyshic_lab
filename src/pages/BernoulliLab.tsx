import React, { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Play, RotateCcw, Droplets, Activity, Info, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Fisika Konstan dan Skala
const RHO = 1000; // Massa jenis air (kg/m^3)
const GRAVITY = 9.81; // m/s^2
const PIXEL_PER_METER = 100; // Skala panjang

interface StreamlineParticle {
  x: number;
  yStartFraction: number; // -0.5 to 0.5 (relative to diameter)
  length: number;
  speedMultiplier: number;
  opacity: number;
}

export default function BernoulliLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // State UI Controls
  const [D1, setD1] = useState<number>(2.0); // Diameter masuk (m)
  const [D2, setD2] = useState<number>(1.0); // Diameter sempit (m)
  const [v1, setV1] = useState<number>(2.0); // Kecepatan masuk (m/s)
  
  // State Telemetri
  const [v2, setV2] = useState<number>(0);
  const [deltaP, setDeltaP] = useState<number>(0);
  const [deltaH, setDeltaH] = useState<number>(0);

  const particlesRef = useRef<StreamlineParticle[]>([]);

  // Update perhitungan analitik saat parameter berubah
  useEffect(() => {
    // A1 v1 = A2 v2 => v2 = v1 * (A1/A2) = v1 * (D1/D2)^2
    const currentV2 = v1 * Math.pow(D1 / D2, 2);
    setV2(currentV2);

    // Bernoulli: P1 - P2 = 0.5 * rho * (v2^2 - v1^2)
    const dP = 0.5 * RHO * (Math.pow(currentV2, 2) - Math.pow(v1, 2));
    setDeltaP(dP);

    // Delta h = dP / (rho * g)
    const dh = dP / (RHO * GRAVITY);
    setDeltaH(dh);
  }, [D1, D2, v1]);

  // Fungsi Interpolasi Geometri Pipa
  const getDiameterAt = (x: number, width: number) => {
    const p1 = 0.25 * width;
    const p2 = 0.4 * width;
    const p3 = 0.6 * width;
    const p4 = 0.75 * width;
    
    const maxD = D1 * PIXEL_PER_METER;
    const minD = D2 * PIXEL_PER_METER;

    if (x < p1) return maxD;
    if (x > p4) return maxD;
    if (x >= p2 && x <= p3) return minD;
    
    if (x >= p1 && x < p2) {
      const t = (x - p1) / (p2 - p1);
      const factor = (1 - Math.cos(t * Math.PI)) / 2;
      return maxD - (maxD - minD) * factor;
    }
    if (x > p3 && x <= p4) {
      const t = (x - p3) / (p4 - p3);
      const factor = (1 - Math.cos(t * Math.PI)) / 2;
      return minD + (maxD - minD) * factor;
    }
    return maxD;
  };

  const initParticles = (count: number, width: number) => {
    particlesRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      yStartFraction: (Math.random() - 0.5) * 0.9, // Avoid sticking exactly to the wall
      length: 15 + Math.random() * 20,
      speedMultiplier: 0.9 + Math.random() * 0.2, // Small variance for realism
      opacity: 0.3 + Math.random() * 0.5
    }));
  };

  const drawVenturi = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerY = height / 2;
    
    // Draw Water Body
    ctx.beginPath();
    for (let x = 0; x <= width; x += 5) {
      const d = getDiameterAt(x, width);
      ctx.lineTo(x, centerY - d / 2);
    }
    for (let x = width; x >= 0; x -= 5) {
      const d = getDiameterAt(x, width);
      ctx.lineTo(x, centerY + d / 2);
    }
    ctx.closePath();
    
    // Create water gradient
    const grad = ctx.createLinearGradient(0, centerY - 150, 0, centerY + 150);
    grad.addColorStop(0, '#0284c7'); // light blue
    grad.addColorStop(0.5, '#0ea5e9'); // cyan
    grad.addColorStop(1, '#0369a1'); // dark blue
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Pipe Walls (Top and Bottom Outlines)
    ctx.beginPath();
    for (let x = 0; x <= width; x += 5) {
      ctx.lineTo(x, centerY - getDiameterAt(x, width) / 2);
    }
    ctx.strokeStyle = '#94a3b8'; // slate-400
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    for (let x = 0; x <= width; x += 5) {
      ctx.lineTo(x, centerY + getDiameterAt(x, width) / 2);
    }
    ctx.stroke();

    // Draw Manometers (Tabung Pengukur Tekanan)
    const x1 = 0.15 * width; // Area 1
    const x2 = 0.5 * width;  // Area 2 (Sempit)
    const manoWidth = 20;
    
    const dAtX1 = getDiameterAt(x1, width);
    const dAtX2 = getDiameterAt(x2, width);
    
    const topX1 = centerY - dAtX1 / 2;
    const topX2 = centerY - dAtX2 / 2;
    
    const baseWaterHeight = 150; // Tinggi air statis di manometer 1
    
    // Manometer 1
    // Glass tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x1 - manoWidth/2, topX1 - 200, manoWidth, 200);
    ctx.strokeRect(x1 - manoWidth/2, topX1 - 200, manoWidth, 200);
    // Water column 1
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(x1 - manoWidth/2, topX1 - baseWaterHeight, manoWidth, baseWaterHeight);

    // Manometer 2
    // Skala penurunan tinggi air berdasarkan deltaH (kita kali faktor agar visualnya terlihat jelas)
    const dhVisual = Math.min(baseWaterHeight - 10, deltaH * PIXEL_PER_METER * 0.1); 
    const waterHeight2 = baseWaterHeight - dhVisual;

    // Glass tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(x2 - manoWidth/2, topX2 - 200, manoWidth, 200);
    ctx.strokeRect(x2 - manoWidth/2, topX2 - 200, manoWidth, 200);
    // Water column 2
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(x2 - manoWidth/2, topX2 - waterHeight2, manoWidth, waterHeight2);
    
    // Draw Dashed Line to show delta H
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x1, topX1 - baseWaterHeight);
    ctx.lineTo(x2 + 40, topX1 - baseWaterHeight);
    ctx.strokeStyle = '#f43f5e'; // pink/red
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, topX2 - waterHeight2);
    ctx.lineTo(x2 + 40, topX2 - waterHeight2);
    ctx.stroke();
    
    ctx.setLineDash([]); // reset
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerY = height / 2;
    const dt = 0.016;

    particlesRef.current.forEach(p => {
      const currentD = getDiameterAt(p.x, width);
      
      // Calculate local velocity based on Continuity Equation
      // vx = v1 * (A1 / Ax) = v1 * (D1^2 / Dx^2)
      const ratio = (D1 * PIXEL_PER_METER) / currentD;
      const vx = v1 * Math.pow(ratio, 2) * PIXEL_PER_METER * p.speedMultiplier;
      
      // Update X position
      p.x += vx * dt;
      if (p.x > width) {
        p.x = 0; // Wrap around
        p.yStartFraction = (Math.random() - 0.5) * 0.9;
      }

      // Calculate Y position based on streamline
      const y = centerY + p.yStartFraction * currentD;

      // Draw streak
      ctx.beginPath();
      ctx.moveTo(p.x, y);
      ctx.lineTo(p.x - p.length * ratio, y); // Streak memanjang jika bergerak cepat
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background Slate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawVenturi(ctx, canvas.width, canvas.height);
    drawParticles(ctx, canvas.width, canvas.height);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (canvasRef.current && particlesRef.current.length === 0) {
      initParticles(150, canvasRef.current.width);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [D1, D2, v1, deltaH]); // Re-bind on parameter changes

  // Batasan D2 tidak boleh lebih besar dari D1
  const handleD2Change = (val: number) => {
    if (val > D1) setD2(D1);
    else setD2(val);
  }

  const handleD1Change = (val: number) => {
    setD1(val);
    if (D2 > val) setD2(val); // D2 adjusts if D1 is smaller
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Wind size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Fluida Dinamis & Bernoulli</h1>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Info size={16} /> Teori
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2">
                  <Droplets size={18} className="text-cyan-500" /> Simulasi Pipa Venturi
                </h2>
              </div>
              <div className="relative aspect-video w-full bg-[#0f172a] overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  width={800} 
                  height={450} 
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Explanation Area */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                <Info size={18} /> Asas Bernoulli & Persamaan Kontinuitas
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Saat fluida memasuki area pipa yang lebih sempit, partikel harus <strong>mempercepat lajunya</strong> agar debit cairan yang mengalir tetap sama (Hukum Kontinuitas). Menurut Hukum Bernoulli, kecepatan yang tinggi ini akan mengorbankan tekanannya, sehingga <strong>tekanan di area sempit lebih rendah</strong>. Penurunan tekanan ini dibuktikan dengan turunnya air di tabung manometer kedua!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-slate-200 dark:text-slate-700"><Wind size={40}/></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Hukum Kontinuitas</span>
                  <span className="font-mono font-bold text-lg text-slate-800 dark:text-white">A₁·v₁ = A₂·v₂</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-slate-200 dark:text-slate-700"><Droplets size={40}/></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Hukum Bernoulli (Horizontal)</span>
                  <span className="font-mono font-bold text-lg text-slate-800 dark:text-white">P₁ + ½ρv₁² = P₂ + ½ρv₂²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            
            {/* Telemetry Display */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 dark:from-cyan-900 dark:to-blue-950 rounded-2xl p-6 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden border border-cyan-500/30">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-400 dark:bg-cyan-600 rounded-full blur-3xl opacity-30"></div>
              <h2 className="font-bold flex items-center gap-2 mb-6 relative z-10 text-cyan-50">
                <Activity size={18} /> Hasil Perhitungan
              </h2>
              
              <div className="space-y-5 relative z-10">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-cyan-100/80 text-xs font-bold uppercase tracking-wider">Kecepatan Sempit (v₂)</span>
                    <div className="text-right">
                      <span className="text-3xl font-black tracking-tight">{v2.toFixed(1)}</span>
                      <span className="text-cyan-200 ml-1 text-sm font-medium">m/s</span>
                    </div>
                  </div>
                  <div className="w-full bg-cyan-950/50 rounded-full h-1.5">
                    <div className="bg-cyan-300 h-1.5 rounded-full" style={{width: `${Math.min(100, (v2 / 20) * 100)}%`}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-cyan-100/80 text-xs font-bold uppercase tracking-wider">Selisih Tekanan (ΔP)</span>
                    <div className="text-right">
                      <span className="text-3xl font-black tracking-tight">{deltaP.toLocaleString('id-ID', {maximumFractionDigits: 0})}</span>
                      <span className="text-cyan-200 ml-1 text-sm font-medium">Pa</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-cyan-100/80 text-xs font-bold uppercase tracking-wider">Beda Tinggi Air (Δh)</span>
                    <div className="text-right">
                      <span className="text-3xl font-black tracking-tight">{deltaH.toFixed(2)}</span>
                      <span className="text-cyan-200 ml-1 text-sm font-medium">m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Diameter Pipa 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Diameter Masuk (D₁)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-cyan-600 dark:text-cyan-400">
                    {D1.toFixed(1)} m
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1.0" max="3.0" step="0.1"
                  value={D1} 
                  onChange={(e) => handleD1Change(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Diameter Pipa 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Diameter Sempit (D₂)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-cyan-600 dark:text-cyan-400">
                    {D2.toFixed(1)} m
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="3.0" step="0.1"
                  value={D2} 
                  onChange={(e) => handleD2Change(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4"></div>

              {/* Kecepatan v1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kecepatan Masuk (v₁)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-cyan-600 dark:text-cyan-400">
                    {v1.toFixed(1)} m/s
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="5.0" step="0.1"
                  value={v1} 
                  onChange={(e) => setV1(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
