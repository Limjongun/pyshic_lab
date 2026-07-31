import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Target, Trophy, ArrowRight } from "lucide-react"
import { sfx } from "@/lib/audio"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/store/useStore"

export default function ChallengeParabola() {
  const navigate = useNavigate()
  const completeChallenge = useStore(state => state.completeChallenge)

  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const projectileRef = useRef<Matter.Body | null>(null)

  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(25)
  const [success, setSuccess] = useState(false)
  const hasHitTarget = useRef(false)
  const hitMarks = useRef<{x: number, y: number}[]>([])

  // Randomize target position between 400 and 700
  const [targetX] = useState(() => Math.floor(Math.random() * 300) + 400)

  useEffect(() => {
    if (!sceneRef.current) return

    const engine = Matter.Engine.create()
    const world = engine.world
    engineRef.current = engine

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 500,
        wireframes: false,
        background: 'transparent' 
      }
    })
    renderRef.current = render

    const ground = Matter.Bodies.rectangle(400, 490, 810, 60, { isStatic: true, render: { fillStyle: '#94a3b8' } })
    const wallLeft = Matter.Bodies.rectangle(-30, 250, 60, 500, { isStatic: true, label: 'frame' })
    const wallRight = Matter.Bodies.rectangle(830, 250, 60, 500, { isStatic: true, label: 'frame' })
    const ceiling = Matter.Bodies.rectangle(400, -30, 810, 60, { isStatic: true, label: 'frame' })
    
    // The target is a treasure chest!
    const target = Matter.Bodies.rectangle(targetX, 430, 80, 20, { 
      isStatic: true, 
      isSensor: true, 
      label: 'target',
      render: { fillStyle: '#fbbf24' } // amber-400
    })
    const targetBase = Matter.Bodies.rectangle(targetX, 450, 60, 20, { isStatic: true, render: { fillStyle: '#b45309' } })

    const projectile = Matter.Bodies.circle(100, 440, 15, { 
      restitution: 0.5,
      friction: 0.1,
      density: 0.05,
      render: { fillStyle: '#f97316' }
    })
    projectileRef.current = projectile

    // Platform for cannon
    const platform = Matter.Bodies.rectangle(100, 460, 80, 10, { isStatic: true, render: { fillStyle: '#cbd5e1' } })

    Matter.World.add(world, [ground, wallLeft, wallRight, ceiling, targetBase, target, platform, projectile])

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        if (
          (bodyA.label === 'target' && bodyB === projectile) ||
          (bodyB.label === 'target' && bodyA === projectile)
        ) {
          if (!hasHitTarget.current) {
            hasHitTarget.current = true
            setSuccess(true)
            sfx.playSuccess()
            completeChallenge("parabola-target")
          }
        } else {
           if ((bodyA.label === 'frame' && bodyB === projectile) || (bodyB.label === 'frame' && bodyA === projectile)) {
             const point = pairs[i].collision.supports[0] || projectile.position;
             hitMarks.current.push({ x: point.x, y: point.y })
           }
           const vA = bodyA.velocity || {x:0, y:0};
           const vB = bodyB.velocity || {x:0, y:0};
           const relVel = Math.sqrt(Math.pow(vA.x - vB.x, 2) + Math.pow(vA.y - vB.y, 2));
           if (relVel > 1) sfx.playBounce(relVel);
        }
      }
    })

    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context
      context.font = "10px sans-serif"
      context.fillStyle = "#64748b"
      context.strokeStyle = "#64748b"
      context.textAlign = "center"
      context.textBaseline = "middle"
      
      // X axis (Top and Bottom)
      for (let x = 100; x < 800; x += 100) {
        context.fillText(`${x - 100}m`, x, 485)
        context.beginPath()
        context.moveTo(x, 460)
        context.lineTo(x, 465)
        context.stroke()
      }

      context.fillStyle = "#ef4444"
      for (const mark of hitMarks.current) {
        context.beginPath()
        context.arc(mark.x, mark.y, 4, 0, 2 * Math.PI)
        context.fill()
      }
    })

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)

    return () => {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      if (render.canvas) render.canvas.remove()
    }
  }, [targetX])

  const fire = () => {
    if (!projectileRef.current) return
    const body = projectileRef.current
    if (success) return // Don't allow firing if already won
    
    hasHitTarget.current = false
    hitMarks.current = []
    
    Matter.Body.setPosition(body, { x: 100, y: 440 })
    Matter.Body.setVelocity(body, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(body, 0)

    const rad = (angle * Math.PI) / 180
    const impulse = power * 3 
    const speed = impulse / 10 // Fixed mass 10
    const vx = Math.cos(rad) * speed
    const vy = -Math.sin(rad) * speed 

    setTimeout(() => {
      sfx.playShoot()
      Matter.Body.setVelocity(body, { x: vx, y: vy })
    }, 50)
  }

  const reset = () => {
    if (!projectileRef.current) return
    setSuccess(false)
    hasHitTarget.current = false
    hitMarks.current = []
    Matter.Body.setPosition(projectileRef.current, { x: 100, y: 440 })
    Matter.Body.setVelocity(projectileRef.current, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(projectileRef.current, 0)
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3 dark:text-white">
          <Target className="text-rose-500" size={32} /> Meriam Penembak Jitu
        </h1>
        <Button variant="outline" onClick={() => navigate("/app/challenges")}>Kembali ke Tantangan</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Simulation Area */}
        <Card className="lg:col-span-3 overflow-hidden shadow-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 relative">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-3">
              Misi: Jatuhkan peluru tepat ke atas peti emas!
            </CardTitle>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" onClick={reset} className="dark:border-slate-700 dark:text-slate-300">
                 <RotateCcw size={14} className="mr-1"/> Ulang
               </Button>
               <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white" onClick={fire} disabled={success}>
                 <Play size={14} className="mr-1 fill-white"/> Tembak
               </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex justify-center bg-slate-950 relative">
            <div ref={sceneRef} className="w-[800px] h-[500px]" />
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
                  Hebat! Kamu berhasil menghitung proyektil dengan tepat dan mendapatkan Lencana Meriam Penembak Jitu!
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
            <CardTitle className="text-lg dark:text-white">Senjata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sudut Tembak</label>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{angle}°</span>
              </div>
              <input 
                type="range" min="0" max="90" 
                value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tenaga Mesiu</label>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{power}</span>
              </div>
              <input 
                type="range" min="10" max="50" 
                value={power} onChange={(e) => setPower(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl mt-8 border border-rose-100 dark:border-rose-900/50">
              <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-2">Target Misi</h4>
              <p className="text-sm text-rose-700 dark:text-rose-400/80">
                Peti emas berada di posisi <strong className="text-rose-600 dark:text-rose-400">X = {targetX - 100}m</strong>.
                Sesuaikan Sudut dan Tenaga agar proyektil jatuh tepat di atasnya.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
