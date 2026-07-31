import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Droplets, Droplet } from "lucide-react"

// Skala Fisika
const PIXELS_PER_METER = 50; 
const CANVAS_W = 800;
const CANVAS_H = 400;

export default function TorricelliLab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Variabel Kontrol
  const [initialWaterH, setInitialWaterH] = useState(6); // meter (tinggi tangki 8m)
  const [holeH, setHoleH] = useState(2); // meter dari dasar (dasar tangki Y = 350)
  const [holeSize, setHoleSize] = useState(0.05); // m^2 luas lubang
  const [gravity, setGravity] = useState(9.8); // m/s^2

  // State Dinamis
  const [currentWaterH, setCurrentWaterH] = useState(initialWaterH);
  
  // Tangki statis
  const tankBaseY = 350; // dasar tangki di piksel
  const tankX = 50;
  const tankW = 100;
  const tankHeightPx = 8 * PIXELS_PER_METER; 

  const reset = () => {
    setIsPlaying(false);
    setCurrentWaterH(initialWaterH);
  }

  // Saat isPlaying = false, air otomatis me-reset ke initial jika initial berubah
  useEffect(() => {
    if (!isPlaying) {
      setCurrentWaterH(initialWaterH);
    }
  }, [initialWaterH, isPlaying]);

  // Loop Animasi
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- LOGIKA FISIKA ---
    let newWaterH = currentWaterH;
    
    // Debit air berkurang jika air di atas lubang
    if (isPlaying && newWaterH > holeH) {
      const dt = 1/60; // 60 FPS
      const v = Math.sqrt(2 * gravity * (newWaterH - holeH)); // Hukum Torricelli
      const Q = holeSize * v; // Debit = Luas * Kecepatan
      const tankArea = 2; // m^2 (luas alas tangki asumsi)
      
      newWaterH -= (Q / tankArea) * dt;
      if (newWaterH < holeH) newWaterH = holeH;
      
      setCurrentWaterH(newWaterH);
    }

    // --- GAMBAR VISUAL ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dasar Tanah
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, tankBaseY, canvas.width, canvas.height - tankBaseY);

    // Tangki Belakang
    ctx.fillStyle = "#94a3b8"; // dinding belakang tangki
    ctx.fillRect(tankX, tankBaseY - tankHeightPx, tankW, tankHeightPx);

    // Air di dalam tangki
    const currentWaterPx = newWaterH * PIXELS_PER_METER;
    ctx.fillStyle = "rgba(14, 165, 233, 0.7)"; // Air biru (sky-500)
    ctx.fillRect(tankX, tankBaseY - currentWaterPx, tankW, currentWaterPx);

    // Lubang (Hole)
    const holeYPx = tankBaseY - (holeH * PIXELS_PER_METER);
    const holeRadiusPx = (holeSize * 100); // Visualisasi ukuran lubang
    
    // Semburan Air (Parabola)
    if (newWaterH > holeH) {
      const v = Math.sqrt(2 * gravity * (newWaterH - holeH)); // m/s
      const v_px = v * PIXELS_PER_METER;
      const g_px = gravity * PIXELS_PER_METER;

      ctx.beginPath();
      ctx.moveTo(tankX + tankW, holeYPx);
      
      // Menggambar kurva lintasan air
      let t = 0;
      let px = tankX + tankW;
      let py = holeYPx;
      
      // Lintasan Atas Air
      const pathTop = [];
      const pathBottom = [];

      while (py < tankBaseY && px < canvas.width) {
        px = tankX + tankW + v_px * t;
        py = holeYPx + 0.5 * g_px * t * t;
        
        // Simpan titik lintasan dengan ketebalan (menyusut seiring jarak)
        const thickness = Math.max(2, holeRadiusPx * Math.pow(0.9, t*10)); 
        pathTop.push({x: px, y: py - thickness});
        pathBottom.push({x: px, y: py + thickness});

        t += 0.05;
      }
      
      // Gambar Path Penuh
      ctx.beginPath();
      if (pathTop.length > 0) {
        ctx.moveTo(pathTop[0].x, pathTop[0].y);
        for(let i=1; i<pathTop.length; i++) ctx.lineTo(pathTop[i].x, pathTop[i].y);
        for(let i=pathBottom.length-1; i>=0; i--) ctx.lineTo(pathBottom[i].x, pathBottom[i].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(14, 165, 233, 0.6)";
        ctx.fill();
      }

      // Hitung Jangkauan Maksimum Teoritis (x = v * t_jatuh)
      const t_jatuh = Math.sqrt((2 * holeH) / gravity);
      const x_max = v * t_jatuh;
      
      // Marker Jangkauan Air
      const landX = tankX + tankW + (x_max * PIXELS_PER_METER);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(landX, tankBaseY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Teks Jangkauan
      ctx.fillStyle = "#f87171";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`X: ${x_max.toFixed(2)} m`, landX - 30, tankBaseY + 20);
    }

    // Gambar Pipa Lubang
    ctx.fillStyle = "#334155";
    ctx.fillRect(tankX + tankW, holeYPx - holeRadiusPx, 10, holeRadiusPx * 2);

    // Tangki Kiri & Kanan & Bawah (Stroke Border)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tankX, tankBaseY - tankHeightPx);
    ctx.lineTo(tankX, tankBaseY);
    ctx.lineTo(tankX + tankW, tankBaseY);
    ctx.lineTo(tankX + tankW, holeYPx + holeRadiusPx); // Sampai lubang bawah
    ctx.moveTo(tankX + tankW, holeYPx - holeRadiusPx); // Dari lubang atas
    ctx.lineTo(tankX + tankW, tankBaseY - tankHeightPx);
    ctx.stroke();

    if (isPlaying && newWaterH > holeH) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Jika air habis atau tidak dimainkan, tetap render statis 1 kali agar update visual slider
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(() => {}); // placeholder
      }
    }
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, initialWaterH, holeH, holeSize, gravity, currentWaterH]);

  // Kalkulasi instan untuk UI
  const currentV = currentWaterH > holeH ? Math.sqrt(2 * gravity * (currentWaterH - holeH)) : 0;
  const t_fall = Math.sqrt((2 * holeH) / gravity);
  const currentX = currentV * t_fall;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Droplets className="text-cyan-500" />
            Tangki Bocor (Hukum Torricelli)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Simulasi kecepatan pancaran air dan lintasan parabola berdasarkan kedalaman tangki.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="space-y-6">
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
              <label className="text-sm font-bold text-sky-700 dark:text-sky-400 flex justify-between mb-2">
                Tinggi Air Awal ($h_1$) <span>{initialWaterH.toFixed(1)} m</span>
              </label>
              <input
                type="range" min={Math.max(1, holeH + 0.1)} max="8" step="0.1"
                value={initialWaterH}
                onChange={(e) => setInitialWaterH(parseFloat(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <label className="text-sm font-bold text-orange-700 dark:text-orange-400 flex justify-between mb-2">
                Ketinggian Lubang ($h_2$) <span>{holeH.toFixed(1)} m</span>
              </label>
              <input
                type="range" min="0" max={Math.min(7.9, initialWaterH - 0.1)} step="0.1"
                value={holeH}
                onChange={(e) => setHoleH(parseFloat(e.target.value))}
                className="w-full accent-orange-600"
              />
              <p className="text-xs text-orange-600 mt-1">Diukur dari dasar tanah.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex justify-between mb-2">
                Gravitasi ($g$) <span>{gravity.toFixed(1)} m/s²</span>
              </label>
              <input
                type="range" min="1.6" max="25" step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-slate-600"
              />
              <p className="text-xs text-slate-500 mt-1">Bumi: 9.8, Bulan: 1.6, Jupiter: 24.7</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                {isPlaying ? <><Pause size={20}/> Jeda</> : <><Play size={20}/> Buka Kran</>}
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
              width={CANVAS_W}
              height={CANVAS_H}
              className="absolute top-0 left-0"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Tinggi Permukaan ($h_1 - h_2$)</p>
              <p className="text-xl font-mono font-bold text-cyan-600">{(currentWaterH - holeH > 0 ? currentWaterH - holeH : 0).toFixed(2)} <span className="text-sm">m</span></p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Kecepatan Sembur ($v$)</p>
              <p className="text-xl font-mono font-bold text-orange-600">{currentV.toFixed(2)} <span className="text-sm">m/s</span></p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <p className="text-xs text-slate-500 font-bold mb-1">Jangkauan Air ({"$x_{max}$"})</p>
              <p className="text-xl font-mono font-bold text-red-500">{currentX.toFixed(2)} <span className="text-sm">m</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
