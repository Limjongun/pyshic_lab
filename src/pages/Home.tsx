import { BookOpen, HelpCircle, FlaskConical, Play, CheckCircle2, Trophy, ArrowRight, Settings, Zap, Waves, Cpu, Globe, Target, Sparkles, Rocket, BrainCircuit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-8 sm:p-12 shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-blue-400/20 group">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
           <Globe size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="absolute bottom-0 left-10 opacity-10 pointer-events-none">
           <Sparkles size={200} className="translate-y-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
             <Rocket size={16} /> Versi 2.0 Kini Tersedia!
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">Eksplorasi Dunia Fisika Tanpa Batas!</h2>
          <p className="text-blue-50 text-lg mb-8 leading-relaxed">
            Selamat datang di <span className="font-bold">PhysicLAB</span>. Ucapkan selamat tinggal pada buku teks yang membosankan! Di sini, Anda bisa melempar proyektil, merakit mesin, hingga memanipulasi gravitasi dalam laboratorium virtual interaktif.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-black px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all" asChild>
              <Link to="/lab">Mulai Eksperimen</Link>
            </Button>
            <Button size="lg" className="bg-transparent text-white border border-white/30 hover:bg-white/10 font-bold px-8 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all" asChild>
              <Link to="/learn">Pelajari Teori</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Top 3 Core Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1 transition-all duration-300 border-green-100 dark:border-green-900/50 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-900 dark:to-green-900/20 rounded-2xl overflow-hidden group">
          <div className="h-2 w-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
          <CardHeader>
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <CardTitle className="text-xl text-green-800 dark:text-green-300">Pusat Belajar</CardTitle>
            <CardDescription className="dark:text-gray-400 text-sm">Pelajari konsep dan rumus fisika melalui materi interaktif, animasi, dan penjelasan yang mudah dipahami.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md" asChild>
              <Link to="/learn">Mulai Belajar <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:-translate-y-1 transition-all duration-300 border-orange-100 dark:border-orange-900/50 bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-900 dark:to-orange-900/20 rounded-2xl overflow-hidden group">
          <div className="h-2 w-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
          <CardHeader>
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FlaskConical size={28} />
            </div>
            <CardTitle className="text-xl text-orange-800 dark:text-orange-300">Laboratorium Virtual</CardTitle>
            <CardDescription className="dark:text-gray-400 text-sm">Lakukan eksperimen sebebas mungkin di sandbox fisika. Ubah gravitasi, massa, gesekan, dan lihat efeknya secara real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md" asChild>
              <Link to="/lab">Buka Lab Fisika <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-900/20 rounded-2xl overflow-hidden group">
          <div className="h-2 w-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <CardHeader>
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BrainCircuit size={28} />
            </div>
            <CardTitle className="text-xl text-blue-800 dark:text-blue-300">Kuis & Evaluasi</CardTitle>
            <CardDescription className="dark:text-gray-400 text-sm">Uji seberapa jauh pemahamanmu dengan kuis interaktif yang seru dan dapatkan respons dari Asisten AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md" asChild>
              <Link to="/quiz">Mulai Ujian <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Physics Topics */}
        <Card className="lg:col-span-2 shadow-sm border-gray-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 dark:text-white font-bold">
              <Settings size={20} className="text-blue-500" />
              Materi Pembelajaran Tersedia
            </CardTitle>
            <Link to="/learn" className="text-xs text-blue-500 font-bold hover:underline bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">Lihat Semua Topik</Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Settings, title: "Mekanika", desc: "Gerak, Gaya, Hukum Newton", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30" },
                { icon: Zap, title: "Energi", desc: "Usaha, Energi, Daya", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/30" },
                { icon: Waves, title: "Gelombang", desc: "Suara, Cahaya, Gerak", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/30" },
                { icon: Cpu, title: "Kelistrikan", desc: "Muatan, Medan Listrik", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
                { icon: Globe, title: "Gravitasi", desc: "Gravitasi, Orbit Planet", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
                { icon: Target, title: "Momentum", desc: "Tumbukan & Impuls", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30" },
              ].map((t) => (
                <Link to="/learn" key={t.title} className="block">
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer text-center flex flex-col items-center group h-full">
                    <div className={`w-12 h-12 ${t.bg} ${t.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <t.icon size={22} />
                    </div>
                    <h4 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-200">{t.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{t.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <Card className="shadow-sm border-gray-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 dark:text-white font-bold">
              <Sparkles size={20} className="text-amber-500" />
              Fitur Unggulan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Asisten AI Cerdas</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tanya apa saja seputar fisika kepada AI kami secara real-time di pojok layar.</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0">
                <Play size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Engine Fisika 2D</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulasi yang sangat akurat menggunakan Matter.js untuk interaksi antar benda.</p>
              </div>
            </div>


            
            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 mt-2 font-bold" asChild>
              <Link to="/challenges">Mulai Tantangan Sekarang!</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
