import { z } from 'zod'

export const registroSchema = z
	.object({
		nome: z.string().min(1, 'Informe o nome.'),
		conselhoUf: z.string().min(1, 'Selecione a UF.'),
		conselhoNumero: z.string().min(1, 'Informe o número.'),
		categoriaConselho: z.string().optional(),
		senha: z.string().min(8, 'A senha tem no mínimo 8 caracteres.'),
		confirmarSenha: z.string().min(1, 'Confirme a senha.'),
	})
	.refine((dados) => dados.senha === dados.confirmarSenha, {
		path: ['confirmarSenha'],
		message: 'As senhas não conferem.',
	})

export type RegistroFormValues = z.infer<typeof registroSchema>
