import { useState, useEffect } from "react";

export type DesktopFontSizeLevel = 0 | 1 | 2 | 3;

// Desktop baseline recovered from the V22 reference implementation.
const SIZES: Record<DesktopFontSizeLevel, { pct: string }> = {
  0: { pct: "100%" },
  1: { pct: "112.5%" },
  2: { pct: "120%" },
  3: { pct: "132%" },
};

const SIZE_KEY = "spandana-font-size-desktop";
const PAPER_KEY = "spandana-paper-white-desktop";

function applySize(level: DesktopFontSizeLevel) {
  const root = document.documentElement;
  // This hook is used only by the desktop control. Do not affect mobile.
  if (window.matchMedia("(min-width: 768px)").matches) {
    root.style.fontSize = SIZES[level].pct;
    root.classList.toggle("elderly-mode", level === 3);
  } else {
    root.style.removeProperty("font-size");
    root.classList.remove("elderly-mode");
  }
}

function applyPaper(on: boolean) {
  // Keep the historical paper-white class behavior for the desktop control,
  // but only while this is a desktop viewport.
  const root = document.documentElement;
  if (window.matchMedia("(min-width: 768px)").matches) {
    root.classList.toggle("paper-white-desktop", on);
  } else {
    root.classList.remove("paper-white-desktop");
  }
}

export function useDesktopFontSize() {
  const [level, setLevel] = useState<DesktopFontSizeLevel>(() => {
    try {
      const n = Number(localStorage.getItem(SIZE_KEY));
      return (Number.isInteger(n) && n >= 0 && n <= 3) ? (n as DesktopFontSizeLevel) : 0;
    } catch { return 0; }
  });

  const [paperWhite, setPaperWhite] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem(PAPER_KEY);
      return val === null ? true : val !== "0";
    } catch { return true; }
  });

  useEffect(() => {
    applySize(level);
    localStorage.setItem(SIZE_KEY, String(level));
    const onResize = () => applySize(level);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [level]);

  useEffect(() => {
    applyPaper(paperWhite);
    localStorage.setItem(PAPER_KEY, paperWhite ? "1" : "0");
    const onResize = () => applyPaper(paperWhite);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [paperWhite]);

  return {
    level,
    paperWhite,
    setTo: (l: DesktopFontSizeLevel) => setLevel(l),
    togglePaper: () => setPaperWhite((p) => !p),
  };
}
