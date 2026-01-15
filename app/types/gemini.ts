export type GeminiScheduleResponse = {
  needsClarification: boolean;
  clarificationQuestion?: string;
  events?: {
    title: string;
    date: string;        // YYYY-MM-DD
    startTime: string;   // HH:mm (24h)
    endTime: string;     // HH:mm (24h)
    description?: string;
  }[];
};
