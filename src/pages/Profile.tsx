import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Save, Quote, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

const AVATAR_SEEDS = [
  "Einstein",
  "Newton",
  "Curie",
  "Tesla",
  "Galileo",
  "Feynman",
  "Bohr",
  "Hawking",
  "Hubble",
  "Faraday",
  "Maxwell",
  "Oppenheimer"
];

export default function Profile() {
  const { userProfile, setUserProfile } = useStore();
  
  const [name, setName] = useState(userProfile?.name || 'Fisikawan Muda');
  const [quote, setQuote] = useState(userProfile?.quote || 'Teruslah bertanya mengapa.');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatarId || 'Einstein');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(userProfile?.name || 'Fisikawan Muda');
    setQuote(userProfile?.quote || 'Teruslah bertanya mengapa.');
    setSelectedAvatar(userProfile?.avatarId || 'Einstein');
  }, [userProfile]);

  const handleSave = () => {
    setUserProfile({
      name,
      quote,
      avatarId: selectedAvatar
    });
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <User className="text-blue-500" />
            Profil Virtual
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Personalisasi identitas fisikawan Anda. Tampil beda dengan avatar dan kutipan favorit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Kolom Kiri: Form & Preview */}
        <div className="space-y-6">
          <Card className="dark:bg-slate-900 border-2 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAvatar}`} 
                    alt="Avatar Preview" 
                    className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>
            <CardContent className="pt-14 pb-8 text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{name || 'Fisikawan Muda'}</h2>
              <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm italic">
                <Quote size={14} className="mr-1 inline -translate-y-1 opacity-50" />
                {quote || 'Belum ada kutipan.'}
                <Quote size={14} className="ml-1 inline translate-y-1 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-900 border-2 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Fisikawan</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  placeholder="Masukkan nama Anda..."
                  maxLength={25}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kutipan Motivasi (Quote)</label>
                <textarea 
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none dark:text-white"
                  placeholder="Misal: Imajinasi lebih penting daripada pengetahuan."
                  rows={3}
                  maxLength={60}
                />
                <div className="text-xs text-right text-slate-400">
                  {quote.length}/60 karakter
                </div>
              </div>

              <Button 
                className="w-full py-6 font-bold text-md flex gap-2" 
                onClick={handleSave}
                variant={isSaved ? "secondary" : "default"}
              >
                {isSaved ? <Sparkles size={18} /> : <Save size={18} />}
                {isSaved ? 'Tersimpan!' : 'Simpan Profil'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Galeri Avatar */}
        <div className="md:col-span-2">
          <Card className="dark:bg-slate-900 border-2 shadow-sm h-full">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Galeri Robot Bottts
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pilih avatar robot pendamping untuk menemani eksplorasi Anda.
              </p>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setSelectedAvatar(seed)}
                    className={`
                      group relative aspect-square rounded-xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center p-2
                      ${selectedAvatar === seed 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-4 ring-blue-500/20' 
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-100 dark:hover:bg-slate-800/80'}
                    `}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`} 
                      alt={seed}
                      className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    />
                    <div className="absolute bottom-2 text-[10px] font-bold text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {seed}
                    </div>
                    
                    {selectedAvatar === seed && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
