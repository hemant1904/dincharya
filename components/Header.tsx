"use client";

import Image from "next/image";

export default function Header() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 32px",
        background: "white",
        borderBottom: "1px solid #eee",
        height: "60px",
      }}
    >
      {/* Logo + Brand */}
      <a
        href="/#home"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0px",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "80px",
            height: "56px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/dincharya_logo.png"
            alt="Dincharya Logo"
            fill
            priority
            sizes="80px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Brand text */}
        <span
          style={{
            fontWeight: 700,
            fontSize: "20px",
            color: "#4f46e5",
            letterSpacing: "0.2px",
            lineHeight: 1,
            transition: "color 0.2s ease",
          }}
        >
          दिनचर्या
        </span>
      </a>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <NavLink href="/#why" label="Why Us" />
        <NavLink href="/#about" label="About Us" />
        <NavLink href="/api/auth/logout" label="Logout" />
      </div>
    </nav>
  );
}

/* 🔹 Reusable Nav Link with Hover */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        marginLeft: 22,
        textDecoration: "none",
        color: "#4f46e5",
        fontSize: "14px",
        fontWeight: 500,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#4338ca";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#4f46e5";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {label}
    </a>
  );
}
