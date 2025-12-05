"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addProductToBag } from "@/actions/add-bag-product";
import { LocalBag, BagContextValue, BagWithTotal } from "@/types/bag";
import { toast } from "sonner";
import { useGetBag } from "@/hooks/bag/use-get-bag";
import { useMergeBag } from "@/hooks/bag/use-merge-bag";

const BagContext = createContext<BagContextValue | undefined>(undefined);

const LOCAL_BAG_KEY = "guest-bag";

const getLocalBag = (): LocalBag => {
  if (typeof window === "undefined") return { items: [] };
  
  try {
    const stored = localStorage.getItem(LOCAL_BAG_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const setLocalBag = (bag: LocalBag) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(LOCAL_BAG_KEY, JSON.stringify(bag));
  } catch (error) {
    console.error("Failed to save bag to localStorage:", error);
  }
};

const clearLocalBag = () => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(LOCAL_BAG_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage bag:", error);
  }
};

interface BagProviderProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export function BagProvider({ children, isAuthenticated }: BagProviderProps) {
  const queryClient = useQueryClient();
  const [localBag, setLocalBagState] = useState<LocalBag>({ items: [] });
  const [hasMerged, setHasMerged] = useState(false);

  useEffect(() => {
    setLocalBagState(getLocalBag());
  }, []);

  const { data: dbBag, isPending } = useGetBag();
  const mergeMutation = useMergeBag();

  useEffect(() => {
    if (isAuthenticated && localBag.items.length > 0 && !hasMerged && !mergeMutation.isPending) {
      mergeMutation.mutate(localBag.items, {
        onSuccess: () => {
          clearLocalBag();
          setLocalBagState({ items: [] });
          queryClient.invalidateQueries({ queryKey: ["bag"] });
          setHasMerged(true);
        },
        onError: (error) => {
          console.error("Failed to merge bag:", error);
          toast.error("Error syncing cart");
        },
      });
    }
  }, [isAuthenticated, localBag.items.length, hasMerged]);

  const addToLocalBag = useCallback((productVariantSizeId: number) => {
    const currentBag = getLocalBag();
    const existingItem = currentBag.items.find(
      (item) => item.productVariantSizeId === productVariantSizeId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentBag.items.push({ productVariantSizeId, quantity: 1 });
    }

    setLocalBag(currentBag);
    setLocalBagState(currentBag);
    queryClient.invalidateQueries({ queryKey: ["localBagDetails"] });
    toast.success("Product added to bag");
  }, [queryClient]);

  const removeFromLocalBag = useCallback((productVariantSizeId: number) => {
    const currentBag = getLocalBag();
    currentBag.items = currentBag.items.filter(
      (item) => item.productVariantSizeId !== productVariantSizeId
    );

    setLocalBag(currentBag);
    setLocalBagState(currentBag);
    queryClient.invalidateQueries({ queryKey: ["localBagDetails"] });
    toast.success("Product removed from bag");
  }, [queryClient]);

  const updateLocalQuantity = useCallback(
    (productVariantSizeId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromLocalBag(productVariantSizeId);
        return;
      }

      const currentBag = getLocalBag();
      const item = currentBag.items.find(
        (item) => item.productVariantSizeId === productVariantSizeId
      );

      if (item) {
        item.quantity = quantity;
        setLocalBag(currentBag);
        setLocalBagState(currentBag);
        queryClient.invalidateQueries({ queryKey: ["localBagDetails"] });
      }
    },
    [removeFromLocalBag, queryClient]
  );

  const addItem = useCallback(
    async (productVariantSizeId: number) => {
      if (isAuthenticated) {
        try {
          await addProductToBag({ productVariantSizeId });
          queryClient.invalidateQueries({ queryKey: ["bag"] });
          toast.success("Product added to bag");
        } catch (error) {
          console.error("Failed to add to bag:", error);
          toast.error("Error adding product");
        }
      } else {
        addToLocalBag(productVariantSizeId);
      }
    },
    [isAuthenticated, addToLocalBag, queryClient]
  );

  const removeItem = useCallback(
    async (productVariantSizeId: number) => {
      if (isAuthenticated) {
        try {
          toast.info("Remove from DB in development");
          queryClient.invalidateQueries({ queryKey: ["bag"] });
        } catch (error) {
          console.error("Failed to remove from bag:", error);
          toast.error("Error removing product");
        }
      } else {
        removeFromLocalBag(productVariantSizeId);
      }
    },
    [isAuthenticated, removeFromLocalBag, queryClient]
  );

  const updateQuantity = useCallback(
    async (productVariantSizeId: number, quantity: number) => {
      if (isAuthenticated) {
        toast.info("Feature in development");
      } else {
        updateLocalQuantity(productVariantSizeId, quantity);
      }
    },
    [isAuthenticated, updateLocalQuantity]
  );

  const clearBag = useCallback(async () => {
    if (isAuthenticated) {
      toast.info("Feature in development");
    } else {
      clearLocalBag();
      setLocalBagState({ items: [] });
      toast.success("Bag cleared");
    }
  }, [isAuthenticated]);

  const totalItems = isAuthenticated
    ? (dbBag?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0)
    : localBag.items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPriceInCents = isAuthenticated
    ? (dbBag?.totalPriceInCents ?? 0)
    : 0;

  const values: BagContextValue = {
    bag: dbBag as BagWithTotal | null ?? null,
    localBag,
    isAuthenticated,
    isPending: isAuthenticated ? isPending : false,
    totalItems,
    totalPriceInCents,
    addItem,
    removeItem,
    updateQuantity,
    clearBag,
    mergeBagOnLogin: () => mergeMutation.mutateAsync(localBag.items),
  };

  return <BagContext.Provider value={values}>{children}</BagContext.Provider>;
}

export function useBagContext() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBagContext must be used within BagProvider");
  }
  return context;
}
