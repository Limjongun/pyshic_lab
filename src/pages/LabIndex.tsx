import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Target, TrendingDown, RefreshCcw, ArrowRight, Activity, Zap, PlayCircle, BookOpen, Globe, SunDim, Radio, Crosshair, Droplets, Thermometer, Cpu, Magnet, Wind, Volume2, RotateCw, Box } from "lucide-react"
import { useStore } from "../store/useStore"

export default function LabIndex() {
  const navigate = useNavigate();
  const { spendEnergy, addXp } = useStore();

  const handleOpenLab = (path: string, status: string) => {
    if (status !== "Tersedia") return;
    
    if (spendEnergy(5)) {
      addXp(5); // Reward karena rajin praktek
      navigate(path);
    } else {
      alert("Energi tidak cukup! Selesaikan kuis atau tantangan untuk mendapatkan energi.");
    }
  }

  const labs = [
    {
      id: "parabola",
      title: "Gerak Parabola",
      shortDesc: "Eksperimen peluncuran proyektil meriam.",
      description: "Uji coba hukum proyektil dengan menembakkan peluru meriam. Analisis bagaimana sudut elevasi, gravitasi, dan kecepatan awal mempengaruhi jarak tempuh maksimal dan ketinggian peluru.",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
      bgLight: "bg-blue-50 dark:bg-blue-900/10",
      iconColor: "text-blue-500",
      path: "/app/lab/parabola",
      tags: ["Kinematika", "Vektor", "Gravitasi"],
      status: "Tersedia"
    },
    {
      id: "inclined-plane",
      title: "Bidang Miring & Gesekan",
      shortDesc: "Simulasi balok pada bidang miring.",
      description: "Amati pertarungan antara gaya gravitasi dan gaya gesek. Ubah material lantai menjadi Es, Kayu, atau Karet untuk melihat secara langsung bagaimana koefisien gesekan statis dan kinetis menahan laju benda.",
      icon: TrendingDown,
      color: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      bgLight: "bg-orange-50 dark:bg-orange-900/10",
      iconColor: "text-orange-500",
      path: "/app/lab/inclined-plane",
      tags: ["Dinamika", "Gaya Gesek", "Hukum Newton"],
      status: "Tersedia"
    },
    {
      id: "pendulum",
      title: "Sistem Tumbukan / Pendulum",
      shortDesc: "Bandul Newton dan transfer momentum.",
      description: "Eksperimen klasik ayunan pendulum (Newton's Cradle). Pelajari bagaimana Energi Kinetik diubah menjadi Energi Potensial secara terus menerus, dan buktikan teori kekekalan momentum saat benda saling bertumbukan.",
      icon: RefreshCcw,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/10",
      iconColor: "text-emerald-500",
      path: "/app/lab/pendulum",
      tags: ["Momentum", "Energi Mekanik", "Tumbukan"],
      status: "Tersedia"
    },
    {
      id: "gravity",
      title: "Gravitasi & Orbit Planet",
      shortDesc: "Simulasi interaksi gravitasi dan gerak orbit.",
      description: "Pelajari Hukum Gravitasi Universal Newton dan Hukum Kepler. Lempar planet mengelilingi bintang raksasa dan amati bentuk orbit elips atau lintasan hiperbola yang menakjubkan!",
      icon: Globe,
      color: "from-purple-500 to-fuchsia-500",
      shadow: "shadow-purple-500/20",
      bgLight: "bg-purple-50 dark:bg-purple-900/10",
      iconColor: "text-purple-500",
      path: "/app/lab/gravity",
      tags: ["Gravitasi", "Hukum Kepler", "Orbit"],
      status: "Tersedia"
    },
    {
      id: "optics",
      title: "Optika Geometri",
      shortDesc: "Eksperimen pembiasan lensa dan pemantulan cermin.",
      description: "Eksperimen pelacakan sinar cahaya (Ray Tracing) menembus lensa cembung/cekung. Pahami perhitungan pembentukan bayangan nyata maupun maya.",
      icon: SunDim,
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-pink-500/20",
      bgLight: "bg-pink-50 dark:bg-pink-900/10",
      iconColor: "text-pink-500",
      path: "/app/lab/optics",
      tags: ["Cahaya", "Lensa", "Pembiasan"],
      status: "Tersedia"
    },
    {
      id: "waves",
      title: "Gelombang Harmonik",
      shortDesc: "Resonansi gelombang tali stasioner.",
      description: "Eksperimen osilasi gelombang mekanik pada tali. Gunakan osilator untuk mencari frekuensi nada dasar hingga membentuk perut gelombang stasioner yang sempurna!",
      icon: Radio,
      color: "from-cyan-500 to-teal-400",
      shadow: "shadow-cyan-500/20",
      bgLight: "bg-cyan-50 dark:bg-cyan-900/10",
      iconColor: "text-cyan-500",
      path: "/app/lab/waves",
      tags: ["Gelombang", "Frekuensi", "Resonansi"],
      status: "Tersedia"
    },
    {
      id: "catapult",
      title: "Catapult & Susunan Bata",
      shortDesc: "Simulasi soft-body ketapel, lemparan peluru, dan kehancuran susunan bata secara realistis.",
      description: "Eksperimen mekanika struktur. Gunakan ketapel untuk menghancurkan susunan bata dengan memanfaatkan gaya pegas dan elastisitas benda.",
      icon: Crosshair,
      color: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20",
      bgLight: "bg-red-50 dark:bg-red-900/10",
      iconColor: "text-red-500",
      path: "/app/lab/catapult",
      tags: ["Mekanika", "Elastisitas", "Struktur"],
      status: "Tersedia"
    },
    {
      id: "fluid",
      title: "Hukum Archimedes",
      shortDesc: "Eksperimen fluida statis mengukur gaya apung berdasarkan massa jenis.",
      description: "Amati bagaimana benda mengapung, melayang, atau tenggelam bergantung pada perbandingan massa jenis benda dan cairan.",
      icon: Droplets,
      color: "from-sky-500 to-cyan-500",
      shadow: "shadow-sky-500/20",
      bgLight: "bg-sky-50 dark:bg-sky-900/10",
      iconColor: "text-sky-500",
      path: "/app/lab/fluid",
      tags: ["Fluida", "Massa Jenis", "Gaya Apung"],
      status: "Tersedia"
    },
    {
      id: "thermodynamics",
      title: "Teori Kinetik Gas",
      shortDesc: "Simulasi Gas Ideal (PV=nRT) dan partikel.",
      description: "Bereksperimen dengan gas ideal dalam tabung. Kontrol suhu dan volume untuk melihat dampaknya pada tekanan.",
      icon: Thermometer,
      color: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
      bgLight: "bg-rose-50 dark:bg-rose-900/10",
      iconColor: "text-rose-500",
      path: "/app/lab/thermodynamics",
      tags: ["Termodinamika", "Suhu", "Tekanan"],
      status: "Tersedia"
    },
    {
      id: "circuit",
      title: "Rangkaian Listrik",
      shortDesc: "Eksperimen sirkuit listrik interaktif dan Hukum Ohm.",
      description: "Susun baterai, kabel, dan lampu secara drag-and-drop. Hitung arus dan tegangan di setiap komponen listrik.",
      icon: Cpu,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/10",
      iconColor: "text-emerald-500",
      path: "/app/lab/circuit",
      tags: ["Listrik", "Sirkuit", "Hukum Ohm"],
      status: "Tersedia"
    },
    {
      id: "magnet",
      title: "Magnet & Gaya Lorentz",
      shortDesc: "Simulasi medan magnet batang, gaya Lorentz, dan partikel bermuatan.",
      description: "Visualisasikan garis medan magnet dan amati bagaimana arus listrik menghasilkan gaya magnet (elektromagnet).",
      icon: Magnet,
      color: "from-indigo-500 to-violet-500",
      shadow: "shadow-indigo-500/20",
      bgLight: "bg-indigo-50 dark:bg-indigo-900/10",
      iconColor: "text-indigo-500",
      path: "/app/lab/magnet",
      tags: ["Magnet", "Lorentz", "Elektromagnet"],
      status: "Tersedia"
    },
    {
      id: "torricelli",
      title: "Tangki Bocor Torricelli",
      shortDesc: "Simulasi aliran air dari tangki.",
      description: "Hitung kecepatan semburan air dan jarak jatuh parabola dari tangki.",
      icon: Droplets,
      color: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/20",
      bgLight: "bg-cyan-50 dark:bg-cyan-900/10",
      iconColor: "text-cyan-500",
      path: "/app/lab/torricelli",
      tags: ["Fluida", "Torricelli", "Kecepatan"],
      status: "Tersedia"
    },
    {
      id: "carnot",
      title: "Siklus Mesin Carnot",
      shortDesc: "Visualisasi proses termodinamika.",
      description: "Visualisasikan 4 langkah proses termodinamika pada mesin pemanas.",
      icon: Activity,
      color: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
      bgLight: "bg-rose-50 dark:bg-rose-900/10",
      iconColor: "text-rose-500",
      path: "/app/lab/carnot",
      tags: ["Termodinamika", "Mesin", "Siklus"],
      status: "Tersedia"
    },
    {
      id: "bernoulli",
      title: "Fluida Dinamis (Bernoulli)",
      shortDesc: "Aliran udara dalam pipa, efek sayap pesawat (lift), dan tekanan.",
      description: "Amati bagaimana kecepatan fluida mempengaruhi tekanan. Aplikasi langsung pada aerodinamika pesawat terbang.",
      icon: Wind,
      color: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/20",
      bgLight: "bg-cyan-50 dark:bg-cyan-900/10",
      iconColor: "text-cyan-500",
      path: "/app/lab/bernoulli",
      tags: ["Fluida Dinamis", "Bernoulli", "Aerodinamika"],
      status: "Tersedia"
    },
    {
      id: "doppler",
      title: "Efek Doppler & Bunyi",
      shortDesc: "Sumber suara bergerak, pergeseran frekuensi, dengan real-time pitch audio.",
      description: "Simulasi interaktif sumber gelombang bunyi yang mendekat dan menjauh. Rasakan perubahan tinggi nada secara real-time.",
      icon: Volume2,
      color: "from-fuchsia-500 to-purple-500",
      shadow: "shadow-fuchsia-500/20",
      bgLight: "bg-fuchsia-50 dark:bg-fuchsia-900/10",
      iconColor: "text-fuchsia-500",
      path: "/app/lab/doppler",
      tags: ["Gelombang Bunyi", "Doppler", "Frekuensi"],
      status: "Tersedia"
    },
    {
      id: "cannon",
      title: "Meriam & Dinding",
      description: "Hancurkan dinding bata dengan mengatur tekanan laras, mesiu, dan gravitasi planet.",
      icon: Target,
      color: "from-rose-500 to-orange-500",
      shadow: "shadow-rose-500/20",
      bgLight: "bg-rose-50 dark:bg-rose-900/10",
      iconColor: "text-rose-500",
      path: "/app/lab/cannon",
      tags: ["Tekanan Gas", "Momentum", "Tumbukan"],
      status: "Tersedia"
    },
    {
      id: "rotation",
      title: "Rotasi & Torsi",
      shortDesc: "Mekanika benda tegar berputar, momen inersia, dan torsi.",
      description: "Eksperimen keseimbangan benda putar. Pelajari hubungan antara torsi, momen inersia, dan kecepatan sudut.",
      icon: RotateCw,
      color: "from-orange-500 to-red-500",
      shadow: "shadow-orange-500/20",
      bgLight: "bg-orange-50 dark:bg-orange-900/10",
      iconColor: "text-orange-500",
      path: "/app/lab/rotasi",
      tags: ["Dinamika", "Torsi", "Inersia"],
      status: "Tersedia"
    },
    {
      id: "faraday",
      title: "Induksi & Hukum Faraday",
      shortDesc: "Induksi elektromagnetik dengan magnet dan kumparan (Generator).",
      description: "Masukkan magnet ke dalam lilitan kawat untuk membangkitkan arus listrik. Pelajari prinsip dasar PLTA dan dinamo.",
      icon: Zap,
      color: "from-yellow-400 to-amber-500",
      shadow: "shadow-yellow-500/20",
      bgLight: "bg-yellow-50 dark:bg-yellow-900/10",
      iconColor: "text-yellow-500",
      path: "/app/lab/faraday",
      tags: ["Induksi", "Faraday", "Generator"],
      status: "Tersedia"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-12">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#0f172a] bg-gradient-to-r from-[#0f172a] to-indigo-950 p-8 md:p-12 shadow-2xl border border-indigo-500/20"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-bold tracking-wider uppercase mb-2">
            <Activity size={16} /> Laboratorium Virtual
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Pusat Simulasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Fisika</span>
          </h1>
          <p className="text-indigo-100/80 text-lg leading-relaxed">
            Tidak perlu lagi membayangkan fisika. Buktikan sendiri rumus-rumusnya dengan melakukan simulasi langsung menggunakan mesin fisika kami yang presisi. Pilih modul eksperimen Anda di bawah ini!
          </p>
        </div>
      </motion.div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {labs.map((lab, index) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            className="flex flex-col"
          >
            <div className={`relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 ${lab.shadow}`}>
              
              {/* Top Accent Bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${lab.color}`}></div>

              <div className="p-8 flex flex-col h-full gap-6">
                
                {/* Icon & Title */}
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${lab.bgLight} shadow-inner`}>
                    <lab.icon size={32} className={lab.iconColor} />
                  </div>
                  {lab.status === "Segera Hadir" ? (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">
                      WIP
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800 flex items-center gap-1">
                      <Zap size={12} className="fill-green-500" /> Siap Uji
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lab.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {lab.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {lab.tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <BookOpen size={12} className="text-slate-400" /> {tag}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button 
                    onClick={() => handleOpenLab(lab.path, lab.status)}
                    className={`flex items-center justify-center w-full gap-2 py-3 rounded-xl font-bold transition-all ${
                      lab.status === "Tersedia" 
                        ? `bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]`
                        : `bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed`
                    }`}
                  >
                    {lab.status === "Tersedia" ? (
                      <>
                        <PlayCircle size={18} /> Masuk ke Lab
                      </>
                    ) : (
                      "Masih Dalam Pembuatan..."
                    )}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
