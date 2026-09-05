import { z } from 'zod'

import { onlyDigits } from '@/features/gestantes/utils/document'

export const gestanteSchema = z
	.object({
		nome: z.string().min(1, 'Informe o nome.'),
		dataNascimento: z.string().min(1, 'Informe a data de nascimento.'),
		cpf: z.string(),
		cns: z.string(),
		nomeMae: z.string(),
		telefone: z.string(),
	})
	.superRefine((dados, ctx) => {
		const cpf = onlyDigits(dados.cpf)
		const cns = onlyDigits(dados.cns)

		if (!cpf && !cns) {
			ctx.addIssue({ code: 'custom', path: ['cpf'], message: 'Informe o CPF ou o CNS.' })
		}
		if (cpf && cpf.length !== 11) {
			ctx.addIssue({ code: 'custom', path: ['cpf'], message: 'CPF deve ter 11 dígitos.' })
		}
		if (cns && cns.length !== 15) {
			ctx.addIssue({ code: 'custom', path: ['cns'], message: 'CNS deve ter 15 dígitos.' })
		}
	})

export type GestanteFormValues = z.infer<typeof gestanteSchema>
