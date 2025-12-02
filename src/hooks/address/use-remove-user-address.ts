import { removeUserAddress } from "@/actions/addresses/remove-user-address";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveUserAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["remove-user-address"],
    mutationFn: async (addressId: string) => removeUserAddress(addressId),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["all-user-addresses"] }),
  });
}
