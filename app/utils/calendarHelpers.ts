
/**
 * calendarHelpers.ts
 *
 * Purpose: Small helper utilities for working with Google Calendar
 * resources (event object shaping, date formatting). These helpers are
 * independent of the API layer and can be reused by multiple routes.
 */
import { google } from "googleapis";
type EventInput = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
};

export async function createCalendarEvent(
  auth: any,
  event: EventInput
) {
  const calendar = google.calendar({
    version: "v3",
    auth
  });

  function toISTISOString(date: string, time: string) {
  return new Date(`${date}T${time}:00+05:30`).toISOString();
  }

  const startDateTime = toISTISOString(event.date, event.startTime);
  const endDateTime = toISTISOString(event.date, event.endTime);


  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: startDateTime,
        
      },
      end: {
        dateTime: endDateTime,
        
      }
    }
  });

  return {
    id: response.data.id,
    summary: response.data.summary,
    start: response.data.start,
    end: response.data.end
  };
}
export function formatDateToRFC3339(date: Date): string {
  return date.toISOString();
}

export type CalendarEventInput = {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendees?: string[];
  location?: string;
};

export function buildCalendarEvent(payload: CalendarEventInput) {
  const event: Record<string, unknown> = {
    summary: payload.summary,
    description: payload.description ?? undefined,
    start: { dateTime: formatDateToRFC3339(payload.start) },
    end: { dateTime: formatDateToRFC3339(payload.end) },
  };
  if (payload.attendees && payload.attendees.length)
    event.attendees = payload.attendees.map((email) => ({ email }));
  if (payload.location) event.location = payload.location;
  return event;
}

export function durationMs(start: Date, end: Date): number {
  return Math.max(0, end.getTime() - start.getTime());
}



