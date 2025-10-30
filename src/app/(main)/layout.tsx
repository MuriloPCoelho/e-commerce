import Header from "@/components/commom/header";
import StickyBar from "@/components/commom/sticky-bar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <StickyBar />
      <main>{children}</main>
    </>
  );
}
