/**
 * Validates and parses Gemini-generated schedule JSON
 */

type Task = {
  title: string;
  startTime: string;
  endTime: string;
  category: string;
};

export function parseGeminiSchedule(data: any): {
  valid: boolean;
  tasks?: Task[];
  message?: string;
} {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "Invalid Gemini response format" };
  }

  if (!Array.isArray(data.tasks)) {
    return { valid: false, message: "Tasks must be an array" };
  }

  for (const task of data.tasks) {
    if (
      typeof task.title !== "string" ||
      typeof task.startTime !== "string" ||
      typeof task.endTime !== "string" ||
      typeof task.category !== "string"
    ) {
      return { valid: false, message: "Invalid task structure detected" };
    }
  }

  return { valid: true, tasks: data.tasks };
}
