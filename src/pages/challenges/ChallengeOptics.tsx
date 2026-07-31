import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Trophy, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/store/useStore"
import { Button } from "@/components/ui/button"

export default function ChallengeOptics() {
  const navigate = useNavigate()
  const completeChallenge = useStore(state => state.completeChallenge)

  const [focalLength, setFocalLength] = useState(100)
  const [objectX, setObjectX] = useState(250) // Distance from lens
  const [success, setSuccess] = useState(false)

  // Calcs
  const s = objectX
  const f = focalLength
  let s_prime = Infinity
  let M = 0

  if (Math.abs(s - f) > 0.1) {
    s_prime = (s * f) / (s - f)
    M = - (s_prime / s)
  }

  // Check Win Condition:
  // Virtual Image (s_prime < 0) AND M = 2.0 (tolerance 0.05)
  useEffect(() => {
    if (s_prime < 0 && Math.abs(Math.abs(M) - 2.0) < 0.05) {
      if (!success) {
        setSuccess(true)
        completeChallenge("optics-illusion")
      }
    }
  }, [s_prime, M, success])

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3 dark:text-white">
          <ShieldCheck className="text-indigo-500" size={32} /> Detektif Cahaya
        </h1>
        <Button variant="outline" onClick={() => navigate("/app/challenges")}>Kembali ke Tantangan</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Simulation Area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border-4 border-slate-800 shadow-2xl">
          
          <div className="text-center space-y-4 z-10 relative">
            <h2 className="text-2xl font-bold text-white">Layar Kaca Pembesar</h2>
            <div className="inline-flex gap-8 items-center bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Perbesaran Saat Ini</p>
                <p className={`text-5xl font-mono font-bold ${Math.abs(Math.abs(M) - 2.0) < 0.05 ? 'text-emerald-400' : 'text-white'}`}>
                  {s_prime === Infinity ? "0" : Math.abs(M).toFixed(2)}x
                </p>
              </div>
              <div className="w-px h-16 bg-slate-700"></div>
              <div className="text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Sifat Bayangan</p>
                <p className={`text-2xl font-bold ${s_prime < 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                  {s_prime === Infinity ? "-" : (s_prime < 0 ? "Maya (Kaca Pembesar)" : "Nyata (Terbalik)")}
                </p>
              </div>
            </div>
          </div>

          {/* Abstract Lens Visualization BG */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
             <div className="w-1 h-[400px] bg-sky-400 absolute"></div>
             <div className="w-[800px] h-1 bg-slate-700 absolute"></div>
          </div>

          {/* Win Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-center z-50"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                  <Trophy size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-4">MISTERI TERPECAHKAN!</h2>
                <p className="text-emerald-100 text-lg max-w-md mb-8">
                  Luar biasa! Kamu berhasil mengatur fokus lensa dan jarak benda untuk mendapatkan efek pembesaran <strong>2.0x</strong> secara sempurna!
                </p>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 font-bold px-8 text-lg rounded-xl" onClick={() => navigate("/app/challenges")}>
                  Klaim Lencana <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
          <div>
            <h3 className="text-xl font-bold dark:text-white mb-6">Peralatan Optik</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fokus Lensa (f)</label>
                  <span className="text-lg font-bold text-sky-600 dark:text-sky-400">{focalLength} cm</span>
                </div>
                <input 
                  type="range" min="50" max="200" step="5"
                  value={focalLength} onChange={(e) => setFocalLength(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jarak Benda (s)</label>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{objectX} cm</span>
                </div>
                <input 
                  type="range" min="20" max="300" step="5"
                  value={objectX} onChange={(e) => setObjectX(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Target Misi</h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-400/80">
              Buat lensa berfungsi sebagai <strong>kaca pembesar</strong> sejati!
              Syaratnya: Bayangan harus <strong className="text-indigo-500">Maya</strong> dan mencapai rasio perbesaran tepat <strong className="text-indigo-500">2.00x</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
