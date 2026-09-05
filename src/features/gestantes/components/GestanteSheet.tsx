import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { CreateGestantePayload, Gestante } from '@/features/gestantes/types/gestante'
import { formatCns, formatCpf, onlyDigits } from '@/features/gestantes/utils/document'
import { gestanteSchema, type GestanteFormValues } from '@/features/gestantes/validation/gestanteSchema'

const VALORES_VAZIOS: GestanteFormValues = {
	nome: '',
	dataNascimento: '',
	cpf: '',
	cns: '',
	nomeMae: '',
	telefone: '',
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
		control,
		formState: { errors },
	} = useForm<GestanteFormValues>({
		resolver: zodResolver(gestanteSchema),
		defaultValues: VALORES_VAZIOS,
	})

	useEffect(() => {
		if (!open) return
		reset(
			gestante
				? {
						nome: gestante.name,
						dataNascimento: gestante.birthDate.slice(0, 10),
						cpf: gestante.identifiers.cpf ? formatCpf(gestante.identifiers.cpf) : '',
						cns: gestante.identifiers.cns ? formatCns(gestante.identifiers.cns) : '',
						nomeMae: gestante.motherName ?? '',
						telefone: gestante.phone ?? '',
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
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0">
					<SheetTitle>{isEdit ? 'Editar gestante' : 'Nova gestante'}</SheetTitle>
				</SheetHeader>

				<form id="gestante-form" className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="gestante-nome" required>
								Nome
							</FieldLabel>
							<FieldContent>
								<Input
									id="gestante-nome"
									placeholder="Nome da gestante"
									aria-invalid={!!errors.nome}
									{...register('nome')}
								/>
								<FieldError errors={[errors.nome]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="gestante-data-nascimento" required>
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

						<Field>
							<FieldLabel htmlFor="gestante-cpf">CPF</FieldLabel>
							<FieldContent>
								<Input id="gestante-cpf" maskType="cpf" aria-invalid={!!errors.cpf} {...register('cpf')} />
								<FieldError errors={[errors.cpf]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="gestante-cns">CNS</FieldLabel>
							<FieldContent>
								<Input id="gestante-cns" maskType="cns" aria-invalid={!!errors.cns} {...register('cns')} />
								<FieldError errors={[errors.cns]} />
							</FieldContent>
						</Field>

						<p className="text-caption text-n-500">Informe pelo menos um documento: CPF ou CNS.</p>

						<Field>
							<FieldLabel htmlFor="gestante-nome-mae">Nome da mãe</FieldLabel>
							<FieldContent>
								<Input id="gestante-nome-mae" placeholder="Opcional" {...register('nomeMae')} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="gestante-telefone">Telefone</FieldLabel>
							<FieldContent>
								<Input id="gestante-telefone" placeholder="Opcional" {...register('telefone')} />
							</FieldContent>
						</Field>
					</FieldGroup>
				</form>

				<SheetFooter className="p-0">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="submit" form="gestante-form" isLoading={isSubmitting}>
						Confirmar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
