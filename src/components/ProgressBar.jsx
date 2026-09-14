export default function ProgressBar({ value, color = "var(--accent)" }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}
