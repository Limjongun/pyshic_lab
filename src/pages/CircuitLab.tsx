import React, { useState, useEffect } from "react"
import { Settings2, Info, Battery, Zap, AlertTriangle, Cpu } from "lucide-react"

// Konstanta
const R_BULB = 10; // Hambatan lampu (Ohm)
const I_MAX = 2.0; // Batas arus sebelum lampu putus (Ampere)

export default function CircuitLab() {
  // Variabel Fisika
  const [voltage, setVoltage] = useState(12); // Volt
  const [r1, setR1] = useState(10); // Ohm
  const [r2, setR2] = useState(20); // Ohm
  
  // Status Sirkuit
  const [isBlown, setIsBlown] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  // Kalkulasi Hukum Ohm
  const rTotal = r1 + r2 + R_BULB;
  let current = 0;
  if (switchOn && !isBlown) {
    current = voltage / rTotal;
  }
  
  const power = current * current * R_BULB;

  // Cek jika meledak
  useEffect(() => {
    if (current > I_MAX && !isBlown) {
      setIsBlown(true);
      playExplosionSfx();
    }
  }, [current, isBlown]);

  const playExplosionSfx = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Bzzzt
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.5);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  const repairBulb = () => {
    setIsBlown(false);
  }

  // --- Animasi Elektron ---
  // Kecepatan gerak elektron (stroke-dashoffset) sebanding dengan Arus
  const electronSpeed = current * 20; 

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Cpu className="text-emerald-500" />
            Rangkaian Listrik & Hukum Ohm
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analisis arus, tegangan, dan hambatan pada sirkuit tertutup. Awas korsleting!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL KENDALI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} /> Komponen Sirkuit
          </div>

          <div className="space-y-6">
            {/* Saklar Utama */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">Saklar Utama</span>
              <button 
                onClick={() => setSwitchOn(!switchOn)}
                className={`relative w-14 h-7 rounded-full transition-colors ${switchOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${switchOn ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Baterai */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <label className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1"><Battery size={16}/> Tegangan Sumber (V)</span>
                <span>{voltage} Volt</span>
              </label>
              <input
                type="range" min="1.5" max="48" step="1.5"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Resistor 1 */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <label className="text-sm font-bold text-amber-700 dark:text-amber-400 flex justify-between mb-2">
                Hambatan R1 <span>{r1} Ω</span>
              </label>
              <input
                type="range" min="1" max="100" step="1"
                value={r1}
                onChange={(e) => setR1(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            {/* Resistor 2 */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <label className="text-sm font-bold text-amber-700 dark:text-amber-400 flex justify-between mb-2">
                Hambatan R2 <span>{r2} Ω</span>
              </label>
              <input
                type="range" min="1" max="100" step="1"
                value={r2}
                onChange={(e) => setR2(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
            
            {/* Status Lampu */}
            {isBlown && (
              <div className="p-4 bg-red-100 dark:bg-red-900/40 rounded-xl border border-red-300 dark:border-red-800 flex flex-col gap-3">
                <div className="flex items-start gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <span className="text-sm font-bold">Lampu Putus! Arus melebihi batas {I_MAX}A.</span>
                </div>
                <button 
                  onClick={repairBulb}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Ganti Bohlam Baru
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SIMULATOR & TELEMETRI */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center h-[450px] relative">
            
            {/* KANVAS SIRKUIT SVG */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full h-full">
              {/* Animasi Jalur Kabel Dasar */}
              <path d="M 100 250 L 100 100 L 250 100 L 350 100 L 500 100 L 500 250 L 320 250 M 280 250 L 140 250" 
                    fill="none" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Animasi Aliran Elektron (Garis Putus-putus berjalan) */}
              {switchOn && !isBlown && (
                <>
                  <style>
                    {`
                      @keyframes flow {
                        to { stroke-dashoffset: -40; }
                      }
                      .electron-flow {
                        stroke-dasharray: 10 30;
                        animation: flow ${1/current}s linear infinite;
                      }
                    `}
                  </style>
                  <path d="M 100 250 L 100 100 L 250 100 L 350 100 L 500 100 L 500 250 L 320 250 M 280 250 L 140 250" 
                        fill="none" className="stroke-emerald-400 dark:stroke-emerald-500 electron-flow" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}

              {/* Baterai (Kiri Bawah) */}
              <g transform="translate(80, 220)">
                <rect x="0" y="0" width="40" height="60" rx="4" className="fill-slate-800 dark:fill-slate-200" />
                <rect x="10" y="-8" width="20" height="8" rx="2" className="fill-slate-400" />
                <text x="20" y="35" textAnchor="middle" className="fill-white dark:fill-slate-900 font-bold text-sm">{voltage}V</text>
                {/* Kutub */}
                <text x="20" y="15" textAnchor="middle" className="fill-emerald-400 font-bold text-xs">+</text>
                <text x="20" y="55" textAnchor="middle" className="fill-red-400 font-bold text-xs">-</text>
              </g>

              {/* Resistor 1 (Atas Kiri) */}
              <g transform="translate(200, 85)">
                {/* Bentuk Zigzag standar IEEE */}
                <path d="M 0 15 L 10 0 L 20 30 L 30 0 L 40 30 L 50 0 L 60 15" fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="4" strokeLinejoin="round" />
                <rect x="-10" y="-20" width="80" height="20" rx="4" className="fill-white/80 dark:fill-slate-800/80" />
                <text x="30" y="-5" textAnchor="middle" className="fill-amber-700 dark:fill-amber-400 font-bold text-sm">R1: {r1}Ω</text>
              </g>

              {/* Resistor 2 (Atas Kanan) */}
              <g transform="translate(370, 85)">
                <path d="M 0 15 L 10 0 L 20 30 L 30 0 L 40 30 L 50 0 L 60 15" fill="none" className="stroke-amber-600 dark:stroke-amber-500" strokeWidth="4" strokeLinejoin="round" />
                <rect x="-10" y="-20" width="80" height="20" rx="4" className="fill-white/80 dark:fill-slate-800/80" />
                <text x="30" y="-5" textAnchor="middle" className="fill-amber-700 dark:fill-amber-400 font-bold text-sm">R2: {r2}Ω</text>
              </g>

              {/* Saklar (Bawah Tengah) */}
              <g transform="translate(280, 250)">
                <circle cx="0" cy="0" r="4" className="fill-slate-500" />
                <circle cx="40" cy="0" r="4" className="fill-slate-500" />
                {/* Tuas */}
                <line x1="0" y1="0" x2={switchOn ? "40" : "35"} y2={switchOn ? "0" : "-20"} className="stroke-slate-600 dark:stroke-slate-400" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Lampu Bohlam (Kanan Bawah) */}
              <g transform="translate(500, 250)">
                {/* Glow Effect */}
                {!isBlown && switchOn && power > 0 && (
                  <circle cx="0" cy="0" r={20 + power * 2} className="fill-yellow-400/30 blur-md transition-all duration-300" />
                )}
                
                {/* Bohlam Glass */}
                <circle cx="0" cy="0" r="25" className={`stroke-[3px] transition-colors ${isBlown ? 'fill-slate-200 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-700' : switchOn ? 'fill-yellow-100 dark:fill-yellow-900/50 stroke-yellow-400' : 'fill-white dark:fill-slate-800 stroke-slate-400'}`} />
                
                {/* Kawat Filamen */}
                {isBlown ? (
                  <path d="M -10 10 L -5 -5 M 5 -5 L 10 10" fill="none" className="stroke-slate-600" strokeWidth="2" />
                ) : (
                  <path d="M -10 10 L -5 -5 L 5 -5 L 10 10" fill="none" className={switchOn ? "stroke-yellow-500" : "stroke-slate-400"} strokeWidth="2" />
                )}
                
                {/* Dudukan Lampu */}
                <rect x="-12" y="25" width="24" height="15" rx="2" className="fill-slate-600" />
                <text x="0" y="-35" textAnchor="middle" className="fill-slate-500 font-bold text-xs">{R_BULB}Ω</text>
              </g>

              {/* Efek Ledakan (jika putus) */}
              {isBlown && (
                <g transform="translate(500, 250)">
                  <path d="M -30 -30 L -15 -15 M 30 -30 L 15 -15 M -30 30 L -15 15 M 30 30 L 15 15 M 0 -40 L 0 -20 M 0 40 L 0 20 M -40 0 L -20 0 M 40 0 L 20 0" 
                        fill="none" className="stroke-red-500 animate-pulse" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}
            </svg>
          </div>

          {/* Telemetry Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">Arus Total (I)</p>
                <p className="font-mono font-bold text-2xl text-emerald-600 dark:text-emerald-300">
                  {current.toFixed(2)} <span className="text-sm">A</span>
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <p className="text-amber-700 dark:text-amber-400 text-xs font-bold mb-1">Hambatan Total (Rt)</p>
                <p className="font-mono font-bold text-2xl text-amber-600 dark:text-amber-300">
                  {rTotal} <span className="text-sm">Ω</span>
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                <p className="text-yellow-700 dark:text-yellow-400 text-xs font-bold mb-1">Daya Lampu (P)</p>
                <p className="font-mono font-bold text-2xl text-yellow-600 dark:text-yellow-300">
                  {power.toFixed(1)} <span className="text-sm">W</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-xs font-bold mb-1">Status</p>
                <p className="font-mono font-bold text-lg text-slate-700 dark:text-slate-300">
                  {isBlown ? <span className="text-red-500">KORSLETING</span> : !switchOn ? "TERPUTUS" : "MENGALIR"}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-3">
              <Zap className="text-indigo-500 shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <strong>Hukum Ohm:</strong> Arus yang mengalir berbanding lurus dengan Tegangan (Volt) dan berbanding terbalik dengan Hambatan (Ohm).<br/>
                <span className="font-mono bg-white/50 dark:bg-black/20 px-1 rounded mt-1 inline-block">I = V / (R1 + R2 + R_Lampu)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
