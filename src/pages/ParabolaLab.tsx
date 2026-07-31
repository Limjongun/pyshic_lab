import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Target, BookOpen, X } from "lucide-react"
import { sfx } from "@/lib/audio"
import { useStore } from "@/store/useStore"

export default function ParabolaLab() {
  const { setLastLab, addActivity } = useStore();
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const projectileRef = useRef<Matter.Body | null>(null)

  useEffect(() => {
    setLastLab({
      name: "Laboratorium Parabola",
      desc: "Eksperimen gerak proyektil dan tembak target",
      url: "/lab/parabola"
    });
    addActivity({
      title: "Membuka Laboratorium Parabola",
      type: "lab"
    });
  }, [setLastLab, addActivity]);

  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(25)
  const [mass, setMass] = useState(10)
  const [success, setSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hasHitTarget = useRef(false)
  const hitMarks = useRef<{x: number, y: number}[]>([])

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
    
    const target = Matter.Bodies.rectangle(650, 430, 80, 20, { 
      isStatic: true, 
      isSensor: true, 
      label: 'target',
      render: { fillStyle: '#22c55e' } 
    })

    const targetBase = Matter.Bodies.rectangle(650, 450, 60, 20, { isStatic: true, render: { fillStyle: '#334155' } })

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
          }
        } else {
           if ((bodyA.label === 'frame' && bodyB === projectile) || (bodyB.label === 'frame' && bodyA === projectile)) {
             const point = pairs[i].collision.supports[0] || projectile.position;
             hitMarks.current.push({ x: point.x, y: point.y })
           }
           const vA = bodyA.velocity || {x:0, y:0};
           const vB = bodyB.velocity || {x:0, y:0};
           const relVel = Math.sqrt(Math.pow(vA.x - vB.x, 2) + Math.pow(vA.y - vB.y, 2));
           sfx.playBounce(relVel);
        }
      }
    })

    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context
      const isDark = document.documentElement.classList.contains('dark')
      
      context.font = "10px sans-serif"
      context.fillStyle = isDark ? "#94a3b8" : "#64748b"
      context.strokeStyle = isDark ? "#94a3b8" : "#64748b"
      context.textAlign = "center"
      context.textBaseline = "middle"
      
      // X axis (Top and Bottom)
      for (let x = 100; x < 800; x += 100) {
        context.fillText(`${x - 100}m`, x, 485)
        context.beginPath()
        context.moveTo(x, 460)
        context.lineTo(x, 465)
        context.stroke()
        
        context.fillText(`${x - 100}m`, x, 15)
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, 5)
        context.stroke()
      }

      // Y axis (Left and Right)
      for (let y = 60; y <= 360; y += 100) {
        const height = 460 - y
        
        context.fillText(`${height}m`, 20, y)
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(5, y)
        context.stroke()
        
        context.fillText(`${height}m`, 780, y)
        context.beginPath()
        context.moveTo(800, y)
        context.lineTo(795, y)
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
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])

  const fire = () => {
    if (!projectileRef.current) return
    const body = projectileRef.current
    setSuccess(false)
    hasHitTarget.current = false
    hitMarks.current = []
    
    Matter.Body.setPosition(body, { x: 100, y: 440 })
    Matter.Body.setVelocity(body, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(body, 0)
    Matter.Body.setMass(body, mass)

    const rad = (angle * Math.PI) / 180
    const impulse = power * 3 
    const speed = impulse / mass
    const vx = Math.cos(rad) * speed
    const vy = -Math.sin(rad) * speed 

    setTimeout(() => {
      sfx.playShoot();
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
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
          <Target className="text-orange-500" /> Lab Gerak Parabola
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Simulation Area */}
        <Card className="xl:col-span-3 overflow-hidden shadow-sm border-gray-100 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-3">
              Tampilan Simulasi
              {success && (
                <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold animate-pulse">Target Kena!</span>
              )}
            </CardTitle>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" onClick={() => setShowHint(true)} className="dark:border-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400">
                 <BookOpen size={14} className="mr-1"/> Rumus
               </Button>
               <Button size="sm" variant="outline" onClick={reset} className="dark:border-slate-700 dark:text-gray-300">
                 <RotateCcw size={14} className="mr-1"/> Ulang
               </Button>
               <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={fire}>
                 <Play size={14} className="mr-1 fill-white"/> Tembak
               </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden flex justify-center bg-slate-50 dark:bg-slate-950 relative">
            <div ref={sceneRef} className="w-[800px] h-[500px]" />
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="shadow-sm h-fit border-gray-100 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Kontrol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sudut (derajat)</label>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{angle}°</span>
              </div>
              <input 
                type="range" 
                min="0" max="90" 
                value={angle} 
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>0°</span><span>90°</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tenaga (gaya)</label>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{power}</span>
              </div>
              <input 
                type="range" 
                min="10" max="50" 
                value={power} 
                onChange={(e) => setPower(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>10</span><span>50</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Massa Bola (kg)</label>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{mass}</span>
              </div>
              <input 
                type="range" 
                min="1" max="50" 
                value={mass} 
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-green-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>1</span><span>50</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl mt-8 border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2 flex items-center gap-1"><Target size={14}/> Tantangan</h4>
              <p className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">Atur sudut peluncuran dan tenaga untuk mengenai area target hijau! Perhatikan efek gravitasi pada lintasan peluru.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showHint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border dark:border-slate-800"
            >
              <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                  <BookOpen className="text-blue-500" /> Rumus Fisika Parabola
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowHint(false)} className="rounded-full hover:bg-gray-200 dark:hover:bg-slate-800">
                  <X size={18} />
                </Button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Gerak parabola terjadi ketika sebuah benda diberikan kecepatan awal pada sudut tertentu. 
                  Ini membentuk lintasan melengkung karena gaya gravitasi selalu menarik benda ke bawah secara konstan.
                </p>
                
                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 space-y-3 font-mono text-sm dark:text-gray-200">
                  <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Kecepatan Awal (v₀)</span>
                    <span>v₀ = Impuls / m</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Kecepatan X (vₓ)</span>
                    <span>vₓ = v₀ × cos(θ)</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Kecepatan Y (v_y)</span>
                    <span>v_y = v₀ × sin(θ)</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">Jarak Maksimum (R)</span>
                    <span>R = (v₀² × sin(2θ)) / g</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
                  <div className="text-yellow-500 mt-0.5">💡</div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-yellow-800 dark:text-yellow-500">Tahukah Kamu?</h4>
                    <p className="text-xs text-yellow-700/80 dark:text-yellow-200/70 leading-relaxed">
                      Jarak horizontal terjauh dalam keadaan ideal (tanpa gesekan udara) selalu dicapai ketika benda diluncurkan pada sudut tepat <strong>45 derajat</strong>. Coba buktikan di simulasi!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
