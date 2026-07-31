import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Play, RotateCcw, Activity, Info, Rocket, Settings2, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- WEB AUDIO API SFX ---
class AudioController {
  ctx: AudioContext | null = null;
  oscillator: OscillatorNode | null = null;
  gainNode: GainNode | null = null;
  filter: BiquadFilterNode | null = null;
  isPlaying: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  startThruster() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isPlaying) return;
    
    // Create white noise buffer
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 400; // Low rumble

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0;

    noiseSource.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    noiseSource.start();
    this.oscillator = noiseSource as any;
    
    // Fade in
    this.gainNode.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1);
    this.filter.frequency.linearRampToValueAtTime(1000, this.ctx.currentTime + 0.2);
    this.isPlaying = true;
  }

  stopThruster() {
    if (!this.ctx || !this.isPlaying || !this.gainNode) return;
    // Fade out
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
    setTimeout(() => {
      if (this.oscillator) {
        try { this.oscillator.stop(); } catch(e){}
        this.oscillator = null;
      }
      this.isPlaying = false;
    }, 200);
  }
}

const audioController = new AudioController();

export default function RotasiLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Fisika State (Constants untuk UI)
  const R_MAX = 2.0; // Radius benda maksimal selalu 2m untuk skala
  const PIXEL_PER_METER = 80;

  // UI Control States
  const [shape, setShape] = useState<'cakram' | 'cincin' | 'bola'>('cakram');
  const [mass, setMass] = useState<number>(10); // kg
  const [force, setForce] = useState<number>(20); // Newton
  const [radiusR, setRadiusR] = useState<number>(2.0); // Posisi Thruster (m)
  
  // Interaction State
  const [thrustDir, setThrustDir] = useState<number>(0); // 1 = CW, -1 = CCW, 0 = off
  
  // Telemetry States
  const [rpm, setRpm] = useState<number>(0);
  const [alphaDisp, setAlphaDisp] = useState<number>(0);
  const [torqueDisp, setTorqueDisp] = useState<number>(0);
  const [inertiaDisp, setInertiaDisp] = useState<number>(0);

  // Fisika Engine State (Ref agar tidak memicu re-render react loop)
  const physics = useRef({
    theta: 0,
    omega: 0,
    alpha: 0,
    lastTime: performance.now(),
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number}[]
  });

  const getShapeFactor = () => {
    if (shape === 'cakram') return 0.5;
    if (shape === 'cincin') return 1.0;
    if (shape === 'bola') return 0.4;
    return 0.5;
  };

  const handlePointerDown = (dir: number) => {
    setThrustDir(dir);
    audioController.startThruster();
  };

  const handlePointerUp = () => {
    setThrustDir(0);
    audioController.stopThruster();
  };

  useEffect(() => {
    // Pastikan audio berhenti jika unmount
    return () => audioController.stopThruster();
  }, []);

  const drawWheel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusPx: number) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(physics.current.theta);

    // Draw Base Shape
    ctx.beginPath();
    ctx.arc(0, 0, radiusPx, 0, Math.PI * 2);
    
    if (shape === 'cakram') {
      ctx.fillStyle = '#475569'; // slate-600 solid
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 10;
      ctx.stroke();
    } else if (shape === 'cincin') {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 30; // Cincin tebal
      ctx.stroke();
      ctx.fillStyle = 'transparent';
    } else if (shape === 'bola') {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusPx);
      grad.addColorStop(0, '#64748b'); // Terang di tengah
      grad.addColorStop(1, '#1e293b'); // Gelap di tepi
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Draw Spokes/Markings so rotation is visible
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 4;
    ctx.moveTo(-radiusPx, 0); ctx.lineTo(radiusPx, 0);
    ctx.moveTo(0, -radiusPx); ctx.lineTo(0, radiusPx);
    ctx.stroke();

    // Draw Thruster Attachment Point
    const thrusterPx = radiusR * PIXEL_PER_METER;
    ctx.beginPath();
    ctx.arc(thrusterPx, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red dot
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Thruster Engine
    ctx.fillStyle = '#cbd5e1';
    // Gambar nozzle sesuai arah dorongan
    if (thrustDir === 1 || thrustDir === 0) {
      ctx.fillRect(thrusterPx - 10, -25, 20, 25);
    }
    if (thrustDir === -1) {
      ctx.fillRect(thrusterPx - 10, 0, 20, 25);
    }
    
    // Draw Particles if thrusting
    if (thrustDir !== 0) {
      // Add new particles
      for (let i = 0; i < 5; i++) {
        physics.current.particles.push({
          x: thrusterPx + (Math.random() - 0.5) * 10,
          y: thrustDir === 1 ? -25 : 25,
          vx: (Math.random() - 0.5) * 50,
          vy: thrustDir === 1 ? (-150 - Math.random() * 100) : (150 + Math.random() * 100), // Arah buang partikel berlawanan gaya
          life: 1.0
        });
      }
    }

    // Update & Draw Particles (Local coordinate system)
    const dt = 0.016;
    for (let i = physics.current.particles.length - 1; i >= 0; i--) {
      let p = physics.current.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt * 3;
      
      if (p.life <= 0) {
        physics.current.particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life * 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 146, 60, ${p.life})`; // orange
      ctx.fill();
    }

    ctx.restore();
  };

  const updatePhysics = () => {
    const now = performance.now();
    let dt = (now - physics.current.lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // Limit dt on tab change
    physics.current.lastTime = now;

    const I = getShapeFactor() * mass * Math.pow(R_MAX, 2);
    setInertiaDisp(I);

    let tau_drive = 0;
    if (thrustDir !== 0) {
      tau_drive = force * radiusR * thrustDir;
    }

    // Gesekan (selalu melawan arah rotasi)
    const friction_mag = 2.0; 
    let tau_friction = 0;
    if (physics.current.omega > 0.01) tau_friction = -friction_mag;
    else if (physics.current.omega < -0.01) tau_friction = friction_mag;
    else tau_friction = -physics.current.omega / dt * I; // Gesekan statis menghentikan roda

    // Net Torque
    let tau_net = tau_drive + tau_friction;
    
    // Cegah roda bergetar di sekitar 0 jika gaya luar 0
    if (thrustDir === 0 && Math.abs(physics.current.omega) < 0.1) {
      tau_net = 0;
      physics.current.omega = 0;
    }

    setTorqueDisp(thrustDir !== 0 ? tau_drive : 0);

    const alpha = tau_net / I;
    setAlphaDisp(alpha);

    physics.current.omega += alpha * dt;
    physics.current.theta += physics.current.omega * dt;

    // RPM = (rad/s) * (60 / (2 * PI))
    setRpm(physics.current.omega * 9.54929);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updatePhysics();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background Slate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWheel(ctx, canvas.width / 2, canvas.height / 2, R_MAX * PIXEL_PER_METER);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [shape, mass, force, radiusR, thrustDir]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <RotateCcw size={18} />
              </div>
              <h1 className="text-lg font-bold">Lab Dinamika Rotasi</h1>
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
                  <Activity size={18} className="text-orange-500" /> Simulasi Flywheel & Thruster
                </h2>
              </div>
              
              <div className="relative flex-1 bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center">
                <canvas 
                  ref={canvasRef}
                  width={800} 
                  height={450} 
                  className="w-full h-full object-contain cursor-crosshair"
                />

                {/* Two Thruster Buttons Overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="flex gap-4">
                    {/* Putar Kiri / Lawan Jarum Jam (CCW) */}
                    <button
                      onMouseDown={() => handlePointerDown(-1)}
                      onMouseUp={handlePointerUp}
                      onMouseLeave={handlePointerUp}
                      onTouchStart={() => handlePointerDown(-1)}
                      onTouchEnd={handlePointerUp}
                      className={`px-6 py-3 rounded-2xl font-black text-sm md:text-base flex items-center gap-2 transition-all select-none
                        ${thrustDir === -1 
                          ? 'bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.8)] scale-95' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl hover:bg-orange-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <RotateCcw size={20} className={thrustDir === -1 ? 'animate-spin-slow' : ''} />
                      PUTAR KIRI
                    </button>

                    {/* Putar Kanan / Searah Jarum Jam (CW) */}
                    <button
                      onMouseDown={() => handlePointerDown(1)}
                      onMouseUp={handlePointerUp}
                      onMouseLeave={handlePointerUp}
                      onTouchStart={() => handlePointerDown(1)}
                      onTouchEnd={handlePointerUp}
                      className={`px-6 py-3 rounded-2xl font-black text-sm md:text-base flex items-center gap-2 transition-all select-none
                        ${thrustDir === 1 
                          ? 'bg-orange-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.8)] scale-95' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl hover:bg-orange-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      PUTAR KANAN
                      <RotateCcw size={20} className={`transform scale-x-[-1] ${thrustDir === 1 ? 'animate-spin-slow' : ''}`} />
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-sm">Tahan salah satu untuk Mendorong</p>
                </div>
              </div>
            </div>

            {/* Hint & Penjelasan (Permintaan User) */}
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-6 border border-orange-200 dark:border-orange-900/50 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-3">
                <ShieldAlert size={20} /> Hint Pembelajaran: Cara Torsi Bekerja
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Bayangkan Anda mencoba memutar pintu putar. Jika Anda mendorong di engselnya ($r \approx 0$), pintu sangat sulit bergerak. Namun jika Anda mendorong di ujung pintunya ($r$ maksimal), pintu berputar dengan mudah! Inilah <b>Torsi ($\tau$)</b>, kombinasi Gaya ($F$) dan Jarak dari poros ($r$).
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li><b>Coba ubah bentuk roda:</b> Cincin berongga sangat sulit diputarkan (inersia $I$ tinggi), sementara bola pejal lebih mudah diputar.</li>
                <li><b>Geser Posisi Thruster:</b> Jika Anda memasang roket terlalu dekat dengan as tengah (poros), roda tidak akan berputar kencang!</li>
              </ul>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            
            {/* Dashboard Telemetri */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-2 border-slate-700">
              <h2 className="font-bold flex items-center gap-2 mb-6 text-orange-400">
                <Activity size={18} /> Telemetri Dinamika
              </h2>
              
              {/* Tachometer RPM */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-slate-700 bg-slate-800 shadow-inner">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white">{Math.abs(rpm).toFixed(0)}</div>
                    <div className="text-xs text-slate-400 font-bold tracking-widest">RPM</div>
                  </div>
                  {/* Circular progress equivalent */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="56" fill="transparent" stroke="#334155" strokeWidth="8" />
                    <circle 
                      cx="60" cy="60" r="56" fill="transparent" stroke="#f97316" strokeWidth="8" 
                      strokeDasharray="351.8" 
                      strokeDashoffset={351.8 - (Math.min(351.8, (Math.abs(rpm) / 500) * 351.8))}
                      className="transition-all duration-75"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-xs font-bold uppercase">Torsi Aktif (τ)</span>
                  <div className="text-right font-mono">
                    <span className="text-lg font-bold text-orange-400">{torqueDisp.toFixed(1)}</span> <span className="text-slate-500 text-xs">N·m</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-xs font-bold uppercase">Momen Inersia (I)</span>
                  <div className="text-right font-mono">
                    <span className="text-lg font-bold text-sky-400">{inertiaDisp.toFixed(1)}</span> <span className="text-slate-500 text-xs">kg·m²</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-xs font-bold uppercase">Percepatan (α)</span>
                  <div className="text-right font-mono">
                    <span className="text-lg font-bold text-emerald-400">{alphaDisp.toFixed(2)}</span> <span className="text-slate-500 text-xs">rad/s²</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <Settings2 size={18} className="text-slate-500" /> Parameter Roda & Mesin
              </h3>
              
              {/* Bentuk Objek */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Geometri Benda ($I$)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setShape('cakram')} className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors ${shape === 'cakram' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-600 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>Silinder Pejal</button>
                  <button onClick={() => setShape('cincin')} className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors ${shape === 'cincin' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-600 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>Cincin Berongga</button>
                  <button onClick={() => setShape('bola')} className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors ${shape === 'bola' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-600 dark:text-orange-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>Bola Pejal</button>
                </div>
              </div>

              {/* Massa Benda (m) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Massa Benda (m)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-orange-600 dark:text-orange-400">{mass} kg</span>
                </div>
                <input type="range" min="1" max="50" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} className="w-full accent-orange-500" />
              </div>

              {/* Posisi Thruster (r) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jarak Thruster dari Poros (r)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-orange-600 dark:text-orange-400">{radiusR.toFixed(1)} m</span>
                </div>
                <input type="range" min="0.2" max="2.0" step="0.1" value={radiusR} onChange={(e) => setRadiusR(parseFloat(e.target.value))} className="w-full accent-orange-500" />
              </div>

              {/* Gaya Dorong Thruster (F) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kekuatan Dorong Roket (F)</label>
                  <span className="text-sm font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-orange-600 dark:text-orange-400">{force} N</span>
                </div>
                <input type="range" min="5" max="100" step="1" value={force} onChange={(e) => setForce(parseInt(e.target.value))} className="w-full accent-orange-500" />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
