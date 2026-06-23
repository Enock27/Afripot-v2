import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — AfriPot Restaurant" },
      { name: "description", content: "Find AfriPot Restaurant in Kigali, Rwanda." },
    ],
  }),
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 md:px-12 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-6">Reserve · Contact</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl">
          Be our <em className="text-gradient-gold">guest</em>
        </h1>
      </section>

      {/* Map + Info */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-background">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

            {/* Left — contact details */}
            <ScrollReveal>
              <div>
                <p className="text-[0.65rem] sm:text-xs tracking-[0.4em] uppercase text-gold mb-4 sm:mb-6">Visit Us</p>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 sm:mb-8">
                  Find us on the map
                </h2>
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold mb-2 sm:mb-3">Address</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Nyarugenge 19 KN 51 St<br />Kigali, Rwanda
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold mb-2 sm:mb-3">Phone</h3>
                    <a
                      href="tel:0795304581"
                      className="text-sm sm:text-base text-foreground hover:text-gold transition-colors font-semibold"
                    >
                      +250 795 304 581
                    </a>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold mb-2 sm:mb-3">Hours</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Mon – Sun<br />7:00 AM – 12:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Google Map */}
            <ScrollReveal>
              <div className="w-full h-80 sm:h-96 md:h-[450px] rounded-lg overflow-hidden shadow-elegant">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d996.8767475107347!2d30.0700598!3d-1.950352199999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2srw!4v1777156713364!5m2!1sen!2srw"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  title="AfriPot Restaurant location"
                />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
