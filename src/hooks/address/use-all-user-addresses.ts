import { getAllUserAddresses } from "@/actions/addresses/get-all-user-addresses";
import { useQuery } from "@tanstack/react-query";

export function useAllUserAddresses(userId: string) {
  return useQuery({
    queryKey: ["all-user-addresses", userId],
    queryFn: async () => getAllUserAddresses(userId),
    enabled: !!userId,
  });
}
