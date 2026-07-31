import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Settings2, Info, ThermometerSun } from "lucide-react"

// Konstanta Fisika Skala
const N_PARTICLES = 200;
const CANVAS_W = 600;
const MAX_H = 400; // Tinggi maksimum kontainer
const MIN_H = 100; // Tinggi minimum kontainer (volume terkecil)

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function ThermodynamicsLab() {
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Variabel Fisika
  const [temp, setTemp] = useState(300); // Kelvin (300K - 1000K)
  const [volumeH, setVolumeH] = useState(MAX_H); // merepresentasikan Volume
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const prevTempRef = useRef<number>(300);
  const pressureSmoothedRef = useRef<number>(0);

  // Inisialisasi Partikel
  useEffect(() => {
    const particles: Particle[] = [];
    const baseSpeed = Math.sqrt(300) * 0.2; // skala visual
    for (let i = 0; i < N_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.random() * CANVAS_W,
        y: MAX_H - Math.random() * volumeH,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed
      });
    }
    particlesRef.current = particles;
    prevTempRef.current = 300;
  }, []);

  // Loop Animasi
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar Piston
    const pistonY = canvas.height - volumeH;
    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.fillRect(0, 0, CANVAS_W, pistonY);
    // Batas bawah piston
    ctx.fillStyle = "#64748b"; // slate-500
    ctx.fillRect(0, pistonY - 20, CANVAS_W, 20);

    // Area Tabung (latar belakang gas)
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, pistonY, CANVAS_W, volumeH);

    const particles = particlesRef.current;
    
    // Update kecepatan jika Suhu berubah (V_rms sebanding akar T)
    if (temp !== prevTempRef.current) {
      const ratio = Math.sqrt(temp / prevTempRef.current);
      particles.forEach(p => {
        p.vx *= ratio;
        p.vy *= ratio;
      });
      prevTempRef.current = temp;
    }

    let collisionImpulse = 0;

    particles.forEach(p => {
      if (isPlaying) {
        p.x += p.vx;
        p.y += p.vy;

        // Pantulan Dinding Kiri & Kanan
        if (p.x < 0) { p.x = 0; p.vx *= -1; collisionImpulse += Math.abs(p.vx); }
        else if (p.x > CANVAS_W) { p.x = CANVAS_W; p.vx *= -1; collisionImpulse += Math.abs(p.vx); }

        // Pantulan Bawah
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; collisionImpulse += Math.abs(p.vy); }
        // Pantulan Piston (Atas)
        else if (p.y < pistonY) { p.y = pistonY; p.vy *= -1; collisionImpulse += Math.abs(p.vy); }
      }

      // Warna Partikel berdasarkan kecepatan (Energi Kinetik)
      const speedSq = p.vx*p.vx + p.vy*p.vy;
      // Warna: Biru dingin (speedSq kecil) -> Merah panas (speedSq besar)
      // Skala: suhu 300 ~ speedSq = 12. suhu 1000 ~ speedSq = 40.
      const heatFactor = Math.min(1, Math.max(0, (speedSq - 10) / 40));
      const r = Math.floor(255 * heatFactor);
      const b = Math.floor(255 * (1 - heatFactor));
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${r}, 50, ${b})`;
      ctx.fill();
    });

    // P = nRT/V. Kita simulasi P secara analitik agar meteran halus.
    // Konstanta nR anggap saja 100 untuk skala visual.
    const theoreticalPressure = (temp * 50) / volumeH;
    
    // Smooth the pressure gauge reading
    pressureSmoothedRef.current += (theoreticalPressure - pressureSmoothedRef.current) * 0.1;

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, volumeH, temp]); // Re-bind jika depedencies berubah (atau gunakan ref sepenuhnya, tp ini cukup)

  const pressure = pressureSmoothedRef.current || (temp * 50) / volumeH;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <ThermometerSun className="text-rose-500" />
            Teori Kinetik Gas Ideal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Membuktikan Persamaan P·V = n·R·T melalui simulasi pergerakan partikel gas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} /> Kendali Sistem Tertutup
          </div>

          <div className="space-y-6">
            {/* Suhu */}
            <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
              <label className="text-sm font-bold text-rose-700 dark:text-rose-400 flex justify-between mb-2">
                Suhu Gas (T) <span>{temp} K</span>
              </label>
              <input
                type="range" min="100" max="1500" step="10"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full accent-rose-600"
              />
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">Mengatur Energi Kinetik Rata-rata molekul.</p>
            </div>

            {/* Volume */}
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
              <label className="text-sm font-bold text-sky-700 dark:text-sky-400 flex justify-between mb-2">
                Volume Tabung (V) <span>{(volumeH / MAX_H * 100).toFixed(0)} L</span>
              </label>
              <input
                type="range" min={MIN_H} max={MAX_H} step="5"
                value={volumeH}
                onChange={(e) => setVolumeH(parseFloat(e.target.value))}
                className="w-full accent-sky-600"
              />
              <p className="text-xs text-sky-600/80 dark:text-sky-400/80 mt-1">Menaikkan/Menurunkan Piston penutup gas.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
                }`}
              >
                {isPlaying ? <><Pause size={20}/> Jeda Partikel</> : <><Play size={20}/> Lanjutkan</>}
              </button>
            </div>
          </div>
        </div>

        {/* SIMULATOR & TELEMETRI */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-slate-950 rounded-2xl shadow-inner border-2 border-slate-800 flex items-end justify-center h-[450px] relative overflow-hidden">
            <canvas 
              ref={canvasRef}
              width={CANVAS_W}
              height={MAX_H}
              className="absolute bottom-0"
            />
            
            {/* Animasi Api Pemanas */}
            <div className="absolute bottom-0 w-full h-8 flex justify-center gap-4 opacity-50 pointer-events-none">
              {temp > 500 && (
                <div className="w-full flex justify-around">
                   <div className="w-8 h-8 bg-orange-500 rounded-full blur-xl animate-pulse delay-75"></div>
                   <div className="w-8 h-8 bg-orange-500 rounded-full blur-xl animate-pulse delay-150"></div>
                   <div className="w-8 h-8 bg-orange-500 rounded-full blur-xl animate-pulse delay-300"></div>
                </div>
              )}
            </div>
            {/* Indikator Es Pendingin */}
            <div className="absolute bottom-0 w-full h-8 flex justify-center gap-4 opacity-50 pointer-events-none">
              {temp <= 200 && (
                <div className="w-full flex justify-around">
                   <div className="w-8 h-8 bg-blue-400 rounded-full blur-xl animate-pulse delay-75"></div>
                   <div className="w-8 h-8 bg-blue-400 rounded-full blur-xl animate-pulse delay-150"></div>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tekanan Gauge */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Tekanan (P)</p>
                <div className="text-4xl font-mono font-black text-slate-800 dark:text-white relative z-10 flex items-baseline gap-1">
                  {pressure.toFixed(1)} <span className="text-lg font-bold text-slate-500">atm</span>
                </div>
                
                {/* Visual Bahaya Tekanan Tinggi */}
                {pressure > 250 && (
                  <div className="absolute inset-0 border-4 border-red-500 rounded-2xl animate-pulse"></div>
                )}
                {pressure > 300 && (
                  <div className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                )}
              </div>

              {/* Persamaan Gas Info */}
              <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-center">
                <div className="flex items-start gap-3 mb-2">
                  <Info className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Hukum Gas Ideal</h4>
                </div>
                <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed mb-3">
                  Menurut persamaan <strong className="font-mono bg-white/50 dark:bg-black/20 px-1 rounded">PV = nRT</strong>, Tekanan berbanding lurus dengan Suhu ($T$) dan berbanding terbalik dengan Volume ($V$).
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800 text-center">
                    <div className="text-xs text-slate-500 mb-1">Rata-rata $E_k$ Partikel</div>
                    <div className="font-mono font-bold text-rose-600 dark:text-rose-400">~ {temp} J</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800 text-center">
                    <div className="text-xs text-slate-500 mb-1">Jumlah Partikel (n)</div>
                    <div className="font-mono font-bold text-sky-600 dark:text-sky-400">{N_PARTICLES}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
