import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { PATHS } from "../data/mockData"

export default function ChoosePath() {
  const [selected, setSelected] = useState(null)
  const { unlockPath, unlockedPaths } = useGame()
  const navigate = useNavigate()

  if (unlockedPaths.length > 0) {
    navigate("/app", { replace: true })
    return null
  }

  const confirm = () => {
    if (!selected) return
    unlockPath(selected)
    navigate(`/app/path/${selected}`)
  }

  return (
    <div>
      <div className="section-title">CHOOSE YOUR PATH</div>
      <div className="path-card-grid">
        {Object.values(PATHS).map((p) => (
          <div
            key={p.id}
            className={`panel path-card ${selected === p.id ? "selected" : ""}`}
            style={{ "--sel-color": p.color }}
            onClick={() => setSelected(p.id)}
          >
            <span className="path-dot" style={{ background: p.color }} />
            <h3>{p.codename}</h3>
            <span className="location">{p.location}</span>
            <p className="blurb">{p.blurb}</p>
          </div>
        ))}
      </div>

      <button className="btn btn-accent" style={{ marginTop: 24 }} disabled={!selected} onClick={confirm}>
        Confirm path
      </button>
    </div>
  )
}
