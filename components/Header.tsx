"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // 🔐 Check auth state from backend
  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        setAuthenticated(data.authenticated && !data.expired);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  function handleSignin() {
    window.location.href = "/api/auth/google";
  }

  async function handleLogout() {
    await fetch("/api/auth/logout");
    window.location.href = "/";
  }

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
        }}
      >
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

        <span
          style={{
            fontWeight: 700,
            fontSize: "20px",
            color: "#4f46e5",
          }}
        >
          दिनचर्या
        </span>
      </a>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <NavLink href="/#why" label="Why Us" />
        <NavLink href="/#about" label="About Us" />

        {/* 🔐 AUTH BUTTON */}
        {!loading && (
          authenticated ? (
            <button
              onClick={handleLogout}
              style={authButtonStyle("#ef4444")}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleSignin}
              style={authButtonStyle("#4f46e5")}
            >
              Sign In
            </button>
          )
        )}
      </div>
    </nav>
  );
}

/* 🔹 Reusable Nav Link */
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
      }}
    >
      {label}
    </a>
  );
}

/* 🔹 Auth Button Style */
function authButtonStyle(bg: string) {
  return {
    marginLeft: 22,
    padding: "8px 16px",
    borderRadius: 8,
    background: bg,
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  } as React.CSSProperties;
}
