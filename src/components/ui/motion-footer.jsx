import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/images/logo.webp";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 18%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 12%, transparent) 40%,
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
      0 10px 30px -10px var(--pill-shadow),
      inset 0 1px 1px var(--pill-highlight),
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
      0 20px 40px -10px var(--pill-shadow-hover),
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

/* Giant Background Text */
.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Heading Text */
.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}

/* Muted / primary colour aliases scoped inside the footer */
.cinematic-footer-wrapper .text-primary-60  { color: color-mix(in oklch, var(--primary)   60%, transparent); }
.cinematic-footer-wrapper .text-secondary-60{ color: color-mix(in oklch, var(--secondary) 60%, transparent); }
.cinematic-footer-wrapper .text-muted       { color: var(--muted-foreground); }
.cinematic-footer-wrapper .text-fore        { color: var(--foreground); }
.cinematic-footer-wrapper .border-subtle    { border-color: var(--border); }
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
const MagneticButton = React.forwardRef(
  ({ className = "", children, as: Component = "button", href, target, rel, onClick, ...props }, forwardedRef) => {
    const localRef = useRef(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;
          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    const handleClick = (e) => {
      if (onClick) onClick(e);
      // If it's being used as an anchor, ensure navigation always fires
      if (Component === "a" && href && !e.defaultPrevented) {
        if (target === "_blank") {
          window.open(href, "_blank", "noreferrer");
        } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
          window.location.href = href;
        }
      }
    };

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MARQUEE STRIP
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 48, padding: "0 24px", whiteSpace: "nowrap" }}>
    <span>Handmade in Perth</span>
    <span style={{ color: "var(--primary)", opacity: 0.7 }}>✦</span>
    <span>West African Flavours</span>
    <span style={{ color: "var(--secondary)", opacity: 0.7 }}>✦</span>
    <span>30 Chin-Chin Varieties</span>
    <span style={{ color: "var(--primary)", opacity: 0.7 }}>✦</span>
    <span>Catering &amp; Events</span>
    <span style={{ color: "var(--secondary)", opacity: 0.7 }}>✦</span>
    <span>Perth, Western Australia</span>
    <span style={{ color: "var(--primary)", opacity: 0.7 }}>✦</span>
  </div>
);

