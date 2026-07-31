import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Settings2, Info, Droplets } from "lucide-react"
import { useAnimationFrame } from "framer-motion"
import { useStore } from "@/store/useStore"

// --- Konstanta Fisika Skala Simulasi ---
const PIXELS_PER_METER = 100;
const G = 9.8; 
const BLOCK_SIZE = 80; // pixel. Volume = (80/100)^3 = 0.512 m^3, tapi kita sederhanakan: 
// Anggap balok berbentuk prisma persegi dengan tinggi H=1 meter, luas alas A=1 m^2. V = 1 m^3.
// Dalam simulasi, H digambar 100 pixel.
const V_BLOCK = 1; // m^3
const WATER_LEVEL_Y = 200; // Y coordinate (in pixel) for water surface. Bottom of tank is 400.

// --- Bahan Balok ---
const BLOCK_MATERIALS = {
  gabus: { name: "Gabus", rho: 200, color: "fill-amber-200 stroke-amber-400" },
  kayu: { name: "Kayu", rho: 600, color: "fill-amber-700 stroke-amber-900" },
  es: { name: "Es", rho: 920, color: "fill-cyan-100 stroke-cyan-300" },
  alumunium: { name: "Alumunium", rho: 2700, color: "fill-slate-300 stroke-slate-500" },
  besi: { name: "Besi", rho: 7800, color: "fill-slate-700 stroke-slate-900" },
}

// --- Cairan ---
const FLUIDS = {
  bensin: { name: "Bensin", rho: 680, color: "rgba(253, 224, 71, 0.4)", visc: 0.5 }, // yellow-300
  minyak: { name: "Minyak", rho: 800, color: "rgba(251, 191, 36, 0.5)", visc: 1.5 }, // amber-400
  air: { name: "Air Murni", rho: 1000, color: "rgba(56, 189, 248, 0.5)", visc: 1.0 }, // sky-400
  airLaut: { name: "Air Laut", rho: 1030, color: "rgba(14, 165, 233, 0.6)", visc: 1.1 }, // sky-500
  madu: { name: "Madu", rho: 1420, color: "rgba(217, 119, 6, 0.7)", visc: 5.0 }, // amber-600
}

// --- Audio SFX Generator ---
const playSplashSfx = (fluidType: keyof typeof FLUIDS, velocity: number) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    
    // Suara percikan menggunakan white noise
    const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    
    // Karakteristik frekuensi filter berdasarkan kekentalan (viscosity) cairan
    // Cairan ringan (bensin) = frekuensi tinggi (splash cerah)
    // Cairan berat (madu) = frekuensi rendah (suara tumpul/blep)
    const visc = FLUIDS[fluidType].visc;
    filter.frequency.value = 3000 / Math.pow(visc, 0.8);
    
    // Volume berdasarkan seberapa keras benturannya
    const impactVolume = Math.min(1.0, Math.abs(velocity) / 500);
    
    gainNode.gain.setValueAtTime(impactVolume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseSource.start();
  } catch (e) {}
}

