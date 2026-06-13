import { createServerFn } from "@tanstack/react-start";
import { Event } from "@/data/eventsData";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const DATA_FILE = path.join(process.cwd(), "src/data/eventsData.json");

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Event[];
  } catch (error) {
    console.error("Error reading events data:", error);
    return [];
  }
});

export const updateEvents = createServerFn({ method: "POST" })
  .handler(async ({ data: events }: { data: Event[] }) => {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
      return { success: true };
    } catch (error) {
      console.error("Error writing events data:", error);
      throw new Error("Failed to save events");
    }
  });
