import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { SunDim, RotateCcw, Glasses, Activity, Lightbulb, MoveHorizontal } from "lucide-react"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 450
const CENTER_X = CANVAS_WIDTH / 2
const CENTER_Y = CANVAS_HEIGHT / 2

// --- SFX Generators ---
const playLensSwitchSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    // Glassy ping
    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.3)
  } catch(e) {}
}

const playLaserSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create two oscillators for a cool sci-fi pew-pew sound
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    osc1.type = "sawtooth"
    osc2.type = "square"
    
    // Pitch drop
    osc1.frequency.setValueAtTime(1200, audioCtx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4)
    osc2.frequency.setValueAtTime(600, audioCtx.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.4)
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4)
    
    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    osc1.start()
    osc2.start()
    osc1.stop(audioCtx.currentTime + 0.4)
    osc2.stop(audioCtx.currentTime + 0.4)
  } catch(e) {}
}

const playResetSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  } catch(e) {}
}

export default function OpticsLab() {
  // --- States ---
  const [lensType, setLensType] = useState<"cembung" | "cekung">("cembung")
  const [focalLength, setFocalLength] = useState(100)
  const [objectX, setObjectX] = useState(100) // Position relative to left, so distance is CENTER_X - objectX
  const [objectHeight, setObjectHeight] = useState(80)

  // Telemetry
  const [telemetry, setTelemetry] = useState({
    s: 300, // distance from center
    s_prime: 0,
    m: 0,
    type: "",
    orientation: "",
    size: ""
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isAnimatingRay, setIsAnimatingRay] = useState(false)
  const rayProgressRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fireLaser = () => {
    if (isAnimatingRay) return
    setIsAnimatingRay(true)
    playLaserSound()
    rayProgressRef.current = 0
    
    let startTime = performance.now()
    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / 800, 1) // 800ms duration
      rayProgressRef.current = progress
      
      updatePhysicsAndDraw()
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimatingRay(false)
        rayProgressRef.current = 0
        updatePhysicsAndDraw()
      }
    }
    requestAnimationFrame(animate)
  }

  // --- Physics Engine & Drawer ---
  const updatePhysicsAndDraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 1. Calculations
    const s = CENTER_X - objectX
    const f_calc = lensType === "cembung" ? focalLength : -focalLength
    
    let s_prime = Infinity
    let M = 0
    let h_prime = 0
    
    if (Math.abs(s - f_calc) > 0.1) {
      s_prime = (s * f_calc) / (s - f_calc)
      M = - (s_prime / s)
      h_prime = M * objectHeight
    }

    // Determine Properties
    let type = s_prime > 0 ? "Nyata (Bisa ditangkap layar)" : "Maya (Hanya terlihat di dalam lensa)"
    let orientation = M > 0 ? "Tegak" : "Terbalik"
    let size = Math.abs(M) > 1 ? "Diperbesar" : Math.abs(M) < 1 ? "Diperkecil" : "Sama Besar"
    
    // Exception for infinity
    if (s_prime === Infinity) {
      type = "Tidak Terhingga (Sejajar)"
      orientation = "-"
      size = "-"
    }

    setTelemetry({
      s,
      s_prime: s_prime === Infinity ? 0 : s_prime,
      m: s_prime === Infinity ? 0 : M,
      type,
      orientation,
      size
    })

    // 2. Clear & Draw Background
    ctx.fillStyle = "#0f172a" // slate-900 (Dark room for optics)
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Grid (cm/10px spacing)
    ctx.strokeStyle = "#1e293b" // slate-800
    ctx.lineWidth = 1
    ctx.beginPath()
    for(let x=0; x<=CANVAS_WIDTH; x+=20) { ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT) }
    for(let y=0; y<=CANVAS_HEIGHT; y+=20) { ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y) }
    ctx.stroke()

    // Principal Axis (Sumbu Utama)
    ctx.beginPath()
    ctx.moveTo(0, CENTER_Y)
    ctx.lineTo(CANVAS_WIDTH, CENTER_Y)
    ctx.strokeStyle = "#475569" // slate-600
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    // Focus Points (Titik F)
    ctx.fillStyle = "#f43f5e" // rose-500
    ctx.beginPath()
    ctx.arc(CENTER_X - focalLength, CENTER_Y, 4, 0, Math.PI * 2)
    ctx.arc(CENTER_X + focalLength, CENTER_Y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#cbd5e1"
    ctx.font = "14px monospace"
    ctx.fillText("F", CENTER_X - focalLength - 5, CENTER_Y + 20)
    ctx.fillText("F", CENTER_X + focalLength - 5, CENTER_Y + 20)

    // Center 2F
    ctx.fillStyle = "#fbbf24" // amber-400
    ctx.beginPath()
    ctx.arc(CENTER_X - focalLength * 2, CENTER_Y, 4, 0, Math.PI * 2)
    ctx.arc(CENTER_X + focalLength * 2, CENTER_Y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText("2F", CENTER_X - focalLength * 2 - 8, CENTER_Y + 20)
    ctx.fillText("2F", CENTER_X + focalLength * 2 - 8, CENTER_Y + 20)

    // --- Draw Object ---
    const drawCandle = (x: number, base_y: number, height: number, isReal: boolean) => {
      ctx.globalAlpha = isReal ? 1.0 : 0.4
      const head_y = base_y - height
      
      // Body
      ctx.fillStyle = isReal ? "#60a5fa" : "#94a3b8" // blue-400 or slate-400
      ctx.fillRect(x - 6, Math.min(base_y, head_y), 12, Math.abs(height))
      
      // Flame (if upright, at top. if inverted, at bottom)
      const tip_y = head_y
      ctx.beginPath()
      ctx.moveTo(x, tip_y + (height > 0 ? -15 : 15))
      ctx.quadraticCurveTo(x + 10, tip_y, x, tip_y)
      ctx.quadraticCurveTo(x - 10, tip_y, x, tip_y + (height > 0 ? -15 : 15))
      ctx.fillStyle = "#fcd34d" // amber-300
      ctx.fill()

      // Glow
      if (isReal) {
        ctx.shadowBlur = 20
        ctx.shadowColor = "#fcd34d"
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1.0
    }

    // Object
    drawCandle(objectX, CENTER_Y, objectHeight, true)

    // Image
    if (s_prime !== Infinity) {
      const imgX = CENTER_X + s_prime
      drawCandle(imgX, CENTER_Y, h_prime, s_prime > 0)
    }

    // --- Draw Ray Tracing ---
    const objHead = { x: objectX, y: CENTER_Y - objectHeight }
    const imgHead = s_prime !== Infinity ? { x: CENTER_X + s_prime, y: CENTER_Y - h_prime } : null

    const drawRay = (startX: number, startY: number, endX: number, endY: number, color: string, dashed: boolean = false) => {
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      if (dashed) ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Ray 1: Parallel to Principal Axis -> Passes through F
    const lensIntersectY = objHead.y
    drawRay(objHead.x, objHead.y, CENTER_X, lensIntersectY, "#ef4444") // Red ray to lens
    
    let slope1 = 0
    if (imgHead) {
      // Draw refracted ray
      // Calculate a point far away on the line from lens intersection to image head
      const dx1 = imgHead.x - CENTER_X
      const dy1 = imgHead.y - lensIntersectY
      slope1 = dy1 / dx1
      
      // Draw Real Refracted Ray (to the right of lens)
      drawRay(CENTER_X, lensIntersectY, CANVAS_WIDTH, lensIntersectY + slope1 * (CANVAS_WIDTH - CENTER_X), "#ef4444")
      
      // Draw Virtual Extension (if image is virtual, behind lens)
      if (s_prime < 0) {
        drawRay(imgHead.x, imgHead.y, CENTER_X, lensIntersectY, "#ef4444", true) // Dashed red
      }
    } else {
      // Parallel rays to infinity
      const f_point_x = lensType === "cembung" ? CENTER_X + focalLength : CENTER_X - focalLength
      slope1 = (CENTER_Y - lensIntersectY) / (f_point_x - CENTER_X)
      drawRay(CENTER_X, lensIntersectY, CANVAS_WIDTH, lensIntersectY + slope1 * (CANVAS_WIDTH - CENTER_X), "#ef4444")
      if (lensType === "cekung") {
        drawRay(f_point_x, CENTER_Y, CENTER_X, lensIntersectY, "#ef4444", true)
      }
    }

    // Ray 2: Through Optical Center (0,0) -> Straight through
    drawRay(objHead.x, objHead.y, CENTER_X, CENTER_Y, "#22c55e") // Green ray to center
    let slope2 = 0
    if (imgHead) {
      const dx2 = imgHead.x - CENTER_X
      const dy2 = imgHead.y - CENTER_Y
      slope2 = dy2 / dx2
      
      drawRay(CENTER_X, CENTER_Y, CANVAS_WIDTH, CENTER_Y + slope2 * (CANVAS_WIDTH - CENTER_X), "#22c55e")
      
      if (s_prime < 0) {
        drawRay(imgHead.x, imgHead.y, CENTER_X, CENTER_Y, "#22c55e", true) // Dashed green
      }
    } else {
      slope2 = (CENTER_Y - objHead.y) / (CENTER_X - objHead.x)
      drawRay(CENTER_X, CENTER_Y, CANVAS_WIDTH, CENTER_Y + slope2 * (CANVAS_WIDTH - CENTER_X), "#22c55e")
    }

    // --- Draw Laser Particles ---
    if (rayProgressRef.current > 0) {
      const progress = rayProgressRef.current
      const t1 = Math.min(progress * 2, 1) // 0 to 0.5 -> 0 to 1
      const t2 = Math.max((progress - 0.5) * 2, 0) // 0.5 to 1.0 -> 0 to 1

      const drawGlowingParticle = (x: number, y: number, color: string) => {
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 15
        ctx.shadowColor = color
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fill()
      }

      // Red Ray Particle
      let rx, ry
      if (t2 === 0) {
        // Traveling to lens
        rx = objHead.x + (CENTER_X - objHead.x) * t1
        ry = objHead.y
      } else {
        // Traveling from lens to right
        const endX = CANVAS_WIDTH
        const endY = lensIntersectY + slope1 * (CANVAS_WIDTH - CENTER_X)
        rx = CENTER_X + (endX - CENTER_X) * t2
        ry = lensIntersectY + (endY - lensIntersectY) * t2
      }
      drawGlowingParticle(rx, ry, "#ef4444")

      // Green Ray Particle
      let gx, gy
      if (t2 === 0) {
        // Traveling to lens center
        gx = objHead.x + (CENTER_X - objHead.x) * t1
        gy = objHead.y + (CENTER_Y - objHead.y) * t1
      } else {
        // Traveling from lens center to right
        const endX = CANVAS_WIDTH
        const endY = CENTER_Y + slope2 * (CANVAS_WIDTH - CENTER_X)
        gx = CENTER_X + (endX - CENTER_X) * t2
        gy = CENTER_Y + (endY - CENTER_Y) * t2
      }
      drawGlowingParticle(gx, gy, "#22c55e")
    }

    // --- Draw Lens Shape Last (On top of rays) ---
    ctx.fillStyle = "rgba(125, 211, 252, 0.3)" // sky-300 transparent glass
    ctx.strokeStyle = "#38bdf8" // sky-400
    ctx.lineWidth = 2
    ctx.beginPath()
    
    if (lensType === "cembung") {
      // Convex shape ()
      ctx.moveTo(CENTER_X, CENTER_Y - 150)
      ctx.quadraticCurveTo(CENTER_X + 30, CENTER_Y, CENTER_X, CENTER_Y + 150)
      ctx.quadraticCurveTo(CENTER_X - 30, CENTER_Y, CENTER_X, CENTER_Y - 150)
    } else {
      // Concave shape ][
      ctx.moveTo(CENTER_X - 20, CENTER_Y - 150)
      ctx.lineTo(CENTER_X + 20, CENTER_Y - 150)
      ctx.quadraticCurveTo(CENTER_X, CENTER_Y, CENTER_X + 20, CENTER_Y + 150)
      ctx.lineTo(CENTER_X - 20, CENTER_Y + 150)
      ctx.quadraticCurveTo(CENTER_X, CENTER_Y, CENTER_X - 20, CENTER_Y - 150)
    }
    
    ctx.fill()
    ctx.stroke()
  }

  // --- Canvas Interaction ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
    
    // If click near object
    if (Math.abs(mouseX - objectX) < 30) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    let mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
    
    // Prevent crossing the lens
    if (mouseX > CENTER_X - 20) mouseX = CENTER_X - 20
    if (mouseX < 20) mouseX = 20
    
    setObjectX(mouseX)
  }

  const handleMouseUp = () => setIsDragging(false)

  // Rerender on state change
  useEffect(() => {
    updatePhysicsAndDraw()
  }, [objectX, objectHeight, focalLength, lensType])

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <SunDim className="text-pink-500" />
            Lab Optika Geometri
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Eksperimen Interaktif Pembiasan Cahaya & Pembentukan Bayangan pada Lensa Tipis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CONTROL PANEL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-pink-600 dark:text-pink-400 border-b pb-2 dark:border-slate-800">
            <Glasses size={20} />
            Konfigurasi Optik
          </div>

          <div className="space-y-5">
            {/* Tipe Lensa */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipe Lensa</label>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => {
                    if (lensType !== "cembung") playLensSwitchSound()
                    setLensType("cembung")
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    lensType === "cembung" ? "bg-white dark:bg-slate-700 shadow-sm text-pink-600" : "text-slate-500"
                  }`}
                >
                  Lensa Cembung (+)
                </button>
                <button
                  onClick={() => {
                    if (lensType !== "cekung") playLensSwitchSound()
                    setLensType("cekung")
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    lensType === "cekung" ? "bg-white dark:bg-slate-700 shadow-sm text-pink-600" : "text-slate-500"
                  }`}
                >
                  Lensa Cekung (-)
                </button>
              </div>
            </div>

            {/* Slider Jarak Fokus */}
            <div className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/30">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Jarak Fokus (f) <span>{focalLength} cm</span>
              </label>
              <input
                type="range"
                min="50" max="250" step="10"
                value={focalLength}
                onChange={(e) => setFocalLength(parseInt(e.target.value))}
                className="w-full accent-pink-500 mt-2"
              />
            </div>

            {/* Slider Tinggi Benda */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                Tinggi Benda (h) <span>{objectHeight} cm</span>
              </label>
              <input
                type="range"
                min="20" max="150" step="5"
                value={objectHeight}
                onChange={(e) => setObjectHeight(parseInt(e.target.value))}
                className="w-full accent-blue-500 mt-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={fireLaser}
                disabled={isAnimatingRay}
                className="flex-1 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SunDim size={18} /> Tembakkan Sinar
              </button>
              <button
                onClick={() => {
                  playResetSound()
                  setObjectX(100)
                  setObjectHeight(80)
                  setFocalLength(100)
                }}
                className="py-3 px-4 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm"
                title="Reset Posisi"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Hint / Teori Dasar Box */}
          <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-900/10">
            <h3 className="font-bold text-pink-700 dark:text-pink-400 flex items-center gap-2 mb-2 text-sm">
              <Lightbulb size={16} /> Hint: Persamaan Lensa Tipis
            </h3>
            <div className="font-mono text-center py-2 bg-white dark:bg-slate-900 rounded-lg text-pink-600 dark:text-pink-400 font-bold border border-pink-100 dark:border-pink-900 text-sm mb-3">
              1/f = 1/s + 1/s'
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              - <strong>f positif</strong> untuk lensa cembung, <strong>f negatif</strong> untuk lensa cekung.<br/>
              - <strong>s' positif</strong> berarti bayangan <strong>Nyata</strong> (di belakang lensa).<br/>
              - <strong>s' negatif</strong> berarti bayangan <strong>Maya</strong> (di depan lensa).
            </p>
          </div>
        </div>

        {/* CANVAS & TELEMETRY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="relative flex-1 flex">
            <div className="bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex-1 flex items-center justify-center border-4 border-slate-800 relative cursor-col-resize min-h-[450px]">
              <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full object-contain"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                // Touch events for mobile
                onTouchStart={(e) => handleMouseDown(e as unknown as React.MouseEvent)}
                onTouchMove={(e) => handleMouseMove(e as unknown as React.MouseEvent)}
                onTouchEnd={handleMouseUp}
              />
            </div>
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
              <MoveHorizontal size={14} className="text-pink-400" /> Geser benda (lilin) ke kanan/kiri
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b pb-4 dark:border-slate-800 mb-5">
              <Activity size={20} className="text-pink-500" />
              Hasil Pengamatan Optik
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Jarak Benda (s)</p>
                <p className="font-mono font-bold text-lg text-slate-700 dark:text-slate-200">
                  {telemetry.s.toFixed(1)} cm
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-pink-100 dark:border-pink-900/30">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Jarak Bayangan (s')</p>
                <p className="font-mono font-bold text-lg text-pink-600 dark:text-pink-400">
                  {telemetry.s_prime.toFixed(1)} cm
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Perbesaran (M)</p>
                <p className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                  {Math.abs(telemetry.m).toFixed(2)}x
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl col-span-2 md:col-span-1 border-l-4 border-l-pink-500">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Sifat Bayangan</p>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight mt-1">
                  {telemetry.type.split(" ")[0]}, {telemetry.orientation}, {telemetry.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
