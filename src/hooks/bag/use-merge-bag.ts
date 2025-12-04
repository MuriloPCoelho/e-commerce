import { mergeBag } from "@/actions/merge-bag";
import { LocalBagItem } from "@/types/bag";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMergeBag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (localBagItems: LocalBagItem[]) =>
      mergeBag({ localBagItems }),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["bag"] }),
  });
}
