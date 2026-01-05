import fs from "fs";
import OpenAI from "openai";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribe() {
  console.log("Starting transcription...");

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(
      path.join("..", "assets", "a_roll.mp4")
    ),
    model: "whisper-1",
    response_format: "verbose_json",
  });

  const segments = response.segments.map(seg => ({
    start_sec: seg.start,
    end_sec: seg.end,
    text: seg.text.trim()
  }));

  fs.writeFileSync(
    path.join("..", "output", "transcript.json"),
    JSON.stringify(segments, null, 2)
  );

  console.log("✅ Transcript saved to output/transcript.json");
}

transcribe();
