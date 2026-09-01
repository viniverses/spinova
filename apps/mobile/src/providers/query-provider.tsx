import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5 * 60 * 1_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
