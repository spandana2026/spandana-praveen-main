import { useState, useEffect } from "react";

export type FontSizeLevel = 0 | 1 | 2 | 3;

const SIZES: Record<FontSizeLevel, { pct: string }> = {
  0: { pct: "100%"  },
  1: { pct: "112.5%"},
  2: { pct: "120%"  },
  3: { pct: "132%"  },
};

const SIZE_KEY   = "spandana-font-size";
const PAPER_KEY  = "spandana-paper-white";

function applyMobileFontSize(level: FontSizeLevel) {
  const styleId = "spandana-mobile-font-scale";
  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `@media (max-width: 767px) { html { font-size: ${SIZES[level].pct} !important; } }`;
}

function applySize(level: FontSizeLevel) {
  // Accessibility font scaling is deliberately mobile-only. Remove any
  // legacy inline root font-size left by older builds, then apply the mobile
  // rule only inside the mobile breakpoint. Desktop typography is untouched.
  document.documentElement.style.removeProperty("font-size");
  applyMobileFontSize(level);
  if (level === 3) {
    document.documentElement.classList.add("elderly-mode");
  } else {
    document.documentElement.classList.remove("elderly-mode");
  }
}

function applyPaper(on: boolean) {
  const sync = () => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    document.documentElement.classList.toggle("paper-white-mobile", Boolean(on && mobile));
  };
  sync();
  // Keep Paper White scoped to mobile even if the viewport changes.
  window.addEventListener("resize", sync, { passive: true });
  return () => window.removeEventListener("resize", sync);
}

export function useFontSize() {
  const [level, setLevel] = useState<FontSizeLevel>(() => {
    try {
      const n = Number(localStorage.getItem(SIZE_KEY));
      return (Number.isInteger(n) && n >= 0 && n <= 3) ? (n as FontSizeLevel) : 0;
    } catch { return 0; }
  });

  const [paperWhite, setPaperWhite] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem(PAPER_KEY);
      return val === null ? true : val !== "0";
    }
    catch { return true; }
  });

  useEffect(() => {
    applySize(level);
    localStorage.setItem(SIZE_KEY, String(level));
  }, [level]);

  useEffect(() => {
    const cleanup = applyPaper(paperWhite);
    localStorage.setItem(PAPER_KEY, paperWhite ? "1" : "0");
    return cleanup;
  }, [paperWhite]);

  const setTo = (l: FontSizeLevel) => setLevel(l);
  const togglePaper = () => setPaperWhite((p) => !p);

  return { level, paperWhite, setTo, togglePaper };
}
