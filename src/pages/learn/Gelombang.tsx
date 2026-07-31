import { ArrowLeft, Activity, Radio, Lightbulb, CheckCircle, Speaker } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store/useStore"

export default function Gelombang() {
  const navigate = useNavigate()
  

  const handleFinish = () => {
    alert("Selamat! Anda telah menyelesaikan materi ini!")
    navigate("/learn")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Activity size={14} /> Lanjut
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gelombang & Bunyi</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Semua alat komunikasi di dunia bergantung pada satu rahasia alam yang sama: Getaran yang merambat (Gelombang). Baik itu gempa bumi, radiasi kosmis, hingga nada gitar akustik.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm">1</span>
            Anatomi Gelombang
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Gelombang secara esensial memindahkan ENERGI dari satu tempat ke tempat lain tanpa memindahkan zat wujud bendanya. Ada komponen yang mendefinisikannya:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mb-4 space-y-2">
            <li><strong>Panjang Gelombang ($\lambda$, lambda):</strong> Jarak fisik antara dua bukit/puncak gelombang (satuan meter).</li>
            <li><strong>Frekuensi ($f$):</strong> Berapa kali gelombang itu bergetar naik-turun dalam satu detik (satuan Hertz). Jika nada gitarnya melengking tinggi, frekuensinya besar.</li>
            <li><strong>Amplitudo ($A$):</strong> Seberapa tinggi puncak bukit gelombang. Jika Anda memutar volume speaker HP Anda jadi maksimal, Amplitudonya lah yang meninggi (suara jadi keras)!</li>
          </ul>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl font-mono text-center text-indigo-600 dark:text-indigo-400 font-bold border border-slate-100 dark:border-slate-700 text-xl">
            v = λ × f
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 text-center">Kecepatan rambat ($v$) adalah hasil kali panjang gelombang dan frekuensinya.</p>
        </motion.section>

        {/* BAB 2 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm">2</span>
            Sifat-Sifat Ajaib Gelombang
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Interferensi (Tabrakan Gelombang)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Jika dua puncak gelombang bertabrakan di titik yang sama, mereka akan bergabung membentuk ombak raksasa yang super tinggi (Interferensi Konstruktif). Tapi jika Puncak menabrak Lembah gelombang lain, mereka akan saling memusnahkan dan menciptakan area yang tenang seketika (Interferensi Destruktif). Ini adalah prinsip <em>Active Noise Cancellation (ANC)</em> di TWS kekinian!</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Difraksi (Melentur)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pernahkah kamu bisa mendengar suara orang ngobrol di balik tembok yang ada celah pintunya? Gelombang suara bisa "berbelok" menembus celah sempit, berbeda dengan peluru yang hanya bisa lurus.</p>
            </div>
          </div>
        </motion.section>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 text-sm">3</span>
            Efek Doppler
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Sirine ambulans yang sedang mengebut ke arahmu akan terdengar melengking tinggi (<strong>Nee-Noo... Nee-Noo...</strong>). Tapi sesaat setelah ambulans itu melewatimu dan menjauh, nadanya tiba-tiba turun menjadi rendah (<strong>Nooo.... Neeee...</strong>).
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Inilah <strong>Efek Doppler</strong>. Saat mobil mendekat, gelombang suaranya di depan mobil ikut terdorong dan memampat (rapat). Gelombang yang rapat berarti Frekuensinya naik, sehingga nadanya tinggi! Sebaliknya saat menjauh, gelombang di belakang mobil merenggang.
          </p>
        </motion.section>

        {/* MENDALAM */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-8 rounded-2xl border border-indigo-200/50 dark:border-purple-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-indigo-800 dark:text-indigo-500 mb-6">
            <Radio className="text-purple-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm mb-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2"><Speaker size={18} className="text-pink-600"/> Kenapa Di Luar Angkasa Sepi?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Bunyi adalah <strong>Gelombang Mekanik</strong> (ia butuh partikel medium seperti atom gas udara untuk saling bertabrakan menghantarkan rambatan suara). Di luar angkasa, tidak ada apa-apa, semuanya vakum hampa udara. Ledakan sebesar planet meledak pun tidak akan menimbulkan suara satu desibel-pun yang terdengar dari pesawatmu!
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/lab/waves" className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Praktek Tali & Gelombang Air &rarr;
            </Link>
            <Link to="/lab/doppler" className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Praktek Sirine Doppler &rarr;
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
