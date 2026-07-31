import { ArrowLeft, Droplets, Lightbulb, CheckCircle, Ship, Wind } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store/useStore"

export default function Fluida() {
  const navigate = useNavigate()
  

  const handleFinish = () => {
    alert("Selamat! Anda telah menyelesaikan materi ini!")
    navigate("/learn")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 pb-20">
      <Link to="/learn" className="inline-flex items-center text-sm text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Menu Materi
      </Link>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-bold uppercase tracking-wider">
          <Droplets size={14} /> Menengah
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Mekanika Fluida</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Fluida merujuk pada segala zat yang bisa mengalir (Zat Cair dan Gas). Fluida tidak punya bentuk tetap dan akan menyesuaikan wadahnya. Mari menyelami keajaiban tekanan air dan rahasia aerodinamika pesawat terbang!
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* BAB 1 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 text-sm">1</span>
            Massa Jenis & Tekanan Dasar
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            Massa Jenis ($\rho$) adalah kerapatan benda. Semakin rapat partikel benda, semakin besar massanya dalam volume yang kecil. Sementara Tekanan ($P$) adalah seberapa besar gaya yang dihantamkan ke suatu luasan area. Pisau yang tajam memiliki "Area" ujung yang sangat kecil, sehingga "Tekanan"-nya sangat besar untuk mengiris daging!
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl font-mono text-center text-cyan-600 dark:text-cyan-400 font-bold border border-slate-100 dark:border-slate-700">
              ρ = m / V
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl font-mono text-center text-cyan-600 dark:text-cyan-400 font-bold border border-slate-100 dark:border-slate-700">
              P = F / A
            </div>
          </div>
        </motion.section>

        {/* BAB 2 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm">2</span>
            Fluida Statis (Air Diam)
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">A. Tekanan Hidrostatis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Pernahkah telinga Anda terasa sakit saat menyelam di dasar kolam? Itu karena berat air di atas Anda menekan ke segala arah. Semakin dalam Anda menyelam, tekanan hidrostatis semakin mencekik! Kapal selam memiliki batas kedalaman maksimal agar tidak remuk oleh tekanan laut.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl font-mono text-center text-blue-600 dark:text-blue-400 font-bold border border-slate-100 dark:border-slate-700 text-lg">
                P = ρ × g × h
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">B. Hukum Pascal</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                "Tekanan yang diberikan pada cairan tertutup akan diteruskan ke segala arah sama besar." Ini adalah rahasia <strong>Dongkrak Hidrolik</strong> di bengkel! Anda hanya perlu memompa piston kecil dengan tenaga satu tangan, dan tekanannya sanggup mengangkat truk raksasa di piston besar.
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">C. Hukum Archimedes</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Setiap benda yang masuk ke dalam air akan mendapat <strong>Gaya Angkat ke Atas ($F_a$)</strong> seberat volume air yang dipindahkannya. Jika $F_a$ lebih besar dari berat kapal, kapal akan <strong>Mengapung</strong>!
              </p>
            </div>
          </div>
        </motion.section>

        {/* BAB 3 */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 text-sm">3</span>
            Fluida Dinamis (Air / Udara Mengalir)
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">A. Persamaan Kontinuitas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Pernahkah Anda menyiram tanaman dan memencet/menutup separuh lubang selang dengan jari? Air tiba-tiba menyemprot keluar jauh lebih cepat! Ini karena aliran air di area yang sempit ($A$ kecil) menuntut air untuk melesat dengan kecepatan tinggi ($v$ besar) agar debit air yang lewat tetap konstan.
              </p>
              <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-xl font-mono text-center text-sky-600 dark:text-sky-400 font-bold border border-slate-100 dark:border-slate-700 text-lg">
                A₁ × v₁ = A₂ × v₂
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2"><Wind className="text-sky-500" size={18}/> B. Asas Bernoulli</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Daniel Bernoulli menemukan fenomena paling kontraintuitif di alam semesta: <strong>Di tempat yang kecepatannya tinggi, tekanannya justru sangat rendah (turun)!</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                <li><strong>Sayap Pesawat:</strong> Sayap dirancang melengkung di atas. Udara di atas sayap melaju lebih kencang, tekanannya turun. Tekanan udara di bawah sayap yang besar akan mengangkat pesawat ratusan ton ke angkasa!</li>
                <li><strong>Angin Topan:</strong> Angin topan yang melaju sangat kencang di atas atap rumah menyebabkan tekanan udara di luar rumah anjlok. Tekanan dalam rumah mendesak ke atas dan membongkar atap!</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* MENDALAM & FAKTA UNIK */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/10 dark:to-sky-900/10 p-8 rounded-2xl border border-cyan-200/50 dark:border-cyan-700/30">
          <h2 className="text-2xl font-black flex items-center gap-2 text-cyan-800 dark:text-cyan-500 mb-6">
            <Lightbulb className="text-cyan-500" size={28} /> Fakta Unik Fisika
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2"><Ship size={18} className="text-cyan-600"/> Kapal Baja Bisa Mengapung?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Logam baja pasti tenggelam. Tapi, kapal pesiar tidak terbuat dari baja utuh! Bentuk perut kapal yang lebar membungkus ruangan berisi udara kosong yang sangat luas. Akibatnya, "Massa Jenis Rata-rata" seluruh kapal menjadi lebih ringan daripada air laut, sehingga Gaya Archimedes sukses mengapungkannya.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 p-5 rounded-xl backdrop-blur-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Rahasia Hukum Torricelli</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Kecepatan pancaran air dari tangki raksasa yang bocor di dinding bawahnya (Hukum Torricelli) ternyata <strong>persis sama</strong> dengan kecepatan bola batu yang dilempar jatuh bebas dari atas tangki! Keduanya ditenagai oleh Energi Potensial Gravitasi.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/lab/bernoulli" className="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Praktek Pipa Bernoulli &rarr;
            </Link>
            <Link to="/lab/torricelli" className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Praktek Tangki Bocor &rarr;
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
