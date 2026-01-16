"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // 🔐 Check auth state
  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) return { authenticated: false };
        return res.json();
      })
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

  async function handleSignout() {
    await fetch("/api/auth/logout");
    window.location.href = "/";
  }

  return (
    <header
      style={{
        height: 80,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong style={{ fontSize: 20, color: "#140c47" }}>
        Dincharya
      </strong>

      {!loading && (
        authenticated ? (
          <button
            onClick={handleSignout}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={handleSignin}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sign in
          </button>
        )
      )}
    </header>
  );
}