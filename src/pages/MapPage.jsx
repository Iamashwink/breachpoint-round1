import { useNavigate } from "react-router-dom"
import { useGame } from "../context/GameContext"
import { PATHS } from "../data/mockData"

const ROW_Y = { A: 60, B: 170, C: 280 }
const CONVERGE_X = 820
const CONVERGE_Y = 170
const NODE_START_X = 50
const NODE_GAP = 56

export default function MapPage() {
  const { unlockedPaths, nodes, echoUnlocked, echoStatus } = useGame()
  const navigate = useNavigate()

  const pathDone = (id) => nodes[id].every((n) => n.status === "completed" || n.status === "skipped")
  const pathProgressCount = (id) => nodes[id].filter((n) => n.status === "completed" || n.status === "skipped").length

  const lastNodeX = NODE_START_X + 9 * NODE_GAP

  return (
    <div>
      <div className="section-title">CHALLENGE MAP</div>

      <div className="panel" style={{ padding: 24, marginBottom: 24, overflowX: "auto" }}>
        <svg viewBox="0 0 900 340" style={{ width: "100%", minWidth: 700, height: "auto" }}>
          {Object.values(PATHS).map((p) => {
            const y = ROW_Y[p.id]
            const unlocked = unlockedPaths.includes(p.id)
            const done = pathDone(p.id)
            const lineColor = unlocked ? p.color : "var(--border)"

            return (
              <g key={p.id}>
                {/* main path line */}
                <line
                  x1={NODE_START_X}
                  y1={y}
                  x2={lastNodeX}
                  y2={y}
                  stroke={lineColor}
                  strokeWidth={unlocked ? 2 : 1.5}
                  strokeDasharray={unlocked ? "0" : "4 6"}
                  opacity={unlocked ? 0.9 : 0.5}
                />
                {/* converging curve into ECHO */}
                <path
                  d={`M ${lastNodeX} ${y} C ${lastNodeX + 90} ${y}, ${CONVERGE_X - 90} ${CONVERGE_Y}, ${CONVERGE_X - 34} ${CONVERGE_Y}`}
                  fill="none"
                  stroke={done ? p.color : "var(--border)"}
                  strokeWidth={done ? 2 : 1.5}
                  strokeDasharray={done ? "0" : "4 6"}
                  opacity={done ? 0.9 : 0.4}
                />
                {/* node dots */}
                {nodes[p.id].map((n, i) => {
                  const cx = NODE_START_X + i * NODE_GAP
                  const resolved = n.status === "completed" || n.status === "skipped"
                  return (
                    <circle
                      key={n.id}
                      cx={cx}
                      cy={y}
                      r={7}
                      fill={resolved ? p.color : "var(--bg-panel)"}
                      stroke={unlocked ? p.color : "var(--border)"}
                      strokeWidth={1.5}
                    />
                  )
                })}
                <text x={NODE_START_X} y={y - 16} fill={unlocked ? p.color : "var(--text-faint)"} fontSize="12" fontFamily="var(--mono)">
                  {p.name} · {p.codename}
                </text>
              </g>
            )
          })}

          {/* ECHO convergence node */}
          <circle
            cx={CONVERGE_X}
            cy={CONVERGE_Y}
            r={34}
            fill={echoUnlocked ? "var(--echo)" : "var(--bg-panel)"}
            stroke="var(--echo)"
            strokeWidth={2}
            strokeDasharray={echoUnlocked ? "0" : "4 6"}
            style={{ cursor: echoUnlocked ? "pointer" : "default" }}
            onClick={() => echoUnlocked && navigate("/app/echo")}
          />
          <text
            x={CONVERGE_X}
            y={CONVERGE_Y + 5}
            fill={echoUnlocked ? "#06141c" : "var(--echo)"}
            fontSize="12"
            fontWeight="700"
            fontFamily="var(--mono)"
            textAnchor="middle"
          >
            ECHO
          </text>
          <text
            x={CONVERGE_X}
            y={CONVERGE_Y + 56}
            fill="var(--text-dim)"
            fontSize="11"
            fontFamily="var(--mono)"
            textAnchor="middle"
          >
            {echoStatus === "completed" ? "RESOLVED" : echoUnlocked ? "UNLOCKED" : "LOCKED"}
          </text>
        </svg>
      </div>

      <div className="map-grid">
        {Object.values(PATHS).map((p) => {
          const unlocked = unlockedPaths.includes(p.id)
          return (
            <div className="panel map-path-card" key={p.id}>
              <div className="map-path-header">
                <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
                <span className="label-dim">{unlocked ? "UNLOCKED" : "LOCKED"}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(pathProgressCount(p.id) / 10) * 100}%`, background: p.color }}
                />
              </div>
              <p className="blurb" style={{ marginTop: 10 }}>{p.blurb}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
