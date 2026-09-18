import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { api } from '@/features/core/service/apiService'
import { useSession } from '@/features/auth/composables/useSession'
import { ESTADOS } from '@/features/core/constants/localizacao'
import { useGetLocalitiesByUf } from '../composables/useGetLocalitiesByUf'
import type { ListFilters } from '../types/listFilters'

interface Option {
	id: string
	name: string
}
interface FilterOptions {
	healthUnits: Option[]
	professionals: (Option & { role: string })[]
	patients: Option[]
	levels: string[]
}

function FilterSelect({
	label,
	value,
	onChange,
	options,
	disabled = false,
	placeholder = 'Todos',
}: {
	label: string
	value?: string
	onChange: (value: string) => void
	options: Option[]
	disabled?: boolean
	placeholder?: string
}) {
	const id = `filter-${label.replace(/\s/g, '-')}`
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Select
				value={value || '__all__'}
				onValueChange={(next) =>
					onChange(next === '__all__' ? '' : next)
				}
				disabled={disabled}
			>
				<SelectTrigger id={id} className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="__all__">{placeholder}</SelectItem>
					{options.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							{option.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export function ListFiltersSheet({
	mode,
	value,
	onApply,
	onClose,
}: {
	mode: 'assessments' | 'patients'
	value: ListFilters
	onApply: (filters: ListFilters) => void
	onClose: () => void
}) {
	// O painel é montado a cada abertura: cancelar descarta apenas o rascunho.
	const [draft, setDraft] = useState<ListFilters>(value)
	const { user } = useSession()
	const options = useQuery({
		queryKey: [
			'assessments',
			'filter-options',
			user?.id,
			user?.currentHealthUnitId,
		],
		queryFn: async () =>
			(await api.get<FilterOptions>('/assessments/filter-options')).data,
	})
	const cities = useGetLocalitiesByUf(
		mode === 'patients' ? draft.state || '' : '',
	)
	const set = (key: keyof ListFilters, next: string) =>
		setDraft((previous) => ({ ...previous, [key]: next }))
	const sorted = (items: Option[] = []) =>
		[...items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
	const invalidPeriod = !!(draft.from && draft.to && draft.from > draft.to)
	const apply = (filters: ListFilters) => {
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
					<SheetTitle>Filtros</SheetTitle>
					<SheetDescription>
						Combine os campos desejados para refinar a listagem.
					</SheetDescription>
				</SheetHeader>
				<div className="flex-1 space-y-5 overflow-y-auto pb-6">
					{options.isPending && (
						<p role="status" className="text-sm text-n-600">
							Carregando opções...
						</p>
					)}
					{options.isError && (
						<div role="alert" className="text-sm text-destructive">
							Não foi possível carregar as opções.{' '}
							<Button
								variant="outline"
								onClick={() => void options.refetch()}
							>
								Tentar novamente
							</Button>
						</div>
					)}
					<FilterSelect
						label="UBS"
						value={draft.healthUnitId}
						onChange={(next) => set('healthUnitId', next)}
						options={sorted(options.data?.healthUnits)}
						disabled={options.isPending || options.isError}
					/>
					{mode === 'assessments' ? (
						<>
							<FilterSelect
								label="Profissional"
								value={draft.appliedByUserId}
								onChange={(next) =>
									set('appliedByUserId', next)
								}
								options={sorted(options.data?.professionals)}
								disabled={options.isPending || options.isError}
							/>
							<FilterSelect
								label="Gestante"
								value={draft.patientId}
								onChange={(next) => set('patientId', next)}
								options={sorted(options.data?.patients)}
								disabled={options.isPending || options.isError}
							/>
							<fieldset className="space-y-3">
								<legend className="mb-2 text-sm font-medium">
									Período
								</legend>
								<div className="space-y-2">
									<Label htmlFor="filter-from">
										Data inicial
									</Label>
									<Input
										id="filter-from"
										datePicker
										value={draft.from}
										onValueChange={(next) =>
											set('from', next)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="filter-to">
										Data final
									</Label>
									<Input
										id="filter-to"
										datePicker
										value={draft.to}
										onValueChange={(next) =>
											set('to', next)
										}
										aria-invalid={invalidPeriod}
									/>
								</div>
								{invalidPeriod && (
									<p
										role="alert"
										className="text-sm text-destructive"
									>
										A data final deve ser igual ou posterior
										à data inicial.
									</p>
								)}
								{(draft.from || draft.to) && (
									<Button
										variant="ghost"
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
						</>
					) : (
						<>
							<FilterSelect
								label="Funcionários"
								value={draft.doctorId}
								onChange={(next) => set('doctorId', next)}
								options={sorted(options.data?.professionals)}
								disabled={options.isPending || options.isError}
							/>
							<FilterSelect
								label="Grau de vulnerabilidade"
								value={draft.vulnerabilityLevel}
								onChange={(next) =>
									set('vulnerabilityLevel', next)
								}
								options={(options.data?.levels || []).map(
									(level) => ({ id: level, name: level }),
								)}
								disabled={options.isPending || options.isError}
							/>
							<p className="text-xs text-n-600">
								Funcionário e UBS referem-se aos atendimentos
								realizados. O grau considera a avaliação mais
								recente.
							</p>
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
								options={sorted(
									cities.data?.map((city) => ({
										id: city.nome,
										name: city.nome,
									})),
								)}
								disabled={
									!draft.state ||
									cities.isFetching ||
									cities.isError
								}
								placeholder={
									cities.isFetching
										? 'Carregando...'
										: !draft.state
											? 'Selecione a UF primeiro'
											: 'Todos'
								}
							/>
							{cities.isError && (
								<div
									role="alert"
									className="text-sm text-destructive"
								>
									Não foi possível carregar os municípios.{' '}
									<Button
										variant="outline"
										onClick={() => void cities.refetch()}
									>
										Tentar novamente
									</Button>
								</div>
							)}
						</>
					)}
				</div>
				<div className="mt-auto flex flex-wrap justify-end gap-3 border-t pt-4">
					<Button
						variant="outline"
						className="mr-auto"
						onClick={() => apply({})}
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
