"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceInput() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);

  // Request microphone permission on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("❌ Speech Recognition not supported in your browser. Use Chrome, Edge, or Safari.");
      setMicPermission("denied");
      return;
    }

    // Request microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Permission granted, stop the stream
        stream.getTracks().forEach((track) => track.stop());
        setMicPermission("granted");
        setError("");

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = true; // Enable interim results for real-time feedback

        recognition.onstart = () => {
          setIsListening(true);
          setError("");
          setInterimText("");
        };

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              final += transcript + " ";
            } else {
              interim += transcript;
            }
          }

          if (interim) {
            setInterimText(interim);
          }

          if (final) {
            setText((prev) => prev + final);
            setInterimText("");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const errorMessage = event.error === "no-speech" 
            ? "⚠️ No speech detected. Please try again."
            : `❌ Error: ${event.error}`;
          setError(errorMessage);
          console.error("Speech error:", event.error);
        };

        recognitionRef.current = recognition;
      })
      .catch((err) => {
        setMicPermission("denied");
        setError(`❌ Microphone permission denied: ${err.message}`);
        console.error("Mic permission error:", err);
      });
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setText("");
    setInterimText("");
    setError("");
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearText = () => {
    setText("");
    setInterimText("");
    setError("");
  };

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h2>🎤 Voice to Text Demo</h2>

      {/* Permission Status */}
      <div style={{
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        backgroundColor: micPermission === "granted" ? "#d4edda" : "#f8d7da",
        color: micPermission === "granted" ? "#155724" : "#721c24",
        border: `1px solid ${micPermission === "granted" ? "#c3e6cb" : "#f5c6cb"}`,
      }}>
        {micPermission === "pending" && "⏳ Requesting microphone permission..."}
        {micPermission === "granted" && "✅ Microphone permission granted"}
        {micPermission === "denied" && "❌ Microphone permission denied. Please enable it in browser settings."}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
        }}>
          {error}
        </div>
      )}

      {/* Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={startListening}
          disabled={micPermission !== "granted" || isListening}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: micPermission === "granted" && !isListening ? "pointer" : "not-allowed",
            backgroundColor: isListening ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            opacity: micPermission === "granted" && !isListening ? 1 : 0.6,
          }}
        >
          {isListening ? "🔴 Listening..." : "🎤 Start Speaking"}
        </button>

        <button
          onClick={stopListening}
          disabled={!isListening}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: isListening ? "pointer" : "not-allowed",
            backgroundColor: "#ffc107",
            color: "#333",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            opacity: isListening ? 1 : 0.6,
          }}
        >
          ⏹️ Stop
        </button>

        <button
          onClick={clearText}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Live Interim Text (Real-time feedback) */}
      {interimText && (
        <div style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          backgroundColor: "#e2e3e5",
          color: "#383d41",
          border: "1px solid #d6d8db",
          fontStyle: "italic",
        }}>
          <strong>🔄 Listening:</strong> {interimText}
        </div>
      )}

      {/* Final Text Output */}
      <div style={{
        padding: "15px",
        borderRadius: "5px",
        backgroundColor: "#f0f0f0",
        border: "2px solid #007bff",
        minHeight: "100px",
      }}>
        <strong>📝 Transcribed Text:</strong>
        <p style={{
          margin: "10px 0 0 0",
          fontSize: "16px",
          color: "#333",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}>
          {text || "Your spoken text will appear here..."}
        </p>
      </div>

      {/* Status Info */}
      <div style={{
        marginTop: "20px",
        padding: "10px",
        fontSize: "12px",
        color: "#666",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
      }}>
        <p><strong>Status:</strong> {isListening ? "🔴 Recording..." : "⚫ Ready"}</p>
        <p><strong>Language:</strong> English (India)</p>
        <p><strong>Browser:</strong> Supported on Chrome, Edge, Safari</p>
      </div>
    </div>
  );
}
