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

  // Hygiene / safety concerns
  if (
    lower.includes("hygiene") ||
    lower.includes("safe") ||
    lower.includes("gand") ||
    lower.includes("saaf nahi")
  ) {
    return "broll_3";
  }

  // Clean kitchen / preparation
  if (
    lower.includes("clean") ||
    lower.includes("kitchen") ||
    lower.includes("saaf") ||
    lower.includes("ghar")
  ) {
    return "broll_4";
  }

  // Healthy lifestyle / closing
  if (
    lower.includes("healthy") ||
    lower.includes("health") ||
    lower.includes("sehat")
  ) {
    return "broll_6";
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