// -------------------------------------------------------------------------
// 4. MAIN COMPONENT
// -------------------------------------------------------------------------
export function CinematicFooter() {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh", scale: 1, opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Inline style objects (avoids Tailwind dependency)
  const s = {
    wrapper: {
      position: "relative",
      height: "100vh",
      width: "100%",
      clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
    },
    footer: {
      position: "fixed",
      bottom: 0, left: 0,
      width: "100%", height: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      overflow: "hidden",
      background: "var(--background)",
      color: "var(--foreground)",
    },
    aurora: {
      position: "absolute",
      left: "50%", top: "50%",
      width: "80vw", height: "60vh",
      borderRadius: "50%",
      filter: "blur(80px)",
      pointerEvents: "none",
      zIndex: 0,
    },
    grid: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
    },
    giantText: {
      fontSize: "26vw",
      lineHeight: 0.75,
      fontWeight: 900,
      letterSpacing: "-0.05em",
      position: "absolute",
      bottom: "-5vh",
      left: "50%",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      zIndex: 0,
      pointerEvents: "none",
      userSelect: "none",
    },
    marqueeBar: {
      position: "absolute",
      top: 48,
      left: 0,
      width: "100%",
      overflow: "hidden",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      background: "rgba(43,27,18,0.6)",
      backdropFilter: "blur(12px)",
      padding: "16px 0",
      zIndex: 10,
      transform: "rotate(-2deg) scaleX(1.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    },
    marqueeTrack: {
      display: "flex",
      width: "max-content",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: "rgba(251,245,234,0.55)",
      animation: "footer-scroll-marquee 40s linear infinite",
    },
    centerContent: {
      position: "relative",
      zIndex: 10,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      marginTop: 80,
      maxWidth: 900,
      margin: "80px auto 0",
      width: "100%",
    },
    heading: {
      fontSize: "clamp(40px, 8vw, 86px)",
      fontFamily: "'Fraunces', serif",
      fontWeight: 900,
      letterSpacing: "-0.03em",
      marginBottom: 48,
      textAlign: "center",
    },
    pillsWrap: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      width: "100%",
    },
    primaryPills: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16,
    },
    secondaryPills: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12,
      marginTop: 8,
    },
    pill: {
      padding: "20px 40px",
      borderRadius: 999,
      color: "var(--foreground)",
      fontWeight: 700,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    pillSm: {
      padding: "12px 24px",
      borderRadius: 999,
      color: "rgba(251,245,234,0.6)",
      fontWeight: 500,
      fontSize: 13,
    },
    bottomBar: {
      position: "relative",
      zIndex: 20,
      width: "100%",
      paddingBottom: 32,
      paddingLeft: 48,
      paddingRight: 48,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
    },
    copyright: {
      color: "rgba(251,245,234,0.45)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    contactLine: {
      marginTop: 4,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 13,
      color: "rgba(251,245,234,0.5)",
    },
    contactLine_link: {
      color: "rgba(251,245,234,0.75)",
      fontWeight: 600,
    },
    contactLine_dot: {
      opacity: 0.4,
    },
    madeBadge: {
      padding: "12px 24px",
      borderRadius: 999,
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "default",
    },
    backTop: {
      width: 48, height: 48,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(251,245,234,0.6)",
    },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={wrapperRef} id="contact" style={s.wrapper}>
        <footer className="cinematic-footer-wrapper" style={s.footer}>

          {/* Ambient aurora glow */}
          <div className="footer-aurora animate-footer-breathe" style={s.aurora} />
          {/* Dot grid */}
          <div className="footer-bg-grid" style={s.grid} />

          {/* Giant background word */}
          <div ref={giantTextRef} className="footer-giant-bg-text" style={s.giantText}>
            DELIGHT
          </div>

          {/* ── Diagonal Marquee ── */}
          <div style={s.marqueeBar}>
            <div style={s.marqueeTrack}>
              <MarqueeItem /><MarqueeItem />
            </div>
          </div>

          {/* ── Main Centre Content ── */}
          <div style={s.centerContent}>
            <h2 ref={headingRef} className="footer-text-glow" style={s.heading}>
              Ready to order?
            </h2>

            <div ref={linksRef} style={s.pillsWrap}>
              {/* Primary contact pills */}
              <div style={s.primaryPills}>
                <MagneticButton
                  as="a"
                  href="https://wa.me/61426921991"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill"
                  style={s.pill}
                >
                  {/* WhatsApp icon */}
                  <svg style={{ width: 22, height: 22, opacity: 0.7 }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="mailto:estelledelight@gmail.com"
                  className="footer-glass-pill"
                  style={s.pill}
                >
                  {/* Email icon */}
                  <svg style={{ width: 22, height: 22, opacity: 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </MagneticButton>
              </div>

              {/* Secondary nav pills */}
              <div style={s.secondaryPills}>
                <MagneticButton as="a" href="#menu" className="footer-glass-pill" style={s.pillSm}>Menu</MagneticButton>
                <MagneticButton as="a" href="#story" className="footer-glass-pill" style={s.pillSm}>Our Story</MagneticButton>
                <MagneticButton as="a" href="#catering" className="footer-glass-pill" style={s.pillSm}>Catering</MagneticButton>
                <MagneticButton as="a" href="#training" className="footer-glass-pill" style={s.pillSm}>Training</MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.instagram.com/estelles_delight/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill"
                  style={s.pillSm}
                >
                  Instagram
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.facebook.com/estelles_delight"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill"
                  style={s.pillSm}
                >
                  Facebook
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.tiktok.com/@estelles_delight"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-glass-pill"
                  style={s.pillSm}
                >
                  TikTok
                </MagneticButton>
              </div>

              {/* Plain-text contact details, visible for anyone (and search engines) that just want the raw info */}
              <div style={s.contactLine}>
                <a href="tel:+61426921991" style={s.contactLine_link}>+61 426 921 991</a>
                <span style={s.contactLine_dot}>·</span>
                <a href="mailto:estelledelight@gmail.com" style={s.contactLine_link}>estelledelight@gmail.com</a>
                <span style={s.contactLine_dot}>·</span>
                <span>Perth, Western Australia</span>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div style={s.bottomBar}>
            {/* Copyright */}
            <span style={s.copyright}>© 2026 Estelle's Delight · Perth, WA</span>

            {/* Made with love badge */}
            <div className="footer-glass-pill" style={s.madeBadge}>
              <span style={{ color: "rgba(251,245,234,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Crafted with
              </span>
              <span className="animate-footer-heartbeat" style={{ fontSize: 16, color: "var(--destructive)" }}>❤</span>
              <span style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>
                in Perth, WA
              </span>
            </div>

            {/* Back to top */}
            <MagneticButton as="button" onClick={scrollToTop} className="footer-glass-pill" style={s.backTop}>
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>

        </footer>
      </div>
    </>
  );
}
