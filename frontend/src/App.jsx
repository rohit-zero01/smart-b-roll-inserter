import { useEffect, useState } from "react";

function App() {
  const [transcript, setTranscript] = useState([]);
  const [timeline, setTimeline] = useState({ insertions: [] });

  useEffect(() => {
    fetch("/transcript.json")
      .then(res => res.json())
      .then(setTranscript);

    fetch("/timeline.json")
      .then(res => res.json())
      .then(setTimeline);
  }, []);

  return (
  <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: "40px 0" }}>
    <div style={styles.container}>
      <h1 style={styles.title}>Smart B-Roll Inserter</h1>
      <p style={styles.subtitle}>
        Automatically plan where B-roll visuals should appear in a UGC video
      </p>

      {/* Action */}
      <div style={styles.section}>
        <button style={styles.button}>Generate B-Roll Plan</button>
      </div>

      {/* Transcript */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transcript Timeline</h2>

        {transcript.map((seg, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.time}>
              {seg.start_sec.toFixed(1)}s – {seg.end_sec.toFixed(1)}s
            </div>
            <div>{seg.text}</div>
          </div>
        ))}
      </div>

      {/* B-roll Plan */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>B-Roll Insertions</h2>

        {timeline.insertions.length === 0 && (
          <p style={styles.muted}>No B-roll insertions generated.</p>
        )}

        {timeline.insertions.map((item, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.badge}>🎬 {item.broll_id}</div>
            <div style={styles.time}>
              At {item.start_sec}s for {item.duration_sec}s
            </div>
            <div style={styles.reason}>{item.reason}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    backgroundColor: "#fafafa",
    color: "#1f2937",
  },
  title: {
    fontSize: "28px",
    marginBottom: "6px",
    fontWeight: 600,
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "28px",
    fontSize: "14.5px",
  },
  section: {
    marginBottom: "36px",
  },
  sectionTitle: {
    marginBottom: "14px",
    fontSize: "18px",
    fontWeight: 500,
    color: "#111827",
  },
  button: {
    padding: "10px 16px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    background: "#ffffff",
    color: "#111827",
  },
  card: {
    background: "#ffffff",
    padding: "14px 16px",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
  },
  time: {
    fontSize: "12.5px",
    color: "#6b7280",
    marginBottom: "6px",
  },
  badge: {
    display: "inline-block",
    background: "#f3f4f6",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    marginBottom: "6px",
  },
  reason: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  muted: {
    color: "#9ca3af",
    fontSize: "14px",
  },
};


export default App;
