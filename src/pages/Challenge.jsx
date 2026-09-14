import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { PATHS } from "../data/mockData"
import Narration from "../components/Narration"

export default function Challenge() {
  const { pathId, nodeId } = useParams()
  const { nodes, setNodeStatus } = useGame()
  const navigate = useNavigate()

  const path = PATHS[pathId]
  const node = nodes[pathId]?.find((n) => n.id === nodeId)

  const alreadyResolved = node?.status === "completed" || node?.status === "skipped"
  const [phase, setPhase] = useState(alreadyResolved ? "challenge" : "pre")
  const [flag, setFlag] = useState("")
  const [error, setError] = useState("")

  const backToPath = () => navigate(`/app/path/${pathId}`)

  if (!path || !node) return null

  if (phase === "pre") {
    return (
      <Narration
        character={node.narration.character}
        lines={node.narration.lines}
        accent={path.color}
        onDone={() => setPhase("challenge")}
      />
    )
  }

  if (phase === "post") {
    return (
      <Narration
        character={node.postNarration.character}
        lines={node.postNarration.lines}
        accent={path.color}
        onDone={backToPath}
      />
    )
  }

  const submitFlag = (e) => {
    e.preventDefault()
    if (!flag.trim()) {
      setError("Enter a flag before submitting.")
      return
    }
    setNodeStatus(pathId, node.id, "completed")
    setError("")
    setPhase("post")
  }

  const skipChallenge = () => {
    setNodeStatus(pathId, node.id, "skipped")
    setPhase("post")
  }

  return (
    <div className="challenge-body">
      <div className="challenge-header">
        <div>
          <div className="section-title" style={{ color: path.color, marginBottom: 6 }}>
            {path.name} · {node.title}
          </div>
          <div className="challenge-tags">
            <span className="tag">{node.category}</span>
            <span className="tag">{node.difficulty}</span>
            <span className="tag">{node.points} PTS</span>
          </div>
        </div>
        <button className="btn" onClick={backToPath}>Back to path</button>
      </div>

      <p>{node.description}</p>

      {node.resource && (
        <div className="panel resource-box">
          <span className="label-dim">{node.resource.type === "zip" ? "DOWNLOAD" : "TARGET"}</span>
          <a className="btn" href={node.resource.href} target="_blank" rel="noreferrer">
            {node.resource.label}
          </a>
        </div>
      )}

      {alreadyResolved ? (
        <p className="label-dim">
          This node is marked {node.status.toUpperCase()}. You can review it, but it won't award points again.
        </p>
      ) : (
        <>
          <form className="flag-row" onSubmit={submitFlag}>
            <input
              type="text"
              placeholder="BreachPoint{...}"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
            />
            <button type="submit" className="btn btn-accent">Submit</button>
          </form>
          {error && <p style={{ color: "var(--danger)", fontSize: 12 }}>{error}</p>}

          <button className="btn btn-danger" style={{ marginTop: 16 }} onClick={skipChallenge}>
            Skip (80% points if returned to later)
          </button>
        </>
      )}
    </div>
  )
}
