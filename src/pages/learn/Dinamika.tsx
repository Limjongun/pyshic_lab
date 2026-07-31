import { ArrowLeft, BookOpen, Navigation, MoveRight, Clock, Target, Zap, Activity, Info, TrendingUp, Sparkles, Lightbulb, Scale, Hand } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Dinamika() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen size={14} /> Dasar
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dinamika Dasar</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Dinamika adalah ilmu yang mempelajari gerak dengan memperhatikan <strong>gaya penyebabnya</strong>. Berbeda dengan kinematika yang cuma melihat geraknya, di sini kita mencari tahu "Kenapa benda ini bisa bergerak?".
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-sm">1</span>
              Apa itu Gaya?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Gaya adalah sebuah <strong>tarikan</strong> atau <strong>dorongan</strong>. Saat kamu menendang bola (dorongan) atau menarik pintu (tarikan), kamu memberikan gaya ke benda tersebut. Gaya bisa membuat benda diam jadi bergerak, atau benda bergerak jadi berhenti.
            </p>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg font-mono text-center text-orange-600 dark:text-orange-400 font-bold border border-slate-100 dark:border-slate-700">
              Simbol: F (Force) | Satuan: Newton (N)
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 text-sm">2</span>
              Massa vs Berat
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              <strong>Massa (m)</strong> itu jumlah materi di dalam dirimu (gak akan berubah meski di bulan). Sedangkan <strong>Berat (W)</strong> adalah tarikan gravitasi terhadap massamu. Di bulan, kamu akan terasa lebih ringan karena gravitasinya kecil!
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg font-mono text-center text-yellow-700 dark:text-yellow-500 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              W = m × g
            </div>
            <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-2 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-yellow-600">W</span> = Berat (N), <span className="font-bold text-yellow-600">m</span> = Massa (kg), <span className="font-bold text-yellow-600">g</span> = Gravitasi
            </div>
          </motion.section>
        </div>

        {/* HUKUM NEWTON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-blue-500">3.</span> Hukum I Newton
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              <strong>Hukum Kemalasan (Inersia).</strong> Benda diam pengennya diam terus, benda gerak pengennya gerak terus, kecuali ada yang maksa (gaya luar).
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-blue-600 dark:text-blue-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              ΣF = 0
            </div>
            <div className="mt-auto bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              Maksudnya: Kalau gak ada gaya dorong/tarik total, benda gak akan berubah lajunya.
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-rose-500">4.</span> Hukum II Newton
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Makin keras kamu dorong meja, makin ngebut jalannya. Tapi kalau mejanya super berat (massa besar), dorongnya jadi susah.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-rose-600 dark:text-rose-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              F = m × a
            </div>
            <div className="mt-auto bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <ul className="space-y-1">
                <li><span className="font-bold text-rose-500">F</span> = Gaya dorong (N)</li>
                <li><span className="font-bold text-rose-500">m</span> = Massa benda (kg)</li>
                <li><span className="font-bold text-rose-500">a</span> = Tarikan/Percepatan</li>
              </ul>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-purple-500">5.</span> Hukum III Newton
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              <strong>Aksi = Reaksi.</strong> Kalau kamu mukul tembok (Aksi), tanganmu bakal sakit karena tembok mukul balik tanganmu sama kerasnya (Reaksi).
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-purple-600 dark:text-purple-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              F₁ = -F₂
            </div>
            <div className="mt-auto bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              Tanda minus (-) artinya gaya reaksinya selalu berlawanan arah dengan gaya aksi.
            </div>
          </motion.section>
        </div>

        {/* BAB 6 & Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-800 dark:text-cyan-400 mb-3">
              <Hand size={20} /> 6. Gaya Gesek (Friction)
            </h2>
            <p className="text-sm text-cyan-800/80 dark:text-cyan-300/80 mb-4">
              Gaya yang selalu melawan arah gerak. Ini alasan kenapa mobil bisa ngerem dan kenapa mendorong lemari di lantai kasar terasa super berat.
            </p>
            <ul className="list-disc list-inside text-sm text-cyan-700 dark:text-cyan-300 space-y-1 mb-4 flex-1">
              <li><strong>Gesek Statis:</strong> Gaya gesek saat benda diam.</li>
              <li><strong>Gesek Kinetis:</strong> Gaya gesek saat benda meluncur.</li>
            </ul>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-3">
              <Target className="text-orange-500" /> Ringkasan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Dinamika menjelaskan <strong>Gaya</strong> (F). Tanpa gaya, benda diam tak akan pernah bergerak, dan benda meluncur tak akan pernah berhenti (Hukum I). Jika didorong, benda akan makin cepat tergantung berat tubuhnya (Hukum II). Dan alam selalu membalas dorongan kita secara seimbang (Hukum III).
            </p>
          </motion.section>
        </div>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-amber-800 dark:text-amber-500 mb-6">
            <Lightbulb className="text-amber-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Rahasia Roket Luar Angkasa</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Di luar angkasa tidak ada udara. Lalu bagaimana roket bisa maju kalau tidak ada udara untuk didorong? Roket menggunakan <strong>Hukum III Newton</strong>! Roket menyemburkan gas api dengan sangat kuat ke belakang (Aksi), dan sebagai balasannya, badan roket terdorong ke depan (Reaksi).
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Mitos Apel Newton</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Kisah bahwa Isaac Newton tiba-tiba paham gravitasi karena kepalanya kejatuhan buah apel sebenarnya hanyalah mitos berlebihan. Benar dia melihat apel jatuh, tapi ia menghabiskan <strong>puluhan tahun</strong> untuk merumuskan matematika di balik jatuhnya apel tersebut menjadi rumus yang kita kenal sekarang.
              </p>
            </div>
          </div>
        </motion.section>

        {/* TANYA AI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex flex-col items-center justify-center mt-12 mb-8 bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
          <Sparkles className="text-indigo-500 mb-3 h-10 w-10" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Masih ada yang bingung tentang Dinamika?</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center max-w-md mb-6">
            Diskusikan materi ini lebih lanjut dengan AI Asisten Belajar kami. Tanyakan soal Hukum Newton, gaya gesek, atau konsep yang belum Anda pahami.
          </p>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2">
            <Sparkles size={18} /> Tanya AI Sekarang
          </button>
        </motion.div>

      </div>
    </div>
  )
}
