import { useState } from "react"

// Relative vertical position (0 = top, 1 = bottom) for each node index,
// giving the trail the same up/down "signal" rhythm as the reference art.
const WAVE = [0.78, 0.4, 0.12, 0.35, 0.68, 0.92, 0.6, 0.25, 0.05, 0.32, 0.58]

const GAP_X = 108
const AMPLITUDE = 130
const NODE_R = 27

export default function NodeTrail({ nodes, color, onNodeClick, disabledClick }) {
  const [hovered, setHovered] = useState(null)

  const points = nodes.map((node, i) => ({
    x: NODE_R + i * GAP_X,
    y: NODE_R + WAVE[i % WAVE.length] * AMPLITUDE,
  }))

  const width = NODE_R * 2 + (nodes.length - 1) * GAP_X
  const height = NODE_R * 2 + AMPLITUDE

  const isTraversed = (i) => {
    const n = nodes[i]
    return n.status === "completed" || n.status === "skipped"
  }

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ position: "relative", width, height }}>
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          {points.slice(0, -1).map((p, i) => {
            const p2 = points[i + 1]
            const done = isTraversed(i)
            return (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={p2.x}
                y2={p2.y}
                stroke={done ? color : "var(--border)"}
                strokeWidth={done ? 2 : 1.5}
                strokeDasharray={done ? "0" : "4 5"}
                opacity={done ? 0.9 : 0.6}
              />
            )
          })}
        </svg>

        {nodes.map((node, i) => {
          const p = points[i]
          const clickable = !disabledClick && node.status !== "locked"
          return (
            <div
              key={node.id}
              className="node-wrap"
              style={{ position: "absolute", left: p.x - 46, top: p.y - NODE_R, width: 92 }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === node.id && (
                <div className="node-tooltip">{node.category} · {node.difficulty}</div>
              )}
              <button
                className={`node-circle ${node.status}`}
                style={{ "--node-color": color }}
                disabled={!clickable}
                onClick={() => onNodeClick?.(node)}
              >
                {node.status === "completed" ? "✓" : node.status === "skipped" ? "»" : node.index}
              </button>
              <span className="node-title">
                {node.title}
                {node.status === "skipped" && " (skipped)"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
