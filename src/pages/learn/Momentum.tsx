import { ArrowLeft, BookOpen, Target, Sparkles, Lightbulb, Activity, CheckCircle, Scale } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store/useStore"

export default function Momentum() {
  const navigate = useNavigate()
  

  const handleFinish = () => {
    alert("Selamat! Anda telah menyelesaikan materi ini!")
    navigate("/learn")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-red-500 hover:text-red-600 dark:text-red-400 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Target size={14} /> Menengah
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Momentum & Tumbukan</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Pernahkah Anda bertanya mengapa sebuah kereta api yang melaju pelan sangat sulit dihentikan, sedangkan peluru kecil yang melaju cepat bisa menembus baja? Semua ini bisa dijelaskan lewat besaran fisika yang disebut <strong>Momentum</strong>.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">1</span>
            Konsep Momentum ($p$)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Momentum dapat diartikan sebagai "tingkat kesukaran untuk menghentikan benda yang sedang bergerak". Momentum bergantung pada dua hal: <strong>Massa (m)</strong> dan <strong>Kecepatan (v)</strong>. Benda yang berat dan cepat memiliki momentum yang sangat besar dan sangat mematikan jika menabrak.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl font-mono text-center text-red-600 dark:text-red-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            p = m × v
          </div>
          <div className="mt-3 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-400 text-center">
            <span className="font-bold text-red-600">p</span> = Momentum (kg·m/s), <span className="font-bold text-red-600">m</span> = Massa (kg), <span className="font-bold text-red-600">v</span> = Kecepatan (m/s)
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-4">
            Karena kecepatan adalah besaran vektor (memiliki arah), maka <strong>momentum juga merupakan vektor</strong>. Momentum mobil yang maju ke kanan bernilai positif, dan yang mundur ke kiri bernilai negatif.
          </p>
        </motion.section>

        {/* BAB 2 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-sm">2</span>
            Impuls (Gaya Sesaat)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Impuls ($I$) adalah gaya yang bekerja pada benda dalam waktu yang sangat singkat ($\Delta t$). Contoh impuls adalah saat raket memukul kok bulu tangkis, atau saat tongkat memukul bola kasti.
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl font-mono text-center text-orange-600 dark:text-orange-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            I = F × Δt
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-4 mb-4">
            <strong>Teorema Impuls-Momentum:</strong> Impuls yang dikerjakan pada suatu benda sama dengan perubahan momentum benda tersebut. Jika Anda memukul bola yang sedang diam, bola akan melesat (momentumnya berubah dari nol menjadi ada nilainya).
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl font-mono text-center text-orange-600 dark:text-orange-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            I = Δp = p₂ - p₁
          </div>
        </motion.section>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-sm">3</span>
            Hukum Kekekalan Momentum
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Dalam peristiwa tumbukan (tabrakan) atau ledakan, jika tidak ada gaya luar yang mengganggu, maka <strong>total momentum sistem sebelum dan sesudah peristiwa adalah SAMA</strong>.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl font-mono text-center text-amber-600 dark:text-amber-400 font-bold border border-slate-100 dark:border-slate-700 text-lg">
            m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-4">
            Prinsip inilah yang membuat pistol terdorong ke belakang (rekoil) saat peluru melesat ke depan. Momentum awal sistem (pistol + peluru) adalah 0. Agar tetap 0 setelah peluru melesat ke depan (+), maka pistol harus mundur ke belakang (-).
          </p>
        </motion.section>

        {/* BAB 4 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <Scale className="text-slate-500" size={24} />
            Jenis-Jenis Tumbukan
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">1. Tumbukan Lenting Sempurna</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Momentum kekal dan Energi Kinetik kekal. Tidak ada energi yang hilang menjadi panas atau bunyi. Benda memantul kembali sepenuhnya. Koefisien restitusi ($e = 1$). Contoh ideal: tabrakan partikel gas.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">2. Tumbukan Lenting Sebagian</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Momentum kekal, tapi Energi Kinetik tidak kekal (berkurang). Ada energi yang berubah menjadi suara atau panas (penyok). Benda masih terpantul tapi tidak sesempurna awalnya ($0 &lt; e &lt; 1$). Contoh: bola bekel yang dipantulkan ke lantai.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">3. Tumbukan Tidak Lenting Sama Sekali</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Setelah bertabrakan, kedua benda <strong>menempel dan bergerak bersama-sama</strong> dengan kecepatan yang sama ($v_1' = v_2'$). Koefisien restitusi ($e = 0$). Contoh: peluru yang menancap di balok kayu.</p>
            </div>
          </div>
        </motion.section>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-8 rounded-2xl border border-red-200/50 dark:border-red-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-red-800 dark:text-red-500 mb-6">
            <Lightbulb className="text-red-500" size={28} /> Fisika Tumbukan di Dunia Nyata
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Rahasia "Crumple Zone" Mobil</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Bagian depan mobil modern dirancang agar mudah hancur/penyok saat tabrakan. Dalam rumus Impuls ($F \times \Delta t = \Delta p$), nilai perubahan momentum saat tabrakan pasti tetap. Jika waktu tabrakan ($\Delta t$) <strong>diperlama</strong> gara-gara mobil menyusut perlahan, maka <strong>Gaya benturan ($F$)</strong> yang dirasakan penumpang akan menjadi jauh lebih kecil!
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Fungsi Kantong Udara (Airbag)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sama halnya dengan Crumple Zone, Airbag berfungsi untuk <strong>memperpanjang selang waktu ($\Delta t$)</strong> kepala pengemudi saat membentur dasbor. Waktu benturan yang lebih lama akan menurunkan Gaya ($F$) mematikan, sehingga kepala selamat dari cedera parah.
              </p>
            </div>
          </div>
          
          <Link to="/lab/cannon" className="block text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Coba Lab Meriam & Dinding (Momentum Tumbukan) &rarr;
          </Link>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-center mt-8">
          <button onClick={handleFinish} className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-green-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2 text-lg">
            <CheckCircle size={24} /> Tandai Selesai
          </button>
        </motion.div>

      </div>
    </div>
  )
}
