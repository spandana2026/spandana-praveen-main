interface BlogPost { id: string; category: string; title: string; excerpt: string; date: string; readTime: string; image: string; published: boolean; }
interface Product { id: string; name: string; price: number; category: string; tag: string; rating: number; reviews: number; desc: string; impact: string; image: string; }
interface ProgramItem { title: string; desc: string; }
/* ── CMS sub-types ─────────────────────────────────────────────────────── */
interface SeoConfig {
  title?: string; description?: string; keywords?: string;
  ogTitle?: string; ogDescription?: string; ogImage?: string;
  canonical?: string; indexable?: boolean; followLinks?: boolean;
  googleVerification?: string;
  pages?: Record<string, { title?: string; description?: string }>;
}
interface SocialLinks { facebook?: string; instagram?: string; twitter?: string; youtube?: string; linkedin?: string; }
interface BrandingConfig { logoUrl?: string; logoUrlWhite?: string; logoScale?: number; logoPosition?: string; tagline?: string; }
interface CampaignWidgetConfig { heading?: string; headingEmphasis?: string; description?: string; goal?: number; current?: number; reachedLabel?: string; buttonLabel?: string; }
interface VolunteerSpotlightConfig { badge?: string; ctaLabel?: string; heading?: string; headingItalic?: string; ctaUrl?: string; }
interface DonateCardDesign {
  minHeight?: number;
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number;
  radius?: number; borderWidth?: number;
  background?: string; borderColor?: string; hoverBackground?: string; selectedBackground?: string;
  shadow?: "none" | "soft" | "medium" | "strong";
  titleColor?: string; descriptionColor?: string; titleSize?: number; descriptionSize?: number;
  gap?: number; buttonRadius?: number; buttonPaddingX?: number; buttonPaddingY?: number;
}
interface DonateDesignConfig {
  heroEyebrow?: string; heroLine1?: string; heroLine2?: string; heroLine3?: string; heroSideText?: string; heroBrushText?: string; heroCta?: string; heroSecondaryCta?: string; heroImage?: string;
  pathwaysHeading?: string; pathwaysLinkLabel?: string; physicalTitle?: string; physicalDescription?: string; mentalTitle?: string; mentalDescription?: string;
  campaignsHeading?: string; campaignsDescription?: string; campaignsLinkLabel?: string; campaignsMax?: number;
  requirementsHeading?: string; requirementsDescription?: string; requirementsLinkLabel?: string; requirementsMax?: number;
  donationHeading?: string; donationDescription?: string; donationImage?: string; donationMax?: number;
  donationOneTimeLabel?: string; donationMonthlyLabel?: string; donationCustomLabel?: string;
  impactHeading?: string; impactDescription?: string; impactStats?: Array<{ value?: string; label?: string; icon?: string }>;
  testimonialText?: string; testimonialAttribution?: string;
  finalCtaHeading?: string; finalCtaText?: string; finalCtaLabel?: string; finalCtaImage?: string;
  showPathways?: boolean; showCampaigns?: boolean; showRequirements?: boolean; showDonation?: boolean; showImpact?: boolean; showFinalCta?: boolean;
  supportCards?: DonateCardDesign;
  opportunityCards?: DonateCardDesign;
  mobile?: { cardGap?: number; sectionPadding?: number; opportunityHorizontalScroll?: boolean };
  builder?: { nodes?: Array<{ id:string; kind:string; label:string; parent?:string; hidden?:boolean; locked?:boolean }>; order?: string[]; selected?: string; device?: Record<string, Record<string, Record<string, unknown>>> };
}
interface DonatePageConfig {
  heading?: string; subheading?: string; taxNote?: string;
  headingMobile?: string; subheadingMobile?: string;
  intlNote?: string; indianTabLabel?: string; intlTabLabel?: string;
  fcraEnabled?: boolean; geoAutoSwitch?: boolean;
  upiApps?: Record<string, unknown>;
  internationalCurrencies?: string[];
  programs?: Array<{ icon: string; name: string; desc: string; inr: number[]; usd: number[] }>;
  design?: DonateDesignConfig;
}
interface FloatingMenuConfig { enabled?: boolean; showMobile?: boolean; showDesktop?: boolean; position?: string; delaySeconds?: number; autoHideSeconds?: number; scrollTriggerPx?: number; menuItems?: Array<{ emoji?: string; label: string; href: string }>; [key: string]: unknown; }
interface MusicTrack { title: string; artist?: string; url: string; }
export interface AdItem {
  id: string; sponsor: string; headline: string; body: string;
  imageUrl?: string; videoUrl?: string; ctaLabel: string; ctaUrl: string;
  skipTimer: number; enabled: boolean; target?: string; color?: string;
}
interface GameOverride {
  enabled?: boolean; isFree?: boolean; emoji?: string; title?: string; tagline?: string;
  showTo?: string; playMode?: string; priceIndia?: string; priceIntl?: string;
}
interface GameSettingsConfig {
  phonepeUpiId?: string; upiName?: string; upiQrUrl?: string; razorpayLink?: string;
  intlGateways?: Record<string, { link?: string; enabled?: boolean; method?: string; url?: string; note?: string }>;
  mode?: string;
  overrides?: Record<string, GameOverride>; gameOrder?: string[];
  prices?: Record<string, number>; pricesIntl?: Record<string, number>;
  trustTagline?: string; trustBody?: string; refundPolicy?: string; thankyouMsg?: string;
  verifyEnabled?: boolean; verifyCode?: string;
  flashNotes?: Array<Record<string, unknown>>;
  ctaText?: { adSupportMsg?: string; donateBtn?: string };
  bannerEnabled?: boolean; bannerHeading?: string; bannerBody?: string;
  adEnabled?: boolean; adPattern?: string[];
  ads?: AdItem[]; adsIndia?: AdItem[]; adsIntl?: AdItem[];
}
type PageHeroConfig = { badge?: string; heroHeading?: string; heroSub?: string; ctaHeading?: string; ctaDesc?: string; ctaButton1?: string; ctaButton2?: string; };
interface SaharaPillarHighlight { label?: string; value?: string; visible?: boolean; order?: number; }
interface SaharaPillarConfig {
  enabled?: boolean; badge?: string; title?: string; titleItalic?: string; heroDescription?: string; heroImage?: string;
  introHeading?: string; intro?: string; whyHeading?: string; whyBody?: string; focusHeading?: string; focusBody?: string;
  programSectionHeading?: string; programSectionSubtext?: string; programCardCta?: string;
  backToProgramsLabel?: string; backToProgramsHref?: string; ctaHeading?: string; ctaDescription?: string;
  ctaButton1?: string; ctaButton1Href?: string; ctaButton2?: string; ctaButton2Href?: string; highlights?: SaharaPillarHighlight[];
}
interface SaharaPageConfig {
  hero?: Record<string, string>; about?: Record<string, unknown>;
  stats?: Array<{ number?: string; label?: string; visible?: boolean; order?: number }>;
  pillars?: { sectionBadge?: string; heading?: string; subtext?: string; physical?: SaharaPillarConfig; mental?: SaharaPillarConfig };
  hours?: Array<{ day?: string; time?: string; visible?: boolean }>;
  contact?: Record<string, string>; cta?: Record<string, unknown>; visitSection?: Record<string, unknown>;
  [key: string]: unknown;
}

