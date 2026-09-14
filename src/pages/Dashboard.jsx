import { useNavigate } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { BASE_STORY } from "../data/mockData"

export default function Dashboard() {
  const { unlockedPaths } = useGame()
  const navigate = useNavigate()

  return (
    <div className="story-block">
      <div className="section-title">TRANSMISSION ZERO</div>
      {BASE_STORY.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {unlockedPaths.length === 0 ? (
        <button className="btn btn-accent" onClick={() => navigate("/app/choose-path")}>
          Unlock a path
        </button>
      ) : (
        <button className="btn" onClick={() => navigate(`/app/path/${unlockedPaths[0]}`)}>
          Continue {unlockedPaths[0]}
        </button>
      )}
    </div>
  )
}
