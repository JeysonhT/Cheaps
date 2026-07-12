import { useCallback, useEffect, useState } from "react";
import creditorService from "@/features/debts/services/seller.service";

export default function useCheckCreditors() {
  const [isLoading, setIsLoading] = useState(false);

  const [response, setResponse] = useState<{ totalCreditors: number } | null>(
    null,
  );

  const check = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await creditorService.checkCreditors();

      setResponse(response);
    } catch (e) {
      setIsLoading(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return {
    isLoading,
    response,
  };
}
