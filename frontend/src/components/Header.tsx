import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Heart, ShoppingBag, HeartHandshake,
  ChevronDown, Shield, Brain, Radio, Gamepad2,
} from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onToggle: () => void;
  links: Array<{ label: string; href: string; children?: Array<{ label: string; href: string; enabled?: boolean }> }>;
  logoUrl: string;
  logoScale: number;
  logoPosition: "left" | "center" | "right";
  donateLabel: string;
  getInvolvedLabel: string;
  shopLabel: string;
  shopUrl: string;
  liveEnabled: boolean;
  pageVisibility: Record<string, boolean>;
  programsOpen: boolean;
  onProgramsEnter: () => void;
  onProgramsLeave: () => void;
  onProgramsClose: () => void;
  mobileStripItems?: Array<{ id: string; label: string; href: string; enabled?: boolean; icon?: string }>;
  mobileHeaderHeight?: number;
  desktopDesign?: { headerHeight?: number; menuPosition?: "left"|"center"|"right"; menuVerticalAlign?: "top"|"center"|"bottom"; menuOffsetY?: number; menuGap?: number; menuFontSize?: number; menuColor?: string; menuHoverColor?: string; activeColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoOffsetX?: number; logoOffsetY?: number };
  mobileDesign?: { headerHeight?: number; menuGap?: number; stripOffsetY?: number; fontSize?: number; textColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoOffsetX?: number; logoOffsetY?: number; itemGap?: number; hamburgerSize?: number };
  dropdownDesign?: { position?: "left"|"center"|"right"; width?: number; itemPaddingY?: number; itemPaddingX?: number; fontSize?: number; background?: string; textColor?: string; hoverBackground?: string; borderColor?: string; radius?: number; offsetY?: number };
}

