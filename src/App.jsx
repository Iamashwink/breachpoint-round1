import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { GameProvider } from "./context/GameContext"
import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import Dashboard from "./pages/Dashboard"
import ChoosePath from "./pages/ChoosePath"
import PathView from "./pages/PathView"
import Challenge from "./pages/Challenge"
import Leaderboard from "./pages/Leaderboard"
import MapPage from "./pages/MapPage"
import { TimeGlitchStart, TimeGlitchStop } from "./pages/TimeGlitch"
import EchoChallenge from "./pages/EchoChallenge"

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="choose-path" element={<ChoosePath />} />
            <Route path="path/:pathId" element={<PathView />} />
            <Route path="path/:pathId/node/:nodeId" element={<Challenge />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="map" element={<MapPage />} />
            <Route path="echo" element={<EchoChallenge />} />
          </Route>
          <Route path="/glitch/start" element={<TimeGlitchStart />} />
          <Route path="/glitch/stop" element={<TimeGlitchStop />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}
