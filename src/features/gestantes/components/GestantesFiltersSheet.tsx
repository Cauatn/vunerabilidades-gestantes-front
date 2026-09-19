import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { ESTADOS } from '@/features/core/constants/localizacao'
import { FilterSelect } from '@/features/shared/components/FilterSelect'
import { useGetLocalitiesByUf } from '@/features/shared/composables/useGetLocalitiesByUf'
import type { ListFilters } from '@/features/shared/types/listFilters'
import { useState } from 'react'

import { useGetVulnerabilityBands } from '@/features/avaliacao/composables/useGetVulnerabilityBands'

export function GestantesFiltersSheet({
	value,
	onApply,
	onClose,
}: {
	value: ListFilters
	onApply: (filters: ListFilters | null) => void
	onClose: () => void
}) {
	const [draft, setDraft] = useState<ListFilters>(value || {})

	const options = useGetVulnerabilityBands()

	const cities = useGetLocalitiesByUf(draft.state || '')

	const set = (key: keyof ListFilters, next: string) =>
		setDraft((previous) => ({ ...previous, [key]: next }))

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
					<SheetTitle>Filtros de Gestantes</SheetTitle>
					<SheetDescription>
						Refine a listagem de gestantes.
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 space-y-5 overflow-y-auto pb-6">
					<FilterSelect
						label="UF"
						value={draft.state}
						onChange={(next) =>
							setDraft((previous) => ({
								...previous,
								state: next,
								city: '',
							}))
						}
						options={ESTADOS.map((state) => ({
							id: state.uf,
							name: `${state.uf} — ${state.nome}`,
						}))}
					/>

					<FilterSelect
						label="Município"
						value={draft.city}
						onChange={(next) => set('city', next)}
						options={[...(cities.data || [])]
							.sort((a, b) =>
								a.nome.localeCompare(b.nome, 'pt-BR'),
							)
							.map((city) => ({
								id: city.nome,
								name: city.nome,
							}))}
						disabled={
							!draft.state || cities.isFetching || cities.isError
						}
						placeholder={
							!draft.state ? 'Selecione a UF primeiro' : 'Todos'
						}
					/>
					{cities.isError && (
						<div role="alert" className="text-sm text-destructive">
							Não foi possível carregar os municípios.{' '}
							<Button
								variant="outline"
								onClick={() => void cities.refetch()}
							>
								Tentar novamente
							</Button>
						</div>
					)}

					<FilterSelect
						label="Grau de vulnerabilidade"
						value={draft.vulnerabilityLevel}
						onChange={(next) => set('vulnerabilityLevel', next)}
						options={(options.data || []).map((band) => ({
							id: band.slug,
							name: band.level,
						}))}
						disabled={options.isPending || options.isError}
					/>
					{options.isError && (
						<div role="alert" className="text-sm text-destructive">
							Não foi possível carregar o grau de vulnerabilidade.{' '}
							<Button
								variant="outline"
								onClick={() => void options.refetch()}
							>
								Tentar novamente
							</Button>
						</div>
					)}
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
					<Button onClick={() => apply(draft)}>Confirmar</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
