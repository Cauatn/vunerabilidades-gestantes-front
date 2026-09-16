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
import { useSession } from '@/features/auth/composables/useSession'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import {
	CATEGORIA_PROFISSIONAL_LABEL,
	CATEGORIA_PROFISSIONAL_OPCOES,
} from '@/features/usuarios/constants/categoriaProfissional'
import { CATEGORIA_TO_ROLE, ROLE_TO_CATEGORIA, type InviteUsuarioPayload, type Usuario } from '@/features/usuarios/types/usuario'
import { usuarioSchema, type UsuarioFormValues } from '@/features/usuarios/validation/usuarioSchema'

const VALORES_VAZIOS: UsuarioFormValues = {
	email: '',
	categoriaProfissional: 'medico',
	ubsAtendimento: [],
	senha: '',
}

interface UsuarioSheetProps {
	usuario?: Usuario
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (payload: InviteUsuarioPayload) => void
	isSubmitting?: boolean
}

export function UsuarioSheet({ usuario, open, onOpenChange, onSubmit, isSubmitting }: UsuarioSheetProps) {
	const { data: healthUnits } = useGetHealthUnits()
	const { user } = useSession()
	const isEdit = !!usuario
	const isProprioUsuario = usuario?.id === user?.id

	const ubsIdPorNome = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.items.forEach((unit) => map.set(unit.name, unit.id))
		return map
	}, [healthUnits])

	const opcoesUbs = useMemo(() => healthUnits?.items.map((unit) => unit.name) ?? [], [healthUnits])

	const ubsAtualNome = useMemo(
		() => healthUnits?.items.find((unit) => unit.id === user?.currentHealthUnitId)?.name,
		[healthUnits, user],
	)

	const ubsAtendimentoNomes = useMemo(
		() =>
			usuario?.healthUnitIds
				.map((id) => healthUnits?.items.find((unit) => unit.id === id)?.name)
				.filter((nome): nome is string => !!nome) ?? [],
		[usuario, healthUnits],
	)

	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors },
	} = useForm<UsuarioFormValues>({
		resolver: zodResolver(usuarioSchema),
		defaultValues: VALORES_VAZIOS,
	})

	const isAdministrador = watch('categoriaProfissional') === 'administrador'

	useEffect(() => {
		if (!open) return
		reset(
			usuario
				? {
						email: usuario.email,
						categoriaProfissional: ROLE_TO_CATEGORIA[usuario.role],
						ubsAtendimento: ubsAtendimentoNomes,
						senha: '',
					}
				: { ...VALORES_VAZIOS, ubsAtendimento: ubsAtualNome ? [ubsAtualNome] : [] },
		)
	}, [open, reset, usuario, ubsAtendimentoNomes, ubsAtualNome])

	function submit(values: UsuarioFormValues) {
		const role = CATEGORIA_TO_ROLE[values.categoriaProfissional]
		onSubmit({
			email: values.email,
			role,
			healthUnitIds:
				role === 'ADMIN'
					? undefined
					: values.ubsAtendimento
							.map((nome) => ubsIdPorNome.get(nome))
							.filter((id): id is string => !!id),
			password: values.senha || undefined,
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

						{isEdit && !isProprioUsuario ? (
							<Field>
								<FieldLabel htmlFor="usuario-senha">Nova senha</FieldLabel>
								<FieldContent>
									<Input
										id="usuario-senha"
										type="password"
										placeholder="Digite para alterar..."
										aria-invalid={!!errors.senha}
										{...register('senha')}
									/>
									<FieldError errors={[errors.senha]} />
								</FieldContent>
							</Field>
						) : null}
					</FieldGroup>

					{!isAdministrador ? (
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
					) : null}
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