export default function FluidLab() {
  const { setLastLab, addActivity } = useStore();

  useEffect(() => {
    setLastLab({
      name: "Laboratorium Fluida",
      desc: "Simulasi tekanan hidrostatik dan gaya apung (Hukum Archimedes)",
      url: "/lab/fluid"
    });
    addActivity({
      title: "Membuka Laboratorium Fluida",
      type: "lab"
    });
  }, [setLastLab, addActivity]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [blockMat, setBlockMat] = useState<keyof typeof BLOCK_MATERIALS>("kayu");
  const [fluidMat, setFluidMat] = useState<keyof typeof FLUIDS>("air");
  
  // Fisika State
  const [pos, setPos] = useState(50); // Titik tengah balok di sumbu Y (pixel). 50 berarti di atas air.
  const [vel, setVel] = useState(0); // Kecepatan Y (pixel/s). Positif = turun.
  const hasSplashedRef = useRef(false); // Melacak apakah sudah memercik air
  
  // Telemetri
  const [telemetry, setTelemetry] = useState({
    w: 0,
    fa: 0,
    vSub: 0
  });

  const rhoBlock = BLOCK_MATERIALS[blockMat].rho;
  const rhoFluid = FLUIDS[fluidMat].rho;
  const mass = rhoBlock * V_BLOCK;
  const W = mass * G;

  const reset = () => {
    setIsPlaying(false);
    setPos(50);
    setVel(0);
    hasSplashedRef.current = false;
    updateTelemetry(50);
  }

  const updateTelemetry = (currentPos: number) => {
    const bottom = currentPos + BLOCK_SIZE/2;
    const top = currentPos - BLOCK_SIZE/2;
    
    let subRatio = 0;
    if (bottom <= WATER_LEVEL_Y) {
      subRatio = 0; // Di atas air
    } else if (top >= WATER_LEVEL_Y) {
      subRatio = 1; // Tenggelam total
    } else {
      subRatio = (bottom - WATER_LEVEL_Y) / BLOCK_SIZE; // Tercelup sebagian
    }

    const vSub = subRatio * V_BLOCK;
    const Fa = rhoFluid * G * vSub;

    setTelemetry({
      w: W,
      fa: Fa,
      vSub: vSub
    });
  }

  // --- Engine ---
  useAnimationFrame((time, delta) => {
    if (!isPlaying) return;
    const dt = delta / 1000;
    if (dt > 0.1) return; // Mencegah lonjakan saat ganti tab

    setPos((prevPos) => {
      setVel((prevVel) => {
        const bottom = prevPos + BLOCK_SIZE/2;
        const top = prevPos - BLOCK_SIZE/2;
        
        // Hitung V tercelup
        let subRatio = 0;
        if (bottom <= WATER_LEVEL_Y) subRatio = 0;
        else if (top >= WATER_LEVEL_Y) subRatio = 1;
        else subRatio = (bottom - WATER_LEVEL_Y) / BLOCK_SIZE;

        const Fa = rhoFluid * G * (subRatio * V_BLOCK);
        let Fnet = W - Fa; // Net force ke bawah
        
        // Gaya Gesekan Fluida (Drag) untuk memberikan efek terminal velocity
        // Asumsi gaya gesek sebanding dengan v (untuk kecepatan rendah/viscous drag)
        if (subRatio > 0) {
          const dragCoeff = 20 * subRatio * (rhoFluid / 1000); 
          const Fdrag = -dragCoeff * prevVel;
          Fnet += Fdrag;
        }

        const a = Fnet / mass; // m/s^2
        const a_px = a * PIXELS_PER_METER;

        let newVel = prevVel + a_px * dt;
        let newPos = prevPos + prevVel * dt + 0.5 * a_px * dt * dt;

        // Lantai Bak Air di Y = 400
        const floorY = 400;
        if (newPos + BLOCK_SIZE/2 >= floorY) {
          newPos = floorY - BLOCK_SIZE/2;
          newVel = 0;
        }

        // Jika bouncing di permukaan atas
        if (newPos - BLOCK_SIZE/2 < 0) {
          newPos = BLOCK_SIZE/2;
          if (newVel < 0) newVel = 0;
        }

        // SFX Trigger saat menyentuh air pertama kali
        if (newPos + BLOCK_SIZE/2 >= WATER_LEVEL_Y && !hasSplashedRef.current && prevVel > 10) {
          playSplashSfx(fluidMat, prevVel);
          hasSplashedRef.current = true;
        } else if (newPos + BLOCK_SIZE/2 < WATER_LEVEL_Y) {
          hasSplashedRef.current = false; // Reset jika ditarik/terlempar ke atas air lagi
        }

        updateTelemetry(newPos);
        return newVel;
      });
      
      let newP = prevPos + vel * dt;
      const floorY = 400;
      if (newP + BLOCK_SIZE/2 >= floorY) newP = floorY - BLOCK_SIZE/2;
      return newP;
    });
  });

  // Sinkronisasi saat property berubah
  useEffect(() => {
    if (!isPlaying) updateTelemetry(pos);
  }, [blockMat, fluidMat]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Droplets className="text-sky-500" />
            Hukum Archimedes & Gaya Apung
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Eksperimen fluida statis mengukur gaya ke atas berdasarkan cairan yang didesak.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} /> Kendali Variabel
          </div>

          <div className="space-y-6">
            {/* Cairan */}
            <div className="p-4 bg-sky-50 dark:bg-sky-900/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
              <label className="text-sm font-bold text-sky-700 dark:text-sky-400 mb-2 block">Jenis Cairan (Fluida)</label>
              <select 
                value={fluidMat} 
                onChange={(e) => {setFluidMat(e.target.value as keyof typeof FLUIDS); reset();}}
                className="w-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 rounded-lg p-2 text-slate-700 dark:text-slate-200"
              >
                {Object.entries(FLUIDS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name} (ρ = {val.rho} kg/m³)</option>
                ))}
              </select>
            </div>

            {/* Balok */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <label className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 block">Bahan Benda (Massa Jenis)</label>
              <select 
                value={blockMat} 
                onChange={(e) => {setBlockMat(e.target.value as keyof typeof BLOCK_MATERIALS); reset();}}
                className="w-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-lg p-2 text-slate-700 dark:text-slate-200"
              >
                {Object.entries(BLOCK_MATERIALS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name} (ρ = {val.rho} kg/m³)</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isPlaying 
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30" 
                    : "bg-sky-500 hover:bg-sky-600 shadow-sky-500/30"
                  }`}
                >
                  {isPlaying ? <><Pause size={20}/> Jeda</> : <><Play size={20}/> Jatuhkan!</>}
                </button>
                <button
                  onClick={reset}
                  className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-all shadow-sm"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIMULATOR & TELEMETRI */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center h-[450px] relative">
            
            <svg width="100%" height="100%" viewBox="0 0 800 450" className="absolute top-0 left-0 pointer-events-none">
              {/* Bak Air */}
              {/* Garis Kiri & Kanan Bak */}
              <line x1="200" y1="150" x2="200" y2="400" className="stroke-slate-400 stroke-4" strokeWidth="6" strokeLinecap="round" />
              <line x1="600" y1="150" x2="600" y2="400" className="stroke-slate-400 stroke-4" strokeWidth="6" strokeLinecap="round" />
              {/* Dasar Bak */}
              <line x1="197" y1="400" x2="603" y2="400" className="stroke-slate-400 stroke-4" strokeWidth="6" strokeLinecap="round" />
              
              {/* Air */}
              <rect 
                x="203" y={WATER_LEVEL_Y} width="394" height={400 - WATER_LEVEL_Y} 
                fill={FLUIDS[fluidMat].color}
                className="transition-colors duration-500"
              />
              
              {/* Garis batas air (Ombak/Garis) */}
              <line x1="203" y1={WATER_LEVEL_Y} x2="597" y2={WATER_LEVEL_Y} className="stroke-white/50" strokeWidth="2" strokeDasharray="10 5" />

              {/* Balok */}
              <rect 
                x={400 - BLOCK_SIZE/2} y={pos - BLOCK_SIZE/2} 
                width={BLOCK_SIZE} height={BLOCK_SIZE} rx="4"
                className={`${BLOCK_MATERIALS[blockMat].color} stroke-2 transition-colors duration-500`}
              />

              {/* Vektor Gaya (Tampil saat di air atau saat jatuh) */}
              <g transform={`translate(400, ${pos})`}>
                {/* Gaya Berat (W) */}
                <line x1="0" y1="0" x2="0" y2="60" className="stroke-green-600 stroke-[3px]" markerEnd="url(#arrow-green)" />
                <text x="15" y="55" className="fill-green-600 font-bold text-sm">W</text>
                
                {/* Gaya Apung (Fa) */}
                {telemetry.fa > 0 && (
                  <>
                    <line x1="-20" y1="0" x2="-20" y2={-Math.min(100, (telemetry.fa / W) * 60)} className="stroke-sky-500 stroke-[4px]" markerEnd="url(#arrow-sky)" />
                    <text x="-25" y="-10" textAnchor="end" className="fill-sky-500 font-bold text-sm">Fa</text>
                  </>
                )}
              </g>

              {/* Arrow definitions */}
              <defs>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
                </marker>
                <marker id="arrow-sky" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Telemetry Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                <p className="text-green-700 dark:text-green-400 text-xs font-bold mb-1">Gaya Berat (W)</p>
                <p className="font-mono font-bold text-xl text-green-600 dark:text-green-300">
                  {telemetry.w.toFixed(0)} <span className="text-sm">N</span>
                </p>
              </div>
              
              <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-100 dark:border-sky-900/30">
                <p className="text-sky-700 dark:text-sky-400 text-xs font-bold mb-1">Gaya Apung (Fa)</p>
                <p className="font-mono font-bold text-xl text-sky-600 dark:text-sky-300">
                  {telemetry.fa.toFixed(0)} <span className="text-sm">N</span>
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <p className="text-amber-700 dark:text-amber-400 text-xs font-bold mb-1">Massa Balok (m)</p>
                <p className="font-mono font-bold text-xl text-amber-600 dark:text-amber-300">
                  {mass.toFixed(0)} <span className="text-sm">kg</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mb-1">V Tercelup</p>
                <p className="font-mono font-bold text-xl text-slate-700 dark:text-slate-300">
                  {(telemetry.vSub * 100).toFixed(0)} <span className="text-sm">%</span>
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
              <Info className="text-indigo-500 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <strong>Hukum Archimedes:</strong> Benda di dalam zat cair akan mendapat Gaya Ke Atas (Fa) sebesar berat fluida yang dipindahkan. <br/>
                Status: 
                <strong className="ml-1 uppercase text-indigo-600 dark:text-indigo-400">
                  {telemetry.fa === 0 ? "Menunggu Jatuh" : 
                   telemetry.w > telemetry.fa && pos + BLOCK_SIZE/2 >= 400 ? "Tenggelam" : 
                   telemetry.vSub >= 0.99 && Math.abs(telemetry.w - telemetry.fa) < 100 ? "Melayang" : 
                   "Mengapung"}
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
