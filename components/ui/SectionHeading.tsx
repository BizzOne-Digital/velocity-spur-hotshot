import Accent from "./Accent";

type Props = {
  heading: string;
  subheading?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
};

/** Section title styled like the reference: italic metal heading flanked by orange rules. */
export default function SectionHeading({ heading, subheading, align = "center", as: Tag = "h2", className = "" }: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        {centered && (
          <span aria-hidden className="hidden h-[3px] w-16 bg-gradient-to-r from-transparent to-brand sm:block md:w-28" />
        )}
        <Tag className="heading-display text-4xl sm:text-5xl lg:text-6xl">
          <Accent text={heading} />
        </Tag>
        {centered && (
          <span aria-hidden className="hidden h-[3px] w-16 bg-gradient-to-l from-transparent to-brand sm:block md:w-28" />
        )}
      </div>
      {subheading && (
        <p
          className={`mt-3 text-sm font-medium uppercase tracking-[0.18em] text-steel sm:text-base ${
            centered ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
