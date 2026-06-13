import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ReservationModal } from "@/components/ReservationModal";
import { useState } from "react";

export const Route = createFileRoute("/reservation")({
  component: ReservationPage,
  head: () => ({
    meta: [
      { title: "Reserve — AfriPot Restaurant" },
      { name: "description", content: "Reserve a table at AfriPot Restaurant." },
    ],
  }),
});

function ReservationPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SiteFooter />
    </div>
  );
}