interface FunZonePageConfig {
  heroButtons?: { showBtnEmoji?: boolean; payLabel?: string; payDesc?: string; freeLabel?: string; freeDesc?: string; defaultMode?: string; btnLayout?: string; btnSize?: string; btnShape?: string; btnAlign?: string; freeColor?: string; payColor?: string; showFree?: boolean; showPay?: boolean; };
  heroVisibility?: Record<string, boolean>;
  badge?: string; headingDesktop?: string; subtitle?: string;
  headingMobile1?: string; headingMobile2?: string; subtitleMobile?: string;
  pill1?: string; pill2?: string; pill3?: string;
  comingSoonTitle?: string; comingSoonDesc?: string;
  comingSoonGames?: Array<Record<string, unknown>>; comingSoonHeading?: string;
  lobbyHeading?: string; moreActivitiesHeading?: string;
  enjoyingText?: string; enjoyingSubtext?: string;
}

interface SiteAdItem {
  id: string; enabled?: boolean;
  title?: string; subtitle?: string; image?: string; link?: string;
  videoUrl?: string; bgColor?: string; textColor?: string;
  [key: string]: unknown;
}

export interface SiteSettings {
  hero: { badge: string; title: string; titleItalic: string; description: string; button1: string; button2: string; button1Href?: string; button2Href?: string; useMobileText?: boolean; mobileBadge?: string; mobileTitle?: string; mobileTitleItalic?: string; mobileDescription?: string; mobileTextAlign?: string; mobileButtonLayout?: string; };
  stats: Array<{ number: string; label: string }>;
  vision: { heading: string; content: string };
  mission: { heading: string; content: string };
  centerCaption: string;
  successStories: Array<{ title: string; story: string; name: string; location: string; program: string; image: string }>;
  promoVideoSection: { title: string; subtitle: string; bullets: string[] };
  testimonials: Array<{ quote: string; name: string; location: string; program: string }>;
  newsletter: { title: string; subtitle: string; buttonLabel?: string; successMsg?: string };
  timeline: Array<{ year: string; title: string; desc: string; highlight?: boolean }>;
  trustStrip: Array<{ label: string; sub: string }>;
  volunteers: Array<{ name: string; role: string; years: string; quote: string; hours: string; program: string }>;
  programsSection: {
    title: string; subtitle: string;
    physical: { label: string; title: string; subtitle: string; items: ProgramItem[]; };
    mental: { label: string; title: string; subtitle: string; items: ProgramItem[]; };
  };
  values: string[];
  getInvolved: { title: string; subtitle: string; };
  contact: { email: string; phone: string; address?: string };
  footer: { copyright: string; };
  theme?: { primaryColor: string; headingFont: string; bodyFont: string; textColor?: string; pageBackground?: string; };
  nav?: {
    links: Array<{ id?: string; label: string; href: string; enabled?: boolean; style?: Record<string, unknown>; desktopPlacement?: "menu" | "cta"; children?: Array<{ id?: string; label: string; href: string; enabled?: boolean; style?: Record<string, unknown>; desktopPlacement?: "menu" | "cta" }> }> ; structureManaged?: boolean;
    donateLabel: string; getInvolvedLabel: string; shopLabel: string; shopUrl?: string;
    design?: {
      desktop?: { headerHeight?: number; menuPosition?: "left" | "center" | "right"; menuVerticalAlign?: "top" | "center" | "bottom"; menuOffsetY?: number; menuOffsetX?: number; menuGap?: number; menuFontSize?: number; menuColor?: string; menuHoverColor?: string; activeColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoOffsetX?: number; logoOffsetY?: number; ctaOffsetX?: number; ctaOffsetY?: number; ctaGap?: number; };
      tablet?: { headerHeight?: number; menuPosition?: "left" | "center" | "right"; menuVerticalAlign?: "top" | "center" | "bottom"; menuOffsetY?: number; menuOffsetX?: number; menuGap?: number; menuFontSize?: number; menuColor?: string; menuHoverColor?: string; activeColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoOffsetX?: number; logoOffsetY?: number; ctaOffsetX?: number; ctaOffsetY?: number; ctaGap?: number; };
      mobile?: { headerHeight?: number; menuGap?: number; stripOffsetY?: number; stripOffsetX?: number; fontSize?: number; textColor?: string; iconColor?: string; background?: string; borderColor?: string; horizontalPadding?: number; logoScale?: number; logoWidth?: number; logoMaxHeight?: number; logoSlotWidth?: number; logoOffsetX?: number; logoOffsetY?: number; itemGap?: number; itemMinWidth?: number; actionAreaGap?: number; actionAreaPadding?: number; iconSize?: number; hamburgerSize?: number; hamburgerBoxSize?: number; hamburgerGap?: number; hamburgerOffsetX?: number; hamburgerOffsetY?: number; drawerSide?: "left" | "right"; drawerWidth?: number; drawerOffsetY?: number; drawerFontSize?: number; drawerBackground?: string; drawerTextColor?: string; drawerOverlayColor?: string; drawerOverlayOpacity?: number; mobileCtaHeight?: number; mobileCtaGap?: number; mobileCtaFontSize?: number; accessibility?: { enabled?: boolean; topOnly?: boolean; hideOnScroll?: boolean; height?: number; gap?: number; fontSize?: number; background?: string; borderColor?: string; horizontalPadding?: number; buttonHeight?: number; groupGap?: number; compactButtonWidth?: number; labeledButtonWidth?: number; paperWidth?: number; controlPadding?: number; firstDisplaySeconds?: number; repeatDisplaySeconds?: number; }; };
      dropdown?: { position?: "left" | "center" | "right"; width?: number; itemGap?: number; itemPaddingY?: number; itemPaddingX?: number; fontSize?: number; background?: string; textColor?: string; hoverBackground?: string; borderColor?: string; radius?: number; shadow?: string; offsetY?: number; }
    };
    mobile?: { headerHeight?: number; logoScale?: number; logoPosition?: "left" | "center" | "right"; stripItems?: Array<{ id: string; label: string; href: string; enabled?: boolean; icon?: string }> };
  };
  footerContent?: { brandSubtitle?: string; brandTagline: string; address: string; email: string; phone: string; showAddress?: boolean; showEmail?: boolean; showPhone?: boolean; social: Array<{ label: string; href: string; enabled?: boolean }>; certifications: Array<{ label: string; sub: string; enabled?: boolean }>; useMobileFooter?: boolean; mobileTagline?: string; mobileAddress?: string; mobilePhone?: string; mobileLayout?: string; showAddressMobile?: boolean; showEmailMobile?: boolean; showPhoneMobile?: boolean; showCertsMobile?: boolean; [key: string]: unknown };
  howItWorks?: { badge: string; heading: string; headingItalic: string; steps: Array<{ num: string; title: string; desc: string; color: string }>; buttonLabel: string };
  coreValuesSection?: { badge: string; taglines: string[]; descriptions: string[] };
  timelineSection?: { badge: string; heading: string; headingItalic: string };
  ticker?: { items: string[] };
  impactSection?: { heading: string; headingItalic: string; subtitle: string; note: string; tiers: Array<{ label: string; title: string; desc: string; tag: string; color: string }> };
  visibility?: { hero?: boolean; impactTicker?: boolean; visionMission?: boolean; coreValues?: boolean; testimonials?: boolean; programs?: boolean; impactCalculator?: boolean; volunteerSpotlight?: boolean; campaignWidget?: boolean; newsletter?: boolean; timeline?: boolean; [key: string]: boolean | undefined };
  /* Extended CMS fields */
  seo?: SeoConfig;
  social?: SocialLinks;
  branding?: BrandingConfig;
  promoVideoId?: string;
  featuredSpotlight?: { type?: "video" | "image" | "hot-news" | "event" | "campaign" | "story" | "poster"; mediaUrl?: string; title?: string; label?: string; caption?: string; linkUrl?: string; buttonLabel?: string; openNewTab?: boolean };
  campaignWidget?: CampaignWidgetConfig;
  volunteerSpotlight?: VolunteerSpotlightConfig;
  donatePage?: DonatePageConfig;
  upiId?: string; upiName?: string; upiQrUrl?: string;
  bankAccountName?: string; bankAccountNumber?: string; bankIfsc?: string; bankName?: string; bankBranch?: string;
  whatsappGroupLink?: string; whatsappGroupName?: string;
  floatingMenu?: FloatingMenuConfig;
  contentProtection?: boolean;
  funZonePage?: FunZonePageConfig;
  gameSettings?: GameSettingsConfig;
  musicEnabled?: boolean; musicPlaylist?: MusicTrack[];
  adsEnabled?: boolean;
  visitorCountEnabled?: boolean;
  visitorCount?: number;
  visitorCountLabel?: string;
  quickLinks?: Array<{ id: string; label: string; tab: string; enabled?: boolean }>;
  ads?: SiteAdItem[];
  /* Hero images & carousel */
  heroImage?: string; heroImageMobile?: string;
  heroMode?: string; heroCarouselImages?: string[]; heroCarouselInterval?: number; heroCarouselTransition?: string;
  heroVideoUrl?: string; heroVideoFallback?: string;
  heroMobileMode?: string; heroMobileCarouselImages?: string[]; heroMobileCarouselInterval?: number; heroMobileCarouselTransition?: string;
  heroMobileVideoUrl?: string; heroMobileVideoFallback?: string;
  /* Mobile overrides */
  useMobileStats?: boolean; mobileStats?: Array<{ number: string; label: string }>;
  useMobileVision?: boolean;
  mobileVision?: { heading?: string; content?: string };
  mobileMission?: { heading?: string; content?: string };
  physicalHealthSections?: Array<{ label?: string; heading?: string; desc?: string; bullets?: string[]; impact?: string }>;
  mentalHealthSections?: Array<{ label?: string; heading?: string; desc?: string; bullets?: string[]; impact?: string }>;
  privacyPolicy?: { title?: string; lastUpdated?: string; content?: string };
  termsOfUse?: { title?: string; lastUpdated?: string; content?: string };
  sectionOrder?: string[];
  useMobilePrograms?: boolean; mobileProgramsTitle?: string; mobileProgramsSubtitle?: string;
  typography?: { headingWeight?: string; lineSpacing?: string; buttonRadius?: string; baseScale?: string; };
  heroLayout?: { textPosition?: string; height?: string; paddingTop?: number; paddingBottom?: number; fontScale?: number; };
  saharaPage?: SaharaPageConfig;
  visionPage?: PageHeroConfig;
  successStoriesPage?: PageHeroConfig;
  testimonialsPage?: PageHeroConfig;
  eventsPage?: { badge?: string; heading?: string; headingItalic?: string; subheading?: string; };
  blogPage?: { badge?: string; heading?: string; subheading?: string; };
  physicalHealthHero?: { badge?: string; heading?: string; subtitle?: string; headingMobile?: string; subtitleMobile?: string; ctaHeading?: string; ctaSubtext?: string; };
  mentalHealthHero?: { badge?: string; heading?: string; subtitle?: string; headingMobile?: string; subtitleMobile?: string; ctaHeading?: string; ctaSubtext?: string; };
  volunteerPage?: Record<string, any>;
  [key: string]: unknown;
}

