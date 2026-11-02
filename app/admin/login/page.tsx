import Image from "next/image";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Sign In" };

export default function AdminLoginPage() {
  return (
    <main className="bg-industrial grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Image src="/logo.svg" alt="Velocity Spur Hotshot Ltd." width={220} height={158} unoptimized priority className="mx-auto h-32 w-auto" />
        <div className="card-glow mt-8 p-6 sm:p-8">
          <h1 className="heading-display text-center text-3xl text-metal">Admin Sign In</h1>
          <p className="mb-6 mt-2 text-center text-sm text-white/55">Authorized personnel only.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
