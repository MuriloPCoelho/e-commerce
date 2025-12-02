import { createUserAddress } from "@/actions/addresses/create-user-address";
import { CreateAddressSchema } from "@/actions/addresses/create-user-address/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUserAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-user-address"],
    mutationFn: async (data: CreateAddressSchema) => createUserAddress(data),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ["all-user-addresses"] }),
  });
}