import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "spandana_floatmenu_seen";

const DEFAULT_ITEMS = [
  { label: "Vision & Mission",         href: "/vision",    emoji: "👁️" },
  { label: "Sahara Community Centers", href: "/sahara",    emoji: "🏛️" },
  { label: "Blog",                     href: "/blog",      emoji: "📝" },
  { label: "Donate",                   href: "/donate",    emoji: "❤️" },
  { label: "Volunteer",                href: "/volunteer", emoji: "🤝" },
  { label: "Shop",                     href: "/shop",      emoji: "🛍️" },
  { label: "Joy Zone",                 href: "/fun-zone",  emoji: "🎮" },
];

interface Props {
  config?: {
    delaySeconds?: number;
    autoHideSeconds?: number;
    showMobile?: boolean;
    menuItems?: Array<{ label: string; href: string; emoji?: string }>;
    animationSpeedMs?: number;
    menuWidthPx?: number;
    itemHeightPx?: number;
    itemGapPx?: number;
    iconSizePx?: number;
    borderRadiusPx?: number;
    labelFontSizePx?: number;
    colorMenuBg?: string;
    colorMenuText?: string;
    colorMenuBorder?: string;
    colorShadow?: string;
  };
}

export default function FloatingMenuPreview({ config = {} }: Props) {
  const delaySeconds = Number(config.delaySeconds ?? 2);
  const autoHideSeconds = Number(config.autoHideSeconds ?? 0);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then((d) => {
        const saved = config.menuItems ?? d?.floatingMenu?.menuItems;
        if (Array.isArray(saved) && saved.length > 0) setItems(saved);
      })
      .catch(() => {});
  }, [config.menuItems]);

  const calculateAnchor = () => {
    const button = document.querySelector<HTMLElement>('[data-spandana-hamburger="true"]');
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const accessibility = document.querySelector<HTMLElement>('.spandana-nav-accessibility');
    const nav = document.querySelector<HTMLElement>('.spandana-nav-root');
    const lowerEdge = accessibility?.getBoundingClientRect().bottom ?? nav?.getBoundingClientRect().bottom ?? rect.bottom;
    const menuWidth = Math.min(Number(config.menuWidthPx ?? 200), window.innerWidth - 16);
    const right = Math.max(8, window.innerWidth - rect.right);
    const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, window.innerWidth - right - menuWidth));
    setAnchor({ left, top: Math.max(rect.bottom + 8, lowerEdge + 8) });
  };

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    const showTimer = setTimeout(() => {
      calculateAnchor();
      setVisible(true);
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
      if (autoHideSeconds > 0) {
        dismissTimer.current = setTimeout(() => setVisible(false), autoHideSeconds * 1000);
      }
    }, Math.max(0, delaySeconds) * 1000);

    const onMenuOpen = () => {
      clearTimeout(showTimer);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      setVisible(false);
    };
    window.addEventListener("main-menu-open", onMenuOpen);
    return () => {
      clearTimeout(showTimer);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      window.removeEventListener("main-menu-open", onMenuOpen);
    };
  }, [delaySeconds, autoHideSeconds, config.menuWidthPx]);

  useEffect(() => {
    if (!visible) return;
    calculateAnchor();
    const onResize = () => calculateAnchor();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [visible, config.menuWidthPx]);

  const close = () => setVisible(false);
  const width = Math.min(Number(config.menuWidthPx ?? 200), 300);

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {visible && anchor && (
          <motion.div
            key="floating-menu"
            initial={config.animationStyle === "fade" ? { opacity: 0 } : config.animationStyle === "scale" ? { opacity: 0, scale: 0.94 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={config.animationStyle === "fade" ? { opacity: 0 } : config.animationStyle === "scale" ? { opacity: 0, scale: 0.94 } : { opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: Number(config.animationSpeedMs ?? 250) / 1000 }}
            className="fixed z-[60] rounded-2xl overflow-hidden border select-none"
            style={{
              left: anchor.left,
              top: anchor.top,
              width,
              maxWidth: "calc(100vw - 16px)",
              borderRadius: `${Number(config.borderRadiusPx ?? 16)}px`,
              background: config.colorMenuBg ?? "#06337d",
              color: config.colorMenuText ?? "#ffffff",
              borderColor: config.colorMenuBorder ?? "rgba(255,255,255,0.20)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: `0 16px 40px ${config.colorShadow ?? "rgba(0,20,80,0.24)"}`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/15">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">Explore</span>
              <button
                type="button"
                onClick={close}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/65 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Close Explore menu"
              >
                <X size={14} />
              </button>
            </div>
            <ul className="flex flex-col py-1.5">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex items-center px-4 text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors"
                    style={{
                      minHeight: `${Number(config.itemHeightPx ?? 44)}px`,
                      fontSize: `${Number(config.labelFontSizePx ?? 14)}px`,
                    }}
                  >
                    <span className="shrink-0 leading-none" style={{ fontSize: `${Number(config.iconSizePx ?? 17)}px`, marginRight: `${Number(config.itemGapPx ?? 11)}px` }}>{item.emoji}</span>
                    <span className="font-medium leading-tight">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
