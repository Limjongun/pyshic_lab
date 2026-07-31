import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { useStore } from "@/store/useStore"
import { useEffect } from "react"
import AIChatExtension from "./AIChatExtension"

export default function MainLayout() {
  const { theme } = useStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto relative">
          <Outlet />
        </main>
      </div>
      
      {/* Global AI Extension */}
      <AIChatExtension />
    </div>
  )
}
