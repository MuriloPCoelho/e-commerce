import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout - E-commerce",
  description: "Finalize sua compra",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-white border-b py-3 px-4 flex items-center">
        <Link
          href="/"
          className={buttonVariants({
            variant: "ghost",
            className: "flex items-center gap-2",
          })}
        >
          <ArrowLeft className="size-5" />
          <span className="text-lg font-semibold">Voltar</span>
        </Link>
      </header>
      <main className="bg-neutral-100 min-h-dvh flex-grow">{children}</main>
    </div>
  );
}
