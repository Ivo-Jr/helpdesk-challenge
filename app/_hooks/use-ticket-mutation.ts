import { useState, useCallback } from "react";
import { useTicketStore } from "../_stores/ticket-store";

interface UseTicketMutationOptions {
  onSuccess?: (data?: unknown) => void;
  onError?: (error: Error) => void;
  successDelay?: number;
  useOptimistic?: boolean;
}

interface UseTicketMutationReturn {
  mutate: (fn: () => Promise<unknown>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useTicketMutation(
  options?: UseTicketMutationOptions
): UseTicketMutationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const storeError = useTicketStore((state) => state.error);

  const mutate = useCallback(
    async (fn: () => Promise<unknown>) => {
      setError(null);
      setIsSuccess(false);
      setIsLoading(true);

      try {
        const result = await fn();
        setIsSuccess(true);
        setIsLoading(false);

        if (options?.onSuccess) {
          const delay = options.successDelay ?? 1500;
          setTimeout(() => {
            options.onSuccess!(result);
          }, delay);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro na operação";
        setError(message);
        setIsLoading(false);
        options?.onError?.(err as Error);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  const finalError = error || storeError;

  return { 
    mutate, 
    isLoading, 
    error: finalError, 
    isSuccess, 
    reset 
  };
}

