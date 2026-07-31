import React, { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Play, Square, Activity, Info, Volume2, Ear, Car, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- WEB AUDIO API DOPPLER ENGINE ---
class DopplerAudioController {
  ctx: AudioContext | null = null;
  oscillator: OscillatorNode | null = null;
  gainNode: GainNode | null = null;
  isPlaying: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  start(baseFreq: number) {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isPlaying) return;
    
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'triangle'; // Suara agak kasar menyerupai klakson/sirene
    this.oscillator.frequency.value = baseFreq;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.5; // Default volume

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.oscillator.start();
    this.isPlaying = true;
  }

  setFrequency(freq: number) {
    if (this.ctx && this.oscillator && this.isPlaying) {
      // Smooth transition to prevent audio popping, but fast enough for instant doppler drop
      this.oscillator.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    }
  }

  setPanAndVolume(pan: number, distance: number) {
     // Optional: Add StereoPannerNode and distance-based volume attenuation if needed
     // For now, keeping it simple to just focus on Frequency (Pitch)
  }

  stop() {
    if (!this.ctx || !this.isPlaying || !this.gainNode || !this.oscillator) return;
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    setTimeout(() => {
      if (this.oscillator) {
        try { this.oscillator.stop(); } catch(e){}
        this.oscillator = null;
      }
      this.isPlaying = false;
    }, 150);
  }
}

const audioController = new DopplerAudioController();

