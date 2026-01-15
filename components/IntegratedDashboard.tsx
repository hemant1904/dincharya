"use client";
import { apiGet, apiPost } from "@/lib/api";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  link?: string;
}

interface SheetEntry {
  date: string;
  title: string;
  status: string;
}

export default function IntegratedDashboard() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [sheetEntries, setSheetEntries] = useState<SheetEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] =
    useState<"gemini" | "calendar" | "sheets">("gemini");

  /* ---------------- Calendar Fetch ---------------- */
  const fetchCalendarEvents = async () => {
    try {
      const data = await apiGet("/api/calendar/list");
      if (data.status === "ok") {
        setCalendarEvents(data.events || []);
        setError("");
      } else {
        setError(data.message || "Calendar error");
      }
    } catch {
      setError("Calendar unavailable");
    }
  };

  /* ---------------- Gemini Submit ---------------- */
  const handleGeminiSubmit = async () => {
    if (!userInput.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const data = await apiPost("/api/gemini", { prompt: userInput });

      if (data.status === "ok") {
        // Backend already synced Calendar + Sheets
        setUserInput("");
        setStatusMessage("✅ AI schedule successfully synced");

        // Refresh calendar to show new events
        setActiveTab("calendar");
        await fetchCalendarEvents();
      } else {
        setError(data.message || "Gemini failed");
      }
    } catch {
      setError("Gemini API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "calendar") {
      fetchCalendarEvents();
    }
  }, [activeTab]);

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        📅 Dincharya – Integrated Dashboard
      </h1>

      {/* Status Badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <span style={badge("#e8f5e9", "#2e7d32")}>✅ Synced</span>
        <span style={badge("#e3f2fd", "#1565c0")}>
          📅 Events: {calendarEvents.length}
        </span>
        <span style={badge("#fff3e0", "#ef6c00")}>
          📊 Sheets: Auto
        </span>
      </div>

      {error && <div style={errorBox}>❌ {error}</div>}

      {/* Tabs */}
      <div style={tabBar}>
        {["gemini", "calendar", "sheets"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={tabButton(activeTab === tab)}
          >
            {tab === "gemini" && "🤖 Gemini"}
            {tab === "calendar" && "📅 Calendar"}
            {tab === "sheets" && "📊 Sheets"}
          </button>
        ))}
      </div>

      {/* GEMINI TAB */}
      {activeTab === "gemini" && (
        <div style={panel}>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your schedule..."
            style={textarea}
            disabled={loading}
          />

          <button
            onClick={handleGeminiSubmit}
            disabled={loading}
            style={{
              ...primaryBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Processing & Syncing..." : "✨ Generate & Sync"}
          </button>

          {statusMessage && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                backgroundColor: "#e8f5e9",
                border: "1px solid #4caf50",
                borderRadius: 6,
                color: "#2e7d32",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {statusMessage}
              <div style={{ fontSize: 12, marginTop: 4 }}>
                📅 Calendar updated • 📊 Sheets logged
              </div>
            </div>
          )}
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === "calendar" && (
        <div style={panel}>
          {calendarEvents.length === 0 ? (
            <p>No AI-generated events found.</p>
          ) : (
            calendarEvents.map((event) => (
              <div key={event.id} style={card}>
                <strong>🕒 {event.title}</strong>
                <p>
                  {new Date(event.start).toLocaleTimeString()} –{" "}
                  {new Date(event.end).toLocaleTimeString()}
                </p>
                <p>{new Date(event.start).toDateString()}</p>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12 }}
                  >
                    🔗 Open in Google Calendar
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* SHEETS TAB */}
      {activeTab === "sheets" && (
        <div style={panel}>
          <p>
            📊 Tasks are automatically logged to Google Sheets when Gemini
            creates calendar events.
          </p>
          <p style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
            (No manual action required)
          </p>
        </div>
      )}

      <footer style={footer}>
        🤖 Gemini • 📅 Google Calendar • 📊 Google Sheets
      </footer>
    </div>
  );
}

/* ---------------- Styles ---------------- */
const badge = (bg: string, color: string) => ({
  padding: "6px 12px",
  borderRadius: 20,
  backgroundColor: bg,
  color,
  fontSize: 13,
  fontWeight: "bold",
});

const errorBox = {
  padding: 12,
  backgroundColor: "#ffe0e0",
  color: "#c00",
  marginBottom: 20,
};

const tabBar = { display: "flex", gap: 10, marginBottom: 20 };
const tabButton = (active: boolean) => ({
  padding: "10px 20px",
  backgroundColor: active ? "#007bff" : "#eee",
  color: active ? "white" : "#333",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
});

const panel = { padding: 20, background: "#f9f9f9", borderRadius: 8 };
const textarea = { width: "100%", height: 120, marginBottom: 10 };
const primaryBtn = { padding: 10, backgroundColor: "#007bff", color: "white" };
const card = {
  padding: 12,
  background: "white",
  marginBottom: 10,
  borderRadius: 6,
};
const footer: CSSProperties = {
  marginTop: 40,
  textAlign: "center",
  color: "#666",
};
