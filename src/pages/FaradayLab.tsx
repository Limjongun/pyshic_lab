import React, { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Lightbulb, Activity, Info, Settings2, Power, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FaradayLab() {
  // === STATE FISIKA & KONTROL ===
  const [N, setN] = useState<number>(3); // Jumlah Lilitan (1 - 5)
  const [B, setB] = useState<number>(50); // Kekuatan Magnet (0 - 100)
  const [isAuto, setIsAuto] = useState<boolean>(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(2.0); // Kecepatan putaran dinamo
  
  // Posisi magnet (0 - 100)
  const [sliderPos, setSliderPos] = useState<number>(20);
  
  // Telemetri Live
  const [voltage, setVoltage] = useState<number>(0);
  const [magneticFlux, setMagneticFlux] = useState<number>(0);

  // Refs untuk animasi yang smooth (mengatasi lag dari state react)
  const requestRef = useRef<number>(0);
  const physicsState = useRef({
    pos: 20,
    time: 0,
    lastPos: 20
  });

  const COIL_CENTER = 75; // Posisi tengah kumparan (%)

  useEffect(() => {
    const animate = () => {
      const state = physicsState.current;
      
      if (isAuto) {
        state.time += 0.016 * autoSpeed; // Asumsi 60fps
        // Osilasi dari posisi 30 ke 90 (melewati kumparan)
        state.pos = 60 + 30 * Math.sin(state.time * Math.PI);
        setSliderPos(state.pos); // Sinkronisasi UI slider
      } else {
        // Smooth interpolation menuju target slider (Simulasi inersia massa magnet)
        state.pos += (sliderPos - state.pos) * 0.2;
      }

      const velocity = state.pos - state.lastPos;
      state.lastPos = state.pos;

      // === PERHITUNGAN HUKUM FARADAY ===
      // Fluks Magnetik memuncak seperti lonceng saat magnet berada tepat di dalam kumparan.
      // Phi(x) = B * e^(-(x - center)^2 / width)
      const width = 150;
      const flux = B * Math.exp(-Math.pow(state.pos - COIL_CENTER, 2) / width);
      
      // dPhi/dx adalah turunan fungsi lonceng
      const dPhi_dx = flux * (-2 * (state.pos - COIL_CENTER) / width);
      
      // V = -N * (dPhi/dx) * (dx/dt)
      // Velocity sudah mewakili dx/dt
      const emf = -N * dPhi_dx * velocity;

      // Update telemetri untuk dirender
      setVoltage(emf);
      setMagneticFlux(flux);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [sliderPos, isAuto, autoSpeed, N, B]);

  // Efek visual berdasarkan voltase
  const absVolt = Math.abs(voltage);
  const bulbBrightness = Math.min(100, absVolt * 2); // 0 to 100%
  const needleRotation = Math.max(-90, Math.min(90, voltage * 3)); // -90 to 90 degrees

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-yellow-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <Power size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Induksi Faraday</h1>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Info size={16} /> Bantuan
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative h-[500px]">
              
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center z-10">
                <h2 className="font-bold flex items-center gap-2">
                  <Activity size={18} className="text-yellow-500" /> Simulasi Magnet & Kumparan
                </h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isAuto} 
                      onChange={(e) => setIsAuto(e.target.checked)}
                      className="accent-yellow-500 w-4 h-4 cursor-pointer"
                    />
                    Mode Dinamo (Otomatis)
                  </label>
                </div>
              </div>

              {/* Canvas Area (Using DOM for Crisp SVGs) */}
              <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center">
                {/* Latar Belakang Grid Kasar */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>

                {/* VOLTMETER */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-48 h-24 bg-slate-800 rounded-t-full border-4 border-slate-700 relative overflow-hidden flex items-end justify-center pb-2 shadow-2xl">
                    <div className="absolute bottom-0 w-2 h-2 bg-white rounded-full z-20"></div>
                    {/* Scale markers */}
                    <div className="absolute w-full h-full">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-slate-500 origin-bottom" style={{ transform: `translateX(-50%) rotate(${(i-4)*20}deg) translateY(-85px)` }}></div>
                      ))}
                    </div>
                    <span className="absolute bottom-4 left-4 text-xs font-bold text-slate-400">-V</span>
                    <span className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">+V</span>
                    
                    {/* Jarum (Needle) */}
                    <div 
                      className="w-1 h-20 bg-red-500 origin-bottom absolute bottom-1 z-10 transition-transform duration-75"
                      style={{ transform: `rotate(${needleRotation}deg)` }}
                    ></div>
                  </div>
                  <div className="bg-slate-800 px-4 py-1 rounded-b-xl border-x-4 border-b-4 border-slate-700 text-yellow-400 font-mono font-bold">
                    {voltage.toFixed(2)} mV
                  </div>
                </div>

                {/* LAMPU BOHLAM */}
                <div className="absolute top-16 right-16 flex flex-col items-center">
                  <div className="relative">
                    {/* Glow Effect Layer */}
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl transition-opacity duration-150"
                      style={{ 
                        backgroundColor: '#fef08a',
                        opacity: bulbBrightness / 100,
                        transform: 'scale(1.5)'
                      }}
                    ></div>
                    <Lightbulb 
                      size={64} 
                      strokeWidth={1.5}
                      className="relative z-10 transition-colors duration-150"
                      color={bulbBrightness > 10 ? '#eab308' : '#64748b'}
                      fill={bulbBrightness > 10 ? `rgba(253, 224, 71, ${bulbBrightness / 100})` : 'transparent'}
                    />
                  </div>
                  {/* Kabel terhubung ke kumparan */}
                  <div className="w-1 h-24 bg-orange-700 mt-2"></div>
                </div>

                {/* KUMPARAN KAWAT (SOLENOID) */}
                <div className="absolute left-[75%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative flex">
                    {[...Array(N)].map((_, i) => (
                      <div key={i} className="w-12 h-40 border-8 border-orange-500 rounded-[50%] -ml-6 shadow-xl shadow-orange-900/50" style={{ transform: 'rotateX(20deg)' }}></div>
                    ))}
                  </div>
                  {/* Pipa penyangga dalam kumparan */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-slate-800/80 rounded-xl -z-10 border border-slate-700"></div>
                </div>

                {/* MAGNET BATANG */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 z-30 transition-transform duration-75"
                  style={{ left: `${physicsState.current.pos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="flex w-48 h-16 rounded-lg overflow-hidden shadow-2xl border-2 border-slate-400/20">
                    <div className="flex-1 bg-red-600 flex items-center justify-center font-black text-white text-2xl tracking-widest relative">
                      N
                      {/* Magnetic Field Lines (Utara) */}
                      <div className="absolute -left-12 w-12 h-full flex flex-col justify-between py-2 opacity-50">
                        <ArrowLeft size={16} className="text-red-400" />
                        <ArrowLeft size={16} className="text-red-400" />
                        <ArrowLeft size={16} className="text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1 bg-blue-600 flex items-center justify-center font-black text-white text-2xl tracking-widest relative">
                      S
                      {/* Magnetic Field Lines (Selatan) */}
                      <div className="absolute -right-12 w-12 h-full flex flex-col justify-between py-2 items-end opacity-50">
                        <ArrowLeft size={16} className="text-blue-400" />
                        <ArrowLeft size={16} className="text-blue-400" />
                        <ArrowLeft size={16} className="text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* SLIDER KONTROL MAGNET (Hanya aktif jika manual) */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Posisi Tangan (Geser Cepat!)</label>
                  {isAuto && <span className="text-xs text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded">Mode Dinamo Aktif</span>}
                </div>
                <input 
                  type="range" 
                  min="10" max="90" step="0.1"
                  value={isAuto ? physicsState.current.pos : sliderPos} 
                  onChange={(e) => {
                    if (!isAuto) setSliderPos(parseFloat(e.target.value))
                  }}
                  disabled={isAuto}
                  className={`w-full h-3 rounded-full outline-none transition-all ${isAuto ? 'accent-slate-400 cursor-not-allowed opacity-50' : 'accent-yellow-500 cursor-grab active:cursor-grabbing'}`}
                />
                <p className="text-xs text-center text-slate-500 mt-2">GGL Induksi (Listrik) hanya tercipta saat magnet <b>bergerak</b>. Buktikan sendiri!</p>
              </div>

            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            
            {/* Indikator Pembelajaran (Kuning Faraday) */}
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-yellow-500/20">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-50">
                <Info size={20} /> Hukum Faraday
              </h3>
              <p className="text-sm text-yellow-100 mb-6 leading-relaxed">
                Tegangan listrik (GGL) berbanding lurus dengan <strong>kecepatan perubahan fluks magnetik</strong> yang memotong kumparan.
              </p>
              <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm text-center">
                <span className="font-mono text-xl font-black text-white">ε = -N · (dΦ/dt)</span>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <Settings2 size={18} className="text-slate-500" /> Parameter Alat
              </h3>
              
              {/* Jumlah Lilitan (N) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jumlah Lilitan (N)</label>
                  <span className="text-sm font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                    {N} Lilitan
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" max="8" step="1"
                  value={N} 
                  onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>

              {/* Kekuatan Magnet (B) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kekuatan Magnet (B)</label>
                  <span className="text-sm font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                    {B} %
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" max="100" step="1"
                  value={B} 
                  onChange={(e) => setB(parseInt(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>

              {/* Kecepatan Dinamo (Hanya aktif jika isAuto) */}
              <div className={`space-y-3 transition-opacity ${isAuto ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">RPM Dinamo (Otomatis)</label>
                  <span className="text-sm font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                    {autoSpeed.toFixed(1)}x
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="5.0" step="0.1"
                  value={autoSpeed} 
                  onChange={(e) => setAutoSpeed(parseFloat(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
