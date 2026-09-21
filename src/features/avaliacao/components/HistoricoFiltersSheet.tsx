import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	FilterSelect,
	type Option,
} from '@/features/shared/components/FilterSelect'
import type { ListFilters } from '@/features/shared/types/listFilters'
import { useState } from 'react'

import { useGetVulnerabilityBands } from '@/features/avaliacao/composables/useGetVulnerabilityBands'
import { useGetGestantes } from '@/features/gestantes/composables/useGetGestantes'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { useGetHealthUnitProfessionals } from '@/features/healthUnits/composables/useGetHealthUnitProfessionals'
import { useSession } from '@/features/auth/composables/useSession'

export function HistoricoFiltersSheet({
	value,
	onApply,
	onClose,
}: {
	value: ListFilters
	onApply: (filters: ListFilters | null) => void
	onClose: () => void
}) {
	const { user } = useSession()
	const [draft, setDraft] = useState<ListFilters>(value || {})

	const bandsQuery = useGetVulnerabilityBands()
	const healthUnitsQuery = useGetHealthUnits({ pageSize: 200 })
	
	const professionalsUnitId = draft.healthUnitId || user?.currentHealthUnitId
	const usuariosQuery = useGetHealthUnitProfessionals(professionalsUnitId, {
		pageSize: 200,
	})
	
	const gestantesQuery = useGetGestantes({ pageSize: 200 })

	const set = (key: keyof ListFilters, next: string) =>
		setDraft((previous) => ({ ...previous, [key]: next }))

	const sorted = (items: Option[] = []) =>
		[...items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

	const invalidPeriod = !!(draft.from && draft.to && draft.from > draft.to)

	const apply = (filters: ListFilters | null) => {
		onApply(filters)
		onClose()
	}

	return (
		<Sheet
			open
			onOpenChange={(open) => {
				if (!open) onClose()
			}}
		>
			<SheetContent showCloseButton>
				<SheetHeader>
					<SheetTitle>Filtros do Histórico</SheetTitle>
					<SheetDescription>
						Refine a listagem do histórico de avaliações.
					</SheetDescription>
				</SheetHeader>
				<div className="flex-1 space-y-5 overflow-y-auto pb-6">
					<FilterSelect
						label="UBS"
						value={draft.healthUnitId}
						onChange={(next) =>
							setDraft((previous) => ({
								...previous,
								healthUnitId: next,
								appliedByUserId: '',
							}))
						}
						options={sorted(healthUnitsQuery.data?.items)}
						disabled={
							healthUnitsQuery.isPending ||
							healthUnitsQuery.isError
						}
					/>

					<FilterSelect
						label="Profissional"
						value={draft.appliedByUserId}
						onChange={(next) => set('appliedByUserId', next)}
						options={sorted(usuariosQuery.data?.items)}
						disabled={
							usuariosQuery.isPending || usuariosQuery.isError || !professionalsUnitId
						}
						placeholder={!professionalsUnitId ? 'Selecione a UBS primeiro' : undefined}
					/>

					<FilterSelect
						label="Gestante"
						value={draft.patientId}
						onChange={(next) => set('patientId', next)}
						options={sorted(gestantesQuery.data?.items)}
						disabled={
							gestantesQuery.isPending || gestantesQuery.isError
						}
					/>

					<FilterSelect
						label="Grau de vulnerabilidade"
						value={draft.vulnerabilityLevel}
						onChange={(next) => set('vulnerabilityLevel', next)}
						options={(bandsQuery.data || []).map((band) => ({
							id: band.slug,
							name: band.level,
						}))}
						disabled={bandsQuery.isPending || bandsQuery.isError}
					/>

					<fieldset className="space-y-3">
						<legend className="mb-2 text-sm font-medium">
							Período de aplicação
						</legend>
						<div className="space-y-2">
							<Label htmlFor="filter-from">Data inicial</Label>
							<Input
								id="filter-from"
								datePicker
								value={draft.from}
								onValueChange={(next) => set('from', next)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="filter-to">Data final</Label>
							<Input
								id="filter-to"
								datePicker
								value={draft.to}
								onValueChange={(next) => set('to', next)}
								aria-invalid={invalidPeriod}
							/>
						</div>
						{invalidPeriod && (
							<p
								role="alert"
								className="text-sm text-destructive"
							>
								A data final deve ser igual ou posterior à data
								inicial.
							</p>
						)}
						{(draft.from || draft.to) && (
							<Button
								variant="outline"
								onClick={() =>
									setDraft((previous) => ({
										...previous,
										from: '',
										to: '',
									}))
								}
							>
								Limpar período
							</Button>
						)}
					</fieldset>
				</div>
				<div className="mt-auto flex flex-wrap justify-end gap-3 pt-4">
					<Button
						variant="outline"
						className="mr-auto"
						onClick={() => apply(null)}
					>
						Limpar filtros
					</Button>
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button
						disabled={invalidPeriod}
						onClick={() => apply(draft)}
					>
						Confirmar
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
