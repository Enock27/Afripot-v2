import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAdminData } from "@/hooks/useAdminData";
import type { GalleryItem } from "@/data/galleryData";
import type { Event } from "@/data/eventsData";
import type { MenuItem, MenuSection } from "@/data/menuData";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const ADMIN_PASSWORD = "afripot2024";
const GALLERY_CATEGORIES = ["Food", "Drinks", "Atmosphere"];

function uid() { return String(Date.now() + Math.floor(Math.random() * 9999)); }

/** Converts any Imgur single-image URL to a direct embeddable image URL.
 *  Returns null if the URL is an Imgur album (cannot be embedded). */
function normalizeImageUrl(url: string): { url: string; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) return { url: trimmed };

  // Detect Imgur ALBUM — cannot embed, must reject
  if (/imgur\.com\/a\//i.test(trimmed)) {
    return { url: trimmed, error: "That is an Imgur album link. Open the album, click on a single photo, then right-click it → Copy image address." };
  }
  if (/imgur\.com\/gallery\//i.test(trimmed)) {
    return { url: trimmed, error: "That is an Imgur gallery link. Open it, click on a single photo, then right-click → Copy image address." };
  }

  // Already a direct image URL (ends with image extension)
  if (/\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(trimmed)) return { url: trimmed };

  // Imgur single-image page: imgur.com/AbCdEfG
  const imgurMatch = trimmed.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,8})\/?$/);
  if (imgurMatch) return { url: `https://i.imgur.com/${imgurMatch[1]}.jpg` };

  // i.imgur.com without extension
  const iImgurMatch = trimmed.match(/^https?:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\/?$/);
  if (iImgurMatch) return { url: `https://i.imgur.com/${iImgurMatch[1]}.jpg` };

  // Pass through (ImgBB, Google Drive, etc.)
  return { url: trimmed };
}

// ─── root ─────────────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("afripot_admin") === "1");
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("afripot_admin"); setAuthed(false); }} />;
}

// ─── login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false); const [shake, setShake] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("afripot_admin", "1"); onSuccess(); }
    else { setErr(true); setShake(true); setTimeout(() => setShake(false), 500); }
  }
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans,sans-serif" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <form onSubmit={submit} style={{ background:"#111", border:"1px solid #222", borderRadius:16, padding:"48px 40px", width:"100%", maxWidth:380, textAlign:"center", animation:shake?"shake 0.4s ease":"none" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🍲</div>
        <h1 style={{ color:"#fff", fontSize:20, fontWeight:700, marginBottom:4 }}>AfriPot Admin</h1>
        <p style={{ color:"#666", fontSize:13, marginBottom:32 }}>Enter your password to continue</p>
        <input type="password" value={pw} autoFocus onChange={e => { setPw(e.target.value); setErr(false); }} placeholder="Password"
          style={{ width:"100%", padding:"12px 16px", borderRadius:8, border:`1px solid ${err?"#cc0000":"#333"}`, background:"#1a1a1a", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box", marginBottom:8 }} />
        {err && <p style={{ color:"#cc0000", fontSize:12, marginBottom:8 }}>Incorrect password.</p>}
        <button type="submit" style={{ width:"100%", padding:13, borderRadius:8, border:"none", background:"#cc0000", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 }}>Sign In</button>
      </form>
    </div>
  );
}

// ─── dashboard ────────────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"gallery"|"events"|"menu">("gallery");
  const { gallery, events, menu, saveGallery, saveEvents, saveMenu, ready } = useAdminData();
  if (!ready) return <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#666", fontFamily:"DM Sans,sans-serif" }}>Loading…</p></div>;
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", fontFamily:"DM Sans,sans-serif", color:"#fff" }}>
      <SiteHeader />
      {/* tab bar */}
      <div style={{ borderBottom:"1px solid #1e1e1e", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
          <div style={{ display:"flex", gap:4 }}>
            {(["gallery","events","menu"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"6px 20px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, textTransform:"capitalize", letterSpacing:1, background:tab===t?"#cc0000":"transparent", color:tab===t?"#fff":"#888" }}>{t}</button>
            ))}
          </div>
          <button onClick={onLogout} style={{ padding:"6px 16px", borderRadius:6, border:"1px solid #333", background:"transparent", color:"#888", fontSize:12, cursor:"pointer" }}>Sign Out</button>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        {tab === "gallery" && <GalleryAdmin items={gallery} onSave={saveGallery} />}
        {tab === "events"  && <EventsAdmin  items={events}  onSave={saveEvents}  />}
        {tab === "menu"    && <MenuAdmin    sections={menu} onSave={saveMenu}    />}
      </div>
      <SiteFooter />
    </div>
  );
}

