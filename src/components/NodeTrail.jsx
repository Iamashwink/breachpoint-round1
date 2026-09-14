import { useMemo, useState } from "react"

const WIDTH = 1160
const HEIGHT = 380
const NODE_R = 25

export default function NodeTrail({ nodes, color, onNodeClick, disabledClick }) {
  const [hovered, setHovered] = useState(null)

  // 1. Equal-level node placement along harmonic wave:
  // - Valleys at y = 280: Node 01, Node 06, Node 10
  // - Peaks at y = 80: Node 04, Node 08
  // - Midline at y = 180: Node 05, Node 07, Node 09
  // - S-curve climb steps: Node 02 (y = 230), Node 03 (y = 130)
  const points = useMemo(() => {
    const baseCoords = [
      { x: 80, y: 280 },   // Node 01: Valley level (start)
      { x: 190, y: 230 },  // Node 02: Rising lower-mid
      { x: 300, y: 130 },  // Node 03: Rising upper-mid
      { x: 420, y: 80 },   // Node 04: Peak 1 crest (top level)
      { x: 535, y: 180 },  // Node 05: Descending midline (mid level)
      { x: 645, y: 280 },  // Node 06: Valley 1 trough (bottom level)
      { x: 755, y: 180 },  // Node 07: Rising midline (mid level)
      { x: 865, y: 80 },   // Node 08: Peak 2 crest (top level)
      { x: 975, y: 180 },  // Node 09: Descending midline (mid level)
      { x: 1080, y: 280 }  // Node 10: Valley 2 trough (bottom level)
    ]

    const N = nodes.length
    if (N === 0) return []
    if (N === 10) return baseCoords

    return nodes.map((_, i) => {
      const t = i / (N - 1)
      const sampleIdx = t * (baseCoords.length - 1)
      const idx0 = Math.floor(sampleIdx)
      const idx1 = Math.min(idx0 + 1, baseCoords.length - 1)
      const frac = sampleIdx - idx0
      return {
        x: Math.round(baseCoords[idx0].x + (baseCoords[idx1].x - baseCoords[idx0].x) * frac),
        y: Math.round(baseCoords[idx0].y + (baseCoords[idx1].y - baseCoords[idx0].y) * frac),
      }
    })
  }, [nodes])

  // 2. Natural smooth continuous spline with horizontal tangents at crests and valleys
  const segments = useMemo(() => {
    if (points.length < 2) return []

    const n = points.length

    // Compute tangents at each point with horizontal slope (ty = 0) at crests and valleys
    const tangents = points.map((p, i) => {
      // Crests: Node 04 (idx 3) and Node 08 (idx 7) are horizontal peaks
      if (i === 3 || i === 7) {
        const prev = points[i - 1]
        const next = points[i + 1]
        return { x: (next.x - prev.x) / 2, y: 0 }
      }
      // Valleys: Node 06 (idx 5) and Node 10 (idx 9) are horizontal troughs
      if (i === 5 || i === 9) {
        const prev = points[i - 1]
        const next = i < n - 1 ? points[i + 1] : { x: p.x + (p.x - points[i - 1].x), y: p.y }
        return { x: (next.x - prev.x) / 2, y: 0 }
      }
      // Start: Node 01 (idx 0) heading up into Node 02
      if (i === 0) {
        const next = points[1]
        return { x: next.x - p.x, y: (next.y - p.y) * 0.7 }
      }
      // General points: central difference
      const prev = points[i - 1]
      const next = points[i + 1]
      return { x: (next.x - prev.x) / 2, y: (next.y - prev.y) / 2 }
    })

    const segs = []
    for (let i = 0; i < n - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const t0 = tangents[i]
      const t1 = tangents[i + 1]

      const c1 = { x: Math.round(p0.x + t0.x / 3), y: Math.round(p0.y + t0.y / 3) }
      const c2 = { x: Math.round(p1.x - t1.x / 3), y: Math.round(p1.y - t1.y / 3) }

      const d = `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`
      segs.push({ from: i, to: i + 1, d })
    }
    return segs
  }, [points])

  // 3. Identify current active challenge
  const currentIdx = nodes.findIndex((n) => n.status === "unlocked")
  const allCompleted = nodes.length > 0 && nodes.every((n) => n.status === "completed" || n.status === "skipped")

  return (
    <div className="node-trail-scroll-wrapper">
      <div
        className="node-trail-canvas"
        style={{
          "--path-color": color,
        }}
      >
        {/* Background SVG with subtle cyber grid, vertical guidelines, and animated wave path */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="node-trail-svg"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            {/* Glowing neon drop-shadow filter */}
            <filter id={`trail-glow-${color.replace("#", "")}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle background grid pattern */}
            <pattern id="trail-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Cyber grid overlay */}
          <rect width={WIDTH} height={HEIGHT} fill="url(#trail-grid)" />

          {/* Vertical subtle track guide lines (matching reference image) */}
          {[420, 645, 865].map((gx) => (
            <line
              key={gx}
              x1={gx}
              y1="0"
              x2={gx}
              y2={HEIGHT}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          ))}

          {/* Corner target markings */}
          <g opacity="0.25" stroke="var(--border)">
            <path d="M 16 32 L 16 16 L 32 16" fill="none" strokeWidth="1.5" />
            <path d={`M ${WIDTH - 32} 16 L ${WIDTH - 16} 16 L ${WIDTH - 16} 32`} fill="none" strokeWidth="1.5" />
            <path d={`M 16 ${HEIGHT - 32} L 16 ${HEIGHT - 16} L 32 ${HEIGHT - 16}`} fill="none" strokeWidth="1.5" />
            <path d={`M ${WIDTH - 32} ${HEIGHT - 16} L ${WIDTH - 16} ${HEIGHT - 16} L ${WIDTH - 16} ${HEIGHT - 32}`} fill="none" strokeWidth="1.5" />
          </g>

          {/* Smooth continuous wave path connecting all nodes */}
          {segments.map((seg, i) => {
            const isTillCurrent = allCompleted || (currentIdx !== -1 && i < currentIdx)
            const isFromCurrent = currentIdx !== -1 && i === currentIdx

            if (isTillCurrent) {
              // Completed / traversed segment: active glowing flowing dash animation
              return (
                <g key={`seg-active-${i}`}>
                  {/* Underglow layer */}
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={7}
                    strokeLinecap="round"
                    className="path-dash-underglow"
                  />
                  {/* Blinking & flowing dash line */}
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={2.8}
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    className="path-dash-active"
                    filter={`url(#trail-glow-${color.replace("#", "")})`}
                  />
                </g>
              )
            }

            if (isFromCurrent) {
              // Segment from current challenge to next node (subtle forward indicator)
              return (
                <g key={`seg-current-lead-${i}`}>
                  <path
                    d={seg.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    className="path-dash-forward-lead"
                  />
                </g>
              )
            }

            // Other / locked nodes: clearly visible dashed circuit track
            return (
              <path
                key={`seg-locked-${i}`}
                d={seg.d}
                fill="none"
                stroke="rgba(140, 180, 220, 0.45)"
                strokeWidth={2}
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="path-dash-locked"
              />
            )
          })}
        </svg>

        {/* Nodes positioned along the wave trajectory with percentage coordinates */}
        {nodes.map((node, i) => {
          const p = points[i]
          if (!p) return null

          const isCurrent = i === currentIdx
          const isSkipped = node.status === "skipped"
          const isCompleted = node.status === "completed"
          const clickable = !disabledClick && node.status !== "locked"

          // Exact percentage positions match the SVG viewBox (1160 x 380)
          const leftPct = (p.x / WIDTH) * 100
          const topPct = (p.y / HEIGHT) * 100

          return (
            <div
              key={node.id}
              className={`node-wrap ${isCurrent ? "node-wrap-current" : ""} ${isSkipped ? "node-wrap-skipped" : ""}`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip on hover */}
              {hovered === node.id && (
                <div className="node-tooltip">
                  <div className="node-tooltip-title">{node.title}</div>
                  <div className="node-tooltip-sub">
                    {node.category} · {node.difficulty} · {node.points} PTS
                  </div>
                  <div className="node-tooltip-status">STATUS: {node.status.toUpperCase()}</div>
                </div>
              )}

              {/* Current challenge badge (exact [YOU] box from reference image) */}
              {isCurrent && (
                <div className="current-target-badge">
                  <span>YOU</span>
                </div>
              )}

              {/* Radar expanding wave ripple rings around current challenge */}
              {isCurrent && (
                <>
                  <div className="current-ping-ring" style={{ "--node-color": color }} />
                  <div className="current-ping-ring ping-ring-delay" style={{ "--node-color": color }} />
                </>
              )}

              {/* Skipped Node Badge & Orbit Ring Animation */}
              {isSkipped && (
                <>
                  <div className="node-skipped-tag">
                    <span className="skipped-pulse-dot" />
                    <span>SKIPPED</span>
                  </div>
                  <div className="skipped-orbit-ring" />
                </>
              )}

              {/* Interactive Node Button with padded 2-digit index (matching reference art) */}
              <button
                className={`node-circle ${node.status} ${isCurrent ? "is-current" : ""}`}
                style={{ "--node-color": color }}
                disabled={!clickable}
                onClick={() => onNodeClick?.(node)}
                aria-label={`${node.title}: ${node.status}`}
              >
                {isSkipped ? (
                  <span className="skipped-chevron">»</span>
                ) : (
                  String(node.index).padStart(2, "0")
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}





