import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward } from 'lucide-react';

const TRACKS = [
  {
    title: "Ambient Focus 1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Ambient Focus 2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Ambient Focus 3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Ambient Focus 4",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35; // Soothing low volume
    }
  }, []);

  useEffect(() => {
    // When track changes (by nextTrack), we want to play it if it was already playing.
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Play blocked", e));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Call play() synchronously inside the click handler
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Playback blocked:", e);
          setIsPlaying(true); // Attempt to set state anyway to show UI
        });
      } else {
        setIsPlaying(true);
      }
    }
  };
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 shadow-sm ml-2 transition-colors">
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={nextTrack} 
        preload="auto"
      />
      
      <div className="flex items-center text-slate-500 dark:text-slate-400 shrink-0">
        <Music size={14} className={isPlaying ? "text-indigo-500 animate-pulse" : ""} />
      </div>
      
      <div className="hidden lg:block w-28 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {TRACKS[currentTrack].title}
        </span>
      </div>

      <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-700 pl-2 shrink-0">
        <button 
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Play/Pause"
        >
          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Next Track"
        >
          <SkipForward size={14} className="fill-current" />
        </button>
      </div>
    </div>
  );
}
