import Header from "@/components/commom/header";
import StickyBar from "@/components/commom/sticky-bar";
import Footer from "@/components/commom/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <StickyBar />
      <main className="min-h-[calc(100vh-var(--header-height))]">
        {children}
      </main>
      <Footer />
    </>
  );
}
