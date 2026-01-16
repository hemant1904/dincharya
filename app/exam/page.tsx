"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import WhyUs from "@/components/whyus";
import About from "@/components/about";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ExamPage() {
  const router = useRouter();

  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  /* 🔥 STANDARDIZED MODAL (NO TICK IN EXAM MODE) */
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("Validating your input…");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function syncWithGoogle(events: any[]) {
    try {
      // 1️⃣ Create calendar events
      const calRes = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      const calData = await calRes.json();

      if (!calRes.ok || calData.status !== "ok") {
        throw new Error("Calendar sync failed");
      }

      // 2️⃣ Log each event into Google Sheets
      

      console.log("✅ Google Calendar & Sheets synced");
    } catch (err) {
      console.error("❌ Google sync error:", err);
    }
  }


  async function handlePlan() {
    if (!examDate || !hours || !subject || !difficulty || !preferredTime) {
      alert("Please fill all fields");
      return;
    }

    setShowModal(true);

    const steps = [
      "Validating your input…",
      "Setting things up…",
      "Generating an optimized plan…",
      "Almost there…",
    ];

    let stepIndex = 0;
    setModalText(steps[0]);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setModalText(steps[stepIndex]);
      } else {
        clearInterval(intervalRef.current!);
      }
    }, 700);

    /* ---------- EXISTING EXAM LOGIC (UNCHANGED) ---------- */
    const [y, m, d] = examDate.split("-").map(Number);
    const exam = new Date(y, m - 1, d);
    exam.setDate(exam.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startHour = 8;
    if (preferredTime === "Morning") startHour = 6;
    if (preferredTime === "Afternoon") startHour = 12;
    if (preferredTime === "Evening") startHour = 16;
    if (preferredTime === "Night") startHour = 20;

    const events: any[] = [];
    const cur = new Date(today);

    while (cur <= exam) {
      const date = cur.toISOString().split("T")[0];
      events.push({
        id: crypto.randomUUID(), // ⭐ IMPORTANT
        title: `Study ${subject}`,
        date,
        startTime: `${String(startHour).padStart(2, "0")}:00`,
        endTime: `${String(startHour + Number(hours)).padStart(2, "0")}:00`,
        description: `Exam prep for ${subject} (${difficulty})`,
        completed: false,
        type:"schedule",
      });

      cur.setDate(cur.getDate() + 1);
    }

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

    const eventMap = new Map<string, any>();

    // 1️⃣ Add existing events first (keep completed state)
    existingEvents.forEach((e) => {
      eventMap.set(e.id, e);
    });

    // 2️⃣ Add new events only if they don’t already exist
    events.forEach((e) => {
      if (!eventMap.has(e.id)) {
        eventMap.set(e.id, e);
      }
    });

    // 3️⃣ Final merged list
    const mergedEvents = Array.from(eventMap.values());


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


    // 🔥 SYNC WITH GOOGLE
    await syncWithGoogle(events);


    /* ✅ FINAL TEXT (NO TICK) */
    setTimeout(() => {
      setModalText("Your schedule is ready!");
    }, steps.length * 700);

    /* ✅ REDIRECT */
    setTimeout(() => {
      setShowModal(false);
      router.push("/output");
    }, steps.length * 700 + 1200);
  }

  return (
    <div style={{ background: "#eaeefa", minHeight: "100vh" }}>
      <Header />

      {/* GO TO DEFAULT MODE */}
      <a
        href="/#home"
        style={{
          position: "absolute",
          top: 110,
          right: 80,
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: "#405b91",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#eef2ff";
          e.currentTarget.style.color = "#4f46e5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#405b91";
        }}
      >
        Go to Default Mode
      </a>

      {/* BODY */}
      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 90, // 👈 pushes container below "Go to Default Mode"
        }}
      >
        <div
          style={{
            width: 900,
            background: "white",
            padding: 50,
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{color: "#140c47",}}>
          Dincharya — Your calm, AI study companion
          </h1>
          <p style={{ color: "#405b91" }}>Welcome to Exam Mode</p>

          <h3 style={{ marginTop: 30, color: "#140c47", }}>
            Let us plan your exam preparation!
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 20,
            }}
          >
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={inputStyle} />
            <input placeholder="Daily free study hours" value={hours} onChange={(e) => setHours(e.target.value)} style={inputStyle} />
            <input placeholder="Subject (e.g. Math)" value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} />

            <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} style={inputStyle}>
              <option value="">Preferred time of day</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>

            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={inputStyle}>
              <option value="">Difficulty of subject</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>High</option>
            </select>

            <input type="file" style={inputStyle} />
          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button onClick={handlePlan} style={buttonStyle}>
              Plan My Day
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL (NO TICK) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: 360, padding: 30 }}>
            <p style={{ fontSize: 18 }}>{modalText}</p>
          </div>
        </div>
      )}

      <WhyUs />
      <About />
      <Footer />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: "44px",
  padding: "0 12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 30px",
  background: "#4f46e5",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
