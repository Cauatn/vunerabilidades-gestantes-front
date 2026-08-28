import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/features/core/components/AppSidebar'
import { useSession } from '@/features/auth/composables/useSession'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { SelecionarUbsModal } from '@/features/usuarios/components/SelecionarUbsModal'
import { useSetCurrentHealthUnit } from '@/features/usuarios/composables/useSetCurrentHealthUnit'

export function AppShell() {
	const { user } = useSession()
	const { data: healthUnits } = useGetHealthUnits()
	const trocarUbs = useSetCurrentHealthUnit()
	const [modalAberto, setModalAberto] = useState(false)

	const minhasUbs = healthUnits?.items.filter((unit) => user?.healthUnitIds.includes(unit.id)) ?? []

	useEffect(() => {
		if (user && !user.currentHealthUnitId && minhasUbs.length > 0) setModalAberto(true)
	}, [user, minhasUbs.length])

	return (
		<div className="flex h-screen overflow-hidden bg-n-0 text-n-800">
			<AppSidebar />
			<main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-10">
				<Outlet />
			</main>
			<SelecionarUbsModal
				open={modalAberto}
				onOpenChange={setModalAberto}
				ubsOptions={minhasUbs}
				isPending={trocarUbs.isPending}
				onConfirmar={(id) => trocarUbs.mutate(id, { onSuccess: () => setModalAberto(false) })}
			/>
		</div>
	)
}
