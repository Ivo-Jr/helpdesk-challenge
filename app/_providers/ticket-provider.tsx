"use client";

import { useEffect } from "react";
import { useTicketStore } from "@/stores/ticket-store";
import type { Ticket } from "@/types/ticket";

interface TicketProviderProps {
  initialTickets?: Ticket[];
  enableCache?: boolean;
  children: React.ReactNode;
}

export function TicketProvider({ 
  initialTickets, 
  enableCache = false,
  children 
}: TicketProviderProps) {
  const setTickets = useTicketStore((state) => state.setTickets);
  const enableCacheStore = useTicketStore((state) => state.enableCache);
  const disableCacheStore = useTicketStore((state) => state.disableCache);

  useEffect(() => {
    if (initialTickets) {
      setTickets(initialTickets);
    }
  }, [initialTickets, setTickets]);

  useEffect(() => {
    if (enableCache) {
      enableCacheStore();
    } else {
      disableCacheStore();
    }
  }, [enableCache, enableCacheStore, disableCacheStore]);

  return <>{children}</>;
}

