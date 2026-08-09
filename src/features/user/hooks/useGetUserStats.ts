import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";

export function useGetUserStats() {
  const fetchUserName = useUserStore((state) => state.getUserName);

  const [userFullName, setUserFullName] = useState<{
    name: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchUserName()
      .then((namePayload) => {
        if (mounted) {
          setUserFullName(namePayload);
        }
      })
      .catch(() => {
        if (mounted) {
          setUserFullName(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [fetchUserName]);

  return { userFullName };
}
