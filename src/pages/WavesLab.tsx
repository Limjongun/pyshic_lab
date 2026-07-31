import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Radio, Play, Pause, RotateCcw, Settings2, Activity, Lightbulb } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 450
const CENTER_Y = CANVAS_HEIGHT / 2
const START_X = 100
const END_X = 700
const L = END_X - START_X
const NUM_SEGMENTS = 150
const DX = L / NUM_SEGMENTS

export default function WavesLab() {
  // --- States ---
  const [isPlaying, setIsPlaying] = useState(false)
  const [frequency, setFrequency] = useState(1.5) // Hz
  const [waveSpeed, setWaveSpeed] = useState(20)  // "Tension" -> affects v
  const [amplitude, setAmplitude] = useState(50)  // pixels

  // Telemetry
  const [telemetry, setTelemetry] = useState({
    wavelength: 0,
    speed: 0
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Physics State arrays
  const stateRef = useRef({
    y: new Float32Array(NUM_SEGMENTS + 1),
    y_old: new Float32Array(NUM_SEGMENTS + 1),
    time: 0,
    animationFrameId: 0
  })

  const resetSimulation = () => {
    setIsPlaying(false)
    cancelAnimationFrame(stateRef.current.animationFrameId)
    stateRef.current = {
      y: new Float32Array(NUM_SEGMENTS + 1),
      y_old: new Float32Array(NUM_SEGMENTS + 1),
      time: 0,
      animationFrameId: 0
    }
    updateTelemetry()
    drawFrame(stateRef.current.y, 0)
  }

  const updateTelemetry = () => {
    // In our simulation, the physical wave speed v is actually exactly waveSpeed * scale
    // We can define logical v = waveSpeed
    // wavelength = v / f
    const v = waveSpeed * 10 // scale for display
    const lambda = v / frequency
    setTelemetry({
      wavelength: lambda,
      speed: v
    })
  }

  const drawFrame = (y: Float32Array, oscillatorY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear background
    ctx.fillStyle = "#020617" // slate-950
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw Grid
    ctx.strokeStyle = "#1e293b" // slate-800
    ctx.lineWidth = 1
    ctx.beginPath()
    for(let x=0; x<=CANVAS_WIDTH; x+=20) { ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT) }
    for(let y=0; y<=CANVAS_HEIGHT; y+=20) { ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y) }
    ctx.stroke()

    // Draw central axis
    ctx.beginPath()
    ctx.moveTo(START_X, CENTER_Y)
    ctx.lineTo(END_X, CENTER_Y)
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw Wall (Right)
    ctx.fillStyle = "#475569" // slate-600
    ctx.fillRect(END_X, CENTER_Y - 100, 40, 200)
    // Wall hook
    ctx.beginPath()
    ctx.arc(END_X, CENTER_Y, 6, 0, Math.PI * 2)
    ctx.fillStyle = "#cbd5e1"
    ctx.fill()

    // Draw Oscillator (Left)
    ctx.fillStyle = "#ef4444" // red-500
    ctx.fillRect(START_X - 40, CENTER_Y + oscillatorY - 10, 40, 20)
    ctx.fillStyle = "#fca5a5" // red-300
    ctx.beginPath()
    ctx.arc(START_X, CENTER_Y + oscillatorY, 6, 0, Math.PI * 2)
    ctx.fill()
    // Oscillator rod
    ctx.beginPath()
    ctx.moveTo(START_X - 20, CENTER_Y + oscillatorY)
    ctx.lineTo(START_X - 20, CANVAS_HEIGHT)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 8
    ctx.stroke()

    // --- Draw String ---
    ctx.beginPath()
    ctx.moveTo(START_X, CENTER_Y + y[0])
    for (let i = 1; i <= NUM_SEGMENTS; i++) {
      ctx.lineTo(START_X + i * DX, CENTER_Y + y[i])
    }
    
    ctx.strokeStyle = "#06b6d4" // cyan-500
    ctx.lineWidth = 4
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    
    // Glow effect
    ctx.shadowBlur = 15
    ctx.shadowColor = "#06b6d4"
    ctx.stroke()
    
    // Core white line
    ctx.strokeStyle = "#cffafe" // cyan-100
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw Particles on String (to show transversal motion)
    for (let i = 15; i < NUM_SEGMENTS; i += 15) {
      ctx.beginPath()
      ctx.arc(START_X + i * DX, CENTER_Y + y[i], 4, 0, Math.PI * 2)
      ctx.fillStyle = "#fef08a" // yellow-200
      ctx.fill()
    }
  }

  const animate = () => {
    if (!isPlaying) return

    const { y, y_old } = stateRef.current
    const y_new = new Float32Array(NUM_SEGMENTS + 1)
    
    // Fixed physics substeps for stability
    const subSteps = 10
    const dt = 0.05 // time step
    
    // Physical parameters
    const c = waveSpeed
    const r = (c * dt) / DX
    const r2 = r * r
    const damping = 0.001

    for (let step = 0; step < subSteps; step++) {
      stateRef.current.time += dt

      // Calculate new positions
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        y_new[i] = 2 * y[i] - y_old[i] + r2 * (y[i+1] - 2 * y[i] + y[i-1]) - damping * (y[i] - y_old[i])
      }

      // Left Boundary: Driven by oscillator
      y_new[0] = amplitude * Math.sin(2 * Math.PI * frequency * (stateRef.current.time * 0.05))
      
      // Right Boundary: Fixed end
      y_new[NUM_SEGMENTS] = 0

      // Swap arrays for next substep
      for (let i = 0; i <= NUM_SEGMENTS; i++) {
        y_old[i] = y[i]
        y[i] = y_new[i]
      }
    }

    drawFrame(y, y[0])
    stateRef.current.animationFrameId = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      stateRef.current.animationFrameId = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(stateRef.current.animationFrameId)
    }
    return () => cancelAnimationFrame(stateRef.current.animationFrameId)
  }, [isPlaying, frequency, waveSpeed, amplitude])

  useEffect(() => {
    updateTelemetry()
    if (!isPlaying) drawFrame(stateRef.current.y, stateRef.current.y[0])
  }, [frequency, waveSpeed, amplitude])

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Radio className="text-cyan-500" />
            Lab Gelombang Harmonik
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Simulasi Resonansi dan Interferensi Gelombang Stasioner pada Tali
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL PANEL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-cyan-600 dark:text-cyan-400 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} />
            Pengaturan Osilator
          </div>

          <div className="space-y-5">
            {/* Slider Frekuensi */}
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Frekuensi (f) <span>{frequency.toFixed(1)} Hz</span>
              </label>
              <input
                type="range"
                min="0.5" max="5.0" step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 mt-2"
              />
            </div>

            {/* Slider Kecepatan Rambat (Tegangan) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Kecepatan Rambat (v) <span>{telemetry.speed} m/s</span>
              </label>
              <input
                type="range"
                min="10" max="40" step="1"
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseInt(e.target.value))}
                className="w-full accent-blue-500 mt-2"
              />
            </div>

            {/* Slider Amplitudo */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Amplitudo (A) <span>{amplitude} cm</span>
              </label>
              <input
                type="range"
                min="10" max="100" step="5"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full accent-indigo-500 mt-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" 
                  : "bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20"
                }`}
              >
                {isPlaying ? <><Pause size={18}/> Hentikan Mesin</> : <><Play size={18}/> Mulai Osilator</>}
              </button>
              <button
                onClick={resetSimulation}
                className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm"
                title="Reset Tali"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Hint Box */}
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/50 dark:bg-cyan-900/10">
            <h3 className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-2 mb-2 text-sm">
              <Lightbulb size={16} /> Misi Resonansi!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Cobalah cari angka <strong>Frekuensi</strong> yang tepat agar gelombang pantul bertemu gelombang datang secara harmonis! 
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Jika tepat, akan terbentuk pola "Mata" (perut gelombang) yang diam di udara. Syaratnya: Panjang tali ($L$) harus kelipatan dari $\frac{1}{2} \lambda$.
            </p>
          </div>
        </div>

        {/* CANVAS & TELEMETRY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="relative flex-1 flex">
            <div className="bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex-1 flex items-center justify-center border-4 border-slate-800 min-h-[450px]">
              <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-4 dark:border-slate-800 mb-5">
              <Activity size={20} className="text-cyan-500" />
              Sensor Gelombang
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Panjang Gelombang (λ)</p>
                <p className="font-mono font-bold text-xl text-cyan-600 dark:text-cyan-400">
                  {telemetry.wavelength.toFixed(1)} m
                </p>
                <p className="text-[10px] text-slate-400 mt-1">λ = v / f</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Cepat Rambat (v)</p>
                <p className="font-mono font-bold text-xl text-slate-700 dark:text-slate-200">
                  {telemetry.speed.toFixed(1)} m/s
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl col-span-2 md:col-span-1">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Tegangan / Energi</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(waveSpeed / 40) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
