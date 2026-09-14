import { useNavigate, useParams } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { PATHS } from "../data/mockData"
import NodeTrail from "../components/NodeTrail"

export default function PathView() {
  const { pathId } = useParams()
  const { nodes } = useGame()
  const navigate = useNavigate()

  const path = PATHS[pathId]
  const list = nodes[pathId]

  if (!path || !list) return null

  const resolvedCount = list.filter((n) => n.status === "completed" || n.status === "skipped").length
  const currentChallenge = list.find((n) => n.status === "unlocked")

  return (
    <div className="path-view-container">
      <div className="path-view-header">
        <div>
          <div className="section-title" style={{ color: path.color, marginBottom: 6 }}>
            {path.name} · {path.codename.toUpperCase()}
          </div>
          <div className="path-view-subtitle">
            <span>LOCATION: {path.location.toUpperCase()}</span>
            <span className="divider">/</span>
            <span>TRANSMISSION: LIVE</span>
            <span className="divider">/</span>
            <span>ROUTE: SIGNAL FLOW (01 → 10)</span>
          </div>
        </div>

        <div className="path-view-stats">
          <div className="stat-pill" style={{ borderColor: path.color }}>
            <span className="stat-label">RESOLVED</span>
            <span className="stat-val" style={{ color: path.color }}>
              {resolvedCount} / {list.length}
            </span>
          </div>
          {currentChallenge && (
            <div className="stat-pill stat-pill-active">
              <span className="live-signal-dot" style={{ background: path.color }} />
              <span className="stat-label">ACTIVE:</span>
              <span className="stat-val">{currentChallenge.title}</span>
            </div>
          )}
        </div>
      </div>

      <NodeTrail
        nodes={list}
        color={path.color}
        onNodeClick={(node) => navigate(`/app/path/${pathId}/node/${node.id}`)}
      />
    </div>
  )
}

