import { useState } from "react"
import { BookOpen, Copy, ExternalLink, ChevronDown, ChevronUp, GraduationCap, Calendar, User, Building, CheckCircle2 } from "lucide-react"
import { useStore } from "@/store/useStore"

interface JournalArticle {
  id: string;
  title: string;
  authors: string;
  year: number;
  institution: string;
  link: string;
  summary: string;
  findings: string[];
}

const JOURNALS: JournalArticle[] = [
  {
    id: "jurnal-1",
    title: "Analisis Pemahaman Konsep Kinematika Partikel Mahasiswa Pendidikan Fisika",
    authors: "Nyoman, dkk.",
    year: 2016,
    institution: "Universitas Lampung (Jurnal Pendidikan Fisika)",
    link: "https://jurnal.fkip.unila.ac.id/index.php/JPF/article/view/11261",
    summary: "Riset ini berfokus pada seberapa dalam pemahaman mahasiswa terhadap konsep dasar Kinematika Partikel (seperti perbedaan antara kecepatan rata-rata dengan kecepatan sesaat, dan percepatan). Ditemukan bahwa banyak yang masih keliru membaca grafik perpindahan terhadap waktu (Grafik x-t).",
    findings: [
      "Banyak pelajar terjebak mengartikan 'titik potong' grafik x-t sebagai terjadinya tabrakan, padahal belum tentu.",
      "Perlu penekanan khusus pada pemahaman 'vektor' sebelum masuk ke rumus kinematika.",
      "Kemampuan analisis grafik berbanding lurus dengan kemampuan matematika dasar."
    ]
  },
  {
    id: "jurnal-2",
    title: "Identifikasi Miskonsepsi Siswa pada Materi Usaha dan Energi Menggunakan Certainty of Response Index (CRI)",
    authors: "Suparno, P. & Mulyani",
    year: 2012,
    institution: "Universitas Negeri Semarang (JPFI)",
    link: "https://journal.unnes.ac.id/nju/index.php/JPFI/article/view/1090",
    summary: "Menggunakan metode CRI (Certainty of Response Index), peneliti mengukur letak kesalahan pemahaman fundamental siswa tentang Usaha dan Energi. Salah satu temuan terbesarnya adalah kebingungan membedakan mana gaya yang melakukan usaha (searah perpindahan) dan gaya yang tidak melakukan usaha (tegak lurus perpindahan).",
    findings: [
      "Miskonsepsi tertinggi terjadi pada pemahaman Gaya Normal dan Gaya Berat saat benda di atas meja (dianggap melakukan usaha padahal 0).",
      "Siswa sering lupa bahwa Hukum Kekekalan Energi Mekanik hanya berlaku jika tidak ada gaya luar (seperti gesekan udara).",
      "Sangat penting bagi guru untuk memperagakan simulasi fisika (virtual lab) untuk menghapus miskonsepsi ini."
    ]
  },
  {
    id: "jurnal-3",
    title: "Analisis Kesulitan Belajar Siswa pada Materi Kinematika Gerak Lurus",
    authors: "Sari, R. & Syuhendri, H.",
    year: 2018,
    institution: "Universitas Sultan Ageng Tirtayasa (Gravity Journal)",
    link: "https://jurnal.untirta.ac.id/index.php/Gravity/article/view/4211",
    summary: "Artikel ini membongkar hambatan belajar utama yang dirasakan siswa saat mempelajari Gerak Lurus Beraturan (GLB) dan Gerak Lurus Berubah Beraturan (GLBB). Hambatan ini meliputi kesulitan menurunkan rumus, hingga kesulitan memvisualisasikan benda bergerak menjadi persamaan matematis.",
    findings: [
      "70% siswa kesulitan membedakan kapan harus menggunakan rumus GLB dan kapan GLBB dalam soal cerita kompleks.",
      "Terdapat kesulitan membayangkan 'nilai percepatan negatif' (perlambatan) saat benda direm.",
      "Penggunaan metode mind-mapping terbukti perlahan mengatasi kesulitan ini."
    ]
  }
];

