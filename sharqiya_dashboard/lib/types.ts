/** Shapes returned by the Al-Sharqiya NestJS API. */

export interface Localized {
  en: string;
  ar: string;
}

export const emptyLocalized = (): Localized => ({ en: "", ar: "" });

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export type UserRole = "superadmin" | "admin" | "editor";

/** Shape returned by `/auth/login` (and stored in localStorage). */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface DashboardUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Shared content building blocks ----------------------------------------

export interface ContentImage {
  src: string;
  alt?: Localized;
  caption?: Localized;
  order?: number;
}

export interface Seo {
  title?: Localized;
  description?: Localized;
  ogImage?: string;
}

export interface ContentSection {
  heading: Localized;
  body: Localized;
  images?: ContentImage[];
}

export interface Spec {
  label: Localized;
  value: Localized;
}

// --- Entities ---------------------------------------------------------------

export interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  thumbUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  alt: Localized;
  folder: string;
  createdAt: string;
}

export interface Service {
  _id: string;
  slug: string;
  order: number;
  icon: string;
  name: Localized;
  excerpt: Localized;
  description: Localized;
  features: Localized[];
  specs: Spec[];
  sections: ContentSection[];
  coverImage: string;
  gallery: ContentImage[];
  seo?: Seo;
  isPublished: boolean;
}

export interface Project {
  _id: string;
  slug: string;
  order: number;
  serviceSlug: string;
  isFeatured: boolean;
  title: Localized;
  client: Localized;
  location: Localized;
  area: string;
  year: number | null;
  excerpt: Localized;
  description: Localized;
  scope: Localized[];
  coverImage: string;
  gallery: ContentImage[];
  seo?: Seo;
  isPublished: boolean;
}

export interface GalleryAlbum {
  _id: string;
  slug: string;
  order: number;
  title: Localized;
  description: Localized;
  coverImage: string;
  images: ContentImage[];
  isPublished: boolean;
}

export interface Faq {
  _id: string;
  order: number;
  question: Localized;
  answer: Localized;
  isPublished: boolean;
}

export interface Testimonial {
  _id: string;
  order: number;
  author: Localized;
  role?: Localized;
  quote: Localized;
  rating?: number;
  avatar?: string;
  isPublished: boolean;
}

export interface LegalPage {
  _id: string;
  slug: string;
  order: number;
  title: Localized;
  sections: ContentSection[];
  seo?: Seo;
  isPublished: boolean;
  updatedAt: string;
}

// --- Singletons -------------------------------------------------------------

export interface Branch {
  city: Localized;
  address: Localized;
  phone: string;
  mapUrl?: string;
  order?: number;
}

export interface OpeningHour {
  day: Localized;
  open: string;
  close: string;
  closed: boolean;
}

export interface Settings {
  _id?: string;
  siteName: Localized;
  tagline: Localized;
  shortDescription: Localized;
  contact: {
    email: string;
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    headOffice: Localized;
  };
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    tiktok: string;
  };
  branches: Branch[];
  openingHours: OpeningHour[];
  foundedYear: number;
  logo: string;
  tradeLicense: string;
}

export interface NavItem {
  key: string;
  label: Localized;
  href: string;
  hidden: boolean;
  order: number;
}

export interface Navigation {
  _id?: string;
  headerMenu: NavItem[];
  footerMenu: NavItem[];
  legalMenu: NavItem[];
}

export interface ContentDoc<T = unknown> {
  _id: string;
  key: string;
  data: T;
  updatedAt: string;
}

// --- Composed page content --------------------------------------------------

export interface HomepageContent {
  hero: {
    eyebrow: Localized;
    titleLine1: Localized;
    titleLine2: Localized;
    subtitle: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    slides: string[];
  };
  intro: { heading: Localized; body: Localized };
  stats: { value: string; label: Localized }[];
  values: { icon: string; title: Localized; body: Localized }[];
  process: { title: Localized; body: Localized }[];
  clients: { heading: Localized; note: Localized; items: Localized[] };
  cta: {
    heading: Localized;
    body: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    image: string;
  };
}

export interface AboutContent {
  hero: {
    eyebrow: Localized;
    title: Localized;
    subtitle: Localized;
    image: string;
  };
  sections: { heading: Localized; body: Localized; image: string }[];
  milestones: { year: string; title: Localized; body: Localized }[];
}

// --- Inbound submissions ----------------------------------------------------

export const QUOTE_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const PROPERTY_TYPES = [
  "residential",
  "commercial",
  "industrial",
  "government",
  "other",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export interface QuoteRequest {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  services: string[];
  propertyType: PropertyType;
  emirate?: string;
  area?: string;
  message?: string;
  locale: string;
  status: QuoteStatus;
  adminNote?: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locale: string;
  isRead: boolean;
  adminNote?: string;
  createdAt: string;
}

// --- Audit & stats ----------------------------------------------------------

export interface AuditLog {
  _id: string;
  userId?: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  statusCode: number;
  createdAt: string;
}

export interface StatsOverview {
  counts: {
    services: number;
    servicesPublished: number;
    projects: number;
    projectsPublished: number;
    albums: number;
    media: number;
    testimonials: number;
    testimonialsPending: number;
  };
  quotes: {
    total: number;
    new: number;
    byStatus: { status: QuoteStatus; count: number }[];
  };
  messages: { total: number; unread: number };
  quoteTrend: { date: string; count: number }[];
  recentQuotes: QuoteRequest[];
}
