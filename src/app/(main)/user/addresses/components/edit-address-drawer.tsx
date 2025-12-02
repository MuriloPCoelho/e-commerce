"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAddressesTable } from "@/db/schema";
import { updateUserAddress } from "@/actions/addresses/update-user-address";

interface EditAddressDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  address: typeof userAddressesTable.$inferSelect;
}


const initialState = (address: typeof userAddressesTable.$inferSelect) => ({
  id: address.id,
  label: address.label || "",
  recipientName: address.recipientName || "",
  phone: address.phone || "",
  street: address.street || "",
  number: address.number || "",
  complement: address.complement || "",
  neighborhood: address.neighborhood || "",
  city: address.city || "",
  state: address.state || "",
  zipCode: address.zipCode || "",
  isDefault: !!address.isDefault,
});

const EditAddressDrawer = ({ isOpen, onOpenChange, address }: EditAddressDrawerProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialState(address));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setFormData(initialState(address));
  }, [isOpen, address]);

  const updateMutation = useMutation({
    mutationFn: (data: unknown) => updateUserAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      setError(null);
      setIsLoading(false);
      onOpenChange(false);
    },
    onError: (err: any) => {
      setError(err?.message || "Erro ao atualizar endereço");
      setIsLoading(false);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    updateMutation.mutate({ ...formData });
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="min-h-dvh">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Edit Address</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">
                  Label<span className="font-normal text-xs">(optional)</span>
                </Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="e.g., Home, Work"
                  value={formData.label}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="Full name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={15}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="Street name"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Number</Label>
                  <Input
                    id="number"
                    name="number"
                    placeholder="123"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="complement">
                  Complement
                  <span className="font-normal text-xs">(optional)</span>
                </Label>
                <Input
                  id="complement"
                  name="complement"
                  placeholder="Apt, suite, etc."
                  value={formData.complement}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  placeholder="Neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="SP"
                    value={formData.state}
                    onChange={handleChange}
                    maxLength={2}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={handleChange}
                  maxLength={9}
                  required
                />
              </div>
              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 cursor-pointer">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: checked as boolean,
                    }))
                  }
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Set as default address
                  </p>
                  <p className="text-muted-foreground text-sm">
                    This address will be used by default for your orders.
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex-row gap-2 flex pb-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditAddressDrawer;
