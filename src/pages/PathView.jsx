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

  if (!path) return null

  return (
    <div>
      <div className="section-title" style={{ color: path.color }}>
        {path.name} · {path.codename}
      </div>

      <NodeTrail
        nodes={list}
        color={path.color}
        onNodeClick={(node) => navigate(`/app/path/${pathId}/node/${node.id}`)}
      />
    </div>
  )
}
