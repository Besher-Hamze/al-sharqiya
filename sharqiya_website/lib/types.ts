/**
 * Shapes returned by the Al-Sharqiya NestJS API (`/api/v1/*`).
 * Every editable string is localised as `{ en, ar }`.
 */

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ContentImage {
  src: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
  order?: number;
}

export interface Seo {
  title?: LocalizedString;
  description?: LocalizedString;
  ogImage?: string;
}

export interface ContentSection {
  heading?: LocalizedString;
  body?: LocalizedString;
  images?: ContentImage[];
}

export interface Spec {
  label: LocalizedString;
  value: LocalizedString;
}

// --- Settings ---------------------------------------------------------------

export interface Branch {
  city: LocalizedString;
  address: LocalizedString;
  phone: string;
  mapUrl?: string;
  order?: number;
}

export interface OpeningHour {
  day: LocalizedString;
  open: string;
  close: string;
  closed: boolean;
}

export interface Settings {
  siteName: LocalizedString;
  tagline: LocalizedString;
  shortDescription: LocalizedString;
  contact: {
    email: string;
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    headOffice: LocalizedString;
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

// --- Navigation -------------------------------------------------------------

export interface NavItem {
  key: string;
  label: LocalizedString;
  href: string;
  hidden?: boolean;
  order?: number;
}

export interface Navigation {
  headerMenu: NavItem[];
  footerMenu: NavItem[];
  legalMenu: NavItem[];
}

// --- Services ---------------------------------------------------------------

export interface Service {
  _id: string;
  slug: string;
  order: number;
  icon: string;
  name: LocalizedString;
  excerpt: LocalizedString;
  description: LocalizedString;
  features: LocalizedString[];
  specs: Spec[];
  sections: ContentSection[];
  coverImage: string;
  gallery: ContentImage[];
  seo?: Seo;
  isPublished: boolean;
}

// --- Projects ---------------------------------------------------------------

export interface Project {
  _id: string;
  slug: string;
  order: number;
  serviceSlug: string;
  isFeatured: boolean;
  title: LocalizedString;
  client: LocalizedString;
  location: LocalizedString;
  area: string;
  year: number | null;
  excerpt: LocalizedString;
  description: LocalizedString;
  scope: LocalizedString[];
  coverImage: string;
  gallery: ContentImage[];
  seo?: Seo;
  isPublished: boolean;
}

// --- Gallery ----------------------------------------------------------------

export interface GalleryAlbum {
  _id: string;
  slug: string;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: ContentImage[];
  isPublished: boolean;
}

// --- FAQs, testimonials, legal pages ---------------------------------------

export interface Faq {
  _id: string;
  order: number;
  question: LocalizedString;
  answer: LocalizedString;
  isPublished: boolean;
}

export interface Testimonial {
  _id: string;
  order: number;
  author: LocalizedString;
  role?: LocalizedString;
  quote: LocalizedString;
  rating?: number;
  avatar?: string;
  isPublished: boolean;
}

export interface LegalPage {
  _id: string;
  slug: string;
  order: number;
  title: LocalizedString;
  sections: ContentSection[];
  seo?: Seo;
  isPublished: boolean;
  updatedAt: string;
}

// --- Composed page content -------------------------------------------------

export interface HomepageContent {
  hero: {
    eyebrow: LocalizedString;
    titleLine1: LocalizedString;
    titleLine2: LocalizedString;
    subtitle: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
    slides: string[];
  };
  intro: {
    heading: LocalizedString;
    body: LocalizedString;
  };
  stats: { value: string; label: LocalizedString }[];
  values: { icon: string; title: LocalizedString; body: LocalizedString }[];
  process: { title: LocalizedString; body: LocalizedString }[];
  clients: {
    heading: LocalizedString;
    note: LocalizedString;
    items: LocalizedString[];
  };
  cta: {
    heading: LocalizedString;
    body: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
    image: string;
  };
}

export interface AboutContent {
  hero: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    subtitle: LocalizedString;
    image: string;
  };
  sections: {
    heading: LocalizedString;
    body: LocalizedString;
    image: string;
  }[];
  milestones: {
    year: string;
    title: LocalizedString;
    body: LocalizedString;
  }[];
}
