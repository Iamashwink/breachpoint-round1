import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../context/GameContext"

export default function Login() {
  const [mode, setMode] = useState("signin")
  const [teamName, setTeamName] = useState("")
  const [password, setPassword] = useState("")
  const { setTeam } = useGame()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!teamName.trim()) return
    setTeam(teamName.trim())
    navigate("/app")
  }

  return (
    <div className="login-screen">
      <div className="login-left">
        <span className="brand-mark">AXIOS</span>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>BreachPoint</div>
          <div className="label-dim" style={{ marginBottom: 18 }}>ROUND 01 · LIVE CTF</div>
          <p style={{ color: "var(--text-dim)", maxWidth: 320, lineHeight: 1.7, fontSize: 13 }}>
            Three systems just said the same thing at the same time. Someone has to find out why.
          </p>
        </div>
        <div className="label-dim">SEC-LVL: CLASSIFIED</div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="tab-switch">
            <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
              SIGN IN
            </button>
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              SIGN UP
            </button>
          </div>

          <div className="field">
            <label>Team name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. NULL_ROUTE"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-accent" style={{ width: "100%", marginTop: 6 }}>
            {mode === "signin" ? "Enter" : "Create team"}
          </button>
        </form>
      </div>
    </div>
  )
}
