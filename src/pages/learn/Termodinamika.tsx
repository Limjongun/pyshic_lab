import { ArrowLeft, Thermometer, Flame, Lightbulb, CheckCircle, Snowflake } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store/useStore"

export default function Termodinamika() {
  const navigate = useNavigate()
  

  const handleFinish = () => {
    alert("Selamat! Anda telah menyelesaikan materi ini!")
    navigate("/learn")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Thermometer size={14} /> Menengah
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Suhu & Termodinamika</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Mengapa rel kereta api dibuat renggang? Bagaimana AC bisa mendinginkan ruangan? Termodinamika adalah saksi bisu peperangan abadi antara Panas (Kalor) dan Dingin.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-sm">1</span>
            Suhu vs Kalor
          </h2>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Banyak orang yang tertukar antara Suhu dan Kalor. 
              <strong>Suhu ($T$)</strong> hanyalah sebuah "angka" derajat untuk menunjukkan seberapa cepat atom/molekul di dalam benda itu bergetar. Semakin liar partikelnya menari, semakin tinggi suhunya.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Sebaliknya, <strong>Kalor ($Q$)</strong> adalah ENERGI. Kalor adalah energi panas yang melompat pindah dari benda yang suhunya TINGGI ke benda yang suhunya RENDAH.
            </p>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl font-mono text-center text-rose-600 dark:text-rose-400 font-bold border border-slate-100 dark:border-slate-700 text-lg">
              Q = m × c × ΔT
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Energi Kalor yang dibutuhkan untuk memanaskan air tergantung pada massa ($m$), sifat spesifik bendanya ($c$), dan seberapa besar kenaikan suhunya ($\Delta T$).
            </p>
          </div>
        </motion.section>

        {/* BAB 2 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-sm">2</span>
            Hukum Gas Ideal
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Gas punya sifat ajaib: mereka selalu memenuhi seluruh ruangan yang tersedia. Fisikawan merangkum pergerakan gas yang tak kasat mata ini ke dalam satu rumus rahasia alam semesta:
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl font-mono text-center text-orange-600 dark:text-orange-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            P × V = n × R × T
          </div>
          <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-4">
            <li><strong>Suhu Naik ($T\uparrow$):</strong> Jika volume dikunci (misal ban mobil), tekanan gas akan meledak ($P\uparrow$) saat terjemur matahari panas.</li>
            <li><strong>Volume Naik ($V\uparrow$):</strong> Jika gas diperbolehkan mengembang bebas (seperti balon udara terbang), ia akan mendingin ($T\downarrow$).</li>
          </ul>
        </motion.section>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">3</span>
            Hukum Termodinamika
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-rose-500 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Hukum Ke-0: Keseimbangan</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Jika kamu memasukkan es batu ke dalam teh panas, akhirnya mereka akan berbagi suhu hingga sama persis (teh dingin). Tidak akan ada lagi perpindahan panas setelah seimbang.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Hukum Ke-1: Kekekalan Energi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Energi semesta tidak bisa diciptakan dan dimusnahkan. Energi panas yang terbakar dalam mesin bensin mobilmu (Kalor) 100% dialihkan menjadi Usaha (roda bergerak maju) dan Energi Dalam (mesin jadi ikut memanas).</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Hukum Ke-2: Entropi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Panas SELALU mengalir dari suhu tinggi ke rendah. Secangkir kopi panas yang dibiarkan di meja akan mendingin, TETAPI kopi dingin tak akan pernah tiba-tiba mendidih tanpa bantuan alat luar. Alam semesta selalu menuju ke ketidakteraturan (Entropi).</p>
            </div>
          </div>
        </motion.section>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10 p-8 rounded-2xl border border-rose-200/50 dark:border-rose-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-rose-800 dark:text-rose-500 mb-6">
            <Flame className="text-rose-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Kenapa AC Harus Diletakkan di Atas?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ini adalah trik cerdas prinsip Konveksi! Udara dingin lebih padat dan berat, sehingga akan turun tenggelam ke bawah secara alami. Udara panas yang ringan di bawah akan naik, lalu dihisap masuk ke AC untuk didinginkan lagi. Sirkulasi ini menyegarkan seluruh ruangan!
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2"><Snowflake size={18} className="text-sky-500"/> Limit Absolut Suhu Dingin</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Kamu bisa merebus baja hingga jutaan derajat Celsius. TETAPI, kamu tidak bisa mendinginkan sesuatu lebih rendah dari <strong>-273.15 °C (Nol Mutlak)</strong>. Pada titik ini, seluruh atom alam semesta membeku dan berhenti bergerak!
              </p>
            </div>
          </div>
          
          <Link to="/lab/carnot" className="block text-center bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Coba Lab Mesin Carnot & Piston &rarr;
          </Link>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center mt-8">
          <button onClick={handleFinish} className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-green-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center gap-2 text-lg">
            <CheckCircle size={24} /> Tandai Selesai
          </button>
        </motion.div>

      </div>
    </div>
  )
}
