import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Zap, Target, Droplets, Thermometer, Activity } from "lucide-react"
import { Link } from "react-router-dom"

export default function Learn() {
  const chapters = [
    {
      id: "kinematics",
      title: "1. Kinematika (Gerak)",
      description: "Pelajari tentang kelajuan, kecepatan, percepatan, dan pergerakan benda.",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-100 dark:border-blue-900/50",
      path: "/app/learn/kinematika",
      badge: "Dasar"
    },
    {
      id: "dynamics",
      title: "2. Dinamika (Gaya)",
      description: "Pelajari Hukum Newton tentang Gerak dan penyebab benda bergerak.",
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      border: "border-orange-100 dark:border-orange-900/50",
      path: "/app/learn/dinamika",
      badge: "Dasar"
    },
    {
      id: "energy",
      title: "3. Usaha & Energi",
      description: "Pahami energi kinetik, potensial, dan hukum kekekalan energi.",
      icon: BookOpen,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-100 dark:border-green-900/50",
      path: "/app/learn/energi",
      badge: "Dasar"
    },
    {
      id: "momentum",
      title: "4. Momentum & Tumbukan",
      description: "Hukum kekekalan momentum, impuls, dan analisis tabrakan antar benda.",
      icon: Target,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-100 dark:border-red-900/50",
      path: "/app/learn/momentum",
      badge: "Menengah"
    },
    {
      id: "fluids",
      title: "5. Mekanika Fluida",
      description: "Mempelajari fluida statis (Hukum Pascal) dan dinamis (Asas Bernoulli).",
      icon: Droplets,
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      border: "border-cyan-100 dark:border-cyan-900/50",
      path: "/app/learn/fluida",
      badge: "Menengah"
    },
    {
      id: "thermodynamics",
      title: "6. Suhu & Termodinamika",
      description: "Pemuaian, perpindahan kalor, dan hukum dasar termodinamika gas.",
      icon: Thermometer,
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-900/30",
      border: "border-rose-100 dark:border-rose-900/50",
      path: "/app/learn/termodinamika",
      badge: "Menengah"
    },
    {
      id: "electromagnetism",
      title: "7. Kelistrikan & Magnet",
      description: "Sirkuit listrik, Hukum Ohm, gaya Lorentz, dan induksi Faraday.",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-100 dark:border-yellow-900/50",
      path: "/app/learn/elektromagnetik",
      badge: "Lanjut"
    },
    {
      id: "waves",
      title: "8. Gelombang & Bunyi",
      description: "Karakteristik gelombang, interferensi, resonansi, dan efek Doppler.",
      icon: Activity,
      color: "text-indigo-500",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      border: "border-indigo-100 dark:border-indigo-900/50",
      path: "/app/learn/gelombang",
      badge: "Lanjut"
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
          <BookOpen className="text-green-500" /> Materi Belajar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Pilih bab untuk mulai membaca dan berinteraksi dengan simulasi mini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chapters.map((ch) => (
          <Link to={ch.path} key={ch.id}>
            <Card className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border dark:bg-slate-900 ${ch.border}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 ${ch.bg} ${ch.color} rounded-xl flex items-center justify-center`}>
                    <ch.icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                    {ch.badge}
                  </span>
                </div>
                <CardTitle className="dark:text-white">{ch.title}</CardTitle>
                <CardDescription className="dark:text-gray-400">{ch.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-800" variant="outline">
                  Baca Bab <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
