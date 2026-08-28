import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/features/core/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function AppShell() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="bg-n-0">
				<div className="flex min-w-0 flex-1 flex-col overflow-auto p-page">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
