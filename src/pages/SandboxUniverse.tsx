import React, { useState, useEffect, useRef } from "react"
import Matter from "matter-js"
import { Play, RotateCcw, Box, Circle, Hexagon, Wind, Trash2, Zap, ThermometerSnowflake, Settings2, Hand, Anchor, Pause, Bomb, Flame, MagnetIcon, Minus, Triangle, CircleDashed, Square, ArrowUpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SandboxUniverse() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  // Kontrol state
  const [gravityY, setGravityY] = useState(1)
  const [gravityX, setGravityX] = useState(0)
  const [timeScale, setTimeScale] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [explosionPower, setExplosionPower] = useState(5)

  // Inisialisasi Matter.js
  useEffect(() => {
    if (!sceneRef.current) return

    // 1. Setup Engine & World
    const engine = Matter.Engine.create({
      gravity: { x: gravityX, y: gravityY, scale: 0.001 }
    })
    const world = engine.world
    engineRef.current = engine

    // 2. Setup Renderer
    const width = sceneRef.current.clientWidth
    const height = 600

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#f8fafc', // slate-50
      }
    })
    renderRef.current = render

    // 3. Batas Lingkungan (Tembok & Lantai)
    const wallOptions = { 
      isStatic: true, 
      render: { fillStyle: '#cbd5e1' }, // slate-300
      friction: 0.5,
      restitution: 0.2
    }

    Matter.World.add(world, [
      // Lantai bawah
      Matter.Bodies.rectangle(width / 2, height + 25, width + 100, 50, wallOptions),
      // Atap
      Matter.Bodies.rectangle(width / 2, -25, width + 100, 50, wallOptions),
      // Tembok kiri
      Matter.Bodies.rectangle(-25, height / 2, 50, height + 100, wallOptions),
      // Tembok kanan
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height + 100, wallOptions),
    ])

    // 4. Interaksi Mouse (Bisa drag and drop benda)
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    })
    Matter.World.add(world, mouseConstraint)
    
    // Sinkronkan mouse dengan render
    render.mouse = mouse;

    // 4.5. Fisika Khusus (Magnet, Balon)
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const bodies = engine.world.bodies;
      
      const magnets = bodies.filter(b => b.label === 'magnet');
      const metals = bodies.filter(b => b.label === 'metal' || b.label === 'heavy');
      const balloons = bodies.filter(b => b.label === 'balloon');

      // Balon terbang ke atas (melawan gravitasi)
      balloons.forEach(b => {
        // Gaya angkat sebanding dengan massa balon
        Matter.Body.applyForce(b, b.position, { x: 0, y: -0.002 * b.mass });
      });

      // Magnet menarik metal
      magnets.forEach(m => {
        metals.forEach(metal => {
          const dx = m.position.x - metal.position.x;
          const dy = m.position.y - metal.position.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 300000 && distSq > 100) { // Jangkauan magnet
            // Gaya magnet melemah seiring kuadrat jarak
            const forceMag = 1.5 * (1 / distSq); 
            Matter.Body.applyForce(metal, metal.position, {
              x: forceMag * dx,
              y: forceMag * dy
            });
            Matter.Body.applyForce(m, m.position, {
              x: -forceMag * dx,
              y: -forceMag * dy
            });
          }
        });
      });
    });

    // 5. Jalankan Engine & Render
    Matter.Render.run(render)
    
    // Kita jalankan runner secara manual atau menggunakan Runner
    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    return () => {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])

  // Efek untuk mengupdate parameter fisika secara real-time
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravityY;
      engineRef.current.gravity.x = gravityX;
      engineRef.current.timing.timeScale = isPlaying ? timeScale : 0;
    }
  }, [gravityY, gravityX, timeScale, isPlaying])

  // ================= Fungsi Memunculkan Objek =================
  const spawnObject = (type: string) => {
    if (!engineRef.current || !sceneRef.current) return
    const width = sceneRef.current.clientWidth
    const spawnX = width / 2 + (Math.random() * 100 - 50) // Posisi acak di tengah atas
    const spawnY = 50

    let newBody;

    switch (type) {
      case 'box':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 60, 60, {
          render: { fillStyle: '#fbbf24', strokeStyle: '#b45309', lineWidth: 2 },
          mass: 5, friction: 0.5, restitution: 0.1
        })
        break;
      case 'ball':
        newBody = Matter.Bodies.circle(spawnX, spawnY, 30, {
          render: { fillStyle: '#60a5fa', strokeStyle: '#1e3a8a', lineWidth: 2 },
          mass: 3, friction: 0.1, restitution: 0.6
        })
        break;
      case 'heavy':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 80, 80, {
          render: { fillStyle: '#475569', strokeStyle: '#0f172a', lineWidth: 3 },
          mass: 50, friction: 0.8, restitution: 0.05, label: 'heavy'
        })
        break;
      case 'bouncy':
        newBody = Matter.Bodies.circle(spawnX, spawnY, 25, {
          render: { fillStyle: '#10b981', strokeStyle: '#064e3b', lineWidth: 2 },
          mass: 2, friction: 0.2, restitution: 1.1
        })
        break;
      case 'ice':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 100, 40, {
          render: { fillStyle: '#a5f3fc', strokeStyle: '#0891b2', lineWidth: 1 },
          mass: 10, friction: 0.001, frictionAir: 0.001, restitution: 0.1
        })
        break;
      case 'tnt':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 50, 50, {
          render: { fillStyle: '#ef4444', strokeStyle: '#7f1d1d', lineWidth: 2 },
          mass: 4, friction: 0.8, restitution: 0.2, label: 'tnt'
        })
        break;
      // ---- BARU ----
      case 'magnet':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 70, 40, {
          render: { fillStyle: '#dc2626', strokeStyle: '#ffffff', lineWidth: 3 },
          mass: 15, friction: 0.5, restitution: 0.1, label: 'magnet'
        })
        break;
      case 'metal':
        newBody = Matter.Bodies.circle(spawnX, spawnY, 20, {
          render: { fillStyle: '#cbd5e1', strokeStyle: '#475569', lineWidth: 2 },
          mass: 20, friction: 0.3, restitution: 0.2, label: 'metal'
        })
        break;
      case 'plank':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 250, 20, {
          render: { fillStyle: '#b45309', strokeStyle: '#78350f', lineWidth: 1 },
          mass: 10, friction: 0.7, restitution: 0.1
        })
        break;
      case 'glass':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 60, 60, {
          render: { fillStyle: 'rgba(255, 255, 255, 0.4)', strokeStyle: '#94a3b8', lineWidth: 1 },
          mass: 2, friction: 0.1, restitution: 0.05
        })
        break;
      case 'balloon':
        newBody = Matter.Bodies.circle(spawnX, spawnY, 35, {
          render: { fillStyle: '#f472b6', strokeStyle: '#be185d', lineWidth: 1 },
          mass: 0.5, frictionAir: 0.05, restitution: 0.8, label: 'balloon'
        })
        break;
      case 'triangle':
        newBody = Matter.Bodies.polygon(spawnX, spawnY, 3, 40, {
          render: { fillStyle: '#a855f7', strokeStyle: '#581c87', lineWidth: 2 },
          mass: 4, friction: 0.4, restitution: 0.2
        })
        break;
      case 'hexagon':
        newBody = Matter.Bodies.polygon(spawnX, spawnY, 6, 35, {
          render: { fillStyle: '#f97316', strokeStyle: '#9a3412', lineWidth: 2 },
          mass: 6, friction: 0.5, restitution: 0.3
        })
        break;
      case 'domino':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 15, 80, {
          render: { fillStyle: '#1e293b', strokeStyle: '#ffffff', lineWidth: 1 },
          mass: 3, friction: 0.6, restitution: 0.1
        })
        break;
      case 'wheel':
        newBody = Matter.Bodies.circle(spawnX, spawnY, 40, {
          render: { fillStyle: '#334155', strokeStyle: '#000000', lineWidth: 4 },
          mass: 8, friction: 0.9, restitution: 0.2
        })
        break;
      case 'sponge':
        newBody = Matter.Bodies.rectangle(spawnX, spawnY, 70, 70, {
          render: { fillStyle: '#fde047', strokeStyle: '#ca8a04', lineWidth: 1 },
          mass: 1, friction: 0.8, restitution: 0.01 // Tidak memantul
        })
        break;
    }

    if (newBody) {
      Matter.World.add(engineRef.current.world, newBody)
    }
  }

  // Membersihkan semua objek kecuali dinding
  const clearObjects = () => {
    if (!engineRef.current) return
    const world = engineRef.current.world
    // Filter out bodies that are NOT static (static = walls/floor)
    const bodiesToRemove = world.bodies.filter(body => !body.isStatic)
    Matter.World.remove(world, bodiesToRemove)
  }

  // ================= Fungsi Ledakan TNT =================
  const explodeTNT = () => {
    if (!engineRef.current) return
    const world = engineRef.current.world
    
    // Cari semua TNT
    const tnts = world.bodies.filter(b => b.label === 'tnt')
    if (tnts.length === 0) return;

    // Cari benda lain untuk dilempar
    const allOtherBodies = world.bodies.filter(b => !b.isStatic && b.label !== 'tnt')

    tnts.forEach(tnt => {
      const tntPos = tnt.position
      allOtherBodies.forEach(body => {
        const dx = body.position.x - tntPos.x
        const dy = body.position.y - tntPos.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        const blastRadius = 400
        if (dist < blastRadius && dist > 0) {
          // Daya ledak proporsional terbalik dengan jarak
          const forceMag = (explosionPower * 0.05) * (1 - dist / blastRadius)
          Matter.Body.applyForce(body, body.position, {
            x: (dx / dist) * forceMag,
            y: (dy / dist) * forceMag
          })
        }
      })
    })
    
    // Hapus TNT setelah meledak
    Matter.World.remove(world, tnts)
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <Settings2 className="text-indigo-500" />
          Sandbox Universe
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Mode bebas tanpa batasan. Spawn benda sesuka hatimu, ubah gaya gravitasi, atur kelajuan waktu, dan ciptakan eksperimen fisika tergila versimu sendiri!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Panel Kontrol Kiri */}
        <div className="space-y-4">
          <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-sm dark:bg-slate-900">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <Box size={20} className="text-indigo-500" /> Benda Utama
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={() => spawnObject('box')}>
                  <span className="text-xs">Kotak Kayu</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => spawnObject('ball')}>
                  <span className="text-xs">Bola Standar</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => spawnObject('heavy')}>
                  <span className="text-xs">Blok Besi</span>
                </Button>
                <Button variant="outline" className="h-auto py-2 flex flex-col gap-1 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => spawnObject('bouncy')}>
                  <span className="text-xs">Super Pantul</span>
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t dark:border-slate-800 space-y-4">
                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-red-700 dark:text-red-400">Daya Ledak TNT</label>
                    <span className="text-xs font-mono font-bold text-red-600">{explosionPower}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="20" step="1" 
                    value={explosionPower} 
                    onChange={(e) => setExplosionPower(parseInt(e.target.value))}
                    className="w-full accent-red-500 mb-3"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse hover:animate-none" onClick={explodeTNT}>
                    <Flame size={18} className="mr-2" /> LEDAKKAN TNT
                  </Button>
                </div>

                <Button variant="destructive" className="w-full" onClick={clearObjects}>
                  <Trash2 size={16} className="mr-2" /> Hapus Semua Objek
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-sm dark:bg-slate-900">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <Wind size={20} className="text-indigo-500" /> Lingkungan Fisika
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium dark:text-gray-300">Gravitasi (Bawah/Atas)</label>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{gravityY.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="-2" max="2" step="0.1" 
                    value={gravityY} 
                    onChange={(e) => setGravityY(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Atas (-2)</span>
                    <span>Nol</span>
                    <span>Bawah (2)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium dark:text-gray-300">Gravitasi (Kiri/Kanan)</label>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{gravityX.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="-2" max="2" step="0.1" 
                    value={gravityX} 
                    onChange={(e) => setGravityX(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium dark:text-gray-300">Kecepatan Waktu</label>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{timeScale.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" max="3" step="0.1" 
                    value={timeScale} 
                    onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t dark:border-slate-800 flex gap-2">
                <Button 
                  className={`flex-1 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <><Pause size={16} className="mr-2" /> Pause Waktu</> : <><Play size={16} className="mr-2" /> Lanjutkan Waktu</>}
                </Button>
                <Button variant="outline" size="icon" onClick={() => { setGravityY(1); setGravityX(0); setTimeScale(1); }} title="Reset Pengaturan Lingkungan">
                  <RotateCcw size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layar Simulasi Kanan */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-2 border-indigo-200 dark:border-indigo-900/50 shadow-lg dark:bg-slate-900 bg-[#f8fafc]">
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-sm">
              <span className="font-mono flex items-center gap-2">
                <Hand size={14} className="text-indigo-400" />
                TIP: Anda bisa menarik, melempar, dan memutar objek menggunakan kursor mouse!
              </span>
              <span className="font-mono text-xs opacity-50">MATTER.JS ENGINE ACTIVE</span>
            </div>
            {/* Kontainer Matter.js */}
            <div ref={sceneRef} className="w-full h-[600px] cursor-crosshair"></div>
          </Card>

          {/* PALET OBJEK (DIPINDAH KE BAWAH CANVAS) */}
          <Card className="mt-6 border-indigo-100 dark:border-indigo-900/50 shadow-sm dark:bg-slate-900 overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 border-b dark:border-slate-700">
              <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                <Box size={20} className="text-indigo-500" /> Gudang Benda Ekstrem
              </h3>
            </div>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => spawnObject('magnet')}>
                  <MagnetIcon size={24} className="text-red-500" />
                  <span className="text-xs font-bold">Magnet Merah</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => spawnObject('metal')}>
                  <Circle size={24} className="text-slate-400" />
                  <span className="text-xs">Bola Baja (Tarik Magnet)</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20" onClick={() => spawnObject('balloon')}>
                  <ArrowUpCircle size={24} className="text-pink-400" />
                  <span className="text-xs">Balon Udara (Anti Grav)</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={() => spawnObject('plank')}>
                  <Minus size={24} className="text-amber-700" />
                  <span className="text-xs">Papan Panjang</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/20" onClick={() => spawnObject('glass')}>
                  <Square size={24} className="text-cyan-200" />
                  <span className="text-xs">Balok Kaca</span>
                </Button>

                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20" onClick={() => spawnObject('triangle')}>
                  <Triangle size={24} className="text-purple-500" />
                  <span className="text-xs">Segitiga Ungu</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={() => spawnObject('hexagon')}>
                  <Hexagon size={24} className="text-orange-500" />
                  <span className="text-xs">Hexagon Oranye</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => spawnObject('domino')}>
                  <Minus size={24} className="text-slate-800 rotate-90" />
                  <span className="text-xs">Balok Domino</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => spawnObject('wheel')}>
                  <CircleDashed size={24} className="text-slate-600" />
                  <span className="text-xs">Roda Karet</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" onClick={() => spawnObject('sponge')}>
                  <Box size={24} className="text-yellow-400" />
                  <span className="text-xs">Spons (Anti Pantul)</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20" onClick={() => spawnObject('ice')}>
                  <ThermometerSnowflake size={24} className="text-cyan-400" />
                  <span className="text-xs">Es Licin (Gesekan 0)</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 border-red-200 hover:border-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/30 md:col-span-2 lg:col-span-4" onClick={() => spawnObject('tnt')}>
                  <Bomb size={24} className="text-red-500" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Blok Peledak TNT</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
