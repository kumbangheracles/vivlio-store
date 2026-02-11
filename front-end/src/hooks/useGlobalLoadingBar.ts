import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/zustand/useLoadingStore";

const useGlobalLoadingBar = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePushRoute = (url: string, option: { scroll?: boolean } = {}) => {
    startTransition(() => {
      router.push(url, {
        scroll: option.scroll ?? false,
      });
    });
  };
  const handleReplaceRoute = (
    url: string,
    option: { scroll?: boolean } = {},
  ) => {
    startTransition(() => {
      router.replace(url, {
        scroll: option.scroll ?? false,
      });
    });
  };

  useEffect(() => {
    if (isPending) {
      useLoadingStore.getState().start();
    } else {
      useLoadingStore.getState().finish();
    }
  }, [isPending]);

  return { handlePushRoute, handleReplaceRoute };
};

export default useGlobalLoadingBar;