// ─── shared: Toast + Field + styles ──────────────────────────────────────────
function Toast({ msg, isError }: { msg: string; isError?: boolean }) {
  if (!msg) return null;
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:isError?"#2a0a0a":"#1a1a1a", border:`1px solid ${isError?"#cc0000":"#333"}`, color:isError?"#ff6b6b":"#fff", padding:"12px 24px", borderRadius:10, fontSize:14, zIndex:9999, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", whiteSpace:"nowrap", maxWidth:"90vw", textAlign:"center" }}>
      {msg}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", color:"#888", fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}
const S = {
  card:       { background:"#111", border:"1px solid #1e1e1e", borderRadius:12, padding:24, marginBottom:28 } as React.CSSProperties,
  cardTitle:  { fontSize:15, fontWeight:700, color:"#ccc", marginBottom:20, marginTop:0 } as React.CSSProperties,
  input:      { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #2a2a2a", background:"#1a1a1a", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" as const, fontFamily:"DM Sans,sans-serif" } as React.CSSProperties,
  grid2:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 } as React.CSSProperties,
  grid3:      { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 } as React.CSSProperties,
  btnPrimary: { padding:"11px 28px", borderRadius:8, border:"none", background:"#cc0000", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" } as React.CSSProperties,
  btnGhost:   { padding:"11px 24px", borderRadius:8, border:"1px solid #333", background:"transparent", color:"#888", fontSize:14, cursor:"pointer" } as React.CSSProperties,
  btnSm:      { padding:"5px 14px", borderRadius:6, border:"1px solid #333", background:"transparent", color:"#ccc", fontSize:12, cursor:"pointer" } as React.CSSProperties,
  btnSmDanger:{ padding:"5px 14px", borderRadius:6, border:"1px solid #3a1010", background:"transparent", color:"#cc0000", fontSize:12, cursor:"pointer" } as React.CSSProperties,
  sectionTitle:{ fontSize:22, fontWeight:700, marginBottom:24, color:"#fff", letterSpacing:1 } as React.CSSProperties,
  imageGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 } as React.CSSProperties,
  imageCard:  { background:"#111", border:"1px solid #1e1e1e", borderRadius:12, overflow:"hidden" } as React.CSSProperties,
  thumb:      { width:"100%", height:150, objectFit:"cover" as const, display:"block" },
};

function useToast() {
  const [state, setState] = useState({ msg: "", isError: false });
  const show = (msg: string, isError = false) => { setState({ msg, isError }); setTimeout(() => setState({ msg:"", isError:false }), 3000); };
  return { toastMsg: state.msg, toastError: state.isError, showToast: show };
}

// ─── URL tip banner ───────────────────────────────────────────────────────────
function ImageUrlTip() {
  return (
    <div style={{ background:"#0d1a0d", border:"1px solid #1a3a1a", borderRadius:8, padding:"12px 16px", marginBottom:12, fontSize:12, color:"#7aaa7a", lineHeight:1.8 }}>
      <strong style={{ color:"#90cc90", fontSize:13 }}>📎 How to get an image URL — use ImgBB (recommended)</strong>
      <ol style={{ margin:"8px 0 0", paddingLeft:18, color:"#aaa" }}>
        <li>Go to <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color:"#6bc96b" }}>imgbb.com</a> → click <strong style={{ color:"#fff" }}>Start Uploading</strong> → pick your photo</li>
        <li>After upload, scroll down and find <strong style={{ color:"#fff" }}>Direct link</strong> — copy that URL</li>
        <li>Paste it in the field below — it ends in <code style={{ color:"#aaa" }}>.jpg</code> and will preview immediately</li>
      </ol>
      <div style={{ marginTop:8, padding:"8px 10px", background:"#1a0a0a", borderRadius:6, border:"1px solid #3a1a1a", color:"#ff8888", fontSize:11 }}>
        ⚠️ <strong>Imgur album links (imgur.com/a/…) do not work.</strong> If you use Imgur, open the album, click one photo, then right-click the image itself → <em>Copy image address</em> to get a direct <code>.jpg</code> link.
      </div>
    </div>
  );
}

