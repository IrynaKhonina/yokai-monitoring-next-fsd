import {QueryClient} from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 мин
            gcTime: 1000 * 60 * 10, // 10 мин
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})