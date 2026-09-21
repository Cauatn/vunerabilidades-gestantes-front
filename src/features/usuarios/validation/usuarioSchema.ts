import { z } from 'zod'

export const usuarioSchema = z
	.object({
		email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
		categoriaProfissional: z.enum(
			['administrador', 'medico', 'enfermeiro'],
			{
				error: 'Selecione a categoria profissional.',
			},
		),
		ubsAtendimento: z.array(z.string()),
		senha: z
			.string()
			.min(8, 'A senha deve ter no mínimo 8 caracteres.')
			.optional()
			.or(z.literal('')),
	})
	.superRefine((dados, ctx) => {
		if (dados.categoriaProfissional === 'administrador') return
		if (dados.ubsAtendimento.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['ubsAtendimento'],
				message: 'Selecione ao menos uma UBS.',
			})
		}
	})

export type UsuarioFormValues = z.infer<typeof usuarioSchema>
