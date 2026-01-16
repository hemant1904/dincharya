"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import WhyUs from "@/components/whyus";
import About from "@/components/about";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ExamPage() {
  const router = useRouter();

  /* 🔐 AUTH STATE */
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  /* 📘 FORM STATE */
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  /* 🔥 MODAL STATE */
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("Validating your input…");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ============================
     STEP 2: AUTH CHECK (CORRECT)
     ============================ */
  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (!data.authenticated || data.expired) {
          alert("Please sign in to use Exam Mode.");
          router.replace("/");
        } else {
          setAuthenticated(true);
        }
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  /* 🔒 BLOCK RENDER UNTIL AUTH CHECK */
  if (checkingAuth) return null;
  if (!authenticated) return null;

  async function syncWithGoogle(events: any[]) {
    try {
      const calRes = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      const calData = await calRes.json();
      if (!calRes.ok || calData.status !== "ok") {
        throw new Error("Calendar sync failed");
      }

      console.log("✅ Google Calendar synced");
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

    /* ---------- EXISTING LOGIC ---------- */
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
        id: crypto.randomUUID(),
        title: `Study ${subject}`,
        date,
        startTime: `${String(startHour).padStart(2, "0")}:00`,
        endTime: `${String(startHour + Number(hours)).padStart(2, "0")}:00`,
        description: `Exam prep for ${subject} (${difficulty})`,
        completed: false,
        type: "schedule",
      });
      cur.setDate(cur.getDate() + 1);
    }

    localStorage.setItem(
      "dincharya_plan",
      JSON.stringify({
        status: "ok",
        data: { needsClarification: false, events },
      })
    );

    await syncWithGoogle(events);

    setTimeout(() => setModalText("Your schedule is ready!"), steps.length * 700);
    setTimeout(() => {
      setShowModal(false);
      router.push("/output");
    }, steps.length * 700 + 1200);
  }

  return (
    <div style={{ background: "#eaeefa", minHeight: "100vh" }}>
      <Header />
      {/* UI unchanged below */}
      <WhyUs />
      <About />
      <Footer />
    </div>
  );
}

/* STYLES */
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
