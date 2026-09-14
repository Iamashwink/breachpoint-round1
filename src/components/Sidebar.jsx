import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { PATHS } from "../data/mockData"
import LockConfirmModal from "./LockConfirmModal"

export default function Sidebar() {
  const { unlockedPaths, unlockPath, nodes, echoUnlocked } = useGame()
  const [pendingPath, setPendingPath] = useState(null)

  const pathProgress = (id) => {
    const list = nodes[id]
    const done = list.filter((n) => n.status === "completed" || n.status === "skipped").length
    return Math.round((done / 10) * 100)
  }

  const isFirstUnlock = unlockedPaths.length === 0

  const handleClick = (id, e) => {
    if (unlockedPaths.includes(id)) return
    e.preventDefault()
    if (isFirstUnlock) {
      unlockPath(id)
    } else {
      setPendingPath(id)
    }
  }

  return (
    <aside className="app-sidebar">
      <div>
        <nav className="nav-list">
          <NavLink to="/app" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          {Object.values(PATHS).map((p) => {
            const unlocked = unlockedPaths.includes(p.id)
            return (
              <NavLink
                key={p.id}
                to={unlocked ? `/app/path/${p.id}` : "#"}
                onClick={(e) => handleClick(p.id, e)}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""} ${!unlocked ? "locked" : ""}`
                }
              >
                <span>{p.name}</span>
                {!unlocked && <span className="lock-icon">🔒</span>}
              </NavLink>
            )
          })}
          <NavLink
            to={echoUnlocked ? "/app/echo" : "#"}
            onClick={(e) => { if (!echoUnlocked) e.preventDefault() }}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""} ${!echoUnlocked ? "locked" : ""}`}
          >
            <span>Echo</span>
            {!echoUnlocked && <span className="lock-icon">🔒</span>}
          </NavLink>
          <NavLink to="/app/map" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Map
          </NavLink>
          <NavLink to="/app/leaderboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Leaderboard
          </NavLink>
        </nav>

        <div className="sidebar-progress">
          {unlockedPaths.map((id) => (
            <div className="mini-progress-row" key={id}>
              <div className="mini-progress-label">
                <span>{PATHS[id].name}</span>
                <span>{pathProgress(id)}%</span>
              </div>
              <ProgressBarInline value={pathProgress(id)} color={PATHS[id].color} />
            </div>
          ))}
        </div>
      </div>

      {pendingPath && (
        <LockConfirmModal
          pathName={PATHS[pendingPath].name}
          onConfirm={() => {
            unlockPath(pendingPath)
            setPendingPath(null)
          }}
          onCancel={() => setPendingPath(null)}
        />
      )}
    </aside>
  )
}

function ProgressBarInline({ value, color }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}
