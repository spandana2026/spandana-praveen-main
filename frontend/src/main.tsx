import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; errorId: string }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false, errorId: "" }; }
  static getDerivedStateFromError(_error: unknown) { return { hasError: true, errorId: `FE-RENDER-${Date.now().toString(36).toUpperCase()}` }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="min-h-screen flex items-center justify-center bg-background p-6"><div className="max-w-md w-full rounded-2xl border border-border bg-card p-7 shadow-lg space-y-4"><h1 className="text-2xl font-serif font-bold">Spandana Website</h1><p className="text-muted-foreground">Something went wrong while loading this page.</p><div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm"><div className="font-semibold">Error ID: {this.state.errorId}</div><div className="text-xs mt-1 text-muted-foreground">Open Admin → System Health / Diagnostics for troubleshooting.</div></div><div className="flex gap-3"><button onClick={()=>window.location.reload()} className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold">Try Again</button><button onClick={()=>window.open("/admin/system-health","_blank")} className="flex-1 rounded-xl border border-border px-4 py-3 font-semibold">Open Diagnostics</button></div></div></div>;
  }
}

createRoot(document.getElementById("root")!).render(<GlobalErrorBoundary><App /></GlobalErrorBoundary>);
