"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import WhyUs from "@/components/whyus";
import About from "@/components/about";
import Footer from "@/components/Footer";

type GeminiPlan = {
  status: string;
  data?: {
    needsClarification?: boolean;
    events?: any[];
  };
};

export default function Dashboard() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Voice
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("Validating your input…");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  /* ------------------ VOICE ------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setText((p) => (p ? p + " " + t : t));
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.ok ? res.json() : { authenticated: false })
      .then((data) => {
        setAuthenticated(data.authenticated && !data.expired);
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthenticated(false);
        setAuthChecked(true);
      });
  }, []);


  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    recognitionRef.current?.start();
    setListening(true);
  }

  function closeModal() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShowModal(false);
    setLoading(false);
  }

  async function handlePlan() {
    // 🔒 REQUIRE GOOGLE LOGIN BEFORE USING FEATURES
    if (!authenticated) {
      alert("Please sign in with Google to use Dincharya features.");
      return;
    }


    // ⬇️ EXISTING LOGIC (UNCHANGED)
    if (!text.trim() || loading) return;

    setLoading(true);
    setShowModal(true);

    const steps = [
      "Validating your input…",
      "Setting things up…",
      "Generating an optimized plan…",
      "Almost there…",
    ];

    let i = 0;
    setModalText(steps[0]);

    intervalRef.current = setInterval(() => {
      i++;
      if (i < steps.length) setModalText(steps[i]);
      else clearInterval(intervalRef.current!);
    }, 700);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const raw = await res.json();
      const events = raw?.data?.events || raw?.events || [];

      if (!events.length) throw new Error("No tasks detected");

      // 1️⃣ Get existing plan (if any)
      const existingRaw = localStorage.getItem("dincharya_plan");
      let existingEvents: any[] = [];

      if (existingRaw) {
        try {
          const parsed = JSON.parse(existingRaw);
          existingEvents = parsed?.data?.events || [];
        } catch {
          existingEvents = [];
        }
      }

      // 2️⃣ Merge old + new (keep pending ones)
      const mergedEvents = [...existingEvents, ...events];

      // 3️⃣ Save merged plan
      localStorage.setItem(
        "dincharya_plan",
        JSON.stringify({
          status: "ok",
          data: {
            needsClarification: false,
            events: mergedEvents,
          },
        })
      );

      setModalText("Your schedule is ready!");

      setTimeout(() => {
        closeModal();
        router.push("/output");
      }, 1200);
    } catch {
      closeModal();
      setError("Something went wrong");
    }
  }


  return (
    <div style={{ background: "#eaeefa", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <div
        id="home"
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "0 20px",
          position: "relative",
        }}
      >
        <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          display: "flex",
          gap: 18,
          fontSize: 14,
        }}
      >
        <a
            href="/output"
            style={{
              color: "#405b91",
              textDecoration: "none",
            }}
            className="pop-hover"
          >
            View Schedule
          </a>

          <a
            href="/exam"
            style={{
              color: "#405b91",
              textDecoration: "none",
            }}
            className="pop-hover"
          >
            Go to Exam Mode
          </a>
        </div>


        <h1 style={{color: "#140c47",}}>
        Dincharya – Your calm, AI planning companion

        </h1>
        <p style={{ color: "#405b91", marginBottom: 18, fontSize:'20px', }}>
          Effortlessly organize your academic and personal life.
        </p>

        <div
          className="pop-hover"
          style={{
            width: "min(90%, 520px)",
            display: "flex",
            background: "white",
            borderRadius: 999,
            padding: "10px 16px",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell me what to schedule today..."
            style={{ flex: 1, border: "none", fontSize: 16 }}
          />
          <img
            src="/icons/mic.png"
            width={22}
            height={22}
            onClick={toggleMic}
            style={{ cursor: "pointer" }}
          />
        </div>

        {authChecked && (
      <button
        onClick={handlePlan}
        className="pop-hover"
        style={{
          marginTop: 20,
          padding: "12px 30px",
          background: authenticated ? "#4f46e5" : "#9ca3af",
          color: "white",
          borderRadius: 8,
          border: "none",
          cursor: authenticated ? "pointer" : "not-allowed",
        }}
      >
        Plan My Day
      </button>
    )}



        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <WhyUs />
      <About />
      <Footer />

      {/* 🔥 STANDARDIZED MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div
            className="modal-box"
            style={{
              width: 360,
              textAlign: "center",
              padding: 30,
            }}
          >
            <p style={{ fontSize: 18 }}>{modalText}</p>
            {modalText.includes("✅") && (
              <img src="/icons/tick.png" style={{ width: 80, marginTop: 12 }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
