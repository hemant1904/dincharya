"use client";

import { useEffect, useState } from "react";

type Habit = {
  id: string;
  text: string;
  done: boolean;
};
function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("dincharya_habits") || "[]");
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem("dincharya_habits", JSON.stringify(habits));
}

export default function HabitPanel({ plan }: { plan: any }) {
  const today = new Date().toISOString().split("T")[0];

  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  const [newHabit, setNewHabit] = useState("");
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
  fetch("/api/sheets")
    .then((r) => r.json())
    .then((data) => {
      if (!data.habits) return;
      const habitRows = data.habits.filter(
        (h: any) => h.type === "habit"
      );

      setHabits((prev) => {
        const map = new Map(prev.map(h => [h.text, h]));

        habitRows.forEach((h: any) => {
  if (!map.has(h.text)) {
    map.set(h.text, {
      id: h.id || crypto.randomUUID(),
      text: h.text,
      done: h.done,
    });
  }
});


        return Array.from(map.values());
      });
    });
}, []);


  async function addHabit() {
    if (!newHabit.trim()) return;

    await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newHabit,
        date: today,
        done: false,
        type: "habit",
      }),
    });

    const habit: Habit = {
    id: crypto.randomUUID(),
    text: newHabit,
    done: false,
  };

  setHabits((prev) => [...prev, habit]);

    setNewHabit("");
  }

  async function toggle(h: Habit) {
    setHabits((prev) =>
  prev.map((x) =>
    x.id === h.id ? { ...x, done: !x.done } : x
  )
);

await fetch("/api/sheets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...h,
    date: today,
    done: !h.done,
  }),
});

  }

  const doneCount = habits.filter((h) => h.done).length;
  const progress = habits.length
    ? Math.round((doneCount / habits.length) * 100)
    : 0;

  /* 🎉 PROGRESS MESSAGE LOGIC */
  function getProgressMessage() {
    if (progress === 0)
      return { text: "Let’s start strong — one habit at a time 💪", color: "#6b7280" };

    if (progress < 50)
      return { text: "Good start! Keep going 🚀", color: "#2563eb" };

    if (progress < 100)
      return { text: "Amazing consistency! Almost there 🔥", color: "#9333ea" };

    return { text: "Perfect day! All habits completed 🎉✨", color: "#16a34a" };
  }

  const progressMessage = getProgressMessage();

  return (
    <div className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>
        📈 Habit Tracker
      </h2>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        {today}
      </p>

      {/* Add habit */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a habit…"
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={addHabit}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            background: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 6px 14px rgba(79,70,229,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Add
        </button>
      </div>

      {/* Habits list */}
      <div style={{ marginTop: 16 }}>
        {habits.map((h) => (
          <div
            key={h.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              background: "#f9fafb",
              marginBottom: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <input
              type="checkbox"
              checked={h.done}
              onChange={() => toggle(h)}
            />
            <span
              style={{
                textDecoration: h.done ? "line-through" : "none",
                color: h.done ? "#9ca3af" : "#111827",
              }}
            >
              {h.text}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>
          Daily Progress: <strong>{progress}%</strong>
        </div>

        <div
          style={{
            height: 8,
            background: "#e5e7eb",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#4f46e5",
              borderRadius: 6,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* 🎉 MOTIVATION POP */}
        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            fontWeight: 500,
            color: progressMessage.color,
            transition: "all 0.3s ease",
          }}
        >
          {progressMessage.text}
        </div>
      </div>
    </div>
  );
}