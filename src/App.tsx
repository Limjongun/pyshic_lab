import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import Home from "./pages/Home"
import LabIndex from "./pages/LabIndex"
import ParabolaLab from "./pages/ParabolaLab"
import InclinedPlaneLab from "./pages/InclinedPlaneLab"
import PendulumLab from "./pages/PendulumLab"
import GravitasiLab from "./pages/GravitasiLab"
import OpticsLab from "./pages/OpticsLab"
import WavesLab from "./pages/WavesLab"
import CatapultLab from "./pages/CatapultLab"
import FluidLab from "./pages/FluidLab"
import ThermodynamicsLab from "./pages/ThermodynamicsLab"
import CircuitLab from "./pages/CircuitLab"
import MagnetLab from "./pages/MagnetLab"
import BernoulliLab from "./pages/BernoulliLab"
import FaradayLab from "./pages/FaradayLab"
import RotasiLab from "./pages/RotasiLab"
import DopplerLab from "./pages/DopplerLab"
import CannonLab from "./pages/CannonLab"
import TorricelliLab from "./pages/TorricelliLab"
import CarnotLab from "./pages/CarnotLab"
import SandboxUniverse from "./pages/SandboxUniverse"
import AdvanceLab from "./pages/AdvanceLab"
import Calculator from "./pages/Calculator"
import Learn from "./pages/Learn"
import Achievements from "./pages/Achievements"
import Kinematika from "./pages/learn/Kinematika"
import Dinamika from "./pages/learn/Dinamika"
import Energi from "./pages/learn/Energi"
import Momentum from "./pages/learn/Momentum"
import Fluida from "./pages/learn/Fluida"
import Termodinamika from "./pages/learn/Termodinamika"
import Elektromagnetik from "./pages/learn/Elektromagnetik"
import Gelombang from "./pages/learn/Gelombang"
import Quiz from "./pages/Quiz"
import Journal from "./pages/Journal"
import Challenges from "./pages/Challenges"
import ChallengeParabola from "./pages/challenges/ChallengeParabola"
import ChallengeGravity from "./pages/challenges/ChallengeGravity"
import ChallengeOptics from "./pages/challenges/ChallengeOptics"
import ChallengeVehicle from "./pages/challenges/ChallengeVehicle"
import Help from "./pages/Help"
import Crossword from "./pages/Crossword"
import Profile from "./pages/Profile"
import Landing from "./pages/Landing"
import { useStore } from "./store/useStore"
import { useEffect } from "react"

function DummyPage({ title }: { title: string }) {
  return <div className="p-8 bg-white rounded-xl border flex items-center justify-center h-64"><h2 className="text-2xl font-bold text-gray-400">{title} - Segera Hadir</h2></div>
}

export default function App() {
  const { theme } = useStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/kinematika" element={<Kinematika />} />
          <Route path="learn/dinamika" element={<Dinamika />} />
          <Route path="learn/energi" element={<Energi />} />
          <Route path="learn/momentum" element={<Momentum />} />
          <Route path="learn/fluida" element={<Fluida />} />
          <Route path="learn/termodinamika" element={<Termodinamika />} />
          <Route path="learn/elektromagnetik" element={<Elektromagnetik />} />
          <Route path="learn/gelombang" element={<Gelombang />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="lab" element={<LabIndex />} />
          <Route path="lab/parabola" element={<ParabolaLab />} />
          <Route path="lab/inclined-plane" element={<InclinedPlaneLab />} />
          <Route path="lab/pendulum" element={<PendulumLab />} />
          <Route path="lab/gravity" element={<GravitasiLab />} />
          <Route path="lab/optics" element={<OpticsLab />} />
          <Route path="lab/waves" element={<WavesLab />} />
          <Route path="lab/catapult" element={<CatapultLab />} />
          <Route path="lab/fluid" element={<FluidLab />} />
          <Route path="lab/thermodynamics" element={<ThermodynamicsLab />} />
          <Route path="lab/circuit" element={<CircuitLab />} />
          <Route path="lab/magnet" element={<MagnetLab />} />
          <Route path="lab/bernoulli" element={<BernoulliLab />} />
          <Route path="lab/faraday" element={<FaradayLab />} />
          <Route path="lab/rotasi" element={<RotasiLab />} />
          <Route path="lab/doppler" element={<DopplerLab />} />
          <Route path="lab/cannon" element={<CannonLab />} />
          <Route path="lab/torricelli" element={<TorricelliLab />} />
          <Route path="lab/carnot" element={<CarnotLab />} />
          <Route path="journal" element={<Journal />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="sandbox" element={<SandboxUniverse />} />
          <Route path="advance-lab" element={<AdvanceLab />} />
          
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/parabola" element={<ChallengeParabola />} />
          <Route path="challenges/gravity" element={<ChallengeGravity />} />
          <Route path="challenges/optics" element={<ChallengeOptics />} />
          <Route path="challenges/vehicle" element={<ChallengeVehicle />} />
          
          <Route path="achievements" element={<DummyPage title="Achievements" />} />
          <Route path="progress" element={<DummyPage title="Progress" />} />
          <Route path="crossword" element={<Crossword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
