import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export default function TanstackQueryClientProvider({ children }: { children: ReactNode }) {
	const client = new QueryClient()
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
