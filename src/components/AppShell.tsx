import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/features/core/components/AppSidebar'

export function AppShell() {
	return (
		<div className="flex min-h-screen bg-n-0 text-n-800">
			<AppSidebar />
			<main className="flex min-w-0 flex-1 flex-col gap-10 overflow-x-hidden p-10">
				<Outlet />
			</main>
		</div>
	)
}
