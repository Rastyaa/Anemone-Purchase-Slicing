"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_OUTLET_ID, outlets, type Outlet } from "@/lib/outlets";

interface OutletContextValue {
  outlet: Outlet;
  setOutletId: (id: string) => void;
}

const OutletContext = createContext<OutletContextValue | null>(null);

export function OutletProvider({ children }: { children: ReactNode }) {
  const [outletId, setOutletId] = useState(DEFAULT_OUTLET_ID);

  const value = useMemo<OutletContextValue>(() => {
    const outlet = outlets.find((item) => item.id === outletId) ?? outlets[0];
    return { outlet, setOutletId };
  }, [outletId]);

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
}

export function useOutlet(): OutletContextValue {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error("useOutlet must be used within OutletProvider");
  }
  return context;
}
