"use client";

import { getAllUserAddresses } from "@/actions/addresses/get-all-user-addresses";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { userAddressesTable } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  addressId: z.string().min(1, "You must select an address"),
});

const AddressSectionSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-xs">
      <div className="flex justify-between mb-3">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="text-xs space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

const AddressSection = () => {
  const [defaultAddress, setDefaultAddress] =
    useState<typeof userAddressesTable.$inferSelect>();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => await getAllUserAddresses(session?.user.id!),
    enabled: !!session?.user,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressId: defaultAddress?.id ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setIsOpen(false);
  };

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setDefaultAddress(defaultAddress);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (defaultAddress?.id) {
      form.reset({ addressId: defaultAddress.id });
    }
  }, [defaultAddress]);

  if (isLoading) {
    return <AddressSectionSkeleton />;
  }

  return (
    <div className="bg-white p-4 rounded-xs">
      <div className="flex justify-between mb-3">
        <h4 className="font-semibold text-lg">Address</h4>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="link" size="xs" className="underline">
              Change
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Address</DrawerTitle>
            </DrawerHeader>

            <form
              id="form-select-address"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="addressId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <RadioGroup
                        className="flex flex-col gap-3 p-4"
                        defaultValue={defaultAddress?.id}
                        onValueChange={field.onChange}
                        value={field.value}
                        aria-invalid={fieldState.invalid}
                      >
                        {addresses.map((address) => (
                          <FieldLabel key={address.id} htmlFor={address.id}>
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent>
                                <FieldTitle className="font-medium">
                                  {address.label}
                                </FieldTitle>
                                <FieldDescription className="text-sm text-neutral-600 font-normal flex flex-col">
                                  <span>
                                    {address.street}, {address.number}{" "}
                                    {address.complement
                                      ? `- ${address.complement}`
                                      : ""}
                                  </span>
                                  <span>
                                    {address.city}/{address.state} -{" "}
                                    {address.zipCode}
                                  </span>
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem
                                value={address.id}
                                id={address.id}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldSet>
                  )}
                />
              </FieldGroup>
            </form>

            <DrawerFooter>
              <Field className="grid grid-cols-2">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  variant="default"
                  className="w-full"
                  type="submit"
                  form="form-select-address"
                >
                  Confirm
                </Button>
              </Field>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="text-xs">
        <div className="font-bold">{defaultAddress?.label}</div>
        <div className="flex gap-4">
          <span>{defaultAddress?.recipientName}</span>
          <span>{defaultAddress?.phone}</span>
        </div>
        <div className="text-neutral-500">
          <div>
            {defaultAddress?.street}, {defaultAddress?.number}{" "}
            {defaultAddress?.complement} - {defaultAddress?.neighborhood}
          </div>
          <div>
            {defaultAddress?.city}/{defaultAddress?.state} -{" "}
            {defaultAddress?.zipCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
