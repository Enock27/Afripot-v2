import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const config: Config = {
  path: "/api/events",
  method: "POST",
};

interface EventPayload {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isFeatured?: boolean;
}

export default async (req: Request) => {
  let items: EventPayload[];
  try {
    items = await req.json();
    if (!Array.isArray(items)) throw new Error("Expected array");
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body — expected a JSON array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    "https://jvhorkrewhqyrwutakrv.supabase.co",
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Delete all rows then re-insert — keeps table in sync with admin state
  const { error: delErr } = await supabase.from("events").delete().neq("id", "");
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (items.length > 0) {
    const { error: insErr } = await supabase.from("events").insert(
      items.map((item, i) => ({
        id:          item.id,
        title:       item.title ?? "",
        date:        item.date ?? "",
        time:        item.time ?? "",
        location:    item.location ?? "",
        description: item.description ?? "",
        image:       item.image ?? "",
        is_featured: item.isFeatured ?? false,
        created_at:  new Date(Date.now() - i * 1000).toISOString(),
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
