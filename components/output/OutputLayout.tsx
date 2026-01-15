"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import WhyUs from "@/components/whyus";
import About from "@/components/about";
import Footer from "@/components/Footer";
import SchedulePanel from "./SchedulePanel";
import HabitPanel from "./HabitPanel";

export default function OutputLayout() {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dincharya_plan");
    if (stored) {
      try {
        setPlan(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid plan data", e);
      }
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eaeefa",
      }}
    >
      <Header />

      {/* OUTPUT HERO */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px 20px",
        }}
      >
        <h1 style={{ color: "#140c47",fontSize: 28, marginBottom: 6 }}>
          Your Planned Day
        </h1>
        <p style={{ color: "#405b91", marginBottom: 28 }}>
          Here’s what Dincharya scheduled for you today
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
          }}
        >
          <SchedulePanel plan={plan} />
          <HabitPanel plan={plan} />
        </div>
      </div>

      <WhyUs />
      <About />
      <Footer />
    </div>
  );
}
