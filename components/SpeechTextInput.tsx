"use client";

import { useState } from "react";

export default function SpeechTextInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      // Call Gemini API
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse(data.data.prompt);
        setText("");
      } else {
        setError(data.message || "Failed to generate prompt");
      }
    } catch (err) {
      setError("Error calling Gemini API: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "bold" }}>
        📝 AI Prompt Generator
      </h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Enter your schedule details here..."
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "100%",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          opacity: loading ? 0.6 : 1,
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate with Gemini"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
          ❌ {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f0f8ff",
            border: "1px solid #007bff",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
            ✅ AI Generated Schedule:
          </h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{response}</p>
        </div>
      )}
    </div>
  );
}