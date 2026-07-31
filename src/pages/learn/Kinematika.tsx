import { ArrowLeft, BookOpen, Navigation, MoveRight, Clock, Target, Zap, Activity, Info, TrendingUp, Sparkles, Lightbulb } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "@/store/useStore"

export default function Kinematika() {
  const { setAIPrompt } = useStore()
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <BookOpen size={14} /> Dasar
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kinematika Dasar</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Kinematika adalah cabang fisika yang mempelajari gerak benda tanpa memperhatikan penyebab geraknya. Dalam kehidupan sehari-hari, konsep ini sangat dekat dengan aktivitas manusia seperti berjalan, berlari, berkendara, hingga pergerakan benda di alam.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm">1</span>
              Pengertian Gerak
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Gerak adalah perubahan posisi suatu benda terhadap titik acuan dalam selang waktu tertentu. Sebuah benda dikatakan bergerak jika posisinya berubah dibandingkan dengan pengamat.
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-sm text-indigo-800 dark:text-indigo-300">
              <strong>Contoh:</strong> Mobil yang melaju di jalan, Bola yang menggelinding, Orang yang berjalan di trotoar.
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm">2</span>
              Titik Acuan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Titik acuan adalah posisi awal yang digunakan sebagai referensi untuk mengamati gerak. Tanpa titik acuan, kita tidak bisa menentukan apakah suatu benda bergerak atau diam.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-sm text-emerald-800 dark:text-emerald-300">
              <strong>Contoh:</strong> Penumpang di dalam bus terlihat diam terhadap kursi, tetapi sebenarnya bergerak terhadap jalan.
            </div>
          </motion.section>
        </div>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-sm">3</span>
            Jarak dan Perpindahan
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2"><MoveRight size={16} className="text-orange-500" /> Jarak</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total lintasan yang ditempuh benda tanpa memperhatikan arah. Jarak selalu bernilai positif.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2"><Navigation size={16} className="text-blue-500" /> Perpindahan</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Perubahan posisi dari titik awal ke titik akhir dengan memperhatikan arah. Bisa bernilai nol jika kembali ke titik awal.</p>
            </div>
          </div>
        </motion.section>

        {/* BAB 4, 5, 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-blue-500">4.</span> Kelajuan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Bayangkan kelajuan seperti angka di <strong>speedometer</strong> motor kamu. Dia cuma ngasih tahu seberapa kencang kamu jalan, tanpa peduli ke arah mana kamu pergi.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-blue-600 dark:text-blue-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              v = s / t
            </div>
            <div className="mt-auto bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Maksud rumusnya:</div>
              <ul className="space-y-1">
                <li><span className="font-bold text-blue-500">v</span> = Kelajuan (seberapa cepat)</li>
                <li><span className="font-bold text-blue-500">s</span> = Jarak tempuh (seberapa jauh)</li>
                <li><span className="font-bold text-blue-500">t</span> = Waktu tempuh (berapa lama)</li>
              </ul>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-purple-500">5.</span> Kecepatan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Mirip kelajuan, tapi <strong>arah itu penting!</strong> Jika kamu bilang "Aku lari 5 km/jam ke Utara", itu kecepatan. Kalau cuma "Aku lari 5 km/jam", itu kelajuan.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-purple-600 dark:text-purple-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              v = ∆x / t
            </div>
            <div className="mt-auto bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-purple-700 dark:text-purple-400 mb-1">Maksud rumusnya:</div>
              <ul className="space-y-1">
                <li><span className="font-bold text-purple-500">v</span> = Kecepatan (punya arah)</li>
                <li><span className="font-bold text-purple-500">∆x</span> = Perpindahan (beda posisi awal & akhir)</li>
                <li><span className="font-bold text-purple-500">t</span> = Waktu tempuh</li>
              </ul>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-2">
              <span className="text-rose-500">6.</span> Percepatan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Pernah <strong>ngegas motor</strong> tiba-tiba dari diam sampai ngebut? Perubahan laju itulah percepatan. Kalau kamu ngerem, namanya jadi perlambatan.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-center text-rose-600 dark:text-rose-400 font-bold border border-slate-100 dark:border-slate-700 mb-3">
              a = (v₂ - v₁) / t
            </div>
            <div className="mt-auto bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400">
              <div className="font-semibold text-rose-700 dark:text-rose-400 mb-1">Maksud rumusnya:</div>
              <ul className="space-y-1">
                <li><span className="font-bold text-rose-500">a</span> = Percepatan (tarikan gas)</li>
                <li><span className="font-bold text-rose-500">v₂</span> = Kecepatan akhir (setelah ngegas)</li>
                <li><span className="font-bold text-rose-500">v₁</span> = Kecepatan awal (sebelum ngegas)</li>
              </ul>
            </div>
          </motion.section>
        </div>

        {/* BAB 7 & 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-cyan-50 dark:bg-cyan-900/10 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-800 dark:text-cyan-400 mb-3">
              <TrendingUp size={20} /> 7. Gerak Lurus Beraturan (GLB)
            </h2>
            <p className="text-sm text-cyan-800/80 dark:text-cyan-300/80 mb-4">
              Bayangkan kereta api peluru yang melaju super mulus dengan kecepatan yang persis sama terus-menerus tanpa pernah digas atau direm. Itulah GLB.
            </p>
            <ul className="list-disc list-inside text-sm text-cyan-700 dark:text-cyan-300 space-y-1 mb-4 flex-1">
              <li>Kecepatannya selalu <strong>tetap (konstan)</strong></li>
              <li>Tidak ada tarikan gas atau rem (<strong>a = 0</strong>)</li>
            </ul>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-cyan-600 dark:text-cyan-400 font-bold shadow-sm mb-3">
              s = v × t
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-cyan-800 dark:text-cyan-300">
              <strong>Rumus gampang:</strong> Jarak (<span className="font-bold">s</span>) itu cuma Kecepatan konstan (<span className="font-bold">v</span>) dikali total Waktu jalan (<span className="font-bold">t</span>).
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-fuchsia-50 dark:bg-fuchsia-900/10 p-6 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900/30 flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2 text-fuchsia-800 dark:text-fuchsia-400 mb-3">
              <Activity size={20} /> 8. Gerak Lurus Berubah Beraturan (GLBB)
            </h2>
            <p className="text-sm text-fuchsia-800/80 dark:text-fuchsia-300/80 mb-4">
              Bayangkan batu yang kamu jatuhkan dari tebing. Semakin ke bawah, jatuhnya akan makin ngebut karena terus ditarik oleh gaya gravitasi secara konstan.
            </p>
            <ul className="list-disc list-inside text-sm text-fuchsia-700 dark:text-fuchsia-300 space-y-1 mb-4 flex-1">
              <li>Kecepatannya berubah secara teratur</li>
              <li>Memiliki <strong>percepatan</strong> (tarikan) yang tetap</li>
            </ul>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl font-mono text-center text-fuchsia-600 dark:text-fuchsia-400 font-bold shadow-sm mb-3">
              s = v₀t + ½at²
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg text-xs text-fuchsia-800 dark:text-fuchsia-300 space-y-1">
              <div><strong>Cara ngitung Jarak (s):</strong></div>
              <div><span className="font-bold">v₀</span> = Kecepatan awal (pas mulai)</div>
              <div><span className="font-bold">a</span> = Tarikan percepatan (contoh: gravitasi)</div>
              <div><span className="font-bold">t</span> = Waktu</div>
            </div>
          </motion.section>
        </div>

        {/* BAB 9 & 10 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-3">
                <Target className="text-green-500" /> 9. Penerapan Kehidupan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Konsep kinematika sangat krusial dan digunakan luas dalam berbagai bidang kehidupan modern:</p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Navigasi GPS</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Transportasi</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Olahraga</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Rekayasa Mesin</li>
              </ul>
            </div>
            
            <div className="w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            
            <div className="flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-3">
                <Info className="text-blue-500" /> 10. Ringkasan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kinematika membantu kita memahami <strong>bagaimana benda bergerak</strong> tanpa membahas gaya yang menyebabkannya. 
                <br/><br/>
                Lima konsep utama pilar kinematika:
                <span className="font-semibold text-slate-700 dark:text-slate-300"> Jarak, Perpindahan, Kelajuan, Kecepatan, dan Percepatan.</span>
              </p>
            </div>
          </div>
        </motion.section>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-amber-800 dark:text-amber-500 mb-6">
            <Lightbulb className="text-amber-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Eksperimen Galileo Galilei</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Legenda mengatakan Galileo menjatuhkan dua bola berbeda massa dari Menara Miring Pisa. Ia membuktikan bahwa percepatan gravitasi bumi menarik semua benda dengan kecepatan yang sama (mengabaikan gesekan udara), membantah teori Aristoteles yang telah dipercaya selama 2000 tahun!
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Satelit GPS & Relativitas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Kinematika saja tidak cukup untuk sistem GPS di HP Anda. Karena satelit GPS bergerak sangat cepat di luar angkasa, waktu berjalan sedikit lebih lambat di sana dibandingkan di Bumi (Relativitas Khusus Einstein). Jika perhitungan ini tidak dikoreksi, lokasi peta GPS Anda akan meleset hingga 10 kilometer setiap hari!
              </p>
            </div>
          </div>
        </motion.section>

        {/* TANYA AI */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex flex-col items-center justify-center mt-12 mb-8 bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800/30">
          <Sparkles className="text-indigo-500 mb-3 h-10 w-10" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Masih ada yang bingung tentang Kinematika?</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center max-w-md mb-6">
            Diskusikan materi ini lebih lanjut dengan AI Asisten Belajar kami. Tanyakan rumus, penyelesaian soal, atau konsep yang belum Anda pahami.
          </p>
          <button 
            onClick={() => setAIPrompt("Tolong jelaskan lebih ringkas tentang konsep Kinematika Dasar (Jarak, Perpindahan, Kecepatan, dan Percepatan) dengan bahasa yang sangat sederhana!")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Sparkles size={18} /> Tanya AI Sekarang
          </button>
        </motion.div>

      </div>
    </div>
  )
}
