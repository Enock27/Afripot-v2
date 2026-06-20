import { createServerFn } from "@tanstack/react-start";
import { Event } from "@/data/eventsData";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// SOURCE OF TRUTH: Single JSON file used by both Admin and Public views
const DATA_FILE = path.join(process.cwd(), "src/data/eventsData.json");

/**
 * FETCH EVENTS
 */
export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Event[];
  } catch (error) {
    console.error("Error reading events data from JSON:", error);
    return [];
  }
});

/**
 * UPDATE EVENTS
 * Sanitizes data to prevent "Converting circular structure to JSON" errors.
 */
export const updateEvents = createServerFn({ method: "POST" })
  .handler(async (ctx: { data: Event[] }) => {
    try {
      const events = ctx.data;
      // Create a clean array containing only the necessary serializable fields
      const sanitizedEvents = events.map((ev) => ({
        id: ev.id,
        title: ev.title,
        date: ev.date,
        time: ev.time,
        location: ev.location,
        description: ev.description,
        image: ev.image,
        isFeatured: ev.isFeatured,
      }));

      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(sanitizedEvents, null, 2), "utf-8");
      
      console.log("Write successful!");
      return { success: true };
    } catch (error) {
      console.error("Detailed Error writing events data:", error);
      throw new Error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
