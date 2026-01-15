"use client";

export default function About() {
  return (
    <div
      id="about"
      className="section-hover"
      style={{
        maxWidth: "1000px",
        margin: "100px auto",
        background: "white",
        padding: "50px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <h2>About Dincharya</h2>

      <h3>Our Purpose</h3>
      <p style={{ color: "#555", lineHeight: "1.7" }}>
        Dincharya is designed to empower individuals by simplifying daily planning and habit formation. Our goal is to help you achieve a balanced and productive lifestyle without the overwhelm, by integrating smart scheduling with intuitive habit tracking.
      </p>

      <h3>Our Vision</h3>
      <p style={{ color: "#555", lineHeight: "1.7" }}>
        We envision a future where everyone has the tools to effortlessly manage their time and cultivate positive habits, leading to greater well-being and success. Dincharya strives to be the indispensable companion in your journey towards personal mastery.
      </p>

      <h3>AI-Driven Automation</h3>
      <p style={{ color: "#555", lineHeight: "1.7" }}>
        Leveraging cutting-edge AI, Dincharya intelligently analyzes your tasks, commitments, and habits to create optimized daily schedules. Our AI ensures your day flows smoothly, adapting to your evolving needs.
      </p>
    </div>
  );
}
