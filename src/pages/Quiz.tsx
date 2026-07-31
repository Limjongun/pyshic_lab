import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, CheckCircle2, XCircle, Trophy, Settings2, Info, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/store/useStore"
import { QUIZ_DATA } from "@/data/quizData"
import type { Question } from "@/data/quizData"

export default function Quiz() {
  // === STATE FOR SETUP ===
  const [setupMode, setSetupMode] = useState(true)
  const [selectedModules, setSelectedModules] = useState<string[]>(["kinematics", "dynamics", "energy", "fluids", "waves", "thermodynamics", "momentum", "electricity", "gravity"])
  const [questionCount, setQuestionCount] = useState<number>(5)
  
  // === STATE FOR PLAYING ===
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  // Shuffle logic
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5)
  }

  const startQuiz = () => {
    if (selectedModules.length === 0) return;
    
    // Filter by module
    const filtered = QUIZ_DATA.filter(q => selectedModules.includes(q.moduleId));
    // Shuffle all filtered
    const shuffled = shuffleArray([...filtered]);
    // Take the desired amount
    const sliced = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    
    setActiveQuestions(sliced);
    setCurrentIdx(0);
    setSelected(null);
    setIsSubmitted(false);
    setScore(0);
    setFinished(false);
    setSetupMode(false);
  }

  const handleToggleModule = (mod: string) => {
    setSelectedModules(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    )
  }

  // === PLAYING ACTIONS ===
  const question = activeQuestions[currentIdx]

  const handleSubmit = () => {
    if (selected === null) return
    setIsSubmitted(true)
    if (selected === question.correct) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setIsSubmitted(false)
    } else {
      setFinished(true)
    }
  }

  const handleRestartSetup = () => {
    setFinished(false)
    setSetupMode(true)
  }

  // === RENDER SETUP SCREEN ===
  if (setupMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 dark:text-white mb-2">
              <Settings2 className="text-blue-500" /> Pengaturan Kuis
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Pilih materi yang ingin diuji dan tentukan jumlah pertanyaannya.</p>
          </div>
        </div>

        <Card className="dark:bg-slate-900 border-gray-100 dark:border-slate-800">
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">Pilih Modul Materi <span className="text-sm font-normal text-gray-400">(Bisa pilih &gt; 1)</span></h3>
              
              <div className="grid gap-3">
                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('kinematics')} onChange={() => handleToggleModule('kinematics')} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="flex-1 font-medium text-blue-600 dark:text-blue-400">Modul 1: Kinematika Dasar</span>
                </label>
                
                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('dynamics')} onChange={() => handleToggleModule('dynamics')} className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="flex-1 font-medium text-orange-600 dark:text-orange-400">Modul 2: Dinamika (Hukum Newton)</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('energy')} onChange={() => handleToggleModule('energy')} className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span className="flex-1 font-medium text-green-600 dark:text-green-400">Modul 3: Usaha & Energi</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('fluids')} onChange={() => handleToggleModule('fluids')} className="w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span className="flex-1 font-medium text-cyan-600 dark:text-cyan-400">Modul 4: Fluida Statis & Dinamis</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('waves')} onChange={() => handleToggleModule('waves')} className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="flex-1 font-medium text-teal-600 dark:text-teal-400">Modul 5: Gelombang & Bunyi</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('thermodynamics')} onChange={() => handleToggleModule('thermodynamics')} className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  <span className="flex-1 font-medium text-red-600 dark:text-red-400">Modul 6: Termodinamika</span>
                </label>
                
                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('momentum')} onChange={() => handleToggleModule('momentum')} className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span className="flex-1 font-medium text-rose-600 dark:text-rose-400">Modul 7: Momentum & Impuls</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('electricity')} onChange={() => handleToggleModule('electricity')} className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="flex-1 font-medium text-purple-600 dark:text-purple-400">Modul 8: Kelistrikan</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" checked={selectedModules.includes('gravity')} onChange={() => handleToggleModule('gravity')} className="w-5 h-5 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                  <span className="flex-1 font-medium text-slate-600 dark:text-slate-400">Modul 9: Gravitasi Bumi & Angkasa</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg dark:text-white">Jumlah Pertanyaan</h3>
              <div className="flex flex-wrap gap-3">
                {[5, 10, 15, QUIZ_DATA.length].map((num) => {
                  const isSelected = questionCount === num;
                  return (
                    <div 
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 flex items-center justify-center ${
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30 scale-105" 
                          : "bg-transparent border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      }`}
                    >
                      {num === QUIZ_DATA.length ? `Semua (${num} Soal)` : `${num} Soal`}
                    </div>
                  )
                })}
              </div>
            </div>

            <Button 
              onClick={startQuiz} 
              disabled={selectedModules.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all"
            >
              Mulai Kuis Acak
            </Button>
            {selectedModules.length === 0 && <p className="text-red-500 text-sm text-center">Pilih minimal 1 modul untuk memulai.</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  // === RENDER FINISHED SCREEN ===
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-12 pb-20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="text-center py-12 border-green-100 dark:border-green-900/50 shadow-sm dark:bg-slate-900">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <Trophy size={40} />
            </div>
            <CardTitle className="text-3xl mb-2 text-green-800 dark:text-green-400">Kuis Selesai!</CardTitle>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Kamu mencetak skor {score} dari {activeQuestions.length}</p>
            <Button onClick={handleRestartSetup} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              <RefreshCw size={18} className="mr-2" /> Atur Ulang Kuis
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!question) return null;

  // === RENDER ACTIVE QUIZ ===
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
          <HelpCircle className="text-blue-500" /> Kuis Fisika
        </h1>
        <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Soal {currentIdx + 1} dari {activeQuestions.length}</span>
      </div>

      <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${((currentIdx) / activeQuestions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-sm border-gray-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider text-white flex justify-between items-center ${
              question.moduleId === 'kinematics' ? 'bg-blue-500' : 
              question.moduleId === 'dynamics' ? 'bg-orange-500' : 
              question.moduleId === 'energy' ? 'bg-green-500' :
              question.moduleId === 'fluids' ? 'bg-cyan-500' :
              question.moduleId === 'waves' ? 'bg-teal-500' :
              question.moduleId === 'thermodynamics' ? 'bg-red-500' :
              question.moduleId === 'momentum' ? 'bg-rose-500' :
              question.moduleId === 'electricity' ? 'bg-purple-500' :
              'bg-slate-600'
            }`}>
              <span>Materi Topik</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md">{question.module}</span>
            </div>

            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl leading-relaxed font-semibold dark:text-white">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {question.options.map((opt, i) => {
                  let btnState = "outline"
                  let icon = null
                  let bgClass = "hover:bg-slate-50 dark:hover:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                  
                  if (isSubmitted) {
                    if (i === question.correct) {
                      btnState = "default"
                      bgClass = "bg-green-500 hover:bg-green-600 text-white border-green-500 ring-2 ring-green-200 dark:ring-green-900 ring-offset-1 dark:ring-offset-slate-900"
                      icon = <CheckCircle2 size={18} className="ml-2 flex-shrink-0" />
                    } else if (i === selected) {
                      btnState = "default"
                      bgClass = "bg-red-500 hover:bg-red-600 text-white border-red-500"
                      icon = <XCircle size={18} className="ml-2 flex-shrink-0" />
                    } else {
                      bgClass = "opacity-50 border-gray-200 dark:border-slate-700 dark:text-gray-400"
                    }
                  } else if (selected === i) {
                    bgClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                  }

                  return (
                    <Button
                      key={i}
                      variant={btnState as any}
                      className={`w-full justify-start h-auto py-4 px-6 text-left break-words whitespace-normal transition-all rounded-xl ${bgClass}`}
                      onClick={() => !isSubmitted && setSelected(i)}
                    >
                      <span className="flex-1 font-medium">{opt}</span>
                      {icon}
                    </Button>
                  )
                })}
              </div>

              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-xl mt-4"
                >
                  <h4 className="flex items-center gap-2 font-bold text-indigo-800 dark:text-indigo-400 mb-2">
                    <Info size={18} /> Penjelasan
                  </h4>
                  <p className="text-sm text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                    {question.explanation}
                  </p>
                </motion.div>
              )}

              <div className="pt-6 flex justify-end">
                {!isSubmitted ? (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={selected === null}
                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] font-semibold rounded-xl"
                  >
                    Kirim Jawaban
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    className="bg-gray-800 hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white min-w-[120px] font-semibold rounded-xl shadow-md shadow-gray-200 dark:shadow-none"
                  >
                    {currentIdx < activeQuestions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Skor Akhir'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
