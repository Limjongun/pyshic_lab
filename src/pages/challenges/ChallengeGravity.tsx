// We will adapt GravitasiLab.tsx but strip it down to a simple version for the challenge
// Due to context size, we'll write a focused, standalone orbit challenge component.
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, RotateCcw, Trophy, ArrowRight, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/store/useStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500
const CENTER_X = CANVAS_WIDTH / 2
const CENTER_Y = CANVAS_HEIGHT / 2

export default function ChallengeGravity() {
  const navigate = useNavigate()
  const completeChallenge = useStore(state => state.completeChallenge)

  const [isPlaying, setIsPlaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Starting condition: a circular orbit
  // G*M1 = 1000. 
  // For circular orbit at r=100: v = sqrt(GM/r) = sqrt(1000/100) = sqrt(10) = 3.16
  const initialPos = { x: CENTER_X, y: CENTER_Y - 100 }
  const [velY, setVelY] = useState(3.16) 

  const simRef = useRef({
    pos: { ...initialPos },
    vel: { x: 4.5, y: 0 }, // Let user adjust X velocity to escape
    trail: [] as {x: number, y: number}[],
    timeInEscape: 0,
    animationFrameId: 0,
    won: false
  })

  const resetSimulation = () => {
    setIsPlaying(false)
    cancelAnimationFrame(simRef.current.animationFrameId)
    simRef.current = {
      pos: { ...initialPos },
      vel: { x: velY, y: 0 },
      trail: [],
      timeInEscape: 0,
      animationFrameId: 0,
      won: false
    }
    setSuccess(false)
    draw()
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Trail
    if (simRef.current.trail.length > 0) {
      ctx.beginPath()
      ctx.moveTo(simRef.current.trail[0].x, simRef.current.trail[0].y)
      for (let i = 1; i < simRef.current.trail.length; i++) {
        ctx.lineTo(simRef.current.trail[i].x, simRef.current.trail[i].y)
      }
      ctx.strokeStyle = "rgba(167, 139, 250, 0.4)" // purple-400
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Sun
    ctx.beginPath()
    ctx.arc(CENTER_X, CENTER_Y, 30, 0, Math.PI * 2)
    ctx.fillStyle = "#fbbf24" // amber-400
    ctx.shadowBlur = 30
    ctx.shadowColor = "#f59e0b"
    ctx.fill()
    ctx.shadowBlur = 0

    // Planet
    const { pos } = simRef.current
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
    ctx.fillStyle = "#a78bfa" // purple-400
    ctx.fill()
  }

  const animate = () => {
    if (!isPlaying) return

    const dt = 0.1
    const steps = 10
    const G_M1 = 1000

    let { pos, vel, trail, timeInEscape, won } = simRef.current

    if (!won) {
      for (let i = 0; i < steps; i++) {
        const dx = pos.x - CENTER_X
        const dy = pos.y - CENTER_Y
        const distSq = dx*dx + dy*dy
        const dist = Math.sqrt(distSq)

        // Crash check
        if (dist < 40) {
          setIsPlaying(false)
          return
        }

        const F = G_M1 / distSq
        const ax = -F * (dx / dist)
        const ay = -F * (dy / dist)

        vel.x += ax * dt
        vel.y += ay * dt
        pos.x += vel.x * dt
        pos.y += vel.y * dt

        // Check escape
        const Ek = 0.5 * (vel.x*vel.x + vel.y*vel.y)
        const Ep = -G_M1 / dist
        const E_total = Ek + Ep

        if (E_total > 0) {
          timeInEscape += dt
          if (timeInEscape > 100) { // Approx 1.5 seconds of game time
            won = true
            setSuccess(true)
            completeChallenge("gravity-escape")
            break
          }
        } else {
          timeInEscape = 0
        }
      }

      trail.push({ x: pos.x, y: pos.y })
      if (trail.length > 200) trail.shift()

      simRef.current = { pos, vel, trail, timeInEscape, animationFrameId: simRef.current.animationFrameId, won }
    }

    draw()
    if (!won) {
      simRef.current.animationFrameId = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      simRef.current.animationFrameId = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(simRef.current.animationFrameId)
    }
    return () => cancelAnimationFrame(simRef.current.animationFrameId)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      simRef.current.vel = { x: velY, y: 0 }
      draw()
    }
  }, [velY])

  // Initial draw
  useEffect(() => {
    draw()
  }, [])

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3 dark:text-white">
          <Play className="text-amber-500" size={32} /> Pelarian dari Bintang
        </h1>
        <Button variant="outline" onClick={() => navigate("/app/challenges")}>Kembali ke Tantangan</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Simulation Area */}
        <Card className="lg:col-span-3 overflow-hidden shadow-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 relative">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Misi: Buat planet lepas dari gravitasi matahari!
            </CardTitle>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" onClick={resetSimulation} className="dark:border-slate-700 dark:text-slate-300">
                 <RotateCcw size={14} className="mr-1"/> Ulang
               </Button>
               <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setIsPlaying(!isPlaying)} disabled={success}>
                 <Play size={14} className="mr-1 fill-white"/> {isPlaying ? "Jeda" : "Luncurkan"}
               </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex justify-center bg-slate-950 relative">
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="max-w-full h-auto" />
          </CardContent>

          {/* Win Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                  <Trophy size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-4">MISI SELESAI!</h2>
                <p className="text-emerald-100 text-lg max-w-md mb-8">
                  Planet berhasil mencapai <strong>Escape Velocity</strong> (Energi Total &gt; 0) dan bebas dari tata surya!
                </p>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 font-bold px-8 text-lg rounded-xl" onClick={() => navigate("/app/challenges")}>
                  Klaim Lencana <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Controls */}
        <Card className="shadow-sm h-fit border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Kendali Pesawat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kecepatan Awal (X)</label>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{velY.toFixed(2)} km/s</span>
              </div>
              <input 
                type="range" min="1.0" max="6.0" step="0.1"
                value={velY} onChange={(e) => setVelY(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
                disabled={isPlaying}
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mt-8 border border-amber-100 dark:border-amber-900/50">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Target Misi</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400/80">
                Atur Kecepatan Awal sedemikian rupa agar planet bergerak menjauh dan <strong>tidak akan pernah kembali</strong>.
                Energi Kinetik harus lebih besar dari Energi Potensial!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
