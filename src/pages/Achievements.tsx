import React, { useState } from "react"
import { Award, Star, Lock, CheckCircle2, Zap } from "lucide-react"
import { useStore } from "../store/useStore"

const AVAILABLE_BADGES = [
  { id: "b1", title: "Siswa Penasaran", desc: "Melangkah pertama kali ke dunia simulasi.", cost: 100, icon: "🥉", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600" },
  { id: "b2", title: "Apel Newton", desc: "Memahami gaya gravitasi dengan sangat baik.", cost: 300, icon: "🍎", color: "bg-red-100 dark:bg-red-900/30 text-red-600" },
  { id: "b3", title: "Penguasa Lautan", desc: "Ahli mekanika fluida dan daya apung.", cost: 600, icon: "🌊", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
  { id: "b4", title: "Dewa Petir Tesla", desc: "Menguasai aliran listrik dan elektromagnetisme.", cost: 1000, icon: "⚡", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" },
  { id: "b5", title: "Einstein Reinkarnasi", desc: "Pencapaian tertinggi seorang fisikawan jenius.", cost: 3000, icon: "🌌", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
]

export default function Achievements() {
  const { xp, badges, buyBadge, energy } = useStore();
  const [toast, setToast] = useState<string | null>(null);

  const handleBuy = (badgeId: string, cost: number) => {
    if (buyBadge(badgeId, cost)) {
      setToast("Berhasil mendapatkan lencana baru!");
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast("XP tidak cukup!");
      setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
            <Award size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Pencapaian & Lencana</h1>
            <p className="text-slate-500 dark:text-slate-400">Tukar XP yang Anda kumpulkan dari kuis dan eksperimen dengan lencana langka.</p>
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="flex flex-col items-center justify-center bg-amber-50 dark:bg-amber-900/30 px-6 py-4 rounded-2xl border border-amber-100 dark:border-amber-800">
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">Total Energi</span>
            <span className="text-3xl font-black text-amber-600 flex items-center gap-2"><Zap size={24}/> {energy}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 px-6 py-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-1">XP Tersedia</span>
            <span className="text-3xl font-black text-indigo-600 flex items-center gap-2"><Star size={24}/> {xp}</span>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      {/* BADGES GRID */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white px-2">Katalog Lencana Eksklusif</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {AVAILABLE_BADGES.map((b) => {
          const isOwned = badges.includes(b.id);
          const canAfford = xp >= b.cost;

          return (
            <div key={b.id} className={`relative flex flex-col bg-white dark:bg-slate-900 border ${isOwned ? 'border-indigo-400 dark:border-indigo-500 shadow-indigo-100 dark:shadow-indigo-900/20 shadow-xl' : 'border-slate-200 dark:border-slate-800'} rounded-3xl p-6 transition-all duration-300`}>
              
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${isOwned ? b.color : 'bg-slate-100 dark:bg-slate-800 opacity-50 grayscale'}`}>
                  {b.icon}
                </div>
                {isOwned ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} /> Dimiliki
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <Lock size={14} /> Terkunci
                  </span>
                )}
              </div>

              <h3 className={`text-xl font-bold mb-2 ${isOwned ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {b.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-500 text-sm mb-6 flex-1">
                {b.desc}
              </p>

              {!isOwned && (
                <button 
                  onClick={() => handleBuy(b.id, b.cost)}
                  disabled={!canAfford}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    canAfford 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Star size={18} /> Tukar {b.cost} XP
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
}
