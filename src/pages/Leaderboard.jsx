import { useGame } from "../context/GameContext"
import { LEADERBOARD, PATHS } from "../data/mockData"

const PODIUM_HEIGHT = { 1: 120, 2: 90, 3: 70 }
const PODIUM_COLOR = { 1: "#e8b34d", 2: "#c7cdd6", 3: "#c17a4d" }

export default function Leaderboard() {
  const { team, pathPoints, totalPoints } = useGame()
  const top3 = LEADERBOARD.slice(0, 3)
  const rest = LEADERBOARD.slice(3)
  const order = [2, 1, 3]

  return (
    <div>
      <div className="section-title">LEADERBOARD</div>

      <div className="podium">
        {order.map((rank) => {
          const entry = top3.find((t) => t.rank === rank)
          return (
            <div className="podium-item" key={rank}>
              <span className="podium-team">{entry.team}</span>
              <span className="podium-points">{entry.points.toLocaleString()} pts</span>
              <div
                className="podium-bar"
                style={{ height: PODIUM_HEIGHT[rank], background: PODIUM_COLOR[rank] }}
              >
                {rank}
              </div>
            </div>
          )
        })}
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Path A</th>
            <th>Path B</th>
            <th>Path C</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rest.map((row) => (
            <tr key={row.rank}>
              <td>{row.rank}</td>
              <td>{row.team}</td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
              <td>{row.points.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="self-row">
            <td>—</td>
            <td>{team || "YOUR_TEAM"}</td>
            <td>{pathPoints("A")}</td>
            <td>{pathPoints("B")}</td>
            <td>{pathPoints("C")}</td>
            <td>{totalPoints}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
