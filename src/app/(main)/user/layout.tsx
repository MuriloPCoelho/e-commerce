import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { UserNavigationTabs } from "@/components/commom/user-navigation-tabs";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-4">


      <UserNavigationTabs />

      <main>{children}</main>
    </div>
  );
}
