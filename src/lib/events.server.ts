import { createServerFn } from "@tanstack/react-start";
import { Event } from "@/data/eventsData";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// SOURCE OF TRUTH: Single JSON file used by both Admin and Public views
const DATA_FILE = path.join(process.cwd(), "src/data/eventsData.json");

/**
 * FETCH EVENTS
 * Always reads from the physical JSON file at runtime.
 */
export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Event[];
  } catch (error) {
    console.error("Error reading events data from JSON:", error);
    // Fallback to empty list if file doesn't exist yet
    return [];
  }
});

/**
 * UPDATE EVENTS
 * Writes changes directly to the JSON file.
 * NOTE: For serverless hosting (like Cloudflare Pages/Workers), 
 * this local filesystem approach will need to be replaced with 
 * a Database or KV storage.
 */
export const updateEvents = createServerFn({ method: "POST" })
  .handler(async ({ data: events }: { data: Event[] }) => {
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      
      // Write the updated event list
      await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
      
      return { success: true };
    } catch (error) {
      console.error("Error writing events data to JSON:", error);
      throw new Error("Failed to save changes to the database.");
    }
  });
