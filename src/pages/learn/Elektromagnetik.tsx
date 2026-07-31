import { ArrowLeft, Zap, Magnet, Lightbulb, CheckCircle, BatteryCharging } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store/useStore"

export default function Elektromagnetik() {
  const navigate = useNavigate()
  

  const handleFinish = () => {
    alert("Selamat! Anda telah menyelesaikan materi ini!")
    navigate("/learn")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Zap size={14} /> Lanjut
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kelistrikan & Kemagnetan</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Semua teknologi modern dari layar HP, internet, hingga mobil listrik bisa beroperasi karena kita sukses menjinakkan dua gaya magis: Gaya Listrik dan Gaya Magnet. Mari kita ungkap rahasianya.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 text-sm">1</span>
            Trinitas Listrik (Hukum Ohm)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Dalam sirkuit kabel, ada 3 aktor utama yang selalu berebut kuasa. Hubungan ketiganya dijelaskan oleh George Ohm dengan rumus yang menjadi nyawa dunia elektronika:
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl font-mono text-center text-yellow-600 dark:text-yellow-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            V = I × R
          </div>
          <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mt-4 space-y-2">
            <li><strong>Tegangan / Voltage (V):</strong> Tenaga dorong dari baterai/PLN. Semakin besar Voltage, semakin kuat elektron dipaksa maju.</li>
            <li><strong>Arus / Current (I):</strong> Jumlah elektron (airnya) yang benar-benar mengalir lewat kabel setiap detik. Arus inilah yang bisa menyetrum Anda.</li>
            <li><strong>Hambatan / Resistance (R):</strong> Rintangan di dalam kabel. Semakin sempit atau panjang kabelnya, semakin sulit elektron lewat (Resistansinya besar).</li>
          </ul>
        </motion.section>

        {/* BAB 2 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm">2</span>
            Gaya Magnetik & Gaya Lorentz
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Medan magnet memiliki kemampuan menolak (kutub senama) atau menarik (kutub beda). Tetapi, Hendrik Lorentz menemukan hal paling gila: <strong>Jika Anda menembakkan muatan listrik yang bergerak memotong masuk ke dalam medan magnet, muatan itu akan dibanting ke samping!</strong>
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl font-mono text-center text-indigo-600 dark:text-indigo-400 font-bold border border-slate-100 dark:border-slate-700 text-lg">
            F = B × I × L
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Gaya dorong inilah yang menjadi jantung dari <strong>Motor Listrik</strong>. Mobil Tesla melaju kencang karena kawat listrik (I) di dalam mesinnya ditendang memutar berulang-ulang oleh magnet raksasa (B)!
          </p>
        </motion.section>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 text-sm">3</span>
            Induksi Elektromagnetik (Hukum Faraday)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Michael Faraday membalik logika motor listrik: "Bila listrik bisa menghasilkan gerakan magnet (Motor), maka magnet yang bergerak harusnya bisa menghasilkan listrik!"
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Saat Anda memasukkan batangan magnet mendekat dan menjauh masuk ke dalam kumparan kawat tembaga, tiba-tiba arus listrik tercipta secara ajaib dari dalam kabel yang tak terhubung baterai satupun. Inilah cikal bakal <strong>Generator (PLN)</strong> yang menyuplai seluruh listrik di bumi!
          </p>
        </motion.section>

        {/* MENDALAM */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-yellow-50 to-indigo-50 dark:from-yellow-900/10 dark:to-indigo-900/10 p-8 rounded-2xl border border-yellow-200/50 dark:border-indigo-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-yellow-800 dark:text-yellow-500 mb-6">
            <Magnet className="text-indigo-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm mb-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2"><BatteryCharging className="text-green-500" size={18}/> Baterai HP Anda yang Meledak</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Jika terjadi korsleting (Short Circuit) di mana kabel positif baterai langsung menyentuh kabel negatif tanpa adanya hambatan lampu/komponen (R = 0), rumus Hukum Ohm ($I = V/R$) akan mendadak menghasilkan Arus Listrik ($I$) yang jumlahnya TAK TERHINGGA! Arus ganas tak terkendali inilah yang langsung melelehkan kabel dan memicu ledakan.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/lab/circuit" className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Praktek Hukum Ohm &rarr;
            </Link>
            <Link to="/lab/magnet" className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Praktek Gaya Magnet &rarr;
            </Link>
            <Link to="/lab/faraday" className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Praktek Generator Listrik &rarr;
            </Link>
          </div>
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
