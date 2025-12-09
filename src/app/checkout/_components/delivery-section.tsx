"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLabel,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field";
import {
  calculateShipping,
  ShippingOption,
} from "@/actions/calculate-shipping";
import { centsToReais } from "@/lib/utils";
import { useBagContext } from "@/providers/bag-provider";
import { useAllUserAddresses } from "@/hooks/address/use-all-user-addresses";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { updateBagShipping } from "@/actions/update-bag-shipping";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const DeliverySection = () => {
  const { bag } = useBagContext();
  const { data: session } = authClient.useSession();
  const { data: addresses = [] } = useAllUserAddresses(session?.user.id!);
  const queryClient = useQueryClient();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const bagAddress = addresses.find((a) => a.id === bag?.userAddressId);

  useEffect(() => {
    const fetchShipping = async () => {
      if (!bag || !bagAddress?.zipCode) return;
      setIsLoading(true);
      setError("");
      try {
        const options = await calculateShipping({
          postalCode: bagAddress.zipCode,
          productPriceInCents: bag.totalPriceInCents,
        });
        setShippingOptions(options);

        // Set selected option from bag or default to first option
        if (bag.shippingMethod) {
          setSelectedOption(bag.shippingMethod);
        } else if (options.length > 0) {
          setSelectedOption(options[0].id);
        }
      } catch (err) {
        setError("Error calculating shipping. Try again.");
        setShippingOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipping();
  }, [
    bag?.userAddressId,
    bag?.totalPriceInCents,
    bag?.shippingMethod,
    bagAddress?.zipCode,
  ]);

  const handleShippingChange = async (optionId: string) => {
    setSelectedOption(optionId);
    const option = shippingOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    setIsUpdating(true);
    try {
      await updateBagShipping({
        shippingMethod: option.id,
        shippingPriceInCents: option.price,
      });
      await queryClient.invalidateQueries({ queryKey: ["bag"] });
    } catch (error) {
      console.error("Failed to update shipping:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!bag?.userAddressId || !bagAddress) return <></>;

  return (
    <div className="bg-white p-4 rounded">
      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
        Delivery
      </h4>

      <FieldGroup>
        <FieldSet>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border rounded-md p-4 flex items-center justify-between gap-3 h-[72px]"
                >
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-[14px] w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex items-start gap-4 h-full">
                    <Skeleton className="h-[14px] w-16" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : (
            <RadioGroup
              value={selectedOption}
              onValueChange={handleShippingChange}
              className="flex flex-col gap-3"
              disabled={isUpdating}
            >
              {shippingOptions.map((option) => (
                <FieldLabel key={option.id} htmlFor={option.id}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <div className="flex flex-col gap-1">
                        <FieldTitle className="font-medium text-sm">
                          {option.name}
                        </FieldTitle>
                        <FieldDescription className="text-xs text-muted-foreground">
                          {option.description}
                        </FieldDescription>
                      </div>
                    </FieldContent>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-right text-sm min-w-[60px]">
                        {option.price === 0
                          ? "Free"
                          : centsToReais(option.price)}
                      </span>
                      <RadioGroupItem value={option.id} id={option.id} />
                    </div>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          )}
        </FieldSet>
      </FieldGroup>
    </div>
  );
};

export default DeliverySection;
