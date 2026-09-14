import { useGame } from "../context/GameContext"

export function TimeGlitchStart() {
  const { setEventLive } = useGame()
  return (
    <div className="glitch-screen">
      <div className="panel glitch-box glitch-anim">
        <div className="glitch-title" style={{ color: "var(--accent)" }}>TIME GLITCH ACTIVE</div>
        <p className="label-dim" style={{ marginBottom: 20 }}>
          The event has begun. Scores are live.
        </p>
        <button className="btn btn-accent" onClick={() => setEventLive(true)}>
          Acknowledge
        </button>
      </div>
    </div>
  )
}

export function TimeGlitchStop() {
  const { resetToStart } = useGame()
  return (
    <div className="glitch-screen">
      <div className="panel glitch-box glitch-anim">
        <div className="glitch-title" style={{ color: "var(--danger)" }}>TIME GLITCH</div>
        <p className="label-dim" style={{ marginBottom: 20 }}>
          All progress is being restored to the starting point.
        </p>
        <button className="btn btn-danger" onClick={resetToStart}>
          Confirm reset
        </button>
      </div>
    </div>
  )
}
