import fs from "fs";
import path from "path";

// Load transcript (Step 1 output)
const transcript = JSON.parse(
  fs.readFileSync(path.join("output", "transcript.json"), "utf-8")
);

// Load B-roll metadata (Step 2 output)
const brolls = JSON.parse(
  fs.readFileSync(path.join("backend", "broll_metadata.json"), "utf-8")
);

// Simple keyword-based matching rules
function matchBroll(text) {
  const lower = text.toLowerCase();

  if (lower.includes("hygiene") || lower.includes("safe")) {
    return "broll_3"; // uncovered food / hygiene concern
  }

  if (lower.includes("clean") || lower.includes("kitchen")) {
    return "broll_4"; // clean kitchen
  }

  if (lower.includes("healthy") || lower.includes("health")) {
    return "broll_6"; // healthy closing shot
  }

  return null;
}

const insertions = [];

// Build timeline
for (const segment of transcript) {
  const brollId = matchBroll(segment.text);

  if (brollId) {
    insertions.push({
      start_sec: segment.start_sec,
      duration_sec: Math.min(2.5, segment.end_sec - segment.start_sec),
      broll_id: brollId,
      reason: `Matched visual concept for: "${segment.text}"`
    });
  }
}

const timeline = {
  a_roll_duration_sec:
    transcript.length > 0 ? transcript[transcript.length - 1].end_sec : 0,
  insertions
};

// Save output
fs.writeFileSync(
  path.join("output", "timeline.json"),
  JSON.stringify(timeline, null, 2)
);

console.log("Timeline plan generated: output/timeline.json");
