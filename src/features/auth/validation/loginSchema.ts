import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
	senha: z.string().min(8, 'A senha tem no mínimo 8 caracteres.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
