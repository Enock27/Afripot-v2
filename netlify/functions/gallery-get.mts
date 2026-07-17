import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const config: Config = {
  path: "/api/gallery",
  method: "GET",
};

export default async () => {
  const supabase = createClient(
    "https://jvhorkrewhqyrwutakrv.supabase.co",
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from("gallery")
    .select("id, title, category, image")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data ?? []), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
