import { cn } from "@/lib/utils";

/**
 * CMS bodies are plain text. Blank lines become paragraphs and lines starting
 * with a dash become a bulleted list, so editors get structure without HTML.
 */
export function Prose({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cn("prose-brand text-ink-500", className)}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((line) => line.trim());
        const isList = lines.every((line) => /^[-•*]\s+/.test(line));

        if (isList) {
          return (
            <ul key={i} className="mb-4 space-y-2 last:mb-0">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    aria-hidden
                  />
                  <span>{line.replace(/^[-•*]\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
