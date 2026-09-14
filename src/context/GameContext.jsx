import { createContext, useContext, useMemo, useState } from "react"
import { PATH_NODES, PATHS } from "../data/mockData"

const GameContext = createContext(null)

const STARTING_STATE = {
  team: "",
  unlockedPaths: [], // e.g. ["A"]
  nodes: JSON.parse(JSON.stringify(PATH_NODES)),
  eventLive: true,
}

export function GameProvider({ children }) {
  const [team, setTeam] = useState(STARTING_STATE.team)
  const [unlockedPaths, setUnlockedPaths] = useState(STARTING_STATE.unlockedPaths)
  const [nodes, setNodes] = useState(STARTING_STATE.nodes)
  const [eventLive, setEventLive] = useState(STARTING_STATE.eventLive)
  const [echoStatus, setEchoStatus] = useState("locked") // locked | unlocked | completed

  const unlockPath = (pathId) => {
    setUnlockedPaths((prev) => {
      if (prev.includes(pathId)) return prev
      const next = [...prev, pathId]
      setNodes((n) => ({
        ...n,
        [pathId]: n[pathId].map((node, i) => (i === 0 ? { ...node, status: "unlocked" } : node)),
      }))
      return next
    })
  }

  const setNodeStatus = (pathId, nodeId, status) => {
    setNodes((prev) => {
      const list = prev[pathId].map((n) => (n.id === nodeId ? { ...n, status } : n))
      const idx = list.findIndex((n) => n.id === nodeId)
      if ((status === "completed" || status === "skipped") && idx > -1 && idx + 1 < list.length) {
        if (list[idx + 1].status === "locked") list[idx + 1] = { ...list[idx + 1], status: "unlocked" }
      }
      const next = { ...prev, [pathId]: list }
      const allPathsDone = Object.keys(PATHS).every((id) =>
        next[id].every((n) => n.status === "completed" || n.status === "skipped")
      )
      if (allPathsDone) {
        setEchoStatus((s) => (s === "locked" ? "unlocked" : s))
      }
      return next
    })
  }

  const resetToStart = () => {
    setNodes(JSON.parse(JSON.stringify(PATH_NODES)))
    setUnlockedPaths((prev) => (prev.length ? [prev[0]] : []))
    setEventLive(true)
    setEchoStatus("locked")
  }

  const echoUnlocked = echoStatus !== "locked"

  const allPathsUnlocked = Object.keys(PATHS).every((id) => unlockedPaths.includes(id))

  const pathPoints = (pathId) =>
    nodes[pathId].reduce((sum, n) => {
      if (n.status === "completed") return sum + n.points
      if (n.status === "skipped") return sum + Math.round(n.points * 0.8)
      return sum
    }, 0)

  const totalPoints = useMemo(
    () => Object.keys(PATHS).reduce((sum, p) => sum + pathPoints(p), 0),
    [nodes]
  )

  const value = {
    team,
    setTeam,
    unlockedPaths,
    unlockPath,
    nodes,
    setNodeStatus,
    eventLive,
    setEventLive,
    resetToStart,
    pathPoints,
    totalPoints,
    echoStatus,
    setEchoStatus,
    echoUnlocked,
    allPathsUnlocked,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within GameProvider")
  return ctx
}