type Tab = "blog" | "shop" | "hero" | "vision" | "programs" | "siteinfo" | "seo" | "live-stream" | "testimonials" | "timeline" | "volunteers" | "successstories" | "sahara" | "theme" | "navigation" | "corevalues" | "visionpage" | "storiespage" | "testimonialspage" | "impact" | "subscribers" | "footer" | "team" | "events" | "ads" | "games" | "dashboard" | "physical-health" | "mental-health" | "get-involved" | "donate" | "fun-zone" | "health-programs" | "gallery" | "blog-posts-crud" | "stories-crud" | "testimonials-crud" | "values-crud" | "game-listings" | "page-builder" | "floating-menu" | "music" | "people-participation" | "volunteer-apps" | "security" | "system-health" | "recycle-bin" | "system-knowledge" | "admin-search";


export type Tab = "blog" | "shop" | "hero" | "vision" | "programs" | "siteinfo" | "seo" | "live-stream" | "testimonials" | "timeline" | "volunteers" | "successstories" | "sahara" | "theme" | "navigation" | "corevalues" | "visionpage" | "storiespage" | "testimonialspage" | "impact" | "subscribers" | "footer" | "team" | "events" | "ads" | "games" | "dashboard" | "physical-health" | "mental-health" | "get-involved" | "donate" | "fun-zone" | "health-programs" | "gallery" | "blog-posts-crud" | "stories-crud" | "testimonials-crud" | "values-crud" | "game-listings" | "page-builder" | "floating-menu" | "music" | "people-participation" | "volunteer-apps" | "security" | "system-health" | "recycle-bin" | "system-knowledge" | "admin-search";

export interface SettingsTabProps {
  settings: SiteSettings;
  updateSettings: (path: (string | number)[], val: unknown) => void;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings | null>>;
  token: string;
  saving: boolean;
  onSave: () => void;
  showFeedback: (type: "success" | "error", msg: string) => void;
}

export interface TokenTabProps {
  token: string;
}
