import Image from "next/image";
import Link from "next/link";
import { shouldSkipOptimization } from "@/lib/imageFallback";

type Props = {
  src?: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
};

/** Brand logo. Admin can override the default SVG from Settings. */
export default function Logo({ src, className = "h-14 w-auto", priority, onClick }: Props) {
  const logo = src || "/logo.svg";
  return (
    <Link href="/" onClick={onClick} aria-label="Velocity Spur Hotshot Ltd. — Home" className="inline-flex shrink-0">
      <Image
        src={logo}
        alt="Velocity Spur Hotshot Ltd. logo"
        width={320}
        height={230}
        priority={priority}
        unoptimized={shouldSkipOptimization(logo)}
        className={`${className} drop-shadow-[0_0_14px_rgba(255,121,0,0.25)]`}
      />
    </Link>
  );
}
