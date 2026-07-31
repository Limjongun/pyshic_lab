import React from "react"
import { motion } from "framer-motion"
import { Target, Trophy, Lock, Play, ShieldCheck, ArrowRight, Wrench } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStore } from "@/store/useStore"

const CHALLENGES = [
  {
    id: "parabola-target",
    title: "Meriam Penembak Jitu",
    description: "Hitung sudut dan kecepatan meriam untuk menjatuhkan bola tepat ke atas peti harta karun di jarak tertentu.",
    path: "/app/challenges/parabola",
    icon: <Target className="text-rose-500" size={32} />,
    color: "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900",
    textColor: "text-rose-600 dark:text-rose-400"
  },
  {
    id: "gravity-escape",
    title: "Pelarian dari Bintang",
    description: "Planetmu terperangkap di orbit! Temukan vektor kecepatan yang tepat agar energi total lebih besar dari nol untuk kabur dari tata surya.",
    path: "/app/challenges/gravity",
    icon: <Play className="text-amber-500" size={32} />,
    color: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    id: "optics-illusion",
    title: "Detektif Cahaya",
    description: "Rakit sebuah kaca pembesar. Gunakan lensa cembung untuk menciptakan bayangan Maya, Tegak, dan Diperbesar TEPAT 2.0x.",
    path: "/app/challenges/optics",
    icon: <ShieldCheck className="text-indigo-500" size={32} />,
    color: "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900",
    textColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    id: "vehicle-builder",
    title: "Vehicle Physics Builder",
    description: "Rakit kendaraan mimpimu dari balok, roda, kipas, dan roket! Taklukkan rintangan dengan memanipulasi variabel fisikanya.",
    path: "/app/challenges/vehicle",
    icon: <Wrench className="text-emerald-500" size={32} />,
    color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900",
    textColor: "text-emerald-600 dark:text-emerald-400"
  }
]

export default function Challenges() {
  const navigate = useNavigate()
  const completedChallenges = useStore((state) => state.completedChallenges)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto"
        >
          <Trophy size={40} className="text-amber-500" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Mode Tantangan (Misi Khusus)
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Uji pemahaman fisikamu dengan menyelesaikan rintangan nyata! Berhasil menyelesaikan misi akan memberimu lencana kehormatan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHALLENGES.map((challenge, idx) => {
          const isCompleted = completedChallenges.includes(challenge.id)

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-3xl border-2 transition-all hover:scale-[1.02] cursor-pointer group ${
                isCompleted 
                  ? "bg-slate-50 dark:bg-slate-800/50 border-emerald-500" 
                  : `${challenge.color}`
              }`}
              onClick={() => navigate(challenge.path)}
            >
              {/* Badge overlay if completed */}
              {isCompleted && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Trophy size={12} /> MISI SELESAI
                </div>
              )}

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${!isCompleted ? challenge.textColor : "text-emerald-500"}`}>
                    {isCompleted ? <ShieldCheck size={32} /> : challenge.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed min-h-[80px]">
                    {challenge.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                  <span className={`font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : challenge.textColor}`}>
                    {isCompleted ? "Mainkan Ulang" : "Mulai Misi"}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-900 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
