import { createServerFn } from "@tanstack/react-start";
import { GalleryItem } from "@/data/galleryData";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const DATA_FILE = path.join(process.cwd(), "src/data/galleryData.json");

/**
 * FETCH GALLERY ITEMS
 */
export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as GalleryItem[];
  } catch (error) {
    console.error("Error reading gallery data from JSON:", error);
    return [];
  }
});

/**
 * UPDATE GALLERY ITEMS
 */
export const updateGallery = createServerFn({ method: "POST" })
  .handler(async (ctx: { data: GalleryItem[] }) => {
    try {
      const items = ctx.data;
      const sanitizedItems = items.map((item) => ({
        id: item.id,
        category: item.category,
        title: item.title,
        image: item.image,
      }));

      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(sanitizedItems, null, 2), "utf-8");
      
      console.log("Gallery write successful!");
      return { success: true };
    } catch (error) {
      console.error("Detailed Error writing gallery data:", error);
      throw new Error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

/**
 * UPLOAD IMAGE
 * Decodes base64 string and saves it to public/uploads directory
 */
export const uploadImage = createServerFn({ method: "POST" })
  .handler(async (ctx: { data: { fileName: string, base64Data: string } }) => {
    try {
      const { fileName, base64Data } = ctx.data;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");

      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Clean filename and add timestamp to prevent collisions
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-]/g, "_");
      const finalFileName = `${Date.now()}-${cleanFileName}`;
      const filePath = path.join(uploadsDir, finalFileName);

      await fs.writeFile(filePath, buffer);
      
      return { success: true, url: `/uploads/${finalFileName}` };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  });