export default function Header({
  open,
  onToggle,
  links,
  logoUrl,
  logoScale,
  logoPosition,
  donateLabel,
  getInvolvedLabel,
  shopLabel,
  shopUrl,
  liveEnabled,
  pageVisibility,
  programsOpen,
  onProgramsEnter,
  onProgramsLeave,
  onProgramsClose,
  mobileStripItems = [],
  mobileHeaderHeight = 64,
  desktopDesign = {},
  mobileDesign = {},
  dropdownDesign = {},
}: Props) {
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showDonate      = pageVisibility.pageDonate      !== false;
  const showGetInvolved = pageVisibility.pageGetInvolved !== false;
  const showShop        = pageVisibility.pageShop        !== false;

  return (
    <div
      className="spandana-nav-root grid grid-cols-[auto_1fr_auto] items-center md:grid-cols-[1fr_auto_1fr] h-[var(--nav-mobile-h)] md:h-[var(--nav-desktop-h)]"
      style={{
        ["--nav-mobile-h" as string]: `${mobileDesign.headerHeight ?? mobileHeaderHeight}px`,
        ["--nav-desktop-h" as string]: `${desktopDesign.headerHeight ?? 80}px`,
        ["--nav-mobile-pad" as string]: `${mobileDesign.horizontalPadding ?? 16}px`,
        ["--nav-desktop-pad" as string]: `${desktopDesign.horizontalPadding ?? 48}px`,
        ["--nav-mobile-bg" as string]: mobileDesign.background ?? "transparent",
        ["--nav-desktop-bg" as string]: desktopDesign.background ?? "",
        ["--nav-mobile-border" as string]: mobileDesign.borderColor ?? "",
        ["--nav-desktop-border" as string]: desktopDesign.borderColor ?? "",
        ["--logo-scale-mobile" as string]: String(mobileDesign.logoScale ?? logoScale),
        ["--logo-x-mobile" as string]: `${mobileDesign.logoOffsetX ?? 0}px`,
        ["--logo-y-mobile" as string]: `${mobileDesign.logoOffsetY ?? 0}px`,
        ["--logo-scale-desktop" as string]: String(desktopDesign.logoScale ?? logoScale),
        ["--logo-x-desktop" as string]: `${desktopDesign.logoOffsetX ?? 0}px`,
        ["--logo-y-desktop" as string]: `${desktopDesign.logoOffsetY ?? 0}px`,
      } as React.CSSProperties}
    >
      {/* Logo */}
      <Link
        href="/"
        onClick={(e) => {
          if (location === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className={`spandana-nav-logo flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity cursor-pointer justify-self-start ${logoPosition === "center" ? "md:justify-self-center" : logoPosition === "right" ? "md:justify-self-end" : "md:justify-self-start"}`}
      >
        <motion.img
          src={logoUrl}
          alt="Spandana Care Aid Foundation"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-10 md:h-14 w-auto"
          style={{
            flexShrink: 0,
            transform: `translate(var(--logo-x-mobile), var(--logo-y-mobile)) scale(var(--logo-scale-mobile))`,
            transformOrigin: "center center",
          }}
        />
      </Link>

      {/* Desktop links */}
      <div
        className={`hidden md:flex items-center ${desktopDesign.menuPosition === "left" ? "justify-self-start" : desktopDesign.menuPosition === "right" ? "justify-self-end" : "justify-self-center"}`}
        style={{ gap: `${desktopDesign.menuGap ?? 28}px`, fontSize: `${desktopDesign.menuFontSize ?? 14}px`, color: desktopDesign.menuColor ?? undefined, alignSelf: desktopDesign.menuVerticalAlign === "top" ? "start" : desktopDesign.menuVerticalAlign === "bottom" ? "end" : "center", paddingInline: `${desktopDesign.horizontalPadding ?? 0}px`, transform: `translateY(${desktopDesign.menuOffsetY ?? 0}px)` }}
      >
        {links.map((l) => {
          const isSahara = l.label === "Sahara Community Centers" || l.href === "/sahara";

          if (isSahara) {
            return (
              <div
                key={l.label}
                className="relative"
                ref={dropdownRef}
                onMouseEnter={onProgramsEnter}
                onMouseLeave={onProgramsLeave}
              >
                <Link
                  href="/sahara"
                  className="flex items-center gap-1 transition-colors group hover:text-[var(--nav-hover)]"
                  style={{ ["--nav-hover" as string]: desktopDesign.menuHoverColor ?? "#0033A0", color: programsOpen ? (desktopDesign.activeColor ?? desktopDesign.menuHoverColor ?? desktopDesign.menuColor) : desktopDesign.menuColor }}
                >
                  Sahara Community Centers
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${programsOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </Link>

                <AnimatePresence>
                  {programsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full mt-3 bg-background border border-border shadow-xl overflow-hidden ${dropdownDesign.position === "left" ? "left-0" : dropdownDesign.position === "right" ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                      style={{ width: `${dropdownDesign.width ?? 256}px`, marginTop: `${dropdownDesign.offsetY ?? 12}px`, background: dropdownDesign.background, color: dropdownDesign.textColor, borderColor: dropdownDesign.borderColor, borderRadius: `${dropdownDesign.radius ?? 16}px` }}
                      onMouseEnter={onProgramsEnter}
                      onMouseLeave={onProgramsLeave}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-background border-l border-t border-border" />
                      {(l.children ?? []).filter(item => item.enabled !== false).map((item) => {
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { onProgramsClose(); window.scrollTo({ top: 0 }); }}
                            className="flex items-center transition-colors group/item" style={{ padding: `${dropdownDesign.itemPaddingY ?? 14}px ${dropdownDesign.itemPaddingX ?? 16}px`, fontSize: `${dropdownDesign.fontSize ?? 14}px` }}
                          >
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:bg-primary transition-colors">
                              <ChevronDown size={13} className="text-primary group-hover/item:text-white" />
                            </div>
                            <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">{item.label}</p>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return l.href.startsWith("#") || l.href.startsWith("/#") ? (
            <a key={l.label} href={l.href} className="transition-colors hover:text-[var(--nav-hover)]" style={{ ["--nav-hover" as string]: desktopDesign.menuHoverColor ?? "#0033A0", color: desktopDesign.menuColor }} >
              {l.label}
            </a>
          ) : (
            <Link key={l.label} href={l.href} className="transition-colors hover:text-[var(--nav-hover)]" style={{ ["--nav-hover" as string]: desktopDesign.menuHoverColor ?? "#0033A0", color: desktopDesign.menuColor }} >
              {l.label}
            </Link>
          );
        })}

        {showGetInvolved && (
          <Button asChild size="default" className="rounded-full px-5 gap-1.5">
            <Link href="/volunteer">
              <HeartHandshake size={15} />
              {getInvolvedLabel}
            </Link>
          </Button>
        )}

        {liveEnabled && (
          <Link
            href="/live"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors shadow-sm"
          >
            <Radio size={12} className="animate-pulse" />
            LIVE
          </Link>
        )}
      </div>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-3">
        {showDonate && (
          <Button asChild variant="outline" size="default" className="rounded-full border-primary text-primary hover:bg-primary/5 gap-1.5">
            <Link href="/donate">
              <Heart size={15} />
              {donateLabel}
            </Link>
          </Button>
        )}
        {showShop && (
          <Button asChild size="default" className="rounded-full px-5 gap-1.5">
            {shopUrl ? (
              <a href={shopUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingBag size={15} />
                {shopLabel}
              </a>
            ) : (
              <Link href="/shop">
                <ShoppingBag size={15} />
                {shopLabel}
              </Link>
            )}
          </Button>
        )}
      </div>

      {/* Mobile Header Strip Items */}
      <div className="md:hidden flex items-center overflow-hidden min-w-0 justify-self-center" style={{ gap: `${mobileDesign.itemGap ?? 10}px`, fontSize: `${mobileDesign.fontSize ?? 10}px`, color: mobileDesign.textColor ?? undefined, transform: `translateY(${mobileDesign.stripOffsetY ?? 0}px)` }}>
        {(mobileStripItems.length ? mobileStripItems : [
          { id: "home", label: "Home", href: "/", enabled: true },
          { id: "donate", label: donateLabel, href: "/donate", enabled: true },
          { id: "get-involved", label: getInvolvedLabel, href: "/volunteer", enabled: true },
          { id: "shop", label: shopLabel, href: shopUrl || "/shop", enabled: true },
        ]).filter(i => i.enabled !== false).map((item) => (
          item.href.startsWith("http") ? (
            <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="shrink-0 font-bold tracking-wide whitespace-nowrap" style={{ color: mobileDesign.textColor ?? undefined }}>{item.label}</a>
          ) : (
            <Link key={item.id} href={item.href} className="shrink-0 font-bold tracking-wide whitespace-nowrap" style={{ color: mobileDesign.textColor ?? undefined }}>{item.label}</Link>
          )
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-foreground justify-self-end"
        style={{ width: `${mobileDesign.hamburgerSize ?? 36}px`, height: `${mobileDesign.hamburgerSize ?? 36}px` }}
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
}
