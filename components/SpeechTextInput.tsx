"use client";

import { useState } from "react";

export default function SpeechTextInput() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "300px",
          marginRight: "10px"
        }}
      />
      <button
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
}
