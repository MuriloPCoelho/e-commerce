import { getUserAddress } from "@/actions/addresses/get-user-address";
import { useQuery } from "@tanstack/react-query";

export function useUserAddress(addressId: string, userId: string) {
  return useQuery({
    queryKey: ["user-address", userId],
    queryFn: async () => getUserAddress(addressId, userId),
    enabled: !!addressId && !!userId,
  });
}
