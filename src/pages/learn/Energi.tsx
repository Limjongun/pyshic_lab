import { ArrowLeft, BookOpen, Navigation, MoveRight, Clock, Target, Zap, Activity, Info, TrendingUp, Sparkles, Lightbulb, Battery, BatteryCharging } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Energi() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen size={14} /> Dasar
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Usaha & Energi Dasar</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Dalam fisika, Energi adalah kemampuan untuk melakukan <strong>usaha</strong>. Menariknya, energi tidak pernah bisa diciptakan atau dimusnahkan, ia hanya berubah bentuk dari satu wujud ke wujud lain.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-sm">1</span>
              Apa itu Usaha?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Dalam fisika, Usaha terjadi ketika kamu memberikan gaya pada suatu benda dan benda tersebut <strong>pindah tempat</strong>. Kalau kamu dorong tembok sampai keringetan tapi temboknya gak geser sedikitpun, usahamu dalam fisika adalah <strong>NOL</strong>!
            </p>
          </div>
          <div className="flex-1">
             <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30 h-full flex flex-col justify-center">
               <div className="font-mono text-center text-green-600 dark:text-green-400 font-bold mb-3 text-lg">
                 W = F × s
               </div>
               <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold text-green-500">W</span> = Usaha (Joule)</li>
                  <li><span className="font-bold text-green-500">F</span> = Gaya yang diberikan (N)</li>
                  <li><span className="font-bold text-green-500">s</span> = Jarak perpindahan (m)</li>
               </ul>
             </div>
          </div>
        </motion.section>

        {/* BAB 2 & 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <BatteryCharging className="text-blue-500" /> 2. Energi Kinetik
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Energi yang dimiliki oleh benda karena dia <strong>bergerak</strong>. Makin cepat benda melesat atau makin berat bendanya, energi kinetiknya makin raksasa. Peluru meriam itu bahaya karena energi kinetiknya tinggi!
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-blue-600 dark:text-blue-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              Ek = ½ m × v²
            </div>
            <div className="mt-auto bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-blue-500">Ek</span> = Energi gerak, <span className="font-bold text-blue-500">m</span> = Massa (berat benda), <span className="font-bold text-blue-500">v</span> = Kelajuan benda.
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <Battery className="text-rose-500" /> 3. Energi Potensial
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Energi "cadangan" atau tersembunyi karena <strong>ketinggian</strong>. Batu yang diam di ujung tebing punya energi potensial besar yang sewaktu-waktu siap meluncur jatuh.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-rose-600 dark:text-rose-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              Ep = m × g × h
            </div>
            <div className="mt-auto bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-rose-500">Ep</span> = Energi potensial, <span className="font-bold text-rose-500">g</span> = Tarikan Gravitasi, <span className="font-bold text-rose-500">h</span> = Ketinggian dari tanah.
            </div>
          </motion.section>
        </div>

        {/* BAB 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-800 dark:text-cyan-400 mb-3">
              <TrendingUp size={20} /> 4. Kekekalan Energi
            </h2>
            <p className="text-sm text-cyan-800/80 dark:text-cyan-300/80 mb-4">
              Hukum paling fundamental: Energi Kinetik dan Potensial bisa saling berubah-ubah wujud, tapi <strong>totalnya selalu sama</strong>. Saat kelapa jatuh, potensialnya makin kecil, tapi gerakan jatuhnya makin cepat (kinetik membesar).
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-cyan-600 dark:text-cyan-400 font-bold shadow-sm mb-3">
              Em = Ep + Ek = Konstan
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-fuchsia-50 dark:bg-fuchsia-900/10 p-6 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900/30 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-fuchsia-800 dark:text-fuchsia-400 mb-3">
              <Zap size={20} /> 5. Daya (Power)
            </h2>
            <p className="text-sm text-fuchsia-800/80 dark:text-fuchsia-300/80 mb-4">
              Seberapa cepat kamu bisa melakukan suatu usaha/energi. Angkat barbel pelan-pelan butuh usaha yang sama dengan angkat cepat. Tapi angkatnya cepat butuh <strong>Daya</strong> yang lebih besar!
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-fuchsia-600 dark:text-fuchsia-400 font-bold shadow-sm mb-3">
              P = W / t
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg text-xs text-fuchsia-800 dark:text-fuchsia-300">
              <span className="font-bold">P</span> = Daya (Watt), <span className="font-bold">W</span> = Usaha, <span className="font-bold">t</span> = Waktu
            </div>
          </motion.section>
        </div>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-amber-800 dark:text-amber-500 mb-6">
            <Lightbulb className="text-amber-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Rahasia Roller Coaster</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tahukah kamu kalau kereta Roller Coaster <strong>tidak punya mesin</strong>? Kereta hanya ditarik perlahan pakai rantai ke puncak pertama yang sangat tinggi untuk mengumpulkan <strong>Energi Potensial</strong>. Sisa perjalanannya yang ngebut, memutar, dan meliuk-liuk itu hanya memanfaatkan perubahan Energi Potensial menjadi Kinetik murni!
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Energi yang Tak Bisa Hilang</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Hukum I Termodinamika menyatakan energi tak pernah musnah. Bensin di motormu yang terbakar tidak hilang, dia berubah jadi energi gerak (memutar ban), energi panas (knalpot panas), dan energi bunyi (suara deru knalpot). Total energi bensin awal = total energi gerak + panas + bunyi!
              </p>
            </div>
          </div>
        </motion.section>

        {/* TANYA AI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col items-center justify-center mt-12 mb-8 bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
          <Sparkles className="text-indigo-500 mb-3 h-10 w-10" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Masih ada yang bingung tentang Energi?</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center max-w-md mb-6">
            Diskusikan materi ini lebih lanjut dengan AI Asisten Belajar kami. Tanyakan rumus usaha, potensial gravitasi, atau hukum kekekalan.
          </p>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2">
            <Sparkles size={18} /> Tanya AI Sekarang
          </button>
        </motion.div>

      </div>
    </div>
  )
}
