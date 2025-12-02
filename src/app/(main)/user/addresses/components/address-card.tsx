"use client";

import { MapPin, Star, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { userAddressesTable } from "@/db/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultUserAddress } from "@/actions/addresses/set-default-user-address";
import EditAddressDrawer from "./edit-address-drawer";
import { useRemoveUserAddress } from "@/hooks/address/use-remove-user-address";

const AddressCard = ({
  address,
}: {
  address: typeof userAddressesTable.$inferSelect;
}) => {
  const [optionsDrawerAddressId, setOptionsDrawerAddressId] = useState<
    string | null
  >(null);
  const [deleteConfirmAddressId, setDeleteConfirmAddressId] = useState<
    string | null
  >(null);
  const [editAddressDrawerId, setEditAddressDrawerId] = useState<string | null>(
    null
  );
  const removeAddressMutation = useRemoveUserAddress();
  const queryClient = useQueryClient();

  const setDefaultAddressMutation = useMutation({
    mutationFn: (addressId: string) => setDefaultUserAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-addresses"] });
      setOptionsDrawerAddressId(null);
    },
  });

  const handleOptionsDrawerChange = (isOpen: boolean, addressId: string) => {
    setOptionsDrawerAddressId(isOpen ? addressId : null);
  };

  const handleShowDeleteConfirm = (addressId: string) => {
    setDeleteConfirmAddressId(addressId);
  };

  const confirmRemoveAddress = (addressId: string) => {
    removeAddressMutation.mutate(addressId);
    setDeleteConfirmAddressId(null);
    setOptionsDrawerAddressId(null);
  };

  const cancelDeleteConfirm = () => {
    setDeleteConfirmAddressId(null);
  };

  return (
    <div
      key={address.id}
      className="border rounded-lg p-4 flex justify-between items-start gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-primary" />
          {address.label && (
            <span className="font-semibold text-base truncate max-w-[120px]">
              {address.label}
            </span>
          )}
        </div>
        <div className="font-medium text-sm truncate">
          {address.recipientName}
        </div>
        <div className="text-xs text-neutral-600 truncate">
          {address.street}, {address.number}
          {address.complement && ` - ${address.complement}`}
        </div>
        <div className="text-xs text-neutral-600 truncate">
          {address.neighborhood}
        </div>
        <div className="text-xs text-neutral-600 truncate">
          {address.city} - {address.state}, {address.zipCode}
        </div>
        <div className="text-xs text-neutral-600 truncate">{address.phone}</div>
      </div>
      <div className="flex flex-col gap-2 items-end min-w-[48px]">
        <div className="flex items-center gap-2">
          {address.isDefault && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              Default
            </Badge>
          )}
          <Drawer
            open={optionsDrawerAddressId === address.id}
            onOpenChange={(isOpen) =>
              handleOptionsDrawerChange(isOpen, address.id)
            }
          >
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                className="text-gray-500 hover:text-primary"
                title="Address options"
              >
                <EllipsisVertical className="w-5 h-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-center">
                  {address.label ? (
                    <span className="font-semibold text-base">
                      {address.label}
                    </span>
                  ) : (
                    <span className="font-semibold text-base">Address</span>
                  )}
                </DrawerTitle>
              </DrawerHeader>
              {deleteConfirmAddressId === address.id ? (
                <div className="p-4 pb-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Remover endereço?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Esta ação não pode ser desfeita. O endereço será removido
                      permanentemente da sua conta.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={cancelDeleteConfirm}
                      // disabled={removeAddressMutation.isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => confirmRemoveAddress(address.id)}
                      // disabled={removeAddressMutation.isLoading}
                    >
                      Remover endereço
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col p-4 pt-0 gap-3 pb-8">
                  {!address.isDefault && (
                    <button
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors w-full"
                      onClick={() =>
                        setDefaultAddressMutation.mutate(address.id)
                      }
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-base">
                          Definir como principal
                        </p>
                        <p className="text-sm text-gray-500">
                          Usar este endereço como principal
                        </p>
                      </div>
                    </button>
                  )}
                  <button
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors w-full"
                    onClick={() => {
                      setEditAddressDrawerId(address.id);
                      setOptionsDrawerAddressId(null); // Fecha o Drawer de opções
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <Pencil className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-base">Edit address</p>
                      <p className="text-sm text-gray-500">
                        Update address information
                      </p>
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors w-full"
                    onClick={() => handleShowDeleteConfirm(address.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-base text-red-600">
                        Remove address
                      </p>
                      <p className="text-sm text-gray-500">
                        Delete this address from your account
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <EditAddressDrawer
        isOpen={editAddressDrawerId === address.id}
        onOpenChange={(open) => {
          if (!open) setEditAddressDrawerId(null);
        }}
        address={address}
      />
    </div>
  );
};

export default AddressCard;
