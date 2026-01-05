import { useEffect, useState } from "react";

function App() {
  const [transcript, setTranscript] = useState([]);
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    fetch("/transcript.json")
      .then(res => res.json())
      .then(data => setTranscript(data));

    fetch("/timeline.json")
      .then(res => res.json())
      .then(data => setTimeline(data));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Smart B-Roll Inserter</h1>

      <h2>Transcript</h2>
      <ul>
        {transcript.map((seg, idx) => (
          <li key={idx}>
            <strong>{seg.start_sec.toFixed(1)}s–{seg.end_sec.toFixed(1)}s:</strong>{" "}
            {seg.text}
          </li>
        ))}
      </ul>

      <h2>B-Roll Timeline</h2>
      <pre>{JSON.stringify(timeline, null, 2)}</pre>
    </div>
  );
}

export default App;
