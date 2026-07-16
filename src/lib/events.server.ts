import { Event, upcomingEvents } from "@/data/eventsData";
import eventsJson from "@/data/eventsData.json";

/**
 * Returns events from the static JSON file bundled at build time.
 * No Node.js fs/path — safe for Hostinger shared (static) hosting.
 */
export async function getEvents(): Promise<Event[]> {
  return eventsJson as Event[];
}

/**
 * No-op on static hosting — changes cannot be persisted without a server.
 */
export async function updateEvents(_events: Event[]): Promise<{ success: boolean }> {
  console.warn("updateEvents: no-op on static hosting.");
  return { success: false };
}
