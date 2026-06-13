import { createFileRoute } from "@tanstack/react-router";
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { PageTransition, ScrollAnimation } from "@/components/PageTransition";
import { useState } from "react";

export const Route = createFileRoute("/demo")({
  component: Demo,
});

function Demo() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
    console.log("Message sent:", message);
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
  };

  const handleImageUpload = (file: File) => {
    console.log("Image uploaded:", file.name);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">V0 AI Chat Demo</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Explore the V0 AI Chat component with Lenis smooth scroll and Framer Motion animations
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Chat Component */}
            <ScrollAnimation className="lg:col-span-2">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Chat Interface</h2>
                <VercelV0Chat
                  onSendMessage={handleSendMessage}
                  onFileUpload={handleFileUpload}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </ScrollAnimation>

            {/* Right Column - Messages Log */}
            <ScrollAnimation>
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Messages Log</h2>
                <div className="border border-border rounded-lg bg-muted/50 p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No messages yet. Try sending one!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className="text-sm p-2 bg-background rounded border border-border/50"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            Message {idx + 1}
                          </p>
                          <p className="text-foreground break-words">{msg}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Features Section */}
          <ScrollAnimation className="mt-16 sm:mt-20 md:mt-24">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-semibold">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Auto-Resizing Textarea",
                    description:
                      "The textarea automatically adjusts its height as you type, with a maximum height of 200px.",
                  },
                  {
                    title: "File Upload",
                    description:
                      "Upload files and images directly from the chat interface with dedicated buttons.",
                  },
                  {
                    title: "Keyboard Shortcuts",
                    description:
                      "Press Enter to send a message, or Shift+Enter to create a new line.",
                  },
                  {
                    title: "Lenis Smooth Scroll",
                    description:
                      "Smooth scrolling experience powered by Lenis for better UX.",
                  },
                  {
                    title: "Framer Motion Animations",
                    description:
                      "Page transitions and scroll animations using Framer Motion.",
                  },
                  {
                    title: "GSAP Integration",
                    description:
                      "Advanced animations and scroll triggers with GSAP and ScrollTrigger.",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 sm:p-6 hover:border-primary transition-colors"
                  >
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Code Example Section */}
          <ScrollAnimation className="mt-16 sm:mt-20 md:mt-24">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold">Usage Example</h2>
              <div className="bg-muted rounded-lg p-4 sm:p-6 overflow-x-auto">
                <pre className="text-xs sm:text-sm text-foreground font-mono">
                  {`import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export function MyComponent() {
  const handleSendMessage = (message: string) => {
    console.log("Message:", message);
  };

  return (
    <VercelV0Chat
      onSendMessage={handleSendMessage}
      onFileUpload={(file) => console.log(file)}
      onImageUpload={(file) => console.log(file)}
    />
  );
}`}
                </pre>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </PageTransition>
  );
}