export default function Journal() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { setAIPrompt } = useStore(); // Gunakan AI Global

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  }

  const copyLink = (e: React.MouseEvent, id: string, link: string, type: 'link' | 'title' | 'ai' = 'link', title?: string) => {
    e.stopPropagation(); 
    
    if (type === 'ai' && title) {
      // Mengirim prompt ke Global AI Chat Extension
      const promptText = `Tolong baca dan jelaskan jurnal berikut ini dengan bahasa yang mudah dipahami: "${title}". Link jurnalnya ada di sini: ${link} . Apa intisari dari jurnal tersebut?`;
      setAIPrompt(promptText);
      return;
    }

    let textToCopy = link;
    if (type === 'title' && title) {
      textToCopy = title;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(`${id}-${type}`);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const openLink = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/50 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full font-medium text-sm">
            <BookOpen size={18} /> Literatur Resmi & Riset Pendidikan
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Jurnal Ilmiah Fisika</h1>
          <p className="text-blue-100 text-lg">
            Temukan kumpulan publikasi dan penelitian terkemuka mengenai inovasi metode pembelajaran fisika. Jadikan referensi andal untuk eksperimen dan tugas akademik Anda.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20">
            <GraduationCap size={64} className="text-white opacity-90" />
          </div>
        </div>
      </div>

      {/* Journal List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white px-2">Publikasi Unggulan (Indonesia)</h2>
        
        <div className="space-y-6">
          {JOURNALS.map((journal) => {
            const isExpanded = expandedId === journal.id;

            return (
              <div 
                key={journal.id} 
                className={`bg-white dark:bg-slate-900 border ${isExpanded ? 'border-indigo-400 dark:border-indigo-500 shadow-lg' : 'border-gray-200 dark:border-slate-800 shadow-sm'} rounded-2xl overflow-hidden transition-all duration-300`}
              >
                {/* BAR UTAMA (Clickable to Expand) */}
                <div 
                  onClick={() => toggleExpand(journal.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
                >
                  <div className="flex-1 space-y-3">
                    <h3 className={`font-bold text-lg md:text-xl leading-snug ${isExpanded ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                      {journal.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5"><User size={16} /> {journal.authors}</div>
                      <div className="flex items-center gap-1.5"><Calendar size={16} /> {journal.year}</div>
                      <div className="flex items-center gap-1.5"><Building size={16} /> {journal.institution}</div>
                    </div>
                  </div>

                  {/* Tombol Aksi di Kanan */}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-800">
                    <button 
                      onClick={(e) => copyLink(e, journal.id, journal.link, 'title', journal.title)}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-xl font-bold transition-all ${copiedId === `${journal.id}-title` ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'}`}
                      title="Salin Nama Jurnal"
                    >
                      {copiedId === `${journal.id}-title` ? <><CheckCircle2 size={16} /> Tersalin</> : <><Copy size={16} /> Nama</>}
                    </button>
                    <button 
                      onClick={(e) => copyLink(e, journal.id, journal.link, 'link')}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-xl font-bold transition-all ${copiedId === `${journal.id}-link` ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'}`}
                      title="Salin Tautan Jurnal"
                    >
                      {copiedId === `${journal.id}-link` ? <><CheckCircle2 size={16} /> Tersalin</> : <><Copy size={16} /> Link</>}
                    </button>
                    <button 
                      onClick={(e) => copyLink(e, journal.id, journal.link, 'ai', journal.title)}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-xl font-bold transition-all ${copiedId === `${journal.id}-ai` ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800'}`}
                      title="Salin Prompt untuk Tanya AI"
                    >
                      {copiedId === `${journal.id}-ai` ? <><CheckCircle2 size={16} /> Prompt Disalin</> : <><BookOpen size={16} /> Tanya AI</>}
                    </button>
                    <button 
                      onClick={(e) => openLink(e, journal.link)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20"
                    >
                      Explore <ExternalLink size={16} />
                    </button>
                    <div className="hidden lg:flex w-8 h-8 items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-full ml-1">
                      {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                    </div>
                  </div>
                </div>

                {/* DROPDOWN KONTEN */}
                {isExpanded && (
                  <div className="border-t border-indigo-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-900/50 p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" /> Abstrak & Penjelasan
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {journal.summary}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 dark:text-white">Kesimpulan Utama:</h4>
                        <ul className="space-y-3">
                          {journal.findings.map((finding, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <div className="mt-0.5 text-green-500"><CheckCircle2 size={16} /></div>
                              <span className="leading-relaxed">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