// ─── gallery admin ────────────────────────────────────────────────────────────
const emptyGalleryItem = (): GalleryItem => ({ id: uid(), title: "", category: "Food", image: "" });

/** Read a File as a base-64 data URL */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Rough size check — warn if the data URL will be large in localStorage */
const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024; // 1.5 MB per image

function GalleryAdmin({ items, onSave }: { items: GalleryItem[]; onSave: (i: GalleryItem[]) => string | null }) {
  const [form, setForm]       = useState<GalleryItem>(emptyGalleryItem());
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "upload">("upload");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toastMsg, toastError, showToast } = useToast();

  function handleUrlChange(url: string) {
    const { url: normalized, error } = normalizeImageUrl(url);
    setForm(f => ({ ...f, image: normalized }));
    setPreview(normalized);
    if (error) showToast("❌ " + error, true);
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select an image file (jpg, png, webp…)", true);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      showToast("⚠️ Image is larger than 1.5 MB. Please compress it first or use a URL instead.", true);
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm(f => ({ ...f, image: dataUrl }));
      setPreview(dataUrl);
      // Pre-fill title from filename if blank
      setForm(f => ({
        ...f,
        image: dataUrl,
        title: f.title.trim() ? f.title : file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }));
    } catch {
      showToast("❌ Failed to read file. Please try again.", true);
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [showToast]);

  // Drag-and-drop onto the upload zone
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Reuse the same logic by synthesising a change event target
    const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    await handleFileChange(fakeEvent);
  }, [handleFileChange]);

  function saveItem() {
    if (!form.title.trim()) { showToast("⚠️ Title is required.", true); return; }
    if (!form.image.trim()) { showToast("⚠️ Image is required.", true); return; }
    const next = editing
      ? items.map(i => i.id === editing ? { ...form } : i)
      : [{ ...form, id: uid() }, ...items];
    const err = onSave(next);
    if (err) { showToast("❌ " + err, true); return; }
    showToast(editing ? "✅ Image updated!" : "✅ Image added to gallery!");
    setForm(emptyGalleryItem()); setEditing(null); setPreview("");
  }

  function editItem(item: GalleryItem) {
    setForm({ ...item });
    setEditing(item.id);
    setPreview(item.image);
    // If image is a data URL it was uploaded; show upload tab, otherwise URL tab
    setInputMode(item.image.startsWith("data:") ? "upload" : "url");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function deleteItem(id: string) {
    if (confirm("Delete this image?")) {
      const err = onSave(items.filter(i => i.id !== id));
      if (err) showToast("❌ " + err, true); else showToast("🗑️ Deleted.");
    }
  }
  function cancel() { setForm(emptyGalleryItem()); setEditing(null); setPreview(""); }

  return (
    <div>
      <Toast msg={toastMsg} isError={toastError} />
      <h2 style={S.sectionTitle}>Gallery <span style={{ color:"#555", fontSize:16 }}>({items.length} images)</span></h2>

      <div style={S.card}>
        <h3 style={S.cardTitle}>{editing ? "✏️ Edit Image" : "➕ Add New Image"}</h3>

        {/* Title + Category */}
        <div style={S.grid2}>
          <Field label="Title">
            <input style={S.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Jollof Rice" />
          </Field>
          <Field label="Category">
            <select style={S.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        {/* Mode toggle */}
        <div style={{ display:"flex", gap:0, marginBottom:12, borderRadius:8, overflow:"hidden", border:"1px solid #2a2a2a", width:"fit-content" }}>
          {(["upload","url"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => { setInputMode(mode); setPreview(""); setForm(f => ({ ...f, image: "" })); }}
              style={{ padding:"8px 20px", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, letterSpacing:0.5, textTransform:"uppercase", background: inputMode === mode ? "#cc0000" : "#1a1a1a", color: inputMode === mode ? "#fff" : "#666", transition:"background 0.2s" }}
            >
              {mode === "upload" ? "📁 Upload File" : "🔗 Paste URL"}
            </button>
          ))}
        </div>

        {/* Upload mode */}
        {inputMode === "upload" && (
          <Field label="Image File (jpg, png, webp — max 1.5 MB)">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{ border:"2px dashed #2a2a2a", borderRadius:10, padding:"32px 20px", textAlign:"center", cursor:"pointer", background:"#141414", transition:"border-color 0.2s", position:"relative" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#cc0000")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              {uploading ? (
                <p style={{ color:"#888", margin:0, fontSize:14 }}>Reading file…</p>
              ) : preview && form.image.startsWith("data:") ? (
                <div>
                  <img src={preview} alt="preview" style={{ maxHeight:160, maxWidth:"100%", borderRadius:8, objectFit:"cover" }} />
                  <p style={{ color:"#666", fontSize:11, marginTop:8, marginBottom:0 }}>Click or drag to replace</p>
                </div>
              ) : (
                <>
                  <p style={{ color:"#888", margin:"0 0 6px", fontSize:28 }}>🖼️</p>
                  <p style={{ color:"#888", margin:"0 0 4px", fontSize:14 }}>Click to choose a photo, or drag one here</p>
                  <p style={{ color:"#555", margin:0, fontSize:11 }}>JPG, PNG, WEBP — max 1.5 MB</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            </div>
          </Field>
        )}

        {/* URL mode */}
        {inputMode === "url" && (
          <Field label="Image URL">
            <ImageUrlTip />
            <input style={S.input} value={form.image.startsWith("data:") ? "" : form.image} onChange={e => handleUrlChange(e.target.value)} placeholder="https://i.imgur.com/xxxxxx.jpg" />
            {preview && !form.image.startsWith("data:") && (
              <div style={{ marginTop:12 }}>
                <img src={preview} alt="preview" onError={() => showToast("⚠️ Image URL did not load. Check the link.", true)}
                  style={{ height:160, borderRadius:8, objectFit:"cover", border:"1px solid #2a2a2a", maxWidth:"100%" }} />
              </div>
            )}
          </Field>
        )}

        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={saveItem} style={S.btnPrimary} disabled={uploading}>
            {editing ? "Save Changes" : "Add to Gallery"}
          </button>
          {editing && <button onClick={cancel} style={S.btnGhost}>Cancel</button>}
        </div>
      </div>

      {/* Existing images grid */}
      {items.length > 0 && (
        <div style={S.imageGrid}>
          {items.map(item => (
            <div key={item.id} style={S.imageCard}>
              <img src={item.image} alt={item.title} style={S.thumb} />
              <div style={{ padding:"10px 12px" }}>
                <p style={{ margin:0, fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.title}</p>
                <p style={{ margin:"2px 0 10px", fontSize:11, color:"#cc0000", textTransform:"uppercase", letterSpacing:1 }}>{item.category}</p>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={() => editItem(item)} style={S.btnSm}>Edit</button>
                  <button onClick={() => deleteItem(item.id)} style={S.btnSmDanger}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── events admin ─────────────────────────────────────────────────────────────
const emptyEvent = (): Event => ({ id: uid(), title: "", date: "", time: "", location: "", description: "", image: "", isFeatured: false });

function EventsAdmin({ items, onSave }: { items: Event[]; onSave: (e: Event[]) => string | null }) {
  const [form, setForm] = useState<Event>(emptyEvent());
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const { toastMsg, toastError, showToast } = useToast();

  function set(field: keyof Event, val: string | boolean) { setForm(f => ({ ...f, [field]: val })); }
  function handleImgChange(url: string) {
    const { url: normalized, error } = normalizeImageUrl(url);
    set("image", normalized);
    setPreview(normalized);
    if (error) showToast("❌ " + error, true);
  }

  function saveItem() {
    if (!form.title.trim()) { showToast("⚠️ Title is required.", true); return; }
    if (!form.date)          { showToast("⚠️ Date is required.", true); return; }
    if (!form.image.trim())  { showToast("⚠️ Image URL is required.", true); return; }
    const next = editing ? items.map(i => i.id === editing ? { ...form } : i) : [{ ...form, id: uid() }, ...items];
    const err = onSave(next);
    if (err) { showToast("❌ " + err, true); return; }
    showToast(editing ? "✅ Event updated!" : "✅ Event created!");
    setForm(emptyEvent()); setEditing(null); setPreview("");
  }

  function editItem(ev: Event) { setForm({ ...ev }); setEditing(ev.id); setPreview(ev.image); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function deleteItem(id: string) { if (confirm("Delete this event?")) { const err = onSave(items.filter(i => i.id !== id)); if (err) showToast("❌ " + err, true); else showToast("🗑️ Deleted."); } }
  function cancel() { setForm(emptyEvent()); setEditing(null); setPreview(""); }

  return (
    <div>
      <Toast msg={toastMsg} isError={toastError} />
      <h2 style={S.sectionTitle}>Events <span style={{ color:"#555", fontSize:16 }}>({items.length} events)</span></h2>
      <div style={S.card}>
        <h3 style={S.cardTitle}>{editing ? "✏️ Edit Event" : "➕ Add New Event"}</h3>
        <Field label="Event Title"><input style={S.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. AfriPot Gala Night" /></Field>
        <div style={S.grid3}>
          <Field label="Date"><input style={S.input} type="date" value={form.date} onChange={e => set("date", e.target.value)} /></Field>
          <Field label="Time"><input style={S.input} type="time" value={form.time} onChange={e => set("time", e.target.value)} /></Field>
          <Field label="Location"><input style={S.input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. KN 51 St, Kigali" /></Field>
        </div>
        <Field label="Description">
          <textarea style={{ ...S.input, minHeight:80, resize:"vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the event…" />
        </Field>
        <Field label="Banner Image URL">
          <ImageUrlTip />
          <input style={S.input} value={form.image} onChange={e => handleImgChange(e.target.value)} placeholder="https://i.imgur.com/xxxxxx.jpg" />
        </Field>
        {preview && (
          <div style={{ marginTop:12 }}>
            <p style={{ color:"#666", fontSize:11, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Preview</p>
            <img src={preview} alt="preview" onError={() => showToast("⚠️ Image URL did not load.", true)} style={{ height:160, borderRadius:8, objectFit:"cover", border:"1px solid #2a2a2a", maxWidth:"100%" }} />
          </div>
        )}
        <label style={{ display:"flex", alignItems:"center", gap:10, marginTop:16, cursor:"pointer" }}>
          <input type="checkbox" checked={!!form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} style={{ width:18, height:18, accentColor:"#cc0000", cursor:"pointer" }} />
          <span style={{ color:"#ccc", fontSize:13 }}>Mark as Featured Event</span>
        </label>
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={saveItem} style={S.btnPrimary}>{editing ? "Save Changes" : "Create Event"}</button>
          {editing && <button onClick={cancel} style={S.btnGhost}>Cancel</button>}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {items.map(ev => (
          <div key={ev.id} style={{ ...S.card, display:"flex", gap:16, padding:16, alignItems:"flex-start", marginBottom:0 }}>
            <img src={ev.image} alt={ev.title} style={{ width:110, height:74, objectFit:"cover", borderRadius:8, flexShrink:0, border:"1px solid #2a2a2a" }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <p style={{ margin:0, fontWeight:700, fontSize:14 }}>{ev.title}</p>
                {ev.isFeatured && <span style={{ background:"#cc0000", color:"#fff", fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700, letterSpacing:1 }}>FEATURED</span>}
              </div>
              <p style={{ margin:"4px 0 2px", color:"#888", fontSize:12 }}>{ev.date} · {ev.time} · {ev.location}</p>
              <p style={{ margin:0, color:"#555", fontSize:12, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>{ev.description}</p>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              <button onClick={() => editItem(ev)} style={S.btnSm}>Edit</button>
              <button onClick={() => deleteItem(ev.id)} style={S.btnSmDanger}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── menu admin ───────────────────────────────────────────────────────────────
const emptyItem = (): MenuItem => ({ name: "", ingredients: "", price: "" });

function MenuAdmin({ sections, onSave }: { sections: MenuSection[]; onSave: (s: MenuSection[]) => string | null }) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const [form, setForm] = useState<MenuItem>(emptyItem());
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "food" | "beverages">("all");
  const { toastMsg, toastError, showToast } = useToast();

  const visibleSections = filter === "all" ? sections : sections.filter(s => s.category === filter);
  const activeSection = sections.find(s => s.id === activeSectionId) ?? sections[0];

  function updateSection(updatedItems: MenuItem[]) {
    const next = sections.map(s => s.id === activeSection.id ? { ...s, items: updatedItems } : s);
    const err = onSave(next);
    if (err) showToast("❌ " + err, true);
    return err;
  }

  function saveItem() {
    if (!form.name.trim()) { showToast("⚠️ Name is required.", true); return; }
    const items = [...activeSection.items];
    if (editingIdx !== null) items[editingIdx] = { ...form };
    else items.push({ ...form });
    const err = updateSection(items);
    if (!err) { showToast(editingIdx !== null ? "✅ Item updated!" : "✅ Item added!"); setForm(emptyItem()); setEditingIdx(null); }
  }

  function startEdit(item: MenuItem, idx: number) { setForm({ ...item }); setEditingIdx(idx); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function deleteItem(idx: number) { if (confirm("Remove this item?")) { const items = activeSection.items.filter((_, i) => i !== idx); const err = updateSection(items); if (!err) showToast("🗑️ Removed."); } }
  function cancelEdit() { setForm(emptyItem()); setEditingIdx(null); }

  return (
    <div>
      <Toast msg={toastMsg} isError={toastError} />
      <h2 style={S.sectionTitle}>Menu <span style={{ color:"#555", fontSize:16 }}>({sections.reduce((a, s) => a + s.items.length, 0)} items)</span></h2>

      {/* category filter */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {(["all","food","beverages"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...S.btnSm, background:filter===f?"#cc0000":"transparent", color:filter===f?"#fff":"#888", border:filter===f?"none":"1px solid #333", textTransform:"capitalize" }}>{f}</button>
        ))}
      </div>

      {/* section selector */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
        {visibleSections.map(s => (
          <button key={s.id} onClick={() => { setActiveSectionId(s.id); cancelEdit(); }} style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${activeSectionId===s.id?"#cc0000":"#2a2a2a"}`, background:activeSectionId===s.id?"#1a0000":"transparent", color:activeSectionId===s.id?"#ff8888":"#888", fontSize:11, fontWeight:600, letterSpacing:0.5, cursor:"pointer" }}>{s.title}</button>
        ))}
      </div>

      {/* form */}
      {activeSection && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>{editingIdx !== null ? `✏️ Edit item in ${activeSection.title}` : `➕ Add item to ${activeSection.title}`}</h3>
          <div style={S.grid2}>
            <Field label="Dish / Item Name"><input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jollof Rice" /></Field>
            <Field label="Price (e.g. 9,000)"><input style={S.input} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="9,000" /></Field>
          </div>
          <Field label="Ingredients / Description">
            <textarea style={{ ...S.input, minHeight:70, resize:"vertical" }} value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} placeholder="e.g. Rice, chicken, spices, herbs" />
          </Field>
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button onClick={saveItem} style={S.btnPrimary}>{editingIdx !== null ? "Save Changes" : "Add Item"}</button>
            {editingIdx !== null && <button onClick={cancelEdit} style={S.btnGhost}>Cancel</button>}
          </div>
        </div>
      )}

      {/* items list */}
      {activeSection && (
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {activeSection.items.length === 0 && <p style={{ color:"#555", fontSize:13, padding:"20px 0" }}>No items yet. Add one above.</p>}
          {activeSection.items.map((item, idx) => (
            <div key={idx} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#111", borderRadius:8, border:"1px solid #1e1e1e" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontWeight:600, fontSize:14, color:"#fff" }}>{item.name}</span>
                {item.price && <span style={{ marginLeft:10, color:"#cc0000", fontSize:13 }}>{item.price} RWF</span>}
                {item.ingredients && <p style={{ margin:"3px 0 0", color:"#666", fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.ingredients}</p>}
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={() => startEdit(item, idx)} style={S.btnSm}>Edit</button>
                <button onClick={() => deleteItem(idx)} style={S.btnSmDanger}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
