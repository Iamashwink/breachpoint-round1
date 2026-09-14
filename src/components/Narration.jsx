import { useEffect, useRef, useState } from "react"

export default function Narration({ character, lines, accent = "var(--accent)", onDone }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [typed, setTyped] = useState("")
  const timerRef = useRef(null)

  const fullLine = lines[lineIndex] || ""

  useEffect(() => {
    setTyped("")
    let i = 0
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      i += 1
      setTyped(fullLine.slice(0, i))
      if (i >= fullLine.length) clearInterval(timerRef.current)
    }, 18)
    return () => clearInterval(timerRef.current)
  }, [lineIndex, fullLine])

  const isTyping = typed.length < fullLine.length

  const handleNext = () => {
    if (isTyping) {
      clearInterval(timerRef.current)
      setTyped(fullLine)
      return
    }
    if (lineIndex + 1 < lines.length) {
      setLineIndex(lineIndex + 1)
    } else {
      onDone?.()
    }
  }

  const handleBack = () => {
    if (lineIndex > 0) setLineIndex(lineIndex - 1)
  }

  return (
    <div className="narration-screen">
      <div className="panel narration-box">
        <div className="narration-topbar">
          <span className="narration-character" style={{ background: accent }}>
            {character}
          </span>
          <div className="narration-buttons">
            <button className="btn" onClick={handleBack} disabled={lineIndex === 0}>Back</button>
            <button className="btn" onClick={() => onDone?.()}>Skip</button>
          </div>
        </div>
        <div className="narration-content">
          <div className="portrait">Portrait</div>
          <p className="narration-text">{typed}</p>
        </div>
        <div className="narration-footer">
          <div className="dot-progress">
            {lines.map((_, i) => (
              <span key={i} className={`dot ${i <= lineIndex ? "active" : ""}`} />
            ))}
          </div>
          <button className="btn btn-accent" onClick={handleNext}>
            {isTyping ? "Skip line" : lineIndex + 1 < lines.length ? "Next" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  )
}
