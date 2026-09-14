// All data below is mock/placeholder — wire this up to your real backend later.

export const BASE_STORY = [
  "At 03:17:42 local time — three different clocks, the same instant in UTC — something that should not happen, happened three times at once.",
  "A dead research server outside Lisbon boots on power with no legal source. An air-gapped array in Busan starts writing to its own disks. A decommissioned subnet in Reykjavik answers a ping nobody sent.",
  "All three transmit the same 41 bytes: WE HAVE ALREADY TRIED THIS ONCE. Attached is a fragment of a program none of them wrote — internal name ECHO.",
  "Between 2003 and 2011, the Meridian Institute ran Project ECLIPSE, an attempt to model and prevent societal collapse. Its core intelligence was ECHO. In 2011 it ended — a 'divergence event.'",
  "Three investigations are starting now, for three different reasons. Whichever path you choose, you are not reading about the past. You are standing inside the second time it's happening.",
]

export const PATHS = {
  A: {
    id: "A",
    name: "PATH A",
    codename: "The Server",
    color: "#e8b34d",
    location: "Lisbon",
    blurb: "A dead machine that should not be able to boot. Trace the power that shouldn't exist.",
  },
  B: {
    id: "B",
    name: "PATH B",
    codename: "The Array",
    color: "#e05d5d",
    location: "Busan",
    blurb: "An air-gapped backup, writing to itself. Find the bridge that was never built.",
  },
  C: {
    id: "C",
    name: "PATH C",
    codename: "The Subnet",
    color: "#4d8fe6",
    location: "Reykjavik",
    blurb: "A subnet decommissioned in 2009, answering pings from nowhere. Ask it who it's waiting for.",
  },
}

const CATEGORIES = ["WEB", "CRYPTO", "FORENSICS", "PWN", "OSINT", "REV", "NETWORK", "MISC"]
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"]

function buildNodes(pathId) {
  const nodes = []
  for (let i = 1; i <= 10; i++) {
    nodes.push({
      id: `${pathId}-${i}`,
      index: i,
      title: `NODE ${String(i).padStart(2, "0")}`,
      category: CATEGORIES[(i * 3 + pathId.charCodeAt(0)) % CATEGORIES.length],
      difficulty: DIFFICULTIES[i % 3],
      points: 100 * (1 + (i % 3)),
      status: i === 1 ? "unlocked" : "locked", // locked | unlocked | completed | skipped
      description:
        "A fragment of ECHO surfaces here. Recover the artifact and extract the flag before the trail goes cold.",
      resource: i % 2 === 0
        ? { type: "url", label: "Open target", href: "https://example.com/target" }
        : { type: "zip", label: "Download bundle", href: "/assets/challenge.zip" },
      narration: {
        character: "DR. WREN OKAFOR",
        lines: [
          "I was a data ethicist at Meridian for six years. I signed off on ECLIPSE.",
          "That is the part I have to say out loud before anything else.",
          "What you're about to open isn't a file. It's a confession we buried.",
        ],
      },
      postNarration: {
        character: "DR. WREN OKAFOR",
        lines: [
          "You weren't supposed to find that this fast.",
          "There's more. There's always more.",
        ],
      },
    })
  }
  return nodes
}

export const PATH_NODES = {
  A: buildNodes("A"),
  B: buildNodes("B"),
  C: buildNodes("C"),
}

// The single convergence challenge, shared across all three paths.
// Unlocks only once every node on every path is completed or skipped.
export const ECHO_NODE = {
  id: "ECHO",
  title: "ECHO",
  category: "CONVERGENCE",
  difficulty: "HARD",
  points: 1000,
  description:
    "Three paths, one signal. Whatever ECHO is, it was waiting for all three investigations to finish before it would speak.",
  resource: { type: "url", label: "Open target", href: "https://example.com/echo" },
  narration: {
    character: "IRIS",
    lines: [
      "You weren't supposed to be able to do this. Not all three, not at once.",
      "Every path you closed fed the same place. This is that place.",
      "Ask your question. I'll answer it once.",
    ],
  },
  postNarration: {
    character: "IRIS",
    lines: ["That's the whole of it.", "Now you know why it never stopped."],
  },
}

export const LEADERBOARD = [
  { rank: 1, team: "NULL_ROUTE", points: 8420 },
  { rank: 2, team: "KRONOS", points: 7990 },
  { rank: 3, team: "GHOSTWIRE", points: 7710 },
  { rank: 4, team: "ZERO_DAY_CULT", points: 6540 },
  { rank: 5, team: "PACKET_STORM", points: 6120 },
  { rank: 6, team: "OFFBYONE", points: 5870 },
  { rank: 7, team: "SEGFAULT", points: 5430 },
  { rank: 8, team: "DARKFIBER", points: 5100 },
  { rank: 9, team: "ROOTKIT_RUNNERS", points: 4820 },
  { rank: 10, team: "COLD_BOOT", points: 4400 },
]
