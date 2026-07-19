import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export const config: Config = {
  path: "/api/events/upload",
  method: "POST",
};

const BUCKET = "event-images";

export default async (req: Request) => {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(JSON.stringify({ error: "Expected multipart/form-data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Failed to parse form data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided — send field named 'file'" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sanitise filename and make it unique
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 60);
  const path = `${Date.now()}-${safe}.${ext}`;

  const supabase = createClient(
    "https://jvhorkrewhqyrwutakrv.supabase.co",
    process.env.SUPABASE_SERVICE_KEY!
  );

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadErr) {
    return new Response(JSON.stringify({ error: uploadErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return new Response(JSON.stringify({ url: urlData.publicUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
