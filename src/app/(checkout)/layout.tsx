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
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado para checkout */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "flex items-center gap-2",
            })}
          >
            <ArrowLeft className="size-5" />
            <span className="text-lg font-semibold">Voltar</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo da página */}
      <main>{children}</main>
    </div>
  );
}
