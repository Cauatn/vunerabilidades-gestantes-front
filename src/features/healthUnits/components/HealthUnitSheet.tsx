import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ESTADOS } from '@/features/core/constants/localizacao'
import { useGetLocalitiesByUf } from '@/features/shared/composables/useGetLocalitiesByUf'

import { Button } from '@/components/ui/button'
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import type {
	CreateHealthUnitPayload,
	HealthUnit,
} from '@/features/healthUnits/types/healthUnit'
import {
	healthUnitSchema,
	type HealthUnitFormValues,
} from '@/features/healthUnits/validation/healthUnitSchema'

const VALORES_VAZIOS: HealthUnitFormValues = {
	name: '',
	code: '',
	city: '',
	state: '',
	address: '',
}

interface HealthUnitSheetProps {
	healthUnit?: HealthUnit
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (payload: CreateHealthUnitPayload) => void
	isSubmitting?: boolean
}

export function HealthUnitSheet({
	healthUnit,
	open,
	onOpenChange,
	onSubmit,
	isSubmitting,
}: HealthUnitSheetProps) {
	const isEdit = !!healthUnit

	const {
		register,
		handleSubmit,
		reset,
		control,
		setValue,
		setError,
		formState: { errors },
	} = useForm<HealthUnitFormValues>({
		resolver: zodResolver(healthUnitSchema),
		defaultValues: VALORES_VAZIOS,
	})
	const uf = useWatch({ control, name: 'state' })
	const {
		data: localidades,
		isFetching,
		isError,
		refetch,
	} = useGetLocalitiesByUf(open ? uf : '')
	const municipios = [...(localidades ?? [])].sort((a, b) =>
		a.nome.localeCompare(b.nome, 'pt-BR'),
	)
	const normalizar = (value: string) =>
		value
			.trim()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toUpperCase()

	useEffect(() => {
		if (!open) return
		reset(
			healthUnit
				? {
						name: healthUnit.name,
						code: healthUnit.code,
						city: healthUnit.city,
						state: healthUnit.state.trim().toUpperCase(),
						address: healthUnit.address ?? '',
					}
				: VALORES_VAZIOS,
		)
	}, [open, healthUnit, reset])

	function submit(values: HealthUnitFormValues) {
		const municipio = municipios.find(
			(item) => normalizar(item.nome) === normalizar(values.city),
		)
		if (!municipio) {
			setError('city', {
				message: 'Selecione um município da UF escolhida.',
			})
			return
		}
		onSubmit({
			name: values.name,
			code: values.code,
			city: municipio.nome,
			state: values.state,
			address: values.address.trim() || undefined,
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0">
					<SheetTitle>
						{isEdit ? 'Editar UBS' : 'Cadastrar UBS'}
					</SheetTitle>
				</SheetHeader>

				<form
					id="health-unit-form"
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(submit)}
				>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="health-unit-name" required>
								Nome
							</FieldLabel>
							<FieldContent>
								<Input
									id="health-unit-name"
									placeholder="Nome da unidade"
									aria-invalid={!!errors.name}
									{...register('name')}
								/>
								<FieldError errors={[errors.name]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="health-unit-code" required>
								Código CNES
							</FieldLabel>
							<FieldContent>
								<Input
									id="health-unit-code"
									placeholder="Código CNES"
									disabled={isEdit}
									aria-invalid={!!errors.code}
									{...register('code')}
								/>
								<FieldError errors={[errors.code]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="health-unit-state" required>
								UF
							</FieldLabel>
							<FieldContent>
								<Controller
									name="state"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={(value) => {
												if (value === field.value)
													return
												field.onChange(value)
												setValue('city', '', {
													shouldDirty: true,
													shouldValidate: true,
												})
											}}
										>
											<SelectTrigger
												id="health-unit-state"
												ref={field.ref}
												onBlur={field.onBlur}
												aria-invalid={!!errors.state}
												className="w-full"
											>
												<SelectValue placeholder="Selecione a UF" />
											</SelectTrigger>
											<SelectContent>
												{ESTADOS.map((estado) => (
													<SelectItem
														key={estado.uf}
														value={estado.uf}
													>
														{estado.uf} —{' '}
														{estado.nome}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[errors.state]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="health-unit-city" required>
								Município
							</FieldLabel>
							<FieldContent>
								<Controller
									name="city"
									control={control}
									render={({ field }) => {
										const selected =
											municipios.find(
												(item) =>
													normalizar(item.nome) ===
													normalizar(field.value),
											)?.nome ?? field.value
										return (
											<Select
												value={selected}
												onValueChange={(value) =>
													setValue('city', value, {
														shouldDirty: true,
														shouldTouch: true,
														shouldValidate: true,
													})
												}
												disabled={
													!uf || isFetching || isError
												}
											>
												<SelectTrigger
													id="health-unit-city"
													ref={field.ref}
													onBlur={field.onBlur}
													aria-invalid={!!errors.city}
													className="w-full"
												>
													<SelectValue
														placeholder={
															!uf
																? 'Selecione a UF primeiro'
																: isFetching
																	? 'Carregando municípios...'
																	: 'Selecione o município'
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{selected &&
														!municipios.some(
															(item) =>
																item.nome ===
																selected,
														) && (
															<SelectItem
																value={selected}
															>
																{selected}
															</SelectItem>
														)}
													{municipios.map((item) => (
														<SelectItem
															key={
																item.codigo_ibge
															}
															value={item.nome}
														>
															{item.nome}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)
									}}
								/>
								{isError && (
									<div
										role="alert"
										className="text-sm text-r-500"
									>
										Não foi possível carregar os municípios.{' '}
										<Button
											type="button"
											variant="outline"
											onClick={() => void refetch()}
										>
											Tentar novamente
										</Button>
									</div>
								)}
								{uf &&
									!isFetching &&
									!isError &&
									localidades?.length === 0 && (
										<p className="text-sm text-n-600">
											Nenhum município encontrado para
											esta UF.
										</p>
									)}
								<FieldError errors={[errors.city]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="health-unit-address">
								Endereço
							</FieldLabel>
							<FieldContent>
								<Input
									id="health-unit-address"
									placeholder="Opcional"
									{...register('address')}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>
				</form>

				<SheetFooter className="p-0">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						form="health-unit-form"
						isLoading={isSubmitting}
						disabled={isFetching || isError}
					>
						Confirmar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
