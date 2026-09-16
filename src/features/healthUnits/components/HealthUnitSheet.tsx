import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

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
		formState: { errors },
	} = useForm<HealthUnitFormValues>({
		resolver: zodResolver(healthUnitSchema),
		defaultValues: VALORES_VAZIOS,
	})

	useEffect(() => {
		if (!open) return
		reset(
			healthUnit
				? {
						name: healthUnit.name,
						code: healthUnit.code,
						city: healthUnit.city,
						state: healthUnit.state,
						address: healthUnit.address ?? '',
					}
				: VALORES_VAZIOS,
		)
	}, [open, healthUnit, reset])

	function submit(values: HealthUnitFormValues) {
		onSubmit({
			name: values.name,
			code: values.code,
			city: values.city,
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
							<FieldLabel htmlFor="health-unit-city" required>
								Município
							</FieldLabel>
							<FieldContent>
								<Input
									id="health-unit-city"
									placeholder="Município"
									aria-invalid={!!errors.city}
									{...register('city')}
								/>
								<FieldError errors={[errors.city]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="health-unit-state" required>
								UF
							</FieldLabel>
							<FieldContent>
								<Input
									id="health-unit-state"
									placeholder="UF"
									maxLength={2}
									aria-invalid={!!errors.state}
									{...register('state')}
								/>
								<FieldError errors={[errors.state]} />
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
					>
						Confirmar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
