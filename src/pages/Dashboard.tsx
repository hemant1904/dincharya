import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Dumbbell, Clock, Users } from "lucide-react";

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: "study" | "fitness" | "social" | "general";
  highlighted?: boolean;
}

interface HabitEntry {
  date: string;
  event: string;
  completed?: boolean;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submittedPlan = location.state?.plan || "";

  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Week");

  // Sample schedule data based on the reference image
  const [schedule, setSchedule] = useState<Record<string, ScheduleItem[]>>({
    "Mon, Oct 23": [
      { id: "1", title: "Calculus Study Session", time: "09:00 AM", completed: false, category: "study" },
      { id: "2", title: "Gym Workout - Legs", time: "01:00 PM", completed: true, category: "fitness" },
      { id: "3", title: "Movie Night", time: "07:00 PM", completed: false, category: "social" },
    ],
    "Tue, Oct 24": [
      { id: "4", title: "Exam Prep: Algebra", time: "10:00 AM", completed: true, category: "study", highlighted: true },
      { id: "5", title: "Project Meeting", time: "04:00 PM", completed: false, category: "general" },
    ],
    "Wed, Oct 25": [
      { id: "6", title: "Morning Run", time: "07:00 AM", completed: false, category: "fitness" },
      { id: "7", title: "History Reading", time: "02:00 PM", completed: true, category: "study" },
    ],
    "Thu, Oct 26": [
      { id: "8", title: "Physics Homework", time: "11:00 AM", completed: false, category: "study" },
      { id: "9", title: "Gym Workout - Upper Body", time: "03:00 PM", completed: true, category: "fitness" },
    ],
    "Fri, Oct 27": [
      { id: "10", title: "Mock Exam: Chemistry", time: "09:30 AM", completed: false, category: "study", highlighted: true },
      { id: "11", title: "Coffee with Friends", time: "05:00 PM", completed: false, category: "social" },
    ],
  });

  const initialHabits: HabitEntry[] = [
    { date: "Oct 26", event: "Meditate for 15 min", completed: false },
    { date: "Oct 26", event: "Drink 8 glasses of water", completed: false },
    { date: "Oct 25", event: "Read 20 pages of textbook", completed: false },
    { date: "Oct 25", event: "Journal entry", completed: false },
    { date: "Oct 24", event: "Practice coding for 1 hour", completed: false },
  ];

  const STORAGE_KEY = "habitEntries";
  const STORAGE_DATE_KEY = "habitEntriesDate";

  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
      const today = new Date().toISOString().slice(0, 10);
      if (saved && savedDate === today) {
        return JSON.parse(saved) as HabitEntry[];
      }
    } catch (e) {
      // ignore
    }
    return initialHabits;
  });

  const [newHabitEvent, setNewHabitEvent] = useState<string>("");

  const toggleHabitComplete = (index: number) => {
    setHabitEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], completed: !next[index].completed };
      return next;
    });
  };

  const updateHabitEvent = (index: number, text: string) => {
    setHabitEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], event: text };
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habitEntries));
      localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString().slice(0, 10));
    } catch (e) {
      // ignore
    }
  }, [habitEntries]);

  // Reset habits at midnight (client-side)
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = setTimeout(() => {
      setHabitEntries(initialHabits.map((h) => ({ ...h, completed: false })));
      try {
        localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString().slice(0, 10));
      } catch (e) {}
    }, msUntilMidnight + 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleComplete = (day: string, itemId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "study":
        return <BookOpen className="w-4 h-4 text-primary" />;
      case "fitness":
        return <Dumbbell className="w-4 h-4 text-rose-500" />;
      case "social":
        return <Users className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const completedCount = Object.values(schedule)
    .flat()
    .filter((item) => item.completed).length;
  const totalCount = Object.values(schedule).flat().length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const habitCompletedCount = habitEntries.filter((e) => e.completed).length;
  const habitTotalCount = habitEntries.length;
  const habitProgressPercent = habitTotalCount > 0 ? Math.round((habitCompletedCount / habitTotalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <Header />

      {/* Blue Banner */}
      <div className="h-16 bg-primary/10" />

      <main className="flex-1 container mx-auto px-4 py-8">
        {submittedPlan && (
          <div className="mb-6 p-4 bg-accent/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Your submitted plan:</p>
            <p className="text-foreground font-medium">{submittedPlan}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">My Schedule</h2>
              <div className="flex gap-1 border border-border rounded-lg overflow-hidden">
                {(["Day", "Week", "Month"] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="rounded-none"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Object.entries(schedule).map(([day, items]) => (
                <div key={day} className="space-y-3">
                  <h3 className="font-medium text-foreground text-sm">{day}</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border transition-all ${
                          item.highlighted
                            ? "bg-rose-50 border-rose-200"
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleComplete(day, item.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                item.completed
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.time}
                            </p>
                          </div>
                          {getCategoryIcon(item.category)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Tracker Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-card border border-border rounded-lg p-6 min-h-[20rem]">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Habit Tracker
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                Track your progress and maintain consistency.
              </p>
              <p className="text-xs text-muted-foreground mb-4">{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add habit event..."
                  value={newHabitEvent}
                  onChange={(e) => setNewHabitEvent(e.target.value)}
                  className="flex-1 border border-border rounded px-2 py-1 bg-card text-foreground"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!newHabitEvent.trim()) return;
                    const todayLabel = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    setHabitEntries((prev) => [...prev, { date: todayLabel, event: newHabitEvent.trim(), completed: false }]);
                    setNewHabitEvent("");
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 font-medium text-muted-foreground w-20 text-center">
                        Done
                      </th>
                      <th className="text-left py-2 font-medium text-muted-foreground">
                        Event
                      </th>
    
                    </tr>
                  </thead>
                  <tbody>
                    {habitEntries.map((entry, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 text-center">
                          <Checkbox
                            checked={!!entry.completed}
                            onCheckedChange={() => toggleHabitComplete(index)}
                          />
                        </td>
                        <td className="py-3 text-foreground">{entry.event}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Habit Progress:</span>
                  <span className="font-medium text-foreground">{habitProgressPercent}%</span>
                </div>
                <Progress value={habitProgressPercent} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
