import {
  Award,
  BadgeCheck,
  Building2,
  CircleParking,
  Clock,
  Factory,
  HardHat,
  Landmark,
  Layers,
  LayoutGrid,
  MapPin,
  Paintbrush,
  Ruler,
  ShieldCheck,
  Sparkles,
  SquareStack,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Content editors pick an icon by name in the dashboard, so the set of
 * allowed names has to be resolved here rather than bundling all of lucide.
 */
const ICONS: Record<string, LucideIcon> = {
  award: Award,
  "badge-check": BadgeCheck,
  building: Building2,
  "circle-parking": CircleParking,
  clock: Clock,
  factory: Factory,
  "hard-hat": HardHat,
  landmark: Landmark,
  layers: Layers,
  "layout-grid": LayoutGrid,
  "map-pin": MapPin,
  paintbrush: Paintbrush,
  ruler: Ruler,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "square-stack": SquareStack,
  "trending-up": TrendingUp,
  users: Users,
  wrench: Wrench,
};

export function DynamicIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = ICONS[name ?? ""] ?? Layers;
  return <Icon className={className} aria-hidden />;
}
