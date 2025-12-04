"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";
import { createAddressSchema, CreateAddressSchema } from "@/actions/addresses/create-user-address/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUserAddress } from "@/hooks/address/use-create-user-address";

interface AddAddressDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAddressDrawer({ isOpen, onOpenChange }: AddAddressDrawerProps) {
  const mutation = useCreateUserAddress();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      label: "",
      recipientName: "",
      phone: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      country: "BR",
      isDefault: false,
    },
  });

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const cleanPhone = (value: string) => value.replace(/\D/g, "");
  const cleanZipCode = (value: string) => value.replace(/\D/g, "");

  const onSubmit = async (values: CreateAddressSchema) => {
    const cleanedValues = {
      ...values,
      phone: cleanPhone(values.phone),
      zipCode: cleanZipCode(values.zipCode),
    }

    mutation.mutate(cleanedValues, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
      onError: (error) => {
        setError(error?.message || "Error adding address");
      }
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="min-h-dvh">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Add Address</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}
            <FieldGroup>
              <div className="grid gap-4 py-4">
                <Controller
                  control={form.control}
                  name="label"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="label">
                        <FieldTitle>Label <span className="font-normal text-xs">(optional)</span></FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input 
                          {...field}
                          id="label"
                          placeholder="e.g., Home, Work"
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="recipientName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="recipientName">
                        <FieldTitle>Recipient Name</FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input 
                          {...field}
                          id="recipientName"
                          placeholder="Full name"
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phone">
                        <FieldTitle>Phone</FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="phone"
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          value={field.value}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Controller
                      control={form.control}
                      name="street"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="street">
                            <FieldTitle>Street</FieldTitle>
                          </FieldLabel>
                          <FieldContent>
                            <Input 
                              {...field}
                              id="street"
                              placeholder="Street name"
                              aria-invalid={fieldState.invalid}
                            />
                          </FieldContent>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={form.control}
                      name="number"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="number">
                            <FieldTitle>Number</FieldTitle>
                          </FieldLabel>
                          <FieldContent>
                            <Input 
                              {...field}
                              id="number"
                              placeholder="123"
                              aria-invalid={fieldState.invalid}
                            />
                          </FieldContent>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>

                <Controller
                  control={form.control}
                  name="complement"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="complement">
                        <FieldTitle>Complement <span className="font-normal text-xs">(optional)</span></FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input 
                          {...field}
                          id="complement"
                          placeholder="Apt, suite, etc."
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="neighborhood"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="neighborhood">
                        <FieldTitle>Neighborhood</FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input 
                          {...field}
                          id="neighborhood"
                          placeholder="Neighborhood"
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="city"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="city">
                          <FieldTitle>City</FieldTitle>
                        </FieldLabel>
                        <FieldContent>
                          <Input 
                            {...field}
                            id="city"
                            placeholder="City"
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="state"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="state">
                          <FieldTitle>State</FieldTitle>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id="state"
                            placeholder="SP"
                            maxLength={2}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            onBlur={field.onBlur}
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="zipCode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="zipCode">
                        <FieldTitle>Zip Code</FieldTitle>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="zipCode"
                          placeholder="00000-000"
                          maxLength={9}
                          value={field.value}
                          onChange={(e) => field.onChange(formatZipCode(e.target.value))}
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <Label 
                      htmlFor="isDefault"
                      className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 cursor-pointer"
                    >
                      <Checkbox
                        id="isDefault"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">Set as default address</p>
                        <p className="text-muted-foreground text-sm">This address will be used by default for your orders.</p>
                      </div>
                    </Label>
                  )}
                />
              </div>
            </FieldGroup>

            <div className="flex gap-2 pb-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onOpenChange(false)
                }} 
                disabled={mutation.isPending} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? (
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
}