"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
        color: "white",
        padding: "70px 20px 40px",
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      {/* Logo */}
      <a
        href="/#home"
        className="pop-hover"
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "10px",
          display: "inline-block",
          color: "white",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        dincharya
      </a>

      {/* Tagline */}
      <p
        style={{
          color: "#9ca3af",
          fontSize: "15px",
          marginBottom: "35px",
        }}
      >
        Your calm, AI planning companion
      </p>

      {/* Social Media Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "26px",
          marginBottom: "35px",
          flexWrap: "wrap",
        }}
      >
        <img
          src="/icons/facebook.png"
          alt="Facebook"
          className="pop-hover"
          style={iconStyle}
        />
        <img
          src="/icons/insta.png"
          alt="Instagram"
          className="pop-hover"
          style={iconStyle}
        />
        <img
          src="/icons/linkedin.png"
          alt="LinkedIn"
          className="pop-hover"
          style={iconStyle}
        />
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <a href="/#home" className="pop-hover" style={linkStyle}>
          Home
        </a>
        <a href="/#why" className="pop-hover" style={linkStyle}>
          Why Us
        </a>
        <a href="/#about" className="pop-hover" style={linkStyle}>
          About Us
        </a>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid #333",
          maxWidth: "700px",
          margin: "0 auto 20px",
        }}
      />

      {/* Copyright */}
      <p
        style={{
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        © 2026 dincharya. All rights reserved.
      </p>
    </footer>
  );
}

/* ---------- Styles ---------- */

const iconStyle = {
  width: "28px",
  height: "28px",
  cursor: "pointer",
  opacity: 0.85,
};

const linkStyle = {
  textDecoration: "none",
  color: "#9ca3af",
  fontSize: "15px",
};
