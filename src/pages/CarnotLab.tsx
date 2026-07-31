import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Flame, Snowflake, Activity } from "lucide-react"

export default function CarnotLab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Variabel Lingkungan
  const [THot, setTHot] = useState(600); // K
  const [TCold, setTCold] = useState(300); // K

  // State Dinamis Siklus
  // Fase: 0=IsoTherm Ekspansi, 1=Adiabatik Ekspansi, 2=IsoTherm Kompresi, 3=Adiabatik Kompresi
  const [phase, setPhase] = useState(0); 
  const [V, setV] = useState(1); // Volume (1 to 4)
  const [T, setT] = useState(600); // Suhu real-time gas
  const [P, setP] = useState(600); // P = nRT/V (anggap nR = 1)
  
  const phaseRef = useRef(0);
  const VRef = useRef(1);
  const TRef = useRef(THot);

  const reset = () => {
    setIsPlaying(false);
    setPhase(0);
    setV(1);
    setT(THot);
    setP(THot / 1);
    phaseRef.current = 0;
    VRef.current = 1;
    TRef.current = THot;
  }

  // --- LOGIKA SIKLUS CARNOT ---
  // Ideal Carnot Cycle:
  // V1 = 1, T1 = THot
  // P1 = THot / 1
  
  // Phase 0: Isothermal Expansion (T=THot, V: 1 -> 2)
  // Phase 1: Adiabatic Expansion (T drops THot->TCold, V: 2 -> 3) (TV^(y-1) = c)
  // Phase 2: Isothermal Compression (T=TCold, V: 3 -> 2.5)
  // Phase 3: Adiabatic Compression (T rises TCold->THot, V: 2.5 -> 1)

  // Karena kita hanya visualisasi ilustratif, kita set target Volume secara manual
  const V1 = 1.0;
  const V2 = 2.0;
  const V3 = 3.5;
  const V4 = 1.75; 

  const animate = () => {
    if (!isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    let p = phaseRef.current;
    let v = VRef.current;
    let t = TRef.current;
    const speed = 0.01;

    if (p === 0) { // Isothermal Expansion
      t = THot; // Temp constant
      v += speed;
      if (v >= V2) { v = V2; p = 1; }
    } 
    else if (p === 1) { // Adiabatic Expansion
      v += speed * 1.5;
      // T drops adiabatically: T * V^(gamma-1) = const. Assume gamma=1.4
      // We linearly interpolate T for simplicity in animation, or use real math:
      // T = THot * (V2 / v)^0.4
      t = THot * Math.pow(V2 / v, 0.4);
      if (t <= TCold || v >= V3) { t = TCold; v = V3; p = 2; }
    }
    else if (p === 2) { // Isothermal Compression
      t = TCold;
      v -= speed;
      if (v <= V4) { v = V4; p = 3; }
    }
    else if (p === 3) { // Adiabatic Compression
      v -= speed * 1.5;
      t = TCold * Math.pow(V4 / v, 0.4);
      if (t >= THot || v <= V1) { t = THot; v = V1; p = 0; }
    }

    phaseRef.current = p;
    VRef.current = v;
    TRef.current = t;

    setPhase(p);
    setV(v);
    setT(t);
    setP((t * 10) / v); // Skala visual P

    drawCanvas();
    animationRef.current = requestAnimationFrame(animate);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    // GAMBAR PISTON (Kiri)
    const pistonW = 150;
    const pistonBaseH = 300;
    const pistonX = 50;
    const pistonY = 50;

    // Dinding silinder
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 4;
    ctx.strokeRect(pistonX, pistonY, pistonW, pistonBaseH);

    // Tinggi gas berbanding lurus dengan Volume
    const gasH = (VRef.current / V3) * pistonBaseH;
    const gasY = pistonY + pistonBaseH - gasH;

    // Warna gas berdasarkan Suhu (Merah = Panas, Biru = Dingin)
    const heatRatio = (TRef.current - 100) / 900; // range 100K to 1000K
    const r = Math.floor(255 * heatRatio);
    const b = Math.floor(255 * (1 - heatRatio));
    ctx.fillStyle = `rgba(${r}, 50, ${b}, 0.6)`;
    ctx.fillRect(pistonX, gasY, pistonW, gasH);

    // Batang Piston
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(pistonX, pistonY, pistonW, gasY - pistonY);
    // Kepala Piston
    ctx.fillStyle = "#334155";
    ctx.fillRect(pistonX - 5, gasY - 15, pistonW + 10, 15);

    // Indikator Sumber Panas / Dingin
    if (phaseRef.current === 0) {
      // Reservoir Panas menyentuh bawah
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(pistonX, pistonY + pistonBaseH, pistonW, 30);
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText("Reservoir Panas (Masuk)", pistonX + 10, pistonY + pistonBaseH + 20);
    } else if (phaseRef.current === 2) {
      // Reservoir Dingin
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(pistonX, pistonY + pistonBaseH, pistonW, 30);
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText("Reservoir Dingin (Keluar)", pistonX + 10, pistonY + pistonBaseH + 20);
    } else {
      // Isolator (Adiabatik)
      ctx.fillStyle = "#a8a29e";
      ctx.fillRect(pistonX, pistonY + pistonBaseH, pistonW, 30);
      ctx.fillStyle = "black";
      ctx.font = "bold 14px Arial";
      ctx.fillText("Isolator Termal", pistonX + 25, pistonY + pistonBaseH + 20);
    }


    // GAMBAR GRAFIK PV (Kanan)
    const graphX = 280;
    const graphY = 50;
    const graphW = 300;
    const graphH = 300;

    // Sumbu
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(graphX, graphY);
    ctx.lineTo(graphX, graphY + graphH);
    ctx.lineTo(graphX + graphW, graphY + graphH);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.fillText("Volume (V)", graphX + graphW - 50, graphY + graphH + 20);
    ctx.fillText("Pressure (P)", graphX - 20, graphY - 10);

    // Kurva Carnot (Statis Background)
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    // 1 -> 2 (Isothermal Hot)
    for (let v=V1; v<=V2; v+=0.1) {
      const p = (THot * 10) / v;
      const ptX = graphX + (v/4)*graphW;
      const ptY = graphY + graphH - (p/10000)*graphH;
      if (v===V1) ctx.moveTo(ptX, ptY); else ctx.lineTo(ptX, ptY);
    }
    // 2 -> 3 (Adiabatic Expand)
    for (let v=V2; v<=V3; v+=0.1) {
      const t = THot * Math.pow(V2/v, 0.4);
      const p = (t * 10) / v;
      const ptX = graphX + (v/4)*graphW;
      const ptY = graphY + graphH - (p/10000)*graphH;
      ctx.lineTo(ptX, ptY);
    }
    // 3 -> 4 (Isothermal Cold)
    for (let v=V3; v>=V4; v-=0.1) {
      const p = (TCold * 10) / v;
      const ptX = graphX + (v/4)*graphW;
      const ptY = graphY + graphH - (p/10000)*graphH;
      ctx.lineTo(ptX, ptY);
    }
    // 4 -> 1 (Adiabatic Compress)
    for (let v=V4; v>=V1; v-=0.1) {
      const t = TCold * Math.pow(V4/v, 0.4);
      const p = (t * 10) / v;
      const ptX = graphX + (v/4)*graphW;
      const ptY = graphY + graphH - (p/10000)*graphH;
      ctx.lineTo(ptX, ptY);
    }
    ctx.stroke();
    ctx.setLineDash([]); // reset dash

    // Titik Current State
    const curPx = graphX + (VRef.current/4)*graphW;
    const curPy = graphY + graphH - (P/10000)*graphH; // normalize p
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(curPx, curPy, 8, 0, Math.PI*2);
    ctx.fill();
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, THot, TCold]); // restart animation loop if playing state changes

  const eff = (1 - (TCold / THot)) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="text-rose-500" />
            Mesin Kalor Carnot
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Simulasi 4 langkah siklus termodinamika ideal penghasil energi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-6">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <label className="text-sm font-bold text-red-700 dark:text-red-400 flex justify-between mb-2">
                Suhu Panas ($T_H$) <span className="flex items-center gap-1"><Flame size={14}/> {THot} K</span>
              </label>
              <input
                type="range" min="400" max="1000" step="10"
                value={THot}
                onChange={(e) => {setTHot(parseFloat(e.target.value)); if(!isPlaying) reset();}}
                className="w-full accent-red-600"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <label className="text-sm font-bold text-blue-700 dark:text-blue-400 flex justify-between mb-2">
                Suhu Dingin ($T_C$) <span className="flex items-center gap-1"><Snowflake size={14}/> {TCold} K</span>
              </label>
              <input
                type="range" min="100" max="350" step="10"
                value={TCold}
                onChange={(e) => {setTCold(parseFloat(e.target.value)); if(!isPlaying) reset();}}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
              <p className="text-sm text-emerald-800 font-bold mb-1">Efisiensi Mesin Maksimal ($\eta$)</p>
              <p className="text-3xl font-black text-emerald-600">{eff.toFixed(1)}%</p>
              <p className="text-xs text-emerald-700 mt-1">$\eta = 1 - (T_C / T_H)$</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isPlaying ? <><Pause size={20}/> Jeda</> : <><Play size={20}/> Jalankan Mesin</>}
              </button>
              <button
                onClick={reset}
                className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 flex items-center justify-center transition-all"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* SIMULATOR */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-slate-950 rounded-2xl shadow-inner border border-slate-800 flex items-center justify-center h-[400px] overflow-hidden relative">
            <canvas 
              ref={canvasRef}
              width="600"
              height="400"
              className="absolute top-0 left-1/2 -translate-x-1/2"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className={`p-3 rounded-xl border text-center transition-all ${phase === 0 ? 'bg-red-100 border-red-500 scale-105' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500">Langkah 1</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Ekspansi Isotermal</p>
            </div>
            <div className={`p-3 rounded-xl border text-center transition-all ${phase === 1 ? 'bg-orange-100 border-orange-500 scale-105' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500">Langkah 2</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Ekspansi Adiabatik</p>
            </div>
            <div className={`p-3 rounded-xl border text-center transition-all ${phase === 2 ? 'bg-blue-100 border-blue-500 scale-105' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500">Langkah 3</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Kompresi Isotermal</p>
            </div>
            <div className={`p-3 rounded-xl border text-center transition-all ${phase === 3 ? 'bg-purple-100 border-purple-500 scale-105' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
              <p className="text-xs font-bold text-slate-500">Langkah 4</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Kompresi Adiabatik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
