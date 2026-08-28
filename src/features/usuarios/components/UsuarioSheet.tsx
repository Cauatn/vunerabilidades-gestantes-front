import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ESTADOS, getMunicipios } from '@/features/core/constants/localizacao'
import { useHealthUnits } from '@/features/healthUnits/composables/useHealthUnits'
import {
	CATEGORIA_PROFISSIONAL_LABEL,
	CATEGORIA_PROFISSIONAL_OPCOES,
} from '@/features/usuarios/constants/categoriaProfissional'
import {
	CATEGORIA_TO_ROLE,
	ROLE_TO_CATEGORIA,
	type CreateUsuarioPayload,
	type Usuario,
} from '@/features/usuarios/types/usuario'
import { usuarioSchema, type UsuarioFormValues } from '@/features/usuarios/validation/usuarioSchema'

const VALORES_VAZIOS: UsuarioFormValues = {
	email: '',
	categoriaProfissional: 'medico',
	regiaoUf: '',
	regiaoMunicipio: '',
	ubsAtendimento: [],
}

interface UsuarioSheetProps {
	usuario?: Usuario
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (payload: CreateUsuarioPayload) => void
	isSubmitting?: boolean
}

export function UsuarioSheet({ usuario, open, onOpenChange, onSubmit, isSubmitting }: UsuarioSheetProps) {
	const isEdit = !!usuario
	const { data: healthUnits } = useHealthUnits()

	const ubsPorNome = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.data.forEach((unit) => map.set(unit.name, unit.id))
		return map
	}, [healthUnits])

	const ubsPorId = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.data.forEach((unit) => map.set(unit.id, unit.name))
		return map
	}, [healthUnits])

	const opcoesUbs = useMemo(() => healthUnits?.data.map((unit) => unit.name) ?? [], [healthUnits])

	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<UsuarioFormValues>({
		resolver: zodResolver(usuarioSchema),
		defaultValues: VALORES_VAZIOS,
	})

	const categoriaProfissional = watch('categoriaProfissional')
	const regiaoUf = watch('regiaoUf')
	const isAdministrador = categoriaProfissional === 'administrador'

	useEffect(() => {
		if (!open) return
		if (usuario) {
			reset({
				email: usuario.email,
				categoriaProfissional: ROLE_TO_CATEGORIA[usuario.role],
				regiaoUf: usuario.regiaoUf ?? '',
				regiaoMunicipio: usuario.regiaoMunicipio ?? '',
				ubsAtendimento: usuario.healthUnitIds
					.map((id) => ubsPorId.get(id))
					.filter((nome): nome is string => !!nome),
			})
		} else {
			reset(VALORES_VAZIOS)
		}
	}, [open, usuario, reset, ubsPorId])

	function submit(values: UsuarioFormValues) {
		const role = CATEGORIA_TO_ROLE[values.categoriaProfissional]
		onSubmit({
			email: values.email,
			role,
			regiaoUf: role === 'ADMIN' ? undefined : values.regiaoUf,
			regiaoMunicipio: role === 'ADMIN' ? undefined : values.regiaoMunicipio,
			healthUnitIds:
				role === 'ADMIN'
					? undefined
					: values.ubsAtendimento
							.map((nome) => ubsPorNome.get(nome))
							.filter((id): id is string => !!id),
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0">
					<SheetTitle>{isEdit ? 'Editar usuário' : 'Criar usuário'}</SheetTitle>
				</SheetHeader>

				<form
					id="usuario-form"
					className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
					onSubmit={handleSubmit(submit)}
				>
					<Divider text="Informações gerais" />

					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="usuario-email" required>
								Email
							</FieldLabel>
							<FieldContent>
								<Input
									id="usuario-email"
									type="email"
									placeholder="Digite..."
									disabled={isEdit}
									aria-invalid={!!errors.email}
									{...register('email')}
								/>
								<FieldError errors={[errors.email]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="usuario-categoria" required>
								Categoria profissional
							</FieldLabel>
							<FieldContent>
								<Controller
									name="categoriaProfissional"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger id="usuario-categoria" className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{CATEGORIA_PROFISSIONAL_OPCOES.map((opcao) => (
													<SelectItem key={opcao} value={opcao}>
														{CATEGORIA_PROFISSIONAL_LABEL[opcao]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</FieldContent>
						</Field>
					</FieldGroup>

					{!isAdministrador && (
						<>
							<Divider text="Região de atuação" />

							<FieldGroup className="grid grid-cols-2 gap-3 space-y-0">
								<Field>
									<FieldLabel htmlFor="usuario-regiao-uf" required>
										UF
									</FieldLabel>
									<FieldContent>
										<Controller
											name="regiaoUf"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={(next) => {
														field.onChange(next)
														setValue('regiaoMunicipio', '')
													}}
												>
													<SelectTrigger id="usuario-regiao-uf" className="w-full" aria-invalid={!!errors.regiaoUf}>
														<SelectValue placeholder="Selecione" />
													</SelectTrigger>
													<SelectContent>
														{ESTADOS.map((estado) => (
															<SelectItem key={estado.uf} value={estado.uf}>
																{estado.uf}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError errors={[errors.regiaoUf]} />
									</FieldContent>
								</Field>

								<Field>
									<FieldLabel htmlFor="usuario-regiao-municipio" required>
										Município
									</FieldLabel>
									<FieldContent>
										<Controller
											name="regiaoMunicipio"
											control={control}
											render={({ field }) => (
												<Select value={field.value} onValueChange={field.onChange} disabled={!regiaoUf}>
													<SelectTrigger
														id="usuario-regiao-municipio"
														className="w-full"
														aria-invalid={!!errors.regiaoMunicipio}
													>
														<SelectValue placeholder="Selecione" />
													</SelectTrigger>
													<SelectContent>
														{getMunicipios(regiaoUf).map((municipio) => (
															<SelectItem key={municipio} value={municipio}>
																{municipio}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError errors={[errors.regiaoMunicipio]} />
									</FieldContent>
								</Field>
							</FieldGroup>

							<Field>
								<FieldLabel htmlFor="usuario-ubs" required>
									UBSs de atendimento
								</FieldLabel>
								<FieldContent>
									<Controller
										name="ubsAtendimento"
										control={control}
										render={({ field }) => (
											<MultiSelect
												id="usuario-ubs"
												options={opcoesUbs}
												value={field.value}
												onValueChange={field.onChange}
											/>
										)}
									/>
									<FieldError errors={[errors.ubsAtendimento]} />
								</FieldContent>
							</Field>
						</>
					)}
				</form>

				<SheetFooter className="p-0">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="submit" form="usuario-form" isLoading={isSubmitting}>
						Confirmar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
