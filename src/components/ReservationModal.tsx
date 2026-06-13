import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  X,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";
import emailjs from "@emailjs/browser";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [guests, setGuests] = useState<string>("");
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubmitStatus("idle");
        setGuests("");
        setSelectedDate(null);
        setSelectedTime("");
        setName("");
        setEmail("");
        setPhone("");
        setExpandedSection(null);
      }, 300);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !sidebarRef.current) return;
    const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleTab);
    first?.focus();
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isFormValid = name.trim() && email.trim() && guests && selectedDate && selectedTime;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setSubmitStatus("loading");

    const formattedDate = selectedDate!.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = new Date(`1970-01-01T${selectedTime}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // HTML email body sent to enockmbagariye@gmail.com
    const htmlMessage = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #faf9f6; border: 1px solid #e8e0cc; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #C4A84F, #B8935A); padding: 28px 32px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 22px; letter-spacing: 1px;">AfriPot Restaurant</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">New Table Reservation</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="margin: 0 0 24px; color: #555; font-size: 14px; line-height: 1.6;">
            A new reservation request has been submitted. Details are below.
          </p>

          <!-- Details table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #ede8da;">
              <td style="padding: 12px 0; color: #999; width: 40%; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Guest Name</td>
              <td style="padding: 12px 0; color: #222; font-weight: bold;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ede8da;">
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 12px 0; color: #222;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ede8da;">
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 12px 0; color: #222;">${phone || "—"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ede8da;">
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Guests</td>
              <td style="padding: 12px 0; color: #222;">${guests} ${parseInt(guests) === 1 ? "person" : "people"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ede8da;">
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</td>
              <td style="padding: 12px 0; color: #222;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</td>
              <td style="padding: 12px 0; color: #222;">${formattedTime}</td>
            </tr>
          </table>

          <!-- CTA hint -->
          <div style="margin-top: 28px; background: #f5f0e8; border-left: 3px solid #C4A84F; padding: 14px 16px; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; color: #7a6a3a; font-size: 13px;">
              Reply to this email or call the guest to confirm their reservation.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 32px; background: #f0ebe0; text-align: center;">
          <p style="margin: 0; color: #aaa; font-size: 11px;">AfriPot Restaurant · Reservation System</p>
        </div>
      </div>
    `;

    try {
      console.log("EmailJS config:", {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? "loaded" : "MISSING",
      });
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: "enockmbagariye@gmail.com",
          subject: `New Reservation — ${name} · ${formattedDate} at ${formattedTime}`,
          guest_name: name,
          guest_email: email,
          guest_phone: phone || "Not provided",
          guests,
          date: formattedDate,
          time: formattedTime,
          html_message: htmlMessage,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus("success");
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Restaurant Reservation"
        className="fixed right-3 bottom-20 top-auto left-auto w-[calc(100vw-24px)] max-w-[320px] max-h-[80vh] sm:inset-auto sm:right-6 sm:top-6 sm:h-[calc(100vh-48px)] sm:w-72 sm:max-w-none sm:max-h-none bg-gradient-to-b from-[#C4A84F] to-[#B8935A] shadow-2xl z-50 flex flex-col rounded-2xl"
        style={{ boxShadow: "-4px 0 20px rgba(0,0,0,0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/src/assets/AfriPot_logo2.png" alt="AfriPot" className="h-8 w-auto" />
            <span className="text-sm font-serif text-white font-semibold">AfriPot</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
            aria-label="Close reservation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Welcome */}
          <div className="px-6 pt-5 pb-4">
            <p className="text-white/80 text-xs leading-relaxed italic">
              Reserve your table for an unforgettable evening of authentic African cuisine.
            </p>
          </div>

          <div className="h-px bg-white/20 mx-6" />

          {/* ── Guests ── */}
          <div className="px-6 py-4 border-b border-white/20">
            <button
              onClick={() => toggleSection("guests")}
              className="w-full flex items-center justify-between text-white hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3">
                <Users size={16} aria-hidden="true" />
                <span className="font-serif text-sm">{guests ? `${guests} guest${parseInt(guests) !== 1 ? "s" : ""}` : "Number of guests"}</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedSection === "guests" ? "rotate-180" : ""}`} />
            </button>
            {expandedSection === "guests" && (
              <div className="mt-3">
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseInt(val, 10) >= 1) setGuests(val);
                  }}
                  className="w-full bg-white/10 text-white text-sm font-semibold rounded-lg px-4 py-2.5 border border-white/30 focus:outline-none focus:border-white/60 placeholder-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g. 4"
                />
              </div>
            )}
          </div>

          {/* ── Date ── */}
          <div className="px-6 py-4 border-b border-white/20">
            <button
              onClick={() => toggleSection("date")}
              className="w-full flex items-center justify-between text-white hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3">
                <Calendar size={16} aria-hidden="true" />
                <span className="font-serif text-sm">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                    : "Select a date"}
                </span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedSection === "date" ? "rotate-180" : ""}`} />
            </button>

            {expandedSection === "date" && (() => {
              const year = today.getFullYear();
              const month = today.getMonth();
              const monthName = today.toLocaleString("en-US", { month: "long" });
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const firstDayOfWeek = new Date(year, month, 1).getDay();
              const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
              return (
                <div className="mt-3">
                  <p className="text-white/70 text-xs font-semibold text-center mb-2 tracking-widest uppercase">
                    {monthName} {year}
                  </p>
                  <div className="grid grid-cols-7 mb-1">
                    {dayLabels.map((d) => (
                      <span key={d} className="text-center text-white/40 text-[10px] font-bold py-1">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => <span key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const date = new Date(year, month, day);
                      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => { setSelectedDate(date); setExpandedSection(null); }}
                          className={`
                            aspect-square flex items-center justify-center rounded-full text-[11px] font-semibold transition
                            ${isPast ? "text-white/20 cursor-not-allowed" : ""}
                            ${isSelected ? "bg-white text-[#C4A84F]" : ""}
                            ${!isSelected && isToday ? "ring-1 ring-white text-white" : ""}
                            ${!isSelected && !isPast && !isToday ? "text-white hover:bg-white/20" : ""}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── Time ── */}
          <div className="px-6 py-4 border-b border-white/20">
            <button
              onClick={() => toggleSection("time")}
              className="w-full flex items-center justify-between text-white hover:opacity-80 transition"
            >
              <div className="flex items-center gap-3">
                <Clock size={16} aria-hidden="true" />
                <span className="font-serif text-sm">
                  {selectedTime
                    ? new Date(`1970-01-01T${selectedTime}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                    : "Select a time"}
                </span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${expandedSection === "time" ? "rotate-180" : ""}`} />
            </button>
            {expandedSection === "time" && (
              <div className="mt-3">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/20 px-4 py-2.5 focus:outline-none focus:border-white/50 [color-scheme:dark] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* ── Guest Info ── */}
          <div className="px-6 py-4 space-y-3">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                <User size={11} aria-hidden="true" /> Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/20 focus:border-white/60 focus:outline-none transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                <Mail size={11} aria-hidden="true" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/20 focus:border-white/60 focus:outline-none transition text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                <Phone size={11} aria-hidden="true" /> Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 7XX XXX XXX"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/20 focus:border-white/60 focus:outline-none transition text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 px-6 py-4 shrink-0 space-y-2.5">
          {/* Success */}
          {submitStatus === "success" && (
            <div className="flex items-start gap-2 bg-white/15 rounded-xl px-3 py-2.5">
              <CheckCircle size={15} className="text-white shrink-0 mt-0.5" />
              <p className="text-white text-xs leading-snug">
                <span className="font-bold">Request received!</span> We'll confirm your table shortly.
              </p>
            </div>
          )}

          {/* Error */}
          {submitStatus === "error" && (
            <div className="flex items-start gap-2 bg-red-500/20 rounded-xl px-3 py-2.5">
              <AlertCircle size={15} className="text-white shrink-0 mt-0.5" />
              <p className="text-white text-xs leading-snug">
                <span className="font-bold">Failed to send.</span> Please try again or call us directly.
              </p>
            </div>
          )}

          {/* Validation hint */}
          {submitStatus === "idle" && !isFormValid && (
            <p className="text-white/40 text-[10px] text-center">
              Fill in name, email, guests, date & time to continue
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitStatus === "loading" || submitStatus === "success"}
            className="w-full bg-white text-[#C4A84F] font-serif font-bold py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitStatus === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Sending…</>
            ) : submitStatus === "success" ? (
              <><CheckCircle size={16} /> Reservation Sent</>
            ) : (
              "Reserve a Table"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
