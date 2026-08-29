import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-gold-500 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-gold-500 to-gold-600 text-graphite-950 shadow-lift hover:shadow-glow hover:brightness-105",
        secondary:
          "bg-white text-graphite-900 ring-1 ring-ink-200 shadow-soft hover:ring-gold-400 hover:shadow-lift",
        dark: "bg-graphite-900 text-white shadow-lift hover:bg-graphite-800 hover:shadow-glow",
        outline:
          "border border-gold-400/70 text-gold-700 hover:border-gold-500 hover:bg-gold-50",
        outlineLight:
          "border border-white/35 text-white backdrop-blur-sm hover:border-gold-300 hover:bg-white/10",
        ghost: "text-graphite-800 hover:bg-ink-100",
        whatsapp:
          "bg-[#25D366] text-white shadow-lift hover:brightness-105 hover:shadow-[0_0_36px_-6px_rgb(37_211_102/0.5)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
