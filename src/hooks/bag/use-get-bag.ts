import { getBag } from "@/actions/get-bag";
import { useQuery } from "@tanstack/react-query";

export function useGetBag() {
  return useQuery({
    queryKey: ["bag"],
    queryFn: async () => getBag(),
  })
}