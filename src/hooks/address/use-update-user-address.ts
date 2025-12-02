import { updateUserAddress } from "@/actions/addresses/update-user-address";
import { UpdateAddressInput } from "@/actions/addresses/update-user-address/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-user-address"],
    mutationFn: async (data: UpdateAddressInput) => updateUserAddress(data),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["all-user-addresses"] }),
  });
}
