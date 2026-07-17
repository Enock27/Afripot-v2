import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAdminData } from "@/hooks/useAdminData";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_PASSWORD = "afripot2024";
const CATEGORIES = ["Food", "Breakfast", "Lunch", "Atmosphere"];

// ─── helpers ────────────────────────────────────────────────────────────────

function uid() {
  return String(Date.now() + Math.floor(Math.random() * 1000));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ─── root component ─────────────────────────────────────────────────────────

function AdminPage() {
  const [authed, setAuthed] = useState(() =>
    sessionStorage.getItem("afripot_admin") === "1"
  );

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("afripot_admin"); setAuthed(false); }} />;
}

// ─── login screen ───────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("afripot_admin", "1");
      onSuccess();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif",
    }}>
      <form onSubmit={submit} style={{
        background: "#111", border: "1px solid #222", borderRadius: 16,
        padding: "48px 40px", width: "100%", maxWidth: 380, textAlign: "center",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🍲</div>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AfriPot Admin</h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 32 }}>Enter your password to continue</p>
        <input
          type="password" value={pw} autoFocus
          onChange={e => { setPw(e.target.value); setErr(false); }}
          placeholder="Password"
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${err ? "#cc0000" : "#333"}`,
            background: "#1a1a1a", color: "#fff", fontSize: 15, outline: "none",
            boxSizing: "border-box", marginBottom: 8,
          }}
        />
        {err && <p style={{ color: "#cc0000", fontSize: 12, marginBottom: 8 }}>Incorrect password. Try again.</p>}
        <button type="submit" style={{
          width: "100%", padding: "13px", borderRadius: 8, border: "none",
          background: "#cc0000", color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", marginTop: 8,
        }}>Sign In</button>
      </form>
    </div>
  );
}

// ─── dashboard shell ────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"gallery" | "events">("gallery");
  const { gallery, events, saveGallery, saveEvents, ready } = useAdminData();

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#666", fontFamily: "DM Sans, sans-serif" }}>Loading…</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "DM Sans, sans-serif", color: "#fff" }}>
      <SiteHeader />

      {/* top bar */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {(["gallery", "events"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 20px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                textTransform: "capitalize", letterSpacing: 1,
                background: tab === t ? "#cc0000" : "transparent",
                color: tab === t ? "#fff" : "#888",
              }}>{t}</button>
            ))}
          </div>
          <button onClick={onLogout} style={{
            padding: "6px 16px", borderRadius: 6, border: "1px solid #333",
            background: "transparent", color: "#888", fontSize: 12, cursor: "pointer",
          }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "gallery"
          ? <GalleryAdmin items={gallery} onSave={saveGallery} />
          : <EventsAdmin items={events} onSave={saveEvents} />}
      </div>

      <SiteFooter />
    </div>
  );
}

// ─── gallery admin ──────────────────────────────────────────────────────────

const emptyGalleryItem = (): GalleryItem => ({ id: uid(), title: "", category: "Food", image: "" });

function GalleryAdmin({ items, onSave }: { items: GalleryItem[]; onSave: (i: GalleryItem[]) => void }) {
  const [form, setForm] = useState<GalleryItem>(emptyGalleryItem());
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setForm(f => ({ ...f, image: b64 }));
  }

  function saveItem() {
    if (!form.title.trim() || !form.image) { showToast("⚠️ Title and image are required."); return; }
    if (editing) {
      onSave(items.map(i => i.id === editing ? { ...form } : i));
      showToast("✅ Item updated!");
    } else {
      onSave([{ ...form, id: uid() }, ...items]);
      showToast("✅ Image added to gallery!");
    }
    setForm(emptyGalleryItem()); setEditing(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function editItem(item: GalleryItem) { setForm({ ...item }); setEditing(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function deleteItem(id: string) { if (confirm("Delete this image?")) { onSave(items.filter(i => i.id !== id)); showToast("🗑️ Deleted."); } }
  function cancel() { setForm(emptyGalleryItem()); setEditing(null); if (fileRef.current) fileRef.current.value = ""; }

  return (
    <div>
      <Toast msg={toast} />
      <h2 style={sh.sectionTitle}>Gallery <span style={{ color: "#555", fontSize: 16 }}>({items.length} images)</span></h2>

      {/* form card */}
      <div style={sh.card}>
        <h3 style={sh.cardTitle}>{editing ? "✏️ Edit Image" : "➕ Add New Image"}</h3>
        <div style={sh.grid2}>
          <Field label="Title">
            <input style={sh.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Jollof Rice" />
          </Field>
          <Field label="Category">
            <select style={sh.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Image — upload a file OR paste a URL">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} style={{ color: "#ccc", fontSize: 13 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
              <span style={{ color: "#555", fontSize: 12 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
            </div>
            <input style={sh.input} value={form.image.startsWith("data:") ? "" : form.image}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
              placeholder="https://example.com/image.jpg" />
          </div>
        </Field>
        {form.image && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#666", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Preview</p>
            <img src={form.image} alt="preview" style={{ height: 160, borderRadius: 8, objectFit: "cover", border: "1px solid #2a2a2a" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={saveItem} style={sh.btnPrimary}>{editing ? "Save Changes" : "Add to Gallery"}</button>
          {editing && <button onClick={cancel} style={sh.btnGhost}>Cancel</button>}
        </div>
      </div>

      {/* grid */}
      <div style={sh.imageGrid}>
        {items.map(item => (
          <div key={item.id} style={sh.imageCard}>
            <img src={item.image} alt={item.title} style={sh.thumb} />
            <div style={{ padding: "10px 12px" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
              <p style={{ margin: "2px 0 10px", fontSize: 11, color: "#cc0000", textTransform: "uppercase", letterSpacing: 1 }}>{item.category}</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => editItem(item)} style={sh.btnSm}>Edit</button>
                <button onClick={() => deleteItem(item.id)} style={sh.btnSmDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── events admin ────────────────────────────────────────────────────────────

const emptyEvent = (): Event => ({
  id: uid(), title: "", date: "", time: "", location: "", description: "", image: "", isFeatured: false,
});

function EventsAdmin({ items, onSave }: { items: Event[]; onSave: (e: Event[]) => void }) {
  const [form, setForm] = useState<Event>(emptyEvent());
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function set(field: keyof Event, val: string | boolean) { setForm(f => ({ ...f, [field]: val })); }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    set("image", await fileToBase64(file));
  }

  function saveItem() {
    if (!form.title.trim() || !form.date || !form.image) { showToast("⚠️ Title, date, and image are required."); return; }
    if (editing) {
      onSave(items.map(i => i.id === editing ? { ...form } : i));
      showToast("✅ Event updated!");
    } else {
      onSave([{ ...form, id: uid() }, ...items]);
      showToast("✅ Event created!");
    }
    setForm(emptyEvent()); setEditing(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function editItem(ev: Event) { setForm({ ...ev }); setEditing(ev.id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function deleteItem(id: string) { if (confirm("Delete this event?")) { onSave(items.filter(i => i.id !== id)); showToast("🗑️ Deleted."); } }
  function cancel() { setForm(emptyEvent()); setEditing(null); if (fileRef.current) fileRef.current.value = ""; }

  return (
    <div>
      <Toast msg={toast} />
      <h2 style={sh.sectionTitle}>Events <span style={{ color: "#555", fontSize: 16 }}>({items.length} events)</span></h2>

      {/* form */}
      <div style={sh.card}>
        <h3 style={sh.cardTitle}>{editing ? "✏️ Edit Event" : "➕ Add New Event"}</h3>
        <Field label="Event Title">
          <input style={sh.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. AfriPot Gala Night" />
        </Field>
        <div style={sh.grid3}>
          <Field label="Date">
            <input style={sh.input} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </Field>
          <Field label="Time">
            <input style={sh.input} type="time" value={form.time} onChange={e => set("time", e.target.value)} />
          </Field>
          <Field label="Location">
            <input style={sh.input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. KN 51 St, Kigali" />
          </Field>
        </div>
        <Field label="Description">
          <textarea style={{ ...sh.input, minHeight: 80, resize: "vertical" }} value={form.description}
            onChange={e => set("description", e.target.value)} placeholder="Describe the event…" />
        </Field>
        <Field label="Image — upload a file OR paste a URL">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} style={{ color: "#ccc", fontSize: 13 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
              <span style={{ color: "#555", fontSize: 12 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
            </div>
            <input style={sh.input} value={form.image.startsWith("data:") ? "" : form.image}
              onChange={e => set("image", e.target.value)} placeholder="https://example.com/banner.jpg" />
          </div>
        </Field>
        {form.image && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#666", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Preview</p>
            <img src={form.image} alt="preview" style={{ height: 160, borderRadius: 8, objectFit: "cover", border: "1px solid #2a2a2a" }} />
          </div>
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, cursor: "pointer" }}>
          <input type="checkbox" checked={!!form.isFeatured} onChange={e => set("isFeatured", e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "#cc0000", cursor: "pointer" }} />
          <span style={{ color: "#ccc", fontSize: 13 }}>Mark as Featured Event</span>
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={saveItem} style={sh.btnPrimary}>{editing ? "Save Changes" : "Create Event"}</button>
          {editing && <button onClick={cancel} style={sh.btnGhost}>Cancel</button>}
        </div>
      </div>

      {/* list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(ev => (
          <div key={ev.id} style={{ ...sh.card, display: "flex", gap: 16, padding: 16, alignItems: "flex-start" }}>
            <img src={ev.image} alt={ev.title} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: "1px solid #2a2a2a" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{ev.title}</p>
                {ev.isFeatured && <span style={{ background: "#cc0000", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: 1 }}>FEATURED</span>}
              </div>
              <p style={{ margin: "4px 0 2px", color: "#888", fontSize: 12 }}>{ev.date} · {ev.time} · {ev.location}</p>
              <p style={{ margin: 0, color: "#555", fontSize: 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{ev.description}</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => editItem(ev)} style={sh.btnSm}>Edit</button>
              <button onClick={() => deleteItem(ev.id)} style={sh.btnSmDanger}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── shared small components ─────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#1a1a1a", border: "1px solid #333", color: "#fff",
      padding: "12px 24px", borderRadius: 10, fontSize: 14, zIndex: 9999,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", whiteSpace: "nowrap",
    }}>{msg}</div>
  );
}

// ─── shared styles ────────────────────────────────────────────────────────────

const sh = {
  sectionTitle: { fontSize: 22, fontWeight: 700, marginBottom: 24, color: "#fff", letterSpacing: 1 } as React.CSSProperties,
  card: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 24, marginBottom: 28 } as React.CSSProperties,
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#ccc", marginBottom: 20, marginTop: 0 } as React.CSSProperties,
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #2a2a2a",
    background: "#1a1a1a", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "DM Sans, sans-serif",
  } as React.CSSProperties,
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } as React.CSSProperties,
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 } as React.CSSProperties,
  btnPrimary: {
    padding: "11px 28px", borderRadius: 8, border: "none", background: "#cc0000",
    color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
  } as React.CSSProperties,
  btnGhost: {
    padding: "11px 24px", borderRadius: 8, border: "1px solid #333",
    background: "transparent", color: "#888", fontSize: 14, cursor: "pointer",
  } as React.CSSProperties,
  btnSm: {
    padding: "5px 14px", borderRadius: 6, border: "1px solid #333",
    background: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer",
  } as React.CSSProperties,
  btnSmDanger: {
    padding: "5px 14px", borderRadius: 6, border: "1px solid #3a1010",
    background: "transparent", color: "#cc0000", fontSize: 12, cursor: "pointer",
  } as React.CSSProperties,
  imageGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16,
  } as React.CSSProperties,
  imageCard: {
    background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden",
  } as React.CSSProperties,
  thumb: { width: "100%", height: 150, objectFit: "cover" as const, display: "block" },
};
