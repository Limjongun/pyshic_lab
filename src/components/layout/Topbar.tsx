import { Zap, Star, Moon, Sun, Bell, Award, LogOut, ChevronDown, User } from "lucide-react"
import { useStore } from "../../store/useStore"
import MusicPlayer from "../ui/MusicPlayer"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Topbar() {
  const { xp, level, energy, theme, toggleTheme, userProfile } = useStore()
  const navigate = useNavigate()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  return (
    <div className="flex items-center justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-20 transition-colors">
      <div>
        <h2 className="text-xl font-bold dark:text-white">Physics LAB</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Jelajahi keajaiban fisika interaktif</p>
      </div>
      
      <div className="hidden md:flex items-center gap-4">

        <MusicPlayer />
        
        <button 
          onClick={toggleTheme}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l dark:border-slate-800">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold dark:text-white">{userProfile?.name || 'Fisikawan Muda'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate" title={userProfile?.quote}>
              {userProfile?.quote || 'Pelajar Sains'}
            </span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden flex items-center justify-center p-0.5">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile?.avatarId || 'Einstein'}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 dark:ring-slate-800 border dark:border-slate-800 z-50">
                <div className="p-3 border-b dark:border-slate-800">
                  <p className="text-sm font-medium leading-none dark:text-white">{userProfile?.name}</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400 truncate mt-2">{userProfile?.quote}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => { setIsDropdownOpen(false); navigate('/app/profile'); }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </button>
                </div>
                <div className="p-1 border-t dark:border-slate-800">
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-md flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
