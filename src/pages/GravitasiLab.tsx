import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Settings2, Activity, Globe, Info, Zap } from "lucide-react"
import { useStore } from "@/store/useStore"

// --- Constants ---
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500
const CENTER_X = CANVAS_WIDTH / 2
const CENTER_Y = CANVAS_HEIGHT / 2
const STAR_RADIUS = 30
const PLANET_RADIUS = 10

// --- Sound Effects ---
const playLaunchSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    // Sci-fi sweep up sound
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5)
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.5)
  } catch (e) { console.error(e) }
}

const playResetSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    // Sci-fi sweep down sound
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3)
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.3)
  } catch (e) { console.error(e) }
}

interface Vector2 {
  x: number
  y: number
}

export default function GravitasiLab() {
  const { setLastLab, addActivity } = useStore();

  useEffect(() => {
    setLastLab({
      name: "Laboratorium Gravitasi",
      desc: "Simulasi interaksi gravitasi antar planet dan benda angkasa",
      url: "/lab/gravitasi"
    });
    addActivity({
      title: "Membuka Laboratorium Gravitasi",
      type: "lab"
    });
  }, [setLastLab, addActivity]);

  // --- States ---
  const [massStarMultiplier, setMassStarMultiplier] = useState(1.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVelocityVector, setShowVelocityVector] = useState(true)

  // Orbit parameters
  const [initialPos, setInitialPos] = useState<Vector2>({ x: CENTER_X + 200, y: CENTER_Y })
  const [initialVel, setInitialVel] = useState<Vector2>({ x: 0, y: -6 })

  // Interaction States
  const [isDraggingPos, setIsDraggingPos] = useState(false)
  const [isDraggingVel, setIsDraggingVel] = useState(false)

  // Telemetry
  const [telemetry, setTelemetry] = useState({
    distance: 200,
    velocity: 6,
    kinetic: 0,
    potential: 0,
    totalEnergy: 0
  })

  // --- Physics Engine State ---
  const simRef = useRef({
    pos: { x: CENTER_X + 200, y: CENTER_Y },
    vel: { x: 0, y: -6 },
    trail: [] as Vector2[],
    lastTime: 0,
    animationFrameId: 0,
    crashed: false
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Base GM constant
  const BASE_GM = 10000
  const getCurrentGM = () => BASE_GM * massStarMultiplier

  // --- Reset Simulation ---
  const resetSimulation = () => {
    setIsPlaying(false)
    cancelAnimationFrame(simRef.current.animationFrameId)
    
    // Play reset sound only if it was triggered manually
    // (We will call it from the UI button instead)
    
    simRef.current = {
      pos: { ...initialPos },
      vel: { ...initialVel },
      trail: [],
      lastTime: performance.now(),
      animationFrameId: 0,
      crashed: false
    }
    
    updateTelemetry(initialPos, initialVel)
    drawFrame(initialPos, initialVel, [])
  }

  // --- Update Telemetry ---
  const updateTelemetry = (pos: Vector2, vel: Vector2) => {
    const dx = pos.x - CENTER_X
    const dy = pos.y - CENTER_Y
    const r = Math.sqrt(dx * dx + dy * dy)
    const v = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
    
    const GM = getCurrentGM()
    // Assume planet mass m = 1 for energy calculation
    const kinetic = 0.5 * v * v
    const potential = -GM / r
    const totalEnergy = kinetic + potential

    setTelemetry({
      distance: r,
      velocity: v,
      kinetic,
      potential,
      totalEnergy
    })
  }

  // --- Drawing Logic ---
  const drawFrame = (pos: Vector2, vel: Vector2, trail: Vector2[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw Space Background
    ctx.fillStyle = "#020617" // slate-950
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw Grid (Subtle)
    ctx.strokeStyle = "#1e293b" // slate-800
    ctx.lineWidth = 1
    ctx.beginPath()
    for(let x=0; x<=CANVAS_WIDTH; x+=50) { ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT) }
    for(let y=0; y<=CANVAS_HEIGHT; y+=50) { ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y) }
    ctx.stroke()

    // Draw Trail
    if (trail.length > 0) {
      ctx.beginPath()
      ctx.moveTo(trail[0].x, trail[0].y)
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y)
      }
      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)" // purple-500 transparent
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw Star
    ctx.beginPath()
    const gmScale = 1 + (massStarMultiplier - 1) * 0.2
    ctx.arc(CENTER_X, CENTER_Y, STAR_RADIUS * gmScale, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, STAR_RADIUS * gmScale)
    gradient.addColorStop(0, "#fef08a") // yellow-200
    gradient.addColorStop(0.4, "#eab308") // yellow-500
    gradient.addColorStop(1, "#ca8a04") // yellow-600
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.shadowBlur = 40
    ctx.shadowColor = "#eab308"
    ctx.fill()
    ctx.shadowBlur = 0 // reset

    // Draw Planet
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, PLANET_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = "#60a5fa" // blue-400
    ctx.fill()

    // Draw Velocity Vector if paused or enabled
    if (!isPlaying && showVelocityVector) {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      // Scale velocity for visual representation
      const velDisplayScale = 10 
      const endX = pos.x + vel.x * velDisplayScale
      const endY = pos.y + vel.y * velDisplayScale
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = "#ef4444" // red-500
      ctx.lineWidth = 3
      ctx.stroke()

      // Arrow head
      const angle = Math.atan2(vel.y, vel.x)
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI/6), endY - 10 * Math.sin(angle - Math.PI/6))
      ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI/6), endY - 10 * Math.sin(angle + Math.PI/6))
      ctx.fillStyle = "#ef4444"
      ctx.fill()

      // Drag Handle for Velocity
      ctx.beginPath()
      ctx.arc(endX, endY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(239, 68, 68, 0.5)"
      ctx.fill()
    }
  }

  // --- Animation Loop ---
  const animate = (time: number) => {
    if (!isPlaying || simRef.current.crashed) return

    // We use a fixed physics step for deterministic orbital simulation
    // to avoid Euler integration blowing up due to variable frame rates.
    const dt = 1.0 // 1 frame = 1 time unit
    const subSteps = 10 // Substepping for higher precision integration
    const sub_dt = dt / subSteps
    const GM = getCurrentGM()

    const state = simRef.current

    for (let i = 0; i < subSteps; i++) {
      const dx = state.pos.x - CENTER_X
      const dy = state.pos.y - CENTER_Y
      const rSq = dx * dx + dy * dy
      const r = Math.sqrt(rSq)

      // Crash check
      if (r < STAR_RADIUS) {
        state.crashed = true
        break
      }

      const a = -GM / rSq
      const ax = a * (dx / r)
      const ay = a * (dy / r)

      // Semi-implicit Euler
      state.vel.x += ax * sub_dt
      state.vel.y += ay * sub_dt
      state.pos.x += state.vel.x * sub_dt
      state.pos.y += state.vel.y * sub_dt
    }

    // Save trail every few frames
    if (Math.random() < 0.2) {
      state.trail.push({ ...state.pos })
      // Keep trail length manageable
      if (state.trail.length > 500) state.trail.shift()
    }

    updateTelemetry(state.pos, state.vel)
    drawFrame(state.pos, state.vel, state.trail)

    simRef.current.animationFrameId = requestAnimationFrame(animate)
  }

  // --- Canvas Interaction (Mouse) ---
  const getMousePos = (e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    // Calculate scale because canvas might be scaled down by CSS
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPlaying) return
    const mouse = getMousePos(e)
    
    // Check if clicked on velocity handle
    const velDisplayScale = 10
    const velX = initialPos.x + initialVel.x * velDisplayScale
    const velY = initialPos.y + initialVel.y * velDisplayScale
    const distToVel = Math.hypot(mouse.x - velX, mouse.y - velY)
    
    if (distToVel < 20) {
      setIsDraggingVel(true)
      return
    }

    // Check if clicked on planet
    const distToPlanet = Math.hypot(mouse.x - initialPos.x, mouse.y - initialPos.y)
    if (distToPlanet < 20) {
      setIsDraggingPos(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPos && !isDraggingVel) return
    const mouse = getMousePos(e)
    
    if (isDraggingPos) {
      setInitialPos({ x: mouse.x, y: mouse.y })
    } else if (isDraggingVel) {
      const velDisplayScale = 10
      setInitialVel({
        x: (mouse.x - initialPos.x) / velDisplayScale,
        y: (mouse.y - initialPos.y) / velDisplayScale
      })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingPos(false)
    setIsDraggingVel(false)
  }

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      simRef.current.lastTime = performance.now()
      simRef.current.animationFrameId = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(simRef.current.animationFrameId)
    }
    return () => cancelAnimationFrame(simRef.current.animationFrameId)
  }, [isPlaying, massStarMultiplier])

  // Handle Initial Draw & Parameter changes when paused
  useEffect(() => {
    if (!isPlaying) {
      resetSimulation()
    }
  }, [massStarMultiplier, initialPos, initialVel])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Globe className="text-purple-500" />
            Gravitasi & Orbit Planet
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Eksperimen Hukum Gravitasi Universal Newton & Lintasan Orbit Kepler
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL PANEL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} />
            Panel Kendali Orbit
          </div>

          <div className="space-y-4">
            {/* Matahari */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div> 
                Bintang Induk (Matahari)
              </h3>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Massa Relatif <span>{massStarMultiplier.toFixed(1)}x M₀</span>
                </label>
                <input
                  type="range"
                  min="0.1" max="5.0" step="0.1"
                  value={massStarMultiplier}
                  onChange={(e) => setMassStarMultiplier(parseFloat(e.target.value))}
                  disabled={isPlaying}
                  className="w-full accent-yellow-500 mt-2"
                />
              </div>
            </div>

            {/* Planet Interaction Instructions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200 block mb-1">Cara Interaksi:</strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>Tarik planet (biru) untuk mengatur posisi awal.</li>
                <li>Tarik ujung panah merah untuk mengatur vektor kecepatan awal lemparan.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!isPlaying) playLaunchSound()
                  setIsPlaying(!isPlaying)
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  isPlaying 
                  ? "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30" 
                  : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30"
                }`}
              >
                {isPlaying ? <><Pause size={20}/> Jeda</> : <><Play size={20}/> Luncurkan!</>}
              </button>
              <button
                onClick={() => {
                  playResetSound()
                  resetSimulation()
                }}
                className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-all shadow-sm"
                title="Reset Posisi"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 italic text-center px-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
              💡 <strong>Hukum Gravitasi Universal:</strong> Semakin besar Massa Bintang Induk, semakin kuat gaya tarik gravitasinya dalam membengkokkan lintasan planet!
            </div>
          </div>
        </div>

        {/* SIMULATION CANVAS & TELEMETRY */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-slate-950 rounded-2xl shadow-inner border border-slate-800 flex-1 relative overflow-hidden flex items-center justify-center min-h-[500px]">
            <canvas 
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="max-w-full h-auto cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Telemetry Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-4 dark:border-slate-800 mb-4">
              <Activity size={20} className="text-purple-500" />
              Telemetri Orbital
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Jarak Radius (r)</p>
                <p className="font-mono font-bold text-lg text-slate-700 dark:text-slate-200">
                  {telemetry.distance.toFixed(0)} km
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Kecepatan (v)</p>
                <p className="font-mono font-bold text-lg text-purple-600 dark:text-purple-400">
                  {telemetry.velocity.toFixed(2)} km/s
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Energi Kinetik (Ek)</p>
                <p className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                  +{telemetry.kinetic.toFixed(0)} J
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">E. Potensial (Ep)</p>
                <p className="font-mono font-bold text-lg text-red-600 dark:text-red-400">
                  {telemetry.potential.toFixed(0)} J
                </p>
              </div>
            </div>

            <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
              <div className="flex items-start gap-3 mb-3">
                <Info className="text-purple-500 shrink-0 mt-0.5" size={20} />
                <h4 className="font-bold text-purple-900 dark:text-purple-200">Analisis Bentuk Orbit</h4>
              </div>
              <div className="space-y-3 text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
                <p>
                  Orbit ditentukan oleh <strong>Energi Total (E) = Ek + Ep</strong>. 
                  Saat ini Energi Total Planet adalah: <strong className="font-mono">{telemetry.totalEnergy.toFixed(0)} J</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Jika <strong>E &lt; 0</strong> (Negatif): Orbit tertutup (Melingkar atau Elips). Planet terikat gravitasi.</li>
                  <li>Jika <strong>E &gt; 0</strong> (Positif): Orbit terbuka (Hiperbola). Kecepatan planet melampaui <em>Escape Velocity</em> dan akan lepas ke angkasa luar!</li>
                </ul>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/80 italic mt-2">
                  *Cobalah tarik panah kecepatan menjadi sangat panjang lalu luncurkan untuk melihat planet terlempar bebas!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
