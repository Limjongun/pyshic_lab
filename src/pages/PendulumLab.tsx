import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Info, Settings2, Activity, Zap, Wind } from "lucide-react"

// --- Constants ---
const L_PX = 250 // Length of pendulum in pixels
const G_PX = 980 // Gravity in pixels/s^2 (approx 9.8 * 100)
const OMEGA = Math.sqrt(G_PX / L_PX)
const PERIOD = (2 * Math.PI) / OMEGA
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 450
const PIVOT_Y = 50
const CENTER_X = CANVAS_WIDTH / 2

// --- Sound Effects ---
const playCollisionSound = (intensity: number) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Normalize intensity between 0 and 1
    const normalizedIntensity = Math.min(Math.max(intensity / 1000, 0.1), 1.0);
    
    // Pluck/clack sound
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600 + normalizedIntensity * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(normalizedIntensity * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors
  }
}

export default function PendulumLab() {
  // --- States ---
  const [m1, setM1] = useState(1.0)
  const [m2, setM2] = useState(1.0)
  const [theta1Deg, setTheta1Deg] = useState(-45)
  const [theta2Deg, setTheta2Deg] = useState(45)
  const [restitution, setRestitution] = useState(1.0)
  const [hasAirFriction, setHasAirFriction] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Telemetry
  const [telemetry, setTelemetry] = useState({
    theta1: -45,
    theta2: 45,
    v1: 0,
    v2: 0,
    ek1: 0,
    ep1: 0,
    ek2: 0,
    ep2: 0,
  })

  // --- Physics Engine State ---
  const simRef = useRef({
    lastTime: 0,
    t_sim: 0,
    next_collision_time: PERIOD / 4,
    v1_center: 0,
    v2_center: 0,
    is_first_swing: true,
    animationFrameId: 0,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // --- Helpers ---
  const getRadius = (mass: number) => 15 + Math.sqrt(mass) * 10

  // --- Reset Simulation ---
  const resetSimulation = () => {
    setIsPlaying(false)
    cancelAnimationFrame(simRef.current.animationFrameId)
    
    const th1 = (theta1Deg * Math.PI) / 180
    const th2 = (theta2Deg * Math.PI) / 180

    simRef.current = {
      ...simRef.current,
      t_sim: 0,
      next_collision_time: PERIOD / 4,
      v1_center: -th1 * L_PX * OMEGA,
      v2_center: -th2 * L_PX * OMEGA,
      is_first_swing: true,
      lastTime: performance.now()
    }
    
    updateTelemetry(th1, th2, 0, 0)
    drawFrame(th1, th2)
  }

  // --- Update Telemetry ---
  const updateTelemetry = (th1: number, th2: number, v1: number, v2: number) => {
    // Convert velocities from px/s to m/s for display (divide by 100)
    const v1_m = v1 / 100
    const v2_m = v2 / 100
    // L in meters = 2.5
    const L_M = 2.5
    const G = 9.8

    const ek1 = 0.5 * m1 * v1_m * v1_m
    const ep1 = m1 * G * L_M * (1 - Math.cos(th1))
    const ek2 = 0.5 * m2 * v2_m * v2_m
    const ep2 = m2 * G * L_M * (1 - Math.cos(th2))

    setTelemetry({
      theta1: (th1 * 180) / Math.PI,
      theta2: (th2 * 180) / Math.PI,
      v1: v1_m,
      v2: v2_m,
      ek1,
      ep1,
      ek2,
      ep2
    })
  }

  // --- Drawing Logic ---
  const drawFrame = (th1: number, th2: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const r1 = getRadius(m1)
    const r2 = getRadius(m2)
    const pivot1_x = CENTER_X - r1
    const pivot2_x = CENTER_X + r2

    const x1 = pivot1_x + L_PX * Math.sin(th1)
    const y1 = PIVOT_Y + L_PX * Math.cos(th1)
    const x2 = pivot2_x + L_PX * Math.sin(th2)
    const y2 = PIVOT_Y + L_PX * Math.cos(th2)

    // Draw Vertical Dashed Center Lines (Reference)
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.moveTo(pivot1_x, PIVOT_Y)
    ctx.lineTo(pivot1_x, PIVOT_Y + L_PX + 40)
    ctx.moveTo(pivot2_x, PIVOT_Y)
    ctx.lineTo(pivot2_x, PIVOT_Y + L_PX + 40)
    ctx.strokeStyle = "#cbd5e1" // slate-300
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([]) // Reset

    // Draw Angle Arcs
    if (Math.abs(th1) > 0.1) {
      ctx.beginPath()
      ctx.arc(pivot1_x, PIVOT_Y, 80, Math.PI / 2 - Math.abs(th1), Math.PI / 2) // Approximate
      // Exact arc:
      ctx.arc(pivot1_x, PIVOT_Y, 80, Math.PI/2 + Math.min(th1, 0), Math.PI/2 + Math.max(th1, 0))
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()
    }
    if (Math.abs(th2) > 0.1) {
      ctx.beginPath()
      ctx.arc(pivot2_x, PIVOT_Y, 80, Math.PI/2 + Math.min(th2, 0), Math.PI/2 + Math.max(th2, 0))
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw Support Bar
    ctx.beginPath()
    ctx.moveTo(CENTER_X - 100, PIVOT_Y)
    ctx.lineTo(CENTER_X + 100, PIVOT_Y)
    ctx.lineWidth = 8
    ctx.strokeStyle = "#334155" // slate-700
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw Strings
    ctx.beginPath()
    ctx.moveTo(pivot1_x, PIVOT_Y)
    ctx.lineTo(x1, y1)
    ctx.moveTo(pivot2_x, PIVOT_Y)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#94a3b8" // slate-400
    ctx.stroke()

    // Draw Ball 1
    ctx.beginPath()
    ctx.arc(x1, y1, r1, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6" // blue-500
    ctx.fill()
    ctx.strokeStyle = "#1d4ed8" // blue-700
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw Ball 2
    ctx.beginPath()
    ctx.arc(x2, y2, r2, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444" // red-500
    ctx.fill()
    ctx.strokeStyle = "#b91c1c" // red-700
    ctx.stroke()

    // Draw Mass Labels Inside Balls (if big enough) or near them
    ctx.fillStyle = "white"
    ctx.font = "bold 12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    if (r1 > 18) ctx.fillText(`${m1}kg`, x1, y1)
    if (r2 > 18) ctx.fillText(`${m2}kg`, x2, y2)
  }

  // --- Animation Loop ---
  const animate = (time: number) => {
    if (!isPlaying) return

    const dt = Math.min((time - simRef.current.lastTime) / 1000, 0.1) // limit dt to 100ms
    simRef.current.lastTime = time

    simRef.current.t_sim += dt
    const state = simRef.current

    // Check for collision
    if (state.t_sim >= state.next_collision_time) {
      const k = hasAirFriction ? 0.15 : 0; // Damping coefficient (0.15 = noticeable air resistance)
      let v1_in, v2_in
      if (state.is_first_swing) {
        const drop_damping = Math.exp(-k * (PERIOD / 4))
        v1_in = state.v1_center * drop_damping
        v2_in = state.v2_center * drop_damping
        state.is_first_swing = false
      } else {
        const swing_damping = Math.exp(-k * (PERIOD / 2))
        v1_in = -state.v1_center * swing_damping
        v2_in = -state.v2_center * swing_damping
      }

      const e = restitution
      const v1_out = ((m1 - e * m2) * v1_in + (1 + e) * m2 * v2_in) / (m1 + m2)
      const v2_out = ((m2 - e * m1) * v2_in + (1 + e) * m1 * v1_in) / (m1 + m2)

      // Play sound based on impact velocity difference
      const impactVelocity = Math.abs(v1_in - v2_in)
      if (impactVelocity > 10) {
        playCollisionSound(impactVelocity)
      }

      state.v1_center = v1_out
      state.v2_center = v2_out
      state.next_collision_time += PERIOD / 2
    }

    let curr_th1, curr_th2, curr_v1, curr_v2
    const k = hasAirFriction ? 0.15 : 0;

    if (state.is_first_swing) {
      const current_damping = Math.exp(-k * state.t_sim);
      const th1_0 = (theta1Deg * Math.PI) / 180
      const th2_0 = (theta2Deg * Math.PI) / 180
      curr_th1 = th1_0 * current_damping * Math.cos(OMEGA * state.t_sim)
      curr_th2 = th2_0 * current_damping * Math.cos(OMEGA * state.t_sim)
      curr_v1 = -th1_0 * L_PX * OMEGA * current_damping * Math.sin(OMEGA * state.t_sim)
      curr_v2 = -th2_0 * L_PX * OMEGA * current_damping * Math.sin(OMEGA * state.t_sim)
    } else {
      const t_loc = state.t_sim - (state.next_collision_time - PERIOD / 2)
      const current_damping = Math.exp(-k * t_loc);
      curr_th1 = (state.v1_center / (L_PX * OMEGA)) * current_damping * Math.sin(OMEGA * t_loc)
      curr_th2 = (state.v2_center / (L_PX * OMEGA)) * current_damping * Math.sin(OMEGA * t_loc)
      curr_v1 = state.v1_center * current_damping * Math.cos(OMEGA * t_loc)
      curr_v2 = state.v2_center * current_damping * Math.cos(OMEGA * t_loc)
    }

    updateTelemetry(curr_th1, curr_th2, curr_v1, curr_v2)
    drawFrame(curr_th1, curr_th2)

    simRef.current.animationFrameId = requestAnimationFrame(animate)
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
  }, [isPlaying, m1, m2, restitution, hasAirFriction])

  // Handle Initial Draw & Parameter changes when paused
  useEffect(() => {
    if (!isPlaying) {
      resetSimulation()
    }
  }, [m1, m2, theta1Deg, theta2Deg, restitution, hasAirFriction])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="text-indigo-500" />
            Sistem Tumbukan / Pendulum
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Eksperimen Hukum Kekekalan Energi & Momentum dalam Tumbukan 1 Dimensi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL PANEL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-2 dark:border-slate-800">
            <Settings2 size={20} />
            Panel Kendali
          </div>

          <div className="space-y-4">
            {/* Bola Kiri */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Bola Kiri
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                    Massa (m₁) <span>{m1.toFixed(1)} kg</span>
                  </label>
                  <input
                    type="range"
                    min="0.1" max="5" step="0.1"
                    value={m1}
                    onChange={(e) => setM1(parseFloat(e.target.value))}
                    disabled={isPlaying}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                    Tarikan Sudut <span>{theta1Deg}°</span>
                  </label>
                  <input
                    type="range"
                    min="-90" max="0" step="1"
                    value={theta1Deg}
                    onChange={(e) => setTheta1Deg(parseFloat(e.target.value))}
                    disabled={isPlaying}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Bola Kanan */}
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Bola Kanan
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                    Massa (m₂) <span>{m2.toFixed(1)} kg</span>
                  </label>
                  <input
                    type="range"
                    min="0.1" max="5" step="0.1"
                    value={m2}
                    onChange={(e) => setM2(parseFloat(e.target.value))}
                    disabled={isPlaying}
                    className="w-full accent-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                    Tarikan Sudut <span>{theta2Deg}°</span>
                  </label>
                  <input
                    type="range"
                    min="0" max="90" step="1"
                    value={theta2Deg}
                    onChange={(e) => setTheta2Deg(parseFloat(e.target.value))}
                    disabled={isPlaying}
                    className="w-full accent-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Sifat Tumbukan</h3>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  Koefisien Restitusi (e) <span>{restitution.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={restitution}
                  onChange={(e) => setRestitution(parseFloat(e.target.value))}
                  disabled={isPlaying}
                  className="w-full accent-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {restitution === 1 ? "Lenting Sempurna (Energi Kekal)" : restitution === 0 ? "Tidak Lenting (Menempel)" : "Lenting Sebagian"}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Wind size={16} className="text-teal-500"/> Gesekan Udara
                  </span>
                  <button 
                    onClick={() => setHasAirFriction(!hasAirFriction)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${hasAirFriction ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${hasAirFriction ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {hasAirFriction ? "Aktif: Energi terkuras oleh resistansi udara" : "Mati: Berada di ruang hampa (Vakum)"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                isPlaying 
                ? "bg-amber-500 hover:bg-amber-600" 
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isPlaying ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Lepaskan!</>}
            </button>
            <button
              onClick={resetSimulation}
              className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* SIMULATION CANVAS & TELEMETRY */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-slate-900 rounded-2xl shadow-inner border border-slate-800 flex-1 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            <canvas 
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="max-w-full h-auto"
            />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          </div>

          {/* Telemetry Dashboard */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-4 dark:border-slate-800 mb-4">
              <Zap size={20} className="text-amber-500" />
              Telemetri Energi (Real-time)
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Telemetry Bola Kiri */}
              <div className="space-y-4">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Bola Kiri
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Kecepatan (v)</p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {Math.abs(telemetry.v1).toFixed(2)} m/s
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Sudut (θ)</p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {Math.abs(telemetry.theta1).toFixed(1)}°
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>E. Kinetik ({telemetry.ek1.toFixed(1)} J)</span>
                    <span>E. Potensial ({telemetry.ep1.toFixed(1)} J)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-75" 
                      style={{ width: `${(telemetry.ek1 / (telemetry.ek1 + telemetry.ep1 || 1)) * 100}%` }}
                    ></div>
                    <div 
                      className="h-full bg-blue-300 transition-all duration-75" 
                      style={{ width: `${(telemetry.ep1 / (telemetry.ek1 + telemetry.ep1 || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Telemetry Bola Kanan */}
              <div className="space-y-4">
                <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> Bola Kanan
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Kecepatan (v)</p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {Math.abs(telemetry.v2).toFixed(2)} m/s
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Sudut (θ)</p>
                    <p className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {Math.abs(telemetry.theta2).toFixed(1)}°
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>E. Kinetik ({telemetry.ek2.toFixed(1)} J)</span>
                    <span>E. Potensial ({telemetry.ep2.toFixed(1)} J)</span>
                  </div>
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-red-500 transition-all duration-75" 
                      style={{ width: `${(telemetry.ek2 / (telemetry.ek2 + telemetry.ep2 || 1)) * 100}%` }}
                    ></div>
                    <div 
                      className="h-full bg-red-300 transition-all duration-75" 
                      style={{ width: `${(telemetry.ep2 / (telemetry.ek2 + telemetry.ep2 || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              <div className="flex items-start gap-3 mb-3">
                <Info className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Formula & Konsep Fisika</h4>
              </div>
              <div className="space-y-3 text-sm text-indigo-800 dark:text-indigo-300">
                <p>
                  <strong>Hukum Kekekalan Momentum:</strong> Total momentum selalu tetap sebelum dan sesudah tabrakan (asumsi tanpa gesekan luar).
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-indigo-100 dark:border-indigo-800 font-mono text-center overflow-x-auto whitespace-nowrap">
                  m₁·v₁ + m₂·v₂ = m₁·v₁' + m₂·v₂'
                </div>
                <p>
                  <strong>Koefisien Restitusi (e):</strong> Mengukur tingkat kelentingan tabrakan.
                </p>
                <div className="bg-white dark:bg-slate-900 p-3 rounded border border-indigo-100 dark:border-indigo-800 font-mono text-center overflow-x-auto whitespace-nowrap">
                  e = -(v₂' - v₁') / (v₂ - v₁)
                </div>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>e = 1 :</strong> Lenting Sempurna. Energi Kinetik 100% dipertahankan (seperti Newton's Cradle ideal).</li>
                  <li><strong>e = 0 :</strong> Tidak Lenting. Bola saling menempel dan bergerak bersama (v₁' = v₂').</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