export default function DopplerLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Fisika State
  const PIXEL_SCALE = 2; // 2 pixels = 1 meter
  
  // UI Control States
  const [f0, setF0] = useState<number>(400); // Frekuensi sumber (Hz)
  const [vs, setVs] = useState<number>(30); // Kecepatan sumber (m/s) (sekitar 108 km/h)
  const [vo, setVo] = useState<number>(0); // Kecepatan pendengar (m/s)
  const [vSound, setVSound] = useState<number>(340); // Kecepatan bunyi di udara (m/s)
  
  // Interaction State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Telemetry States
  const [fPrime, setFPrime] = useState<number>(400);
  const [distanceInfo, setDistanceInfo] = useState<string>("Mendekat");

  // State Fisika untuk requestAnimationFrame
  const physics = useRef({
    xs: 100, // Posisi sumber (m)
    xo: 300, // Posisi observer (m)
    time: 0,
    lastTime: performance.now(),
    wavefronts: [] as { x: number, time: number }[],
    lastWaveTime: 0
  });

  const resetSimulation = () => {
    physics.current.xs = 50;
    physics.current.xo = 350; // Sekitar 700px di layar
    physics.current.time = 0;
    physics.current.wavefronts = [];
    setFPrime(f0);
    if (isPlaying) {
      audioController.stop();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioController.stop();
      setIsPlaying(false);
    } else {
      audioController.start(f0);
      physics.current.lastTime = performance.now();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      audioController.stop();
    };
  }, []);

  const updatePhysics = () => {
    if (!isPlaying) return;

    const now = performance.now();
    let dt = (now - physics.current.lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; 
    physics.current.lastTime = now;

    physics.current.time += dt;

    // Gerakkan sumber
    physics.current.xs += vs * dt;
    // Gerakkan observer (jika tidak nol)
    physics.current.xo += vo * dt;

    // Menghasilkan wavefront baru setiap sekian detik
    // Frekuensi gelombang asli di layar kita kurangi agar tidak terlalu padat
    // Misal 5 wave per detik
    const waveInterval = 1.0 / 5.0; 
    if (physics.current.time - physics.current.lastWaveTime > waveInterval) {
      physics.current.wavefronts.push({
        x: physics.current.xs,
        time: physics.current.time
      });
      physics.current.lastWaveTime = physics.current.time;
    }

    // Hapus wave yang sudah terlalu besar
    physics.current.wavefronts = physics.current.wavefronts.filter(w => {
      const radius = (physics.current.time - w.time) * vSound;
      return radius * PIXEL_SCALE < 1500; // Layar
    });

    // === RUMUS EFEK DOPPLER ===
    // Jarak
    const dist = physics.current.xo - physics.current.xs;
    
    let v_rel_s = 0; // Kecepatan sumber *menuju* pendengar
    let v_rel_o = 0; // Kecepatan pendengar *menuju* sumber

    if (dist > 0) {
      // Sumber di kiri, Pendengar di kanan
      v_rel_s = vs; // Jika vs positif (ke kanan), dia menuju pendengar
      v_rel_o = -vo; // Jika vo positif (ke kanan), dia menjauhi sumber
      setDistanceInfo("Mendekat");
    } else {
      // Sumber sudah melewati pendengar (Sumber di kanan, Pendengar di kiri)
      v_rel_s = -vs; // Jika vs positif (ke kanan), dia menjauhi pendengar
      v_rel_o = vo; // Jika vo positif (ke kanan), dia menuju sumber
      setDistanceInfo("Menjauh (PITCH DROP!)");
    }

    // f' = f0 * (v + v_rel_o) / (v - v_rel_s)
    let denominator = (vSound - v_rel_s);
    if (denominator <= 0) denominator = 0.001; // Cegah sonic boom divide by zero di simulasi sederhana ini

    const currentFPrime = f0 * (vSound + v_rel_o) / denominator;
    
    setFPrime(currentFPrime);
    audioController.setFrequency(currentFPrime);

    // Auto-stop jika sumber keluar layar terlalu jauh
    if (physics.current.xs > 450 || physics.current.xs < -50) {
      togglePlay();
    }
  };

  const drawScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Background Street
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    const centerY = height / 2;

    // Draw Road
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, centerY - 40, width, 80);
    // Road dashed line
    ctx.beginPath();
    ctx.setLineDash([20, 20]);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Draw Wavefronts
    ctx.lineWidth = 2;
    physics.current.wavefronts.forEach(w => {
      const radius = (physics.current.time - w.time) * vSound;
      const radiusPx = Math.abs(radius * PIXEL_SCALE);
      
      const xPx = w.x * PIXEL_SCALE;

      ctx.beginPath();
      ctx.arc(xPx, centerY, radiusPx, 0, Math.PI * 2);
      
      // Opacity fades as it gets larger
      const opacity = Math.max(0, 1.0 - (radiusPx / 500));
      ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`; // sky-500
      ctx.stroke();
    });

    // Draw Observer
    const xoPx = physics.current.xo * PIXEL_SCALE;
    ctx.beginPath();
    ctx.arc(xoPx, centerY + 60, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24'; // amber
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    // Ear Icon representation
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👂', xoPx, centerY + 60);

    // Draw Source (Ambulance/Car)
    const xsPx = physics.current.xs * PIXEL_SCALE;
    ctx.fillStyle = '#ef4444'; // red
    ctx.fillRect(xsPx - 20, centerY - 15, 40, 30);
    // Siren light
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(xsPx - 5, centerY - 20, 10, 5);
    // Headlights if moving right
    if (vs > 0) {
      ctx.beginPath();
      ctx.moveTo(xsPx + 20, centerY - 10);
      ctx.lineTo(xsPx + 60, centerY - 20);
      ctx.lineTo(xsPx + 60, centerY + 20);
      ctx.lineTo(xsPx + 20, centerY + 10);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.3)'; // yellow glow
      ctx.fill();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updatePhysics();
    drawScene(ctx, canvas.width, canvas.height);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isPlaying, vs, vo, f0, vSound]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Volume2 size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Efek Doppler</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative h-[500px]">
              
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center z-10">
                <h2 className="font-bold flex items-center gap-2">
                  <Activity size={18} className="text-sky-500" /> Kanvas Suara & Gelombang
                </h2>
                <div className="flex gap-2">
                  <button onClick={resetSimulation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <RotateCcw size={16} /> Reset
                  </button>
                  <button 
                    onClick={togglePlay} 
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95 shadow-md
                      ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20'}`}
                  >
                    {isPlaying ? <Square size={16} className="fill-white" /> : <Play size={16} className="fill-white" />} 
                    {isPlaying ? 'Hentikan Bunyi' : 'Bunyikan Sirene'}
                  </button>
                </div>
              </div>

              <div className="relative flex-1 bg-[#0f172a] overflow-hidden">
                <canvas 
                  ref={canvasRef}
                  width={800} 
                  height={450} 
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

            {/* Hint & Penjelasan */}
            <div className="bg-sky-50 dark:bg-sky-950/20 rounded-3xl p-6 border border-sky-200 dark:border-sky-900/50 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 text-sky-700 dark:text-sky-400 mb-3">
                <Info size={20} /> Fenomena Pitch Drop
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Pernahkah Anda mendengar mobil balap atau ambulans melintas? Suaranya terdengar melengking tinggi (NGUIIING) saat mendekat, namun seketika berubah menjadi rendah (NGOOONG) persis saat ia melewati Anda.
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Ini adalah **Efek Doppler**. Gelombang suara merapat saat sumber mendekat (Frekuensi naik), dan meregang saat sumber menjauh (Frekuensi turun). Mainkan simulasinya dan dengarkan dengan *speaker* Anda!
              </p>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            
            {/* Dashboard Telemetri */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-2 border-slate-700">
              <h2 className="font-bold flex items-center gap-2 mb-6 text-sky-400">
                <Ear size={18} /> Frekuensi Terdengar (f')
              </h2>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <div className={`text-5xl font-black transition-colors ${isPlaying ? 'text-sky-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'text-slate-600'}`}>
                  {fPrime.toFixed(0)} <span className="text-2xl text-slate-500">Hz</span>
                </div>
                <div className={`mt-2 font-bold px-3 py-1 rounded-full text-xs ${distanceInfo.includes('Menjauh') ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  Status: {distanceInfo}
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center font-mono text-sm text-slate-300">
                f' = f₀ · <span className="text-sky-400">(v ± v_o)</span> / <span className="text-rose-400">(v ∓ v_s)</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Frekuensi Sumber (f0) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Volume2 size={16} className="text-slate-400"/> Frekuensi Asli (f₀)
                  </label>
                  <span className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400">{f0} Hz</span>
                </div>
                <input type="range" min="200" max="800" step="10" value={f0} onChange={(e) => setF0(parseInt(e.target.value))} className="w-full accent-sky-500" />
              </div>

              {/* Kecepatan Sumber (vs) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Car size={16} className="text-slate-400"/> Kecepatan Ambulans (v_s)
                  </label>
                  <span className="text-sm font-mono font-bold text-rose-500">{vs} m/s</span>
                </div>
                <input type="range" min="0" max="100" step="1" value={vs} onChange={(e) => setVs(parseInt(e.target.value))} className="w-full accent-rose-500" />
                <p className="text-xs text-slate-400 text-right">*(~{Math.round(vs * 3.6)} km/jam)</p>
              </div>

              {/* Kecepatan Pendengar (vo) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Ear size={16} className="text-slate-400"/> Kecepatan Pendengar (v_o)
                  </label>
                  <span className="text-sm font-mono font-bold text-emerald-500">{vo} m/s</span>
                </div>
                <input type="range" min="-50" max="50" step="1" value={vo} onChange={(e) => setVo(parseInt(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1">
                  <span>Mundur</span>
                  <span>Maju</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

              {/* Kecepatan Bunyi (v) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Rambat Bunyi Udara (v)</label>
                  <span className="text-sm font-mono font-bold text-slate-500">{vSound} m/s</span>
                </div>
                <input type="range" min="300" max="350" step="1" value={vSound} onChange={(e) => setVSound(parseInt(e.target.value))} className="w-full accent-slate-400" />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
