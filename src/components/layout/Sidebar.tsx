import { NavLink } from "react-router-dom"
import { Home, BookOpen, HelpCircle, FlaskConical, Target, Calculator, Info, Share2, LibraryBig, Box, Cpu, Grid3x3, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  
  const menuItems = [
    { name: "Beranda", icon: Home, path: "/app" },
    { name: "Belajar", icon: BookOpen, path: "/app/learn" },
    { name: "Kuis", icon: HelpCircle, path: "/app/quiz" },
    { name: "Lab Terarah", icon: FlaskConical, path: "/app/lab" },
    { name: "Sandbox", icon: Box, path: "/app/sandbox" },
    { name: "Advance Lab", icon: Cpu, path: "/app/advance-lab" },
    { name: "Jurnal Ilmiah", icon: LibraryBig, path: "/app/journal" },
    { name: "Tantangan", icon: Target, path: "/app/challenges" },
    { name: "Kalkulator", icon: Calculator, path: "/app/calculator" },
    { name: "Teka-Teki Fisika", icon: Grid3x3, path: "/app/crossword" },
    { name: "Profil Saya", icon: User, path: "/app/profile" },
    { name: "Bantuan", icon: Info, path: "/app/help" },
  ]

  return (
    <div className="w-64 border-r dark:border-slate-800 h-screen bg-white dark:bg-slate-900 flex flex-col justify-between hidden lg:flex fixed left-0 top-0 overflow-y-auto transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl mb-8 dark:text-white">
          <FlaskConical className="text-orange-500" />
          <span>PHYSICS <span className="text-orange-500">LAB</span></span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-orange-500 text-white font-medium shadow-md shadow-orange-200 dark:shadow-none" : "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-500"
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white flex gap-2 rounded-xl shadow-sm shadow-blue-200">
          <Share2 size={18} /> Bagikan Lab
        </Button>
        <p className="text-center text-xs text-gray-400 mt-4">Physics Lab v2.0.0</p>
      </div>
    </div>
  )
}
