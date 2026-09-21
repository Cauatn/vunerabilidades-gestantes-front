import { z } from 'zod'

export const healthUnitSchema = z.object({
	name: z.string().min(3, 'O nome deve ter ao menos 3 caracteres.'),
	code: z.string().min(1, 'Informe o código CNES.'),
	city: z.string().min(1, 'Informe o município.'),
	state: z
		.string()
		.length(2, 'A UF deve ter duas letras.')
		.transform((value) => value.toUpperCase()),
	address: z.string(),
})

export type HealthUnitFormValues = z.infer<typeof healthUnitSchema>
