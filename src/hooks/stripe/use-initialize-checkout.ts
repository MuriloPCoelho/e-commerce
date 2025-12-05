import { initializeCheckout } from "@/actions/stripe/initialize-checkout";
import { useQuery } from "@tanstack/react-query";
import { useBagContext } from "@/providers/bag-provider";

export function useInitializeCheckout() {
  const { bag } = useBagContext();

  return useQuery({
    queryKey: ["initialize-checkout", bag?.id, bag?.totalPriceInCents],
    queryFn: async () => initializeCheckout(),
    enabled: !!bag && bag.totalPriceInCents > 0,
  });
}
