import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const config: Config = {
  path: "/api/events",
  method: "GET",
};

export default async () => {
  const supabase = createClient(
    "https://jvhorkrewhqyrwutakrv.supabase.co",
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from("events")
    .select("id, title, date, time, location, description, image, is_featured")
    .order("date", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Map snake_case DB columns → camelCase frontend shape
  const events = (data ?? []).map((row) => ({
    id:          row.id,
    title:       row.title,
    date:        row.date,
    time:        row.time,
    location:    row.location,
    description: row.description,
    image:       row.image,
    isFeatured:  row.is_featured ?? false,
  }));

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
