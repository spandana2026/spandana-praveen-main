import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/nav";

/**
 * Isolated header-only preview shell. It renders the exact production Nav
 * component inside a real browser viewport, while supplying only enough Home
 * page context to make the header visually representative.
 */
export default function HeaderPreview() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const device = (params.get("device") === "mobile" ? "mobile" : params.get("device") === "tablet" ? "tablet" : "desktop") as "desktop" | "tablet" | "mobile";
  const [nav, setNav] = useState<any>({});
  const [pageSettings, setPageSettings] = useState<any>({});
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [liveStream, setLiveStream] = useState<any>({});

  useEffect(() => {
    const sendReady = () => window.parent?.postMessage({ type: "spandana-admin-header-preview-ready" }, window.location.origin);
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const type = event.data?.type;
      if (type === "spandana-admin-header-preview-ping") { sendReady(); return; }
      if (type !== "spandana-admin-header-preview") return;
      if (event.data.nav) setNav(event.data.nav);
      if (event.data.settings) setPageSettings(event.data.settings);
      if (event.data.logoUrl) setLogoUrl(event.data.logoUrl);
      if (event.data.visibility) setVisibility(event.data.visibility);
      if (event.data.liveStream) setLiveStream(event.data.liveStream);
    };
    window.addEventListener("message", onMessage);
    sendReady();
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const heroImage = device === "mobile"
    ? pageSettings?.heroImageMobile || pageSettings?.heroMobileCarouselImages?.[0]
    : pageSettings?.heroImage || pageSettings?.heroCarouselImages?.[0];
  const backgroundImage = heroImage || "/images/hero-indian.png";

  return (
    <div data-header-preview-root="true" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#0033A0" }}>
      <div data-preview-page-context="true" aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,51,160,.88), rgba(0,51,160,.88)), url("${backgroundImage}")`, backgroundSize: "cover", backgroundPosition: "center", pointerEvents: "none" }} />
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Nav
          previewMode
          previewDevice={device}
          previewSettings={nav}
          previewLogoUrl={logoUrl}
          previewPageVisibility={visibility}
          previewLiveSettings={liveStream}
          showAccessibilityPreview
          onEditorSelect={(id) => window.parent?.postMessage({ type: "spandana-admin-header-preview-select", id }, window.location.origin)}
        />
      </div>
    </div>
  );
}
