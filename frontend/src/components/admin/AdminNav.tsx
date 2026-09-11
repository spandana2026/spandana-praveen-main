import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Settings, Navigation, Mail, Paintbrush,
  Home, Heart, Users, BookOpen, MessageSquare, Clock, Star,
  Building2, ShieldCheck, HeartHandshake, DollarSign, Gamepad2,
  CalendarDays, ShoppingBag, Megaphone, Lock,
  Globe, GalleryHorizontal, Search, Radio, LayoutTemplate, Menu, UserCheck, Trash2, BookOpenCheck, UsersRound,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",             label: "Dashboard",                 icon: LayoutDashboard,  group: "Dashboard" },

  { id: "siteinfo",              label: "Global Settings",            icon: Settings,          group: "Site Management" },
  { id: "branding",              label: "Branding",                   icon: Paintbrush,        group: "Site Management" },
  { id: "social-media",          label: "Social Media",                icon: Globe,             group: "Site Management" },
  { id: "theme",                 label: "Theme & Fonts",              icon: Paintbrush,        group: "Site Management" },
  { id: "navigation",            label: "Main Menu / Navigation",      icon: Navigation,        group: "Site Management" },
  { id: "footer",                label: "Footer",                     icon: Mail,              group: "Site Management" },
  { id: "seo",                   label: "SEO",                        icon: Search,            group: "Site Management" },

  { id: "page-builder",          label: "Page Builder",               icon: LayoutTemplate,    group: "Page Builder" },

  { id: "hero",                  label: "Home",                       icon: Home,              group: "Homepage" },
  { id: "vision",                label: "Vision & Mission",           icon: Heart,             group: "Homepage" },
  { id: "programs",              label: "Core Programs",               icon: Users,             group: "Homepage" },
  { id: "corevalues",            label: "Core Values",                 icon: ShieldCheck,       group: "Homepage" },
  { id: "impact",                label: "Your Impact",                 icon: DollarSign,        group: "Homepage" },
  { id: "timeline",              label: "Timeline",                    icon: Clock,             group: "Homepage" },
  { id: "ads",                   label: "Ad Banners",                  icon: Megaphone,         group: "Homepage" },

  { id: "sahara",                label: "Sahara Community Centers",     icon: Building2,        group: "Community" },

  { id: "emergency-aid",         label: "Emergency Aid & Relief",       icon: HeartHandshake,   group: "Emergency Response" },

  { id: "people-participation",  label: "People & Participation",        icon: UsersRound,         group: "People & Participation" },
  { id: "volunteers",            label: "Volunteers",                   icon: Star,              group: "People & Participation" },
  { id: "volunteer-apps",        label: "Join Us Connections",           icon: UserCheck,         group: "People & Participation" },
  { id: "get-involved",          label: "Get Involved",                 icon: HeartHandshake,   group: "People & Participation" },
  { id: "team",                 label: "Team Portal",                  icon: Lock,              group: "People & Participation" },
  { id: "security",             label: "Account Security",              icon: ShieldCheck,       group: "System" },
  { id: "system-health",        label: "System Health / Diagnostics",  icon: HeartHandshake,    group: "System" },
  { id: "system-knowledge",     label: "System Knowledge & Export",    icon: BookOpenCheck,     group: "System" },
  { id: "recycle-bin",          label: "Recycle Bin",                   icon: Trash2,             group: "System" },
  { id: "subscribers",           label: "Newsletter",                   icon: Mail,              group: "People & Participation" },

  { id: "events",                label: "Events",                      icon: CalendarDays,      group: "Events" },

  { id: "blog",                  label: "Blog",                        icon: BookOpen,          group: "Editorial" },
  { id: "successstories",        label: "Success Stories",              icon: BookOpen,          group: "Editorial" },
  { id: "testimonials",          label: "Testimonials",                 icon: MessageSquare,    group: "Editorial" },

  { id: "donate",                label: "Donate",                      icon: DollarSign,        group: "Fundraising" },

  { id: "fun-zone",              label: "Joy Zone",                    icon: Gamepad2,          group: "Joy Zone" },

  { id: "shop",                  label: "Shop & NEENAS",                icon: ShoppingBag,      group: "Shop" },

  { id: "gallery",               label: "Media Library",                icon: GalleryHorizontal, group: "Media" },
];

const GROUPS = [
  "Dashboard",
  "Site Management",
  "Page Builder",
  "Homepage",
  "Community",
  "Emergency Response",
  "People & Participation",
  "Events",
  "Editorial",
  "Fundraising",
  "Joy Zone",
  "Shop",
  "Media",
  "System",
];

interface AdminNavProps { onItemClick?: () => void; }


export default function AdminNav({ onItemClick }: AdminNavProps) {
  const [location] = useLocation();

  function isActive(id: string) {
    if (id === "dashboard") return location === "/admin" || location === "/admin/" || location === "/admin/dashboard";
    return location === `/admin/${id}`;
  }

  return (
    <nav className="flex flex-col py-4 px-3 gap-0.5 overflow-y-auto flex-1 min-h-0">
      {GROUPS.map((group) => {
        const items = NAV_ITEMS.filter((i) => i.group === group);
        if (!items.length) return null;
        return (
          <div key={group} className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
              {group}
            </p>
            {items.map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                href={`/admin/${id}`}
                onClick={onItemClick}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full mb-0.5 min-h-[44px]
                  ${isActive(id) ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
        );
      })}

      <div className="mt-auto pt-3 border-t border-border space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted">
          View Live Site ↗
        </a>
      </div>
    </nav>
  );
}
