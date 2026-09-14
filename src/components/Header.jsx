import { useGame } from "../context/GameContext"

export default function Header() {
  const { team } = useGame()
  const initials = (team || "TM").slice(0, 2).toUpperCase()

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="brand-mark">AXIOS</span>
        <span className="divider">/</span>
        <span className="header-round">BREACHPOINT · ROUND 1</span>
      </div>
      <div className="header-right">
        <span className="label-dim">{team || "UNKNOWN_TEAM"}</span>
        <div className="avatar">{initials}</div>
      </div>
    </header>
  )
}
