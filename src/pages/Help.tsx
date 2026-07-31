import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, HelpCircle, ChevronDown, ChevronUp, Beaker, Zap, Box, BrainCircuit } from 'lucide-react';

const faqs = [
  {
    question: 'Apa itu PhysicsLAB?',
    answer: 'PhysicsLAB adalah platform pembelajaran fisika interaktif berbasis web yang menggabungkan laboratorium virtual, gamifikasi, dan kecerdasan buatan. Platform ini dirancang untuk membuat belajar fisika menjadi menyenangkan, eksperimental, dan mudah dipahami melalui simulasi langsung.'
  },
  {
    question: 'Bagaimana cara mendapatkan XP (Experience Points) dan naik level?',
    answer: 'Anda bisa mendapatkan XP dengan cara menyelesaikan Kuis Fisika, mengeksplorasi Lab Terarah, serta menyelesaikan berbagai Tantangan (Challenges) yang tersedia di menu navigasi. Semakin tinggi level Anda, semakin membuktikan penguasaan Anda terhadap konsep fisika.'
  },
  {
    question: 'Apa perbedaan Lab Terarah, Sandbox, dan Advance Lab?',
    answer: 'Lab Terarah berfokus pada eksperimen topik spesifik (seperti Parabola, Gravitasi, Optik) dengan parameter terukur. Sandbox adalah ruang bebas di mana Anda bisa bereksperimen menggabungkan berbagai objek seperti magnet dan TNT tanpa batas. Advance Lab menggunakan WebGL untuk simulasi kompleks tingkat tinggi, seperti mekanika mesin uap.'
  },
  {
    question: 'Bagaimana cara meminta bantuan penjelasan materi?',
    answer: 'Anda dapat menggunakan panel Asisten AI di sebelah kanan layar kapan saja! Ketikkan pertanyaan fisika Anda, atau minta asisten untuk membuatkan kuis atau memberikan panduan terkait laboratorium yang sedang Anda jalankan.'
  }
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <Info className="text-blue-500" />
          Bantuan & Tentang Kami
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Pelajari lebih lanjut tentang misi PhysicsLAB dan temukan jawaban atas pertanyaan yang sering diajukan.
        </p>
      </div>

      {/* About Section */}
      <Card className="border-blue-100 dark:border-blue-900/50 shadow-sm dark:bg-slate-900 overflow-hidden">
        <div className="bg-blue-50 dark:bg-slate-800 p-6 border-b border-blue-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Beaker className="text-blue-500" />
            Tentang PhysicsLAB
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              <strong>PhysicsLAB</strong> lahir dari keyakinan bahwa Fisika bukanlah sekadar deretan rumus di papan tulis, melainkan sekumpulan hukum alam yang mengatur seluruh alam semesta. Kami membangun platform ini agar siapa saja dapat melihat, menyentuh, dan berinteraksi langsung dengan hukum-hukum tersebut.
            </p>
            <p>
              Dibangun dengan teknologi simulasi fisika termutakhir seperti <strong>Matter.js</strong> dan <strong>Pixi.js WebGL</strong>, kami menjamin pengalaman eksperimen yang realistis, tanpa friksi, dan aman dari bahaya laboratorium sungguhan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 text-orange-500 rounded-lg flex items-center justify-center mb-3">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold dark:text-white mb-2">Belajar Interaktif</h3>
                <p className="text-sm">Tinggalkan buku sejenak, manipulasi gravitasi, masa, dan energi secara *real-time*.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 text-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Box size={20} />
                </div>
                <h3 className="font-bold dark:text-white mb-2">Kebebasan Eksperimen</h3>
                <p className="text-sm">Ruang Sandbox tak terbatas untuk memicu kreativitas tanpa batasan kurikulum baku.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-500 rounded-lg flex items-center justify-center mb-3">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="font-bold dark:text-white mb-2">Asisten AI Cerdas</h3>
                <p className="text-sm">Bingung? Asisten Antigravity akan senantiasa memandu perjalanan saintifik Anda.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="shadow-sm dark:bg-slate-900">
        <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-slate-500" />
            Frequently Asked Questions (FAQ)
          </h2>
        </div>
        <CardContent className="p-6 divide-y dark:divide-slate-800">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left focus:outline-none group"
              >
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {faq.question}
                </h3>
                <div className="text-slate-400 group-hover:text-blue-500 transition-colors ml-4 shrink-0">
                  {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>
              
              <div 
                className={`mt-3 text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-400 pt-8 pb-4">
         &copy; {new Date().getFullYear()} PhysicsLAB Education. Designed for future scientists.
      </div>
    </div>
  );
}
