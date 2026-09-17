import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input, applyMask } from '@/components/ui/input'
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
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { ESTADOS } from '@/features/core/constants/localizacao'
import type {
	CreateGestantePayload,
	Gestante,
} from '@/features/gestantes/types/gestante'
import {
	formatCns,
	formatCpf,
	onlyDigits,
} from '@/features/gestantes/utils/document'
import {
	gestanteSchema,
	type GestanteFormValues,
} from '@/features/gestantes/validation/gestanteSchema'
import { useGetLocalitiesByUf } from '@/features/shared/composables/useGetLocalitiesByUf'

const VALORES_VAZIOS: GestanteFormValues = {
	nome: '',
	dataNascimento: '',
	cpf: '',
	cns: '',
	nomeMae: '',
	telefone: '',
	estado: '',
	municipio: '',
}

interface GestanteSheetProps {
	gestante?: Gestante
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (payload: CreateGestantePayload) => void
	isSubmitting?: boolean
	nomeInicial?: string
}

export function GestanteSheet({
	gestante,
	open,
	onOpenChange,
	onSubmit,
	isSubmitting,
	nomeInicial,
}: GestanteSheetProps) {
	const isEdit = !!gestante
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		control,
		formState: { errors },
	} = useForm<GestanteFormValues>({
		resolver: zodResolver(gestanteSchema),
		defaultValues: VALORES_VAZIOS,
	})

	const estadoSelecionado = useWatch({
		control,
		name: 'estado',
	})

	const { data: localidades, isLoading: isLoadingLocalidades } =
		useGetLocalitiesByUf(estadoSelecionado)

	useEffect(() => {
		// Resetar município quando o estado selecionado mudar e não for o reset inicial
		const currentMunicipio = control._formValues.municipio
		if (
			localidades &&
			currentMunicipio &&
			!localidades.some((l) => l.nome === currentMunicipio)
		) {
			setValue('municipio', '')
		}
	}, [estadoSelecionado, setValue, control, localidades])

	useEffect(() => {
		if (!open) return
		reset(
			gestante
				? {
						nome: gestante.name,
						dataNascimento: gestante.birthDate.slice(0, 10),
						cpf: gestante.identifiers.cpf
							? formatCpf(gestante.identifiers.cpf)
							: '',
						cns: gestante.identifiers.cns
							? formatCns(gestante.identifiers.cns)
							: '',
						nomeMae: gestante.motherName ?? '',
						telefone: applyMask('telefone', gestante.phone ?? ''),
						estado: gestante.state,
						municipio: gestante.city,
					}
				: { ...VALORES_VAZIOS, nome: nomeInicial ?? '' },
		)
	}, [open, gestante, nomeInicial, reset])

	function submit(values: GestanteFormValues) {
		const cpf = onlyDigits(values.cpf)
		const cns = onlyDigits(values.cns)
		onSubmit({
			name: values.nome,
			cpf: cpf || undefined,
			cns: cns || undefined,
			birthDate: values.dataNascimento,
			motherName: values.nomeMae.trim() || undefined,
			phone: onlyDigits(values.telefone) || undefined,
			state: values.estado,
			city: values.municipio,
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0 mb-6">
					<SheetTitle>
						{isEdit ? 'Editar gestante' : 'Nova gestante'}
					</SheetTitle>
				</SheetHeader>

				<form
					id="gestante-form"
					className="flex flex-col gap-4"
					onSubmit={handleSubmit(submit)}
				>
					<FieldGroup>
						<Divider text="Informações pessoais" />
						<Field>
							<FieldLabel htmlFor="gestante-nome" required>
								Nome
							</FieldLabel>
							<FieldContent>
								<Input
									id="gestante-nome"
									placeholder="Digite..."
									aria-invalid={!!errors.nome}
									{...register('nome')}
								/>
								<FieldError errors={[errors.nome]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel
								htmlFor="gestante-data-nascimento"
								required
							>
								Data de nascimento
							</FieldLabel>
							<FieldContent>
								<Controller
									name="dataNascimento"
									control={control}
									render={({ field }) => (
										<Input
											id="gestante-data-nascimento"
											datePicker
											value={field.value}
											onValueChange={field.onChange}
										/>
									)}
								/>
								<FieldError errors={[errors.dataNascimento]} />
							</FieldContent>
						</Field>

						<div className="flex gap-4">
							<Field>
								<FieldLabel htmlFor="gestante-cpf">
									CPF
								</FieldLabel>
								<FieldContent>
									<Input
										id="gestante-cpf"
										maskType="cpf"
										aria-invalid={!!errors.cpf}
										{...register('cpf')}
									/>
									<FieldError errors={[errors.cpf]} />
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="gestante-cns">
									CNS
								</FieldLabel>
								<FieldContent>
									<Input
										id="gestante-cns"
										maskType="cns"
										aria-invalid={!!errors.cns}
										{...register('cns')}
									/>
									<FieldError errors={[errors.cns]} />
								</FieldContent>
							</Field>
						</div>
						<p className="text-caption text-n-500">
							Informe pelo menos um documento: CPF ou CNS.
						</p>
					</FieldGroup>

					<FieldGroup>
						<Divider text="Endereço" />
						<Field>
							<FieldLabel required>Estado</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="estado"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Selecione" />
											</SelectTrigger>
											<SelectContent>
												{ESTADOS.map((estado) => (
													<SelectItem
														key={estado.uf}
														value={estado.uf}
													>
														{estado.uf}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[errors.estado]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel required>Município</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="municipio"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={
												!estadoSelecionado ||
												isLoadingLocalidades
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder={
														isLoadingLocalidades
															? 'Carregando...'
															: 'Selecione'
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{localidades?.map((local) => (
													<SelectItem
														key={local.codigo_ibge}
														value={local.nome}
													>
														{local.nome}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[errors.municipio]} />
							</FieldContent>
						</Field>
					</FieldGroup>

					<FieldGroup>
						<Divider text="Informações complementares" />
						<Field>
							<FieldLabel htmlFor="gestante-nome-mae">
								Nome da mãe
							</FieldLabel>
							<FieldContent>
								<Input
									id="gestante-nome-mae"
									placeholder="Digite..."
									{...register('nomeMae')}
								/>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="gestante-telefone">
								Telefone
							</FieldLabel>
							<FieldContent>
								<Input
									id="gestante-telefone"
									type="tel"
									autoComplete="tel-national"
									maskType="telefone"
									{...register('telefone')}
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
						form="gestante-form"
						isLoading={isSubmitting}
					>
						Confirmar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
