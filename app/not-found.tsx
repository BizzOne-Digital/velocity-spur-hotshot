import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="bg-industrial grid min-h-screen place-items-center px-4 text-center">
      <div>
        <Image src="/logo.svg" alt="Velocity Spur Hotshot Ltd." width={200} height={144} unoptimized className="mx-auto h-28 w-auto" />
        <p className="heading-display mt-8 text-8xl text-fire">404</p>
        <h1 className="heading-display mt-2 text-4xl text-metal">Wrong Turn</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">The page you are looking for has moved or does not exist.</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/request-quote" variant="outline">
            Request a Quote
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
