import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const config: Config = {
  path: "/api/gallery",
  method: "POST",
};

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export default async (req: Request) => {
  // Verify admin secret
  const auth = req.headers.get("x-admin-secret");
  if (!auth || auth !== process.env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let items: GalleryItem[];
  try {
    items = await req.json();
    if (!Array.isArray(items)) throw new Error("Expected array");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    "https://jvhorkrewhqyrwutakrv.supabase.co",
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Delete everything then re-insert — keeps table in sync with admin state
  const { error: delErr } = await supabase.from("gallery").delete().neq("id", "");
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (items.length > 0) {
    const { error: insErr } = await supabase.from("gallery").insert(
      items.map((item, i) => ({
        id:         item.id,
        title:      item.title ?? "",
        category:   item.category ?? "Food",
        image:      item.image,
        created_at: new Date(Date.now() - i * 1000).toISOString(),
      }))
    );
    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
