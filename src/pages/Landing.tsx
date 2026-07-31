import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Box, Wifi, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col relative overflow-hidden">
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-12 lg:py-4 z-10 relative">
        
        {/* Decorative Circle Background */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl -z-10 hidden lg:block"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-3xl -z-10 hidden lg:block"></div>

        <div className="max-w-2xl lg:w-1/2 space-y-6 lg:pr-12">
          <div className="flex items-center gap-2 text-fuchsia-500 font-bold text-sm tracking-wider uppercase">
            <Zap size={16} className="fill-current" />
            <span>Simulasi Fisika Masa Depan</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight">
            PHYSICS THAT <br/>
            <span className="text-orange-500">EMPOWERS</span> <br/>
            EVERY DAY
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-md">
            Interaktif. Akurat. Menyenangkan.<br />
            Eksplorasi teknologi simulasi canggih yang dirancang khusus untuk meningkatkan cara Anda belajar.
          </p>
          
          <div className="pt-4">
            <button 
              onClick={() => navigate('/app')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105 shadow-lg shadow-orange-500/20 flex items-center gap-3"
            >
              Mulai Eksplorasi
              <div className="bg-white/20 text-white p-1 rounded-full">
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center perspective-1000">
          <img 
            src="/hero_banner.png" 
            alt="3D Physics Illustration" 
            className="w-full max-w-lg xl:max-w-xl object-contain drop-shadow-2xl animate-float"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
        </div>
      </main>

      {/* Bottom Features Section */}
      <div className="px-4 md:px-8 pb-8 z-10 w-full mt-auto">
        <div className="bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 text-white rounded-3xl p-8 md:p-12 w-full mx-auto max-w-7xl flex flex-col md:flex-row gap-10 justify-between items-start">
          
          <div className="md:w-1/4">
            <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6">Built for the future</p>
            <div className="space-y-4">
              <Box className="text-fuchsia-500" size={32} />
              <h3 className="font-bold text-lg uppercase tracking-wider text-slate-100">Desain Inovatif</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Dirancang dengan presisi untuk fokus pada kemudahan belajar interaktif di masa depan.</p>
            </div>
          </div>
          
          <div className="md:w-1/4 pt-10 md:pt-11 space-y-4">
            <Zap className="text-lime-400" size={32} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-100">Performa Tinggi</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Teknologi mesin fisika kecepatan tinggi yang dapat Anda andalkan setiap saat.</p>
          </div>

          <div className="md:w-1/4 pt-10 md:pt-11 space-y-4">
            <Wifi className="text-fuchsia-500" size={32} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-100">Konektivitas Mulus</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Tetap terhubung dan sinkronisasikan profil serta kemajuan Anda dengan mudah.</p>
          </div>

          <div className="md:w-1/4 pt-10 md:pt-11 space-y-4">
            <ShieldCheck className="text-lime-400" size={32} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-100">Penyimpanan Aman</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Data pembelajaran lokal Anda tersimpan kokoh dengan proteksi State modern.</p>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
