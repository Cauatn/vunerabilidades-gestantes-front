import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { CreateGestantePayload, Gestante } from '@/features/gestantes/types/gestante'
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

const digits = (value: string) => value.replace(/\D/g, '')

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
						cpf: gestante.identifier.type === 'CPF' ? gestante.identifier.value : '',
						cns: gestante.identifier.type === 'SUS_CARD' ? gestante.identifier.value : '',
						nomeMae: gestante.motherName ?? '',
						telefone: gestante.phone ?? '',
					}
				: { ...VALORES_VAZIOS, nome: nomeInicial ?? '' },
		)
	}, [open, gestante, nomeInicial, reset])

	function submit(values: GestanteFormValues) {
		const cpf = digits(values.cpf)
		const cns = digits(values.cns)
		onSubmit({
			name: values.nome,
			identifierType: cpf ? 'CPF' : 'SUS_CARD',
			identifierValue: cpf || cns,
			birthDate: values.dataNascimento,
			motherName: values.nomeMae.trim() || undefined,
			phone: digits(values.telefone) || undefined,
		})
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0">
					<SheetTitle>{isEdit ? 'Editar gestante' : 'Nova gestante'}</SheetTitle>
				</SheetHeader>

				<form id="gestante-form" className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
					<div className="space-y-1.5">
						<Label htmlFor="gestante-nome">Nome</Label>
						<Input id="gestante-nome" placeholder="Nome da gestante" aria-invalid={!!errors.nome} {...register('nome')} />
						{errors.nome ? <p className="text-caption text-danger">{errors.nome.message}</p> : null}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="gestante-data-nascimento">Data de nascimento</Label>
						<Input
							id="gestante-data-nascimento"
							type="date"
							aria-invalid={!!errors.dataNascimento}
							{...register('dataNascimento')}
						/>
						{errors.dataNascimento ? (
							<p className="text-caption text-danger">{errors.dataNascimento.message}</p>
						) : null}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="gestante-cpf">CPF</Label>
						<Input id="gestante-cpf" placeholder="000.000.000-00" aria-invalid={!!errors.cpf} {...register('cpf')} />
						{errors.cpf ? <p className="text-caption text-danger">{errors.cpf.message}</p> : null}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="gestante-cns">CNS</Label>
						<Input id="gestante-cns" placeholder="000 0000 0000 0000" aria-invalid={!!errors.cns} {...register('cns')} />
						{errors.cns ? <p className="text-caption text-danger">{errors.cns.message}</p> : null}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="gestante-nome-mae">Nome da mãe</Label>
						<Input id="gestante-nome-mae" placeholder="Opcional" {...register('nomeMae')} />
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="gestante-telefone">Telefone</Label>
						<Input id="gestante-telefone" placeholder="Opcional" {...register('telefone')} />
					</div>
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
