"use client";

import { getAllUserAddresses } from "@/actions/addresses/get-all-user-addresses";
import AddAddressDrawer from "./components/add-address-drawer";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import AddressCard from "./components/address-card";

export default function AddressesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => getAllUserAddresses(session?.user.id!),
    enabled: !!session?.user,
  });

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
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
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
