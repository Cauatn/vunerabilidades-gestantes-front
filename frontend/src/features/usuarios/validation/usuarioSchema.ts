import { z } from 'zod'

export const usuarioSchema = z
	.object({
		email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
		categoriaProfissional: z.enum(['administrador', 'medico', 'enfermeiro'], {
			error: 'Selecione a categoria profissional.',
		}),
		regiaoUf: z.string(),
		regiaoMunicipio: z.string(),
		ubsAtendimento: z.array(z.string()),
	})
	.superRefine((dados, ctx) => {
		if (dados.categoriaProfissional === 'administrador') return

		if (!dados.regiaoUf) ctx.addIssue({ code: 'custom', path: ['regiaoUf'], message: 'Selecione a UF.' })
		if (!dados.regiaoMunicipio)
			ctx.addIssue({ code: 'custom', path: ['regiaoMunicipio'], message: 'Selecione o município.' })
		if (dados.ubsAtendimento.length === 0)
			ctx.addIssue({ code: 'custom', path: ['ubsAtendimento'], message: 'Selecione ao menos uma UBS.' })
	})

export type UsuarioFormValues = z.infer<typeof usuarioSchema>
