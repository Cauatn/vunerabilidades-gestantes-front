import { calcularIdade } from '@/features/core/utils/date'
import type { Gestante } from '@/features/gestantes/types/gestante'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA, type Usuario } from '@/features/usuarios/types/usuario'
import type { Assessment } from '@/features/avaliacao/types/assessment'
import type { AvaliacaoDetalhe, CategoriaRespostas } from '@/features/avaliacao/types/historico'
import { classificarNivel } from '@/features/avaliacao/utils/vulnerabilidade'

interface Contexto {
	gestante?: Gestante
	aplicador?: Usuario
	ubsNome?: string
}

export function montarAvaliacaoDetalhe(atendimento: Assessment, contexto: Contexto): AvaliacaoDetalhe {
	const secaoPorPergunta = new Map(
		atendimento.snapshot.questions.map((pergunta) => [pergunta.id, pergunta.section]),
	)

	const categorias = new Map<string, CategoriaRespostas>()
	for (const resposta of atendimento.answers) {
		const titulo = secaoPorPergunta.get(resposta.questionId) ?? 'Sem seção'
		let categoria = categorias.get(titulo)
		if (!categoria) {
			categoria = { id: titulo, titulo, respostas: [] }
			categorias.set(titulo, categoria)
		}
		categoria.respostas.push({
			id: resposta.id,
			pergunta: resposta.questionStatement,
			resposta: resposta.optionLabel,
		})
	}

	const nascimento = contexto.gestante?.birthDate.slice(0, 10) ?? ''
	const categoriaProfissional = contexto.aplicador
		? CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[contexto.aplicador.role]]
		: '—'

	return {
		id: atendimento.id,
		resumo: {
			dataAplicacao: atendimento.appliedAt.slice(0, 10),
			ubs: contexto.ubsNome ?? '—',
			aplicador: contexto.aplicador?.name ?? '—',
			categoriaProfissional,
			crmCoren: contexto.aplicador?.professionalRegistration ?? '—',
			email: contexto.aplicador?.email ?? '—',
		},
		gestante: {
			nome: contexto.gestante?.name ?? '—',
			dataNascimento: nascimento,
			idade: nascimento ? calcularIdade(nascimento) : 0,
			cpf:
				contexto.gestante?.identifier.type === 'CPF' ? contexto.gestante.identifier.value : '—',
			cns:
				contexto.gestante?.identifier.type === 'SUS_CARD'
					? contexto.gestante.identifier.value
					: '—',
		},
		pontuacao: atendimento.result.totalScore,
		classificacao: classificarNivel(
			atendimento.result.vulnerabilityLevel,
			atendimento.snapshot.vulnerabilityBands,
			atendimento.result.vulnerabilityBandId,
		),
		categorias: [...categorias.values()],
		recomendacoesGestante: [...atendimento.recommendations]
			.sort((a, b) => a.order - b.order)
			.map((rec) => ({ id: rec.id, titulo: rec.text, observacoes: '' })),
	}
}
