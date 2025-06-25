"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [contactPurpose, setContactPurpose] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showCopyTick, setShowCopyTick] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state when closing popup
  const closePopup = () => {
    setShowContactPopup(false);
    setTimeout(() => {
      setContactPurpose(null);
      setSelectedEmail(null);
      setCopyFeedback(null);
      setShowCopyTick(false);
    }, 300);
  };

  // Handle purpose selection
  const handlePurposeSelect = (purpose: string) => {
    setContactPurpose(purpose);

    if (purpose === "job" || purpose === "business") {
      setSelectedEmail("hello@yashsuthar.com");
    } else {
      setSelectedEmail("yashsuthar0309@gmail.com");
    }
  };

  // Go back to purpose selection
  const goBackToPurpose = () => {
    setContactPurpose(null);
    setSelectedEmail(null);
    setCopyFeedback(null);
    setShowCopyTick(false);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (selectedEmail) {
      navigator.clipboard.writeText(selectedEmail);
      setCopyFeedback("Copied!");
      setShowCopyTick(true);

      // Reset the tick after 2 seconds
      setTimeout(() => {
        setCopyFeedback(null);
        setShowCopyTick(false);
      }, 2000);
    }
  };

  // Particles background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }[] = [];
    let animationFrameId: number;
    let isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(window.innerWidth / 15, 40);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDark
        ? "rgba(255, 255, 255, 0.6)"
        : "rgba(0, 0, 0, 0.6)";
      ctx.beginPath();

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
              : `rgba(0, 0, 0, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      ctx.fill();
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    resizeCanvas();
    updateParticles();

    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      isDark = e.matches;
    };
    colorSchemeQuery.addEventListener("change", handleColorSchemeChange);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      colorSchemeQuery.removeEventListener("change", handleColorSchemeChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Particles Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 opacity-40"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="w-full p-4 md:p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">Yash Suthar</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="max-w-2xl w-full space-y-6 md:space-y-8 text-center backdrop-blur-sm bg-background/30 p-6 md:p-8 rounded-xl">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Portfolio Coming Soon
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              I&apos;m currently working on something awesome. Stay tuned!
            </p>
          </div>

          <div className="w-16 md:w-24 h-1 bg-foreground/20 mx-auto rounded-full"></div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">
              Meanwhile, you can find me here:
            </h3>
            <div className="flex justify-center flex-wrap gap-4 md:gap-5 py-2">
              <Link
                href="https://github.com/yashsuthar00"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">GitHub</span>
                </div>
              </Link>

              <Link
                href="https://www.linkedin.com/in/yashsuthar00"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">LinkedIn</span>
                </div>
              </Link>

              <Link
                href="https://resume.yashsuthar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">Resume</span>
                </div>
              </Link>

              <Link
                href="https://leetcode.com/yashsuthar00"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 17L10 11L4 5"></path>
                      <path d="M12 19L20 19"></path>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">LeetCode</span>
                </div>
              </Link>

              <Link
                href="https://colab-ide.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                      <line x1="12" y1="22" x2="12" y2="15.5"></line>
                      <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">Projects</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="w-16 md:w-24 h-1 bg-foreground/20 mx-auto rounded-full"></div>

          <div className="pt-1 md:pt-2">
            <h3 className="text-lg md:text-xl font-semibold mb-3">
              Get in touch
            </h3>
            <button
              onClick={() => setShowContactPopup(true)}
              className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 text-sm md:text-base"
            >
              <svg
                className="mr-2 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Contact Me
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-3 md:p-6">
        <div className="max-w-5xl mx-auto text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Yash Suthar. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={closePopup}
            aria-hidden="true"
          ></div>

          <div className="glass-morphism rounded-xl shadow-lg p-6 max-w-md w-full z-10 relative animate-scaleIn">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-foreground/10 transition-colors interactive-glow"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!contactPurpose ? (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  What can I help you with?
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handlePurposeSelect("job")}
                    className="flex items-center p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left hover:scale-[1.01] interactive-glow"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-foreground/10 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Job Opportunity</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hiring or recruitment inquiry
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePurposeSelect("business")}
                    className="flex items-center p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left hover:scale-[1.01] interactive-glow"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-foreground/10 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Business Inquiry</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Collaboration or project proposal
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePurposeSelect("feedback")}
                    className="flex items-center p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left hover:scale-[1.01] interactive-glow"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-foreground/10 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Feedback</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Comments on projects or suggestions
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePurposeSelect("other")}
                    className="flex items-center p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left hover:scale-[1.01] interactive-glow"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-foreground/10 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Other</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Personal message or other inquiry
                      </p>
                    </div>
                  </button>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Or connect with me directly on{" "}
                  <a
                    href="https://www.linkedin.com/in/yashsuthar00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:underline"
                  >
                    LinkedIn
                  </a>
                </p>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center">
                  <button
                    onClick={goBackToPurpose}
                    className="mr-2 p-1.5 rounded-full hover:bg-foreground/10 transition-colors interactive-glow"
                    aria-label="Go back"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </button>
                  <h3 className="text-xl font-semibold">Contact Details</h3>
                </div>

                <div className="glass-card rounded-lg p-5 transition-all">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-foreground/10 dark:bg-foreground/15 mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>

                    <div className="text-center">
                      <h4 className="font-medium text-lg mb-1">
                        {contactPurpose === "job"
                          ? "Job Opportunity"
                          : contactPurpose === "business"
                          ? "Business Inquiry"
                          : contactPurpose === "feedback"
                          ? "Feedback"
                          : "Personal Message"}
                      </h4>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {contactPurpose === "job" || contactPurpose === "business"
                          ? "Please use my professional email address:"
                          : "Please use my personal email address:"}
                      </p>

                      <div className="flex items-center justify-center gap-2 mb-4 relative">
                        <code className="bg-foreground/10 dark:bg-foreground/15 px-3 py-2 rounded-md text-sm relative transition-all">
                          {selectedEmail}
                          {copyFeedback && (
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background dark:bg-foreground dark:text-background px-2 py-1 rounded text-xs animate-fadeIn">
                              {copyFeedback}
                            </span>
                          )}
                        </code>
                        <button
                          onClick={handleCopy}
                          className="p-2 rounded-full bg-foreground/10 dark:bg-foreground/15 hover:bg-foreground/15 dark:hover:bg-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 interactive-glow"
                          title={showCopyTick ? "Copied!" : "Copy to clipboard"}
                          aria-label={showCopyTick ? "Copied!" : "Copy to clipboard"}
                        >
                          {showCopyTick ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-green-500 dark:text-green-400 animate-checkmark"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          )}
                        </button>
                      </div>

                      <a
                        href={`mailto:${selectedEmail}?subject=${encodeURIComponent(
                          `${
                            contactPurpose === "job"
                              ? "Job Opportunity"
                              : contactPurpose === "business"
                              ? "Business Inquiry"
                              : contactPurpose === "feedback"
                              ? "Feedback"
                              : "Personal Message"
                          } for Yash Suthar`
                        )}`}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-foreground text-background dark:bg-foreground/90 dark:text-background transition-colors hover:bg-foreground/90 dark:hover:bg-foreground interactive-glow text-sm"
                      >
                        <svg
                          className="mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Open Email Client
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Prefer another method? Contact me on{" "}
                  <a
                    href="https://www.linkedin.com/in/yashsuthar00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:underline"
                  >
                    LinkedIn
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
