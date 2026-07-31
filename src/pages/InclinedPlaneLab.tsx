import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Info, Settings2, XCircle } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useAnimationFrame } from "framer-motion"

const PIXELS_PER_METER = 100;

export default function InclinedPlaneLab() {
  const { addXp } = useStore()
  
  // Kontrol Fisika
  const [L, setL] = useState<number>(500); // Panjang lintasan (pixel)
  const [m, setM] = useState<number>(5); // Massa (kg)
  const [theta, setTheta] = useState<number>(30); // Sudut (derajat)
  const [muType, setMuType] = useState<"es"|"kayu"|"karet">("kayu");
  
  const muValues = { es: 0.0, kayu: 0.2, karet: 0.5 };
  const mu = muValues[muType];
  const g = 9.8;
  
  // State UI
  const [showHint, setShowHint] = useState(false);
  
  // State Simulasi
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // dalam pixel (0 sampai L)
  const [velocity, setVelocity] = useState(0); // px/s
  const [timePassed, setTimePassed] = useState(0); // detik

  // --- AUDIO SFX ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const startSfx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Create 1-second white noise buffer
    const bufferSize = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const gainNode = ctx.createGain();

    if (muType === 'es') {
      filter.frequency.value = 5000;
      gainNode.gain.value = 0.01; // Sangat pelan dan halus
    } else if (muType === 'kayu') {
      filter.frequency.value = 2000;
      gainNode.gain.value = 0.05; // Sedang
    } else {
      filter.frequency.value = 600; 
      gainNode.gain.value = 0.15; // Kasar dan nge-bass
    }

    // Fade in to avoid clicks
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(muType === 'es' ? 0.01 : muType === 'kayu' ? 0.05 : 0.15, ctx.currentTime + 0.1);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSourceRef.current = noiseSource;
  }

  const stopSfx = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch (e) {}
      noiseSourceRef.current = null;
    }
  }

  useEffect(() => {
    if (isPlaying) {
      startSfx();
    } else {
      stopSfx();
    }
    return () => stopSfx();
  }, [isPlaying, muType]);

  // Kalkulasi Fisika Real-time
  const rad = theta * (Math.PI / 180);
  const W = m * g;
  const Wx = W * Math.sin(rad);
  const Wy = W * Math.cos(rad);
  const N = Wy;
  const maxFk = mu * N;
  
  // Gaya Gesek Kinetis (hanya menahan Wx, tidak pernah mendorong ke atas)
  const fk = Wx > maxFk ? maxFk : Wx;
  const Fnet = Wx - fk;
  const a = Fnet / m; // percepatan nyata (m/s^2)
  const a_px = a * PIXELS_PER_METER; // percepatan di layar (px/s^2)

  // Loop Simulasi
  useAnimationFrame((time, delta) => {
    if (!isPlaying) return;
    const dt = delta / 1000;
    
    setPosition(prevP => {
      setVelocity(prevV => {
        let newV = prevV + a_px * dt;
        let newP = prevP + prevV * dt + 0.5 * a_px * dt * dt;
        
        if (newP >= L) {
          setIsPlaying(false); // Stop saat mencapai ujung
          addXp(100); // Beri reward XP saat eksperimen selesai
          return 0; // stop velocity
        }
        return newV;
      });
      
      let newP = prevP + velocity * dt + 0.5 * a_px * dt * dt;
      if (newP >= L) return L;
      return newP;
    });
    
    setTimePassed(prev => prev + dt);
  });

  const handlePlay = () => {
    if (position >= L) {
      // jika sudah di ujung, reset lalu mainkan
      setPosition(0);
      setVelocity(0);
      setTimePassed(0);
    }
    // Hanya bisa jalan kalau gaya dorong menang dari gesekan
    if (Fnet > 0) {
      setIsPlaying(true);
    }
  }

  const handlePause = () => setIsPlaying(false);
  
  const handleReset = () => {
    setIsPlaying(false);
    setPosition(0);
    setVelocity(0);
    setTimePassed(0);
  }

  // --- RENDERING GRAFIS SVG ---
  // Pivot (sudut kanan bawah bidang miring)
  const pivotX = 650;
  const pivotY = 350;
  const dx = L * Math.cos(rad);
  const dy = L * Math.sin(rad);
  
  const topLeftX = pivotX - dx;
  const topLeftY = pivotY - dy;

  // Posisi Balok
  const blockX = topLeftX + position * Math.cos(rad);
  const blockY = topLeftY + position * Math.sin(rad);

  // Skala panah vektor (agar terlihat jelas di layar)
  const vScale = 2.0;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl">
          <Settings2 size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Lab Bidang Miring</h1>
          <p className="text-gray-500 dark:text-gray-400">Amati pengaruh gaya berat, gaya normal, dan gaya gesek pada balok yang meluncur.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: CANVAS SIMULASI (Takes up 2 columns on large screens) */}
        <Card className="lg:col-span-2 overflow-hidden border-gray-200 dark:border-slate-800 dark:bg-slate-900 shadow-lg">
          <div className="bg-slate-50 dark:bg-slate-950 w-full h-[450px] relative overflow-hidden flex items-center justify-center">
            
            <svg width="100%" height="100%" viewBox="0 0 800 450" className="absolute top-0 left-0">
              <defs>
                {/* Arrowhead marker */}
                <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>

              {/* Teks Instruksi Bantuan di Background */}
              {position === 0 && !isPlaying && (
                <text x="400" y="50" textAnchor="middle" className="fill-gray-300 dark:fill-gray-700 font-bold text-2xl">
                  TEKAN PLAY UNTUK MELUNCUR
                </text>
              )}

              {/* Segitiga Bidang Miring */}
              <polygon 
                points={`${topLeftX},${topLeftY} ${pivotX},${pivotY} ${topLeftX},${pivotY}`}
                className={`stroke-2 transition-colors duration-500 ${
                  muType === 'es' ? 'fill-cyan-100 dark:fill-cyan-900/30 stroke-cyan-300 dark:stroke-cyan-700' :
                  muType === 'kayu' ? 'fill-amber-200 dark:fill-amber-900/40 stroke-amber-400 dark:stroke-amber-700' :
                  'fill-zinc-400 dark:fill-zinc-800 stroke-zinc-600 dark:stroke-zinc-600'
                }`}
              />
              {/* Garis Lantai */}
              <line x1="50" y1={pivotY} x2="750" y2={pivotY} className="stroke-gray-300 dark:stroke-gray-700 stroke-[4px]" strokeLinecap="round" />

              {/* Teks Dimensi Fisika */}
              {/* Tinggi (h) */}
              <line x1={topLeftX - 15} y1={topLeftY} x2={topLeftX - 15} y2={pivotY} className="stroke-gray-400 dark:stroke-gray-600 stroke-2" strokeDasharray="4" />
              <text x={topLeftX - 25} y={pivotY - dy/2 + 5} className="fill-gray-600 dark:fill-gray-400 font-semibold text-sm" textAnchor="end">
                h = {(dy / PIXELS_PER_METER).toFixed(1)} m
              </text>

              {/* Jarak Mendatar (x) */}
              <line x1={topLeftX} y1={pivotY + 15} x2={pivotX} y2={pivotY + 15} className="stroke-gray-400 dark:stroke-gray-600 stroke-2" strokeDasharray="4" />
              <text x={topLeftX + dx/2} y={pivotY + 35} className="fill-gray-600 dark:fill-gray-400 font-semibold text-sm" textAnchor="middle">
                x = {(dx / PIXELS_PER_METER).toFixed(1)} m
              </text>

              {/* Panjang Lintas (s) */}
              <g transform={`translate(${topLeftX + dx/2}, ${pivotY - dy/2}) rotate(${theta})`}>
                <text x="0" y="30" className="fill-indigo-600 dark:fill-indigo-400 font-bold text-sm" textAnchor="middle">
                  s = {(L / PIXELS_PER_METER).toFixed(1)} m
                </text>
              </g>

              {/* Group Balok dan Vektor (Rotasi Otomatis sesuai Bidang) */}
              <g transform={`translate(${blockX}, ${blockY}) rotate(${theta})`}>
                
                {/* Vektor Gaya Normal (Ke atas / tegak lurus bidang) */}
                <line x1="0" y1="-20" x2="0" y2={-20 - N * vScale} className="stroke-blue-500 stroke-[3px]" markerEnd="url(#arrow)" />
                <text x="-5" y={-30 - N * vScale} className="fill-blue-600 dark:fill-blue-400 font-bold text-sm" textAnchor="end">N</text>

                {/* Vektor Gaya Gesek (Ke belakang / berlawanan arah luncur) */}
                {fk > 0 && (
                  <>
                    <line x1="-20" y1="-10" x2={-20 - fk * vScale} y2="-10" className="stroke-red-500 stroke-[3px]" markerEnd="url(#arrow)" />
                    <text x={-25 - fk * vScale} y="-15" className="fill-red-600 dark:fill-red-400 font-bold text-sm" textAnchor="end">fk</text>
                  </>
                )}

                {/* Kotak Balok */}
                <rect x="-20" y="-40" width="40" height="40" rx="4" className="fill-gray-800 dark:fill-gray-200 stroke-gray-600 dark:stroke-gray-400 stroke-2" />
                <text x="0" y="-15" textAnchor="middle" className="fill-white dark:fill-slate-900 font-bold text-sm">{m}kg</text>

                {/* Vektor Gaya Gravitasi Total (Lurus ke bawah di dunia nyata, berarti harus di-rotasi balik sebesar -theta) */}
                <g transform={`rotate(${-theta})`}>
                  <line x1="0" y1="0" x2="0" y2={W * vScale} className="stroke-green-600 dark:stroke-green-500 stroke-[3px]" markerEnd="url(#arrow)" />
                  <text x="10" y={W * vScale + 10} className="fill-green-700 dark:fill-green-400 font-bold text-sm">W</text>
                </g>

                {/* Vektor Wx (Gravitasi searah bidang miring) */}
                <line x1="20" y1="-20" x2={20 + Wx * vScale} y2="-20" className="stroke-orange-500 stroke-[3px]" strokeDasharray="4" markerEnd="url(#arrow)" />
                <text x={25 + Wx * vScale} y="-25" className="fill-orange-600 dark:fill-orange-400 font-bold text-sm">Wx</text>

              </g>
            </svg>
          </div>
          
          {/* Panel Kontrol Animasi di bawah Canvas */}
          <div className="bg-white dark:bg-slate-900 p-4 border-t dark:border-slate-800 flex justify-center gap-4">
            {!isPlaying ? (
              <Button onClick={handlePlay} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                <Play size={18} className="mr-2" /> {position >= L ? "Ulang & Mainkan" : "Mulai"}
              </Button>
            ) : (
              <Button onClick={handlePause} className="bg-amber-500 hover:bg-amber-600 text-white min-w-[120px] rounded-xl font-bold shadow-lg shadow-amber-500/30 transition-all">
                <Square size={18} className="mr-2" /> Jeda
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" className="min-w-[120px] rounded-xl font-bold dark:border-slate-700 dark:text-gray-300">
              <RotateCcw size={18} className="mr-2" /> Reset
            </Button>
            <Button onClick={() => setShowHint(true)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/80 dark:text-indigo-300 min-w-[120px] rounded-xl font-bold transition-all">
              <Info size={18} className="mr-2" /> Penjelasan Rumus
            </Button>
          </div>
        </Card>

        {/* KOLOM KANAN: KONTROL VARIABEL & HASIL */}
        <div className="space-y-6">
          <Card className="border-gray-200 dark:border-slate-800 dark:bg-slate-900 shadow-md">
            <CardHeader className="pb-4 border-b dark:border-slate-800">
              <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                Variabel Bebas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Slider Panjang Lintasan */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Panjang Papan (L)</label>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{(L / PIXELS_PER_METER).toFixed(1)} meter</span>
                </div>
                <input 
                  type="range" min="200" max="700" step="10" 
                  value={L} onChange={(e) => { setL(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider Massa */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Massa Balok (m)</label>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{m} kg</span>
                </div>
                <input 
                  type="range" min="1" max="20" step="1" 
                  value={m} onChange={(e) => { setM(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Slider Sudut */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sudut Papan (θ)</label>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{theta}°</span>
                </div>
                <input 
                  type="range" min="0" max="80" step="1" 
                  value={theta} onChange={(e) => { setTheta(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-orange-600"
                />
              </div>

              {/* Material Permukaan */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis Permukaan (Koef. Gesek)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { setMuType("es"); handleReset(); }}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border-2 transition-all ${muType === 'es' ? 'bg-cyan-50 border-cyan-400 text-cyan-700 dark:bg-cyan-900/30 dark:border-cyan-500 dark:text-cyan-300' : 'border-gray-200 text-gray-500 dark:border-slate-700 dark:text-gray-400 hover:border-cyan-200'}`}
                  >Es Licin<br/>(μ=0)</button>
                  <button 
                    onClick={() => { setMuType("kayu"); handleReset(); }}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border-2 transition-all ${muType === 'kayu' ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/30 dark:border-amber-500 dark:text-amber-300' : 'border-gray-200 text-gray-500 dark:border-slate-700 dark:text-gray-400 hover:border-amber-200'}`}
                  >Kayu Halus<br/>(μ=0.2)</button>
                  <button 
                    onClick={() => { setMuType("karet"); handleReset(); }}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border-2 transition-all ${muType === 'karet' ? 'bg-zinc-100 border-zinc-600 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-500 dark:text-zinc-200' : 'border-gray-200 text-gray-500 dark:border-slate-700 dark:text-gray-400 hover:border-zinc-300'}`}
                  >Karet Kasar<br/>(μ=0.5)</button>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-slate-800 dark:bg-slate-900 shadow-md">
            <CardHeader className="pb-3 border-b dark:border-slate-800">
              <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                Analisis Data (Live)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gaya Tarik (Wx)</div>
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{Wx.toFixed(1)} N</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gaya Gesek (fk)</div>
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">{fk.toFixed(1)} N</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Resultan (Fnet)</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{Fnet.toFixed(1)} N</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Percepatan (a)</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{a.toFixed(2)} m/s²</div>
                </div>
              </div>
              
              <div className="mt-2 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-3">
                <Info size={20} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-900 dark:text-indigo-300 leading-relaxed">
                  {Fnet <= 0 
                    ? "Gaya tarik Wx tidak sanggup mengalahkan gaya gesek. Balok tetap diam." 
                    : `Balok meluncur turun dengan percepatan ${a.toFixed(2)} m/s² selama ${timePassed.toFixed(2)} detik.`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* MODAL HINT / PENJELASAN */}
      {showHint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 dark:bg-indigo-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Info size={24} /> Penjelasan Rahasia Fisikanya!
              </h2>
              <button onClick={() => setShowHint(false)} className="text-white hover:text-indigo-200 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                Bingung dengan panah-panah yang ada di layar? Jangan khawatir, ini dia arti dari kekuatan gaib (gaya) yang mengatur balok tersebut:
              </p>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div className="font-bold text-green-700 dark:text-green-400 text-lg mb-1 flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm">W</span> Gaya Gravitasi Total
                  </div>
                  <p className="text-green-900/80 dark:text-green-300/80 text-sm">Kekuatan tarik bumi yang murni. Panah ini <strong>selalu menunjuk lurus ke bawah</strong> menuju inti bumi, tidak peduli seberapa miring papannya.</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
                  <div className="font-bold text-orange-700 dark:text-orange-400 text-lg mb-1 flex items-center gap-2">
                    <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-sm">Wx</span> Gaya Tarik Merosot
                  </div>
                  <p className="text-orange-900/80 dark:text-orange-300/80 text-sm">Ini adalah "pecahan" dari kekuatan gravitasi yang bertugas menarik balok turun sejajar dengan kemiringan papan. <br/><em>Rumus: Wx = Massa × Gravitasi × Sin(Sudut)</em>. Semakin curam papannya, Wx semakin kuat!</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <div className="font-bold text-blue-700 dark:text-blue-400 text-lg mb-1 flex items-center gap-2">
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-sm">N</span> Gaya Normal
                  </div>
                  <p className="text-blue-900/80 dark:text-blue-300/80 text-sm">Dorongan balasan dari papan kayu agar balok tidak jebol tembus ke bawah. Arahnya selalu <strong>tegak lurus dengan permukaan papan</strong>.</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30">
                  <div className="font-bold text-red-700 dark:text-red-400 text-lg mb-1 flex items-center gap-2">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-sm">fk</span> Gaya Gesek
                  </div>
                  <p className="text-red-900/80 dark:text-red-300/80 text-sm">Musuh utama pergerakan! Selalu melawan arah luncur balok. Es sangat licin (gesekan kecil), Karet sangat kasar (gesekan besar).</p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                    🎯 Fnet (Resultan) = Pemenang Akhir
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Total selisih pertarungan antara <strong>Gaya Tarik (Wx) melawan Gaya Gesek (fk)</strong>. Jika Fnet bernilai 0 atau negatif, balok tidak akan bisa bergerak!</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowHint(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold">
                  Saya Mengerti!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
