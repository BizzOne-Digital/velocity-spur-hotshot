import { Fragment } from "react";

/**
 * Renders editable heading text: "\n" becomes a line break and "*text*"
 * renders in the brand orange gradient. Everything else gets the metallic finish.
 */
export default function Accent({ text, metal = true }: { text: string; metal?: boolean }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
              <span key={pi} className="text-fire pr-[0.08em]">
                {part.slice(1, -1)}
              </span>
            ) : part ? (
              <span key={pi} className={metal ? "text-metal pr-[0.06em]" : undefined}>
                {part}
              </span>
            ) : null
          )}
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/** Plain-text version for alt text, metadata and aria labels. */
export function plain(text: string): string {
  return text.replace(/\*/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}
