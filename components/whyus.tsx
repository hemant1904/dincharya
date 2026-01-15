"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

export default function WhyUs() {
  return (
    <div id="why" style={{ marginTop: 120, textAlign: "center" }}>
      <h2 style={{color: '#140c47',}}>
        Why Dincharya?
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "30px",
          padding: "60px",
        }}
      >
        {/* Saves Time */}
        <div style={cardStyle} className="card-hover">
          <div style={iconCircle}>
            <Image src="/icons/time.png" alt="Saves Time" width={110} height={80} />
          </div>
          <h3>Saves Time</h3>
          <p style={descStyle}>
            Automate tedious scheduling, freeing up precious hours for studying and leisure activities
          </p>
        </div>

        {/* Reduces Stress */}
        <div style={cardStyle} className="card-hover">
          <div style={iconCircle}>
            <Image src="/icons/dimag.png" alt="Reduces Stress" width={100} height={50} />
          </div>
          <h3>Reduces Stress</h3>
          <p style={descStyle}>
            Gain clarity and control over your daily tasks, eliminating anxiety about missed deadlines
          </p>
        </div>

        {/* Automates Planning */}
        <div style={cardStyle} className="card-hover">
          <div style={iconCircle}>
            <Image src="/icons/cycle.png" alt="Automates Planning" width={60} height={60} />
          </div>
          <h3>Automates Planning</h3>
          <p style={descStyle}>
            Intelligent algorithms create optimized schedules based on your goals and commitments.
          </p>
        </div>

        {/* Tracks Habits */}
        <div style={cardStyle} className="card-hover">
          <div style={iconCircle}>
            <Image src="/icons/chart.png" alt="Tracks Habits" width={60} height={60} />
          </div>
          <h3>Tracks Habits</h3>
          <p style={descStyle}>
            Effortlessly monitor your progress on key habits, building consistency and healthy routines.
          </p>
        </div>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "white",
  padding: "40px 25px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  textAlign: "center",
};

const iconCircle: CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: "#eef2ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px auto",
};

const descStyle: CSSProperties = {
  color: "#6b7280",
  lineHeight: "1.6",
  fontSize: "16px",
};
