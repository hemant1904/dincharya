"use client";

import { useState, useMemo, useEffect } from "react";

type Event = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
};

/* ---------- Helpers ---------- */

function getTaskId(task: Event) {
  return `${task.title}-${task.date}-${task.startTime}`;
}

function loadCompleted(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("dincharya_completed") || "{}");
  } catch {
    return {};
  }
}

/* ---------- Component ---------- */

export default function SchedulePanel({ plan }: { plan: any }) {
  const [sortBy, setSortBy] = useState("time");
  const [completed, setCompleted] =
    useState<Record<string, boolean>>(loadCompleted);

  /* ✅ PERSIST COMPLETED STATE */
  useEffect(() => {
    localStorage.setItem(
      "dincharya_completed",
      JSON.stringify(completed)
    );
  }, [completed]);

  const events: Event[] =
    plan?.data?.events ||
    plan?.events ||
    [];

  const toggleComplete = (task: Event) => {
    const id = getTaskId(task);
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const baseSorted = useMemo(() => {
    return [...events].sort((a, b) => {
      if (sortBy === "time") return a.startTime.localeCompare(b.startTime);
      if (sortBy === "date") return a.date.localeCompare(b.date);
      if (sortBy === "alpha") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [events, sortBy]);

  const pendingTasks = baseSorted.filter(
    (task) => !completed[getTaskId(task)]
  );

  const completedTasks = baseSorted.filter(
    (task) => completed[getTaskId(task)]
  );

  const Grid = ({
    tasks,
    strike = false,
  }: {
    tasks: Event[];
    strike?: boolean;
  }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginTop: "14px",
      }}
    >
      {tasks.map((task) => {
        const id = getTaskId(task);

        return (
          <div
            key={id}
            className="schedule-item"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "14px",
              background: "#fff",
              opacity: strike ? 0.6 : 1,
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = "translateY(-3px)"; 
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)"; 
            }} 
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = "translateY(0)"; 
              e.currentTarget.style.boxShadow = "none"; 
            }}
          >
            {/* Checkbox */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <input
                type="checkbox"
                checked={!!completed[id]}
                onChange={() => toggleComplete(task)}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4f46e5",
                }}
              />
            </div>

            {/* Content */}
            <div
              style={{
                textDecoration: strike ? "line-through" : "none",
              }}
            >
              <div 
              className="schedule-title"
              style={{ 
                fontSize: 15, 
                fontWeight: 600,
                marginBottom: 4, 
              }}
              >
                {task.title}
              </div>

              <div
                className="schedule-time"
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 8,
                }}
              >
                {task.date} • {task.startTime} – {task.endTime}
              </div>

              <a
                href={`https://calendar.google.com/calendar/u/0/r/day/${task.date.replaceAll(
                  "-",
                  "/"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#4f46e5",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                View in Calendar →
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="card">
      {/* Header */}
      <div
        className="schedule-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>
          🗓️ My Schedule
        </h2>
         {/*RIGHT CONTROLS*/}
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          gap: "12px", 
        }}
        >
          {/* SORT DROPDOWN → moved to yellow area */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="time">Sort by Time</option>
            <option value="alpha">Sort A–Z</option>
          </select>

          <button
            onClick={() => (window.location.href = "/#home")}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(79,70,229,0.35)"; 
            }} 
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"; 
              e.currentTarget.style.boxShadow = "none"; 
            }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Pending */}
      {pendingTasks.length > 0 && (
        <>
          <h4>Pending</h4>
          <Grid tasks={pendingTasks} />
        </>
      )}

      {/* Completed */}
      {completedTasks.length > 0 && (
        <>
          <h4 style={{ marginTop: 28 }}>Completed</h4>
          <Grid tasks={completedTasks} strike />
        </>
      )}
    </div>
  );
}
