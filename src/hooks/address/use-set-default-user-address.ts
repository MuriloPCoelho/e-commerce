import { setDefaultUserAddress } from "@/actions/addresses/set-default-user-address";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetDefaultUserAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["set-default-user-address"],
    mutationFn: async (addressId: string) => setDefaultUserAddress(addressId),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["all-user-addresses"] }),
  });
}