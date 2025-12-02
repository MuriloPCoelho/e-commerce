"use client";

import AddAddressDrawer from "./components/add-address-drawer";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import AddressCard from "./components/address-card";
import { useAllUserAddresses } from "@/hooks/address/use-all-user-addresses";

const AddressCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
};

export default function AddressesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: addresses = [], isLoading } = useAllUserAddresses(session?.user.id!);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="py-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          variant="link"
          className="underline"
          size="xs"
        >
          <span>Add Address</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <AddressCardSkeleton />
          <AddressCardSkeleton />
          <AddressCardSkeleton />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            You don't have any saved addresses yet.
          </p>
          <Button onClick={() => setIsDrawerOpen(true)}>
            <Plus />
            <span>Add your first address</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}

      <AddAddressDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  );
}
