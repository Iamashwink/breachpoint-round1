import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { ECHO_NODE } from "../data/mockData"
import Narration from "../components/Narration"

export default function EchoChallenge() {
  const { echoStatus, setEchoStatus } = useGame()
  const navigate = useNavigate()
  const [phase, setPhase] = useState(echoStatus === "completed" ? "challenge" : "pre")
  const [flag, setFlag] = useState("")
  const [error, setError] = useState("")

  const backToMap = () => navigate("/app/map")

  if (phase === "pre") {
    return (
      <Narration
        character={ECHO_NODE.narration.character}
        lines={ECHO_NODE.narration.lines}
        accent="var(--echo)"
        onDone={() => setPhase("challenge")}
      />
    )
  }

  if (phase === "post") {
    return (
      <Narration
        character={ECHO_NODE.postNarration.character}
        lines={ECHO_NODE.postNarration.lines}
        accent="var(--echo)"
        onDone={backToMap}
      />
    )
  }

  const submitFlag = (e) => {
    e.preventDefault()
    if (!flag.trim()) {
      setError("Enter a flag before submitting.")
      return
    }
    setEchoStatus("completed")
    setError("")
    setPhase("post")
  }

  return (
    <div className="challenge-body">
      <div className="challenge-header">
        <div>
          <div className="section-title" style={{ color: "var(--echo)", marginBottom: 6 }}>
            CONVERGENCE · {ECHO_NODE.title}
          </div>
          <div className="challenge-tags">
            <span className="tag">{ECHO_NODE.category}</span>
            <span className="tag">{ECHO_NODE.difficulty}</span>
            <span className="tag">{ECHO_NODE.points} PTS</span>
          </div>
        </div>
        <button className="btn" onClick={backToMap}>Back to map</button>
      </div>

      <p>{ECHO_NODE.description}</p>

      <div className="panel resource-box">
        <span className="label-dim">TARGET</span>
        <a className="btn" href={ECHO_NODE.resource.href} target="_blank" rel="noreferrer">
          {ECHO_NODE.resource.label}
        </a>
      </div>

      {echoStatus === "completed" ? (
        <p className="label-dim">ECHO is resolved. The convergence is complete.</p>
      ) : (
        <form className="flag-row" onSubmit={submitFlag}>
          <input
            type="text"
            placeholder="BreachPoint{...}"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
          />
          <button type="submit" className="btn btn-accent">Submit</button>
        </form>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: 12 }}>{error}</p>}
    </div>
  )
}
