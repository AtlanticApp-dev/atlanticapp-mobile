import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000 // 5 minutes (les données sont considérées comme "fraîches" pendant 5 minutes)
        }
    }
})