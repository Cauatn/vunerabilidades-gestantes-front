import type { Classificacao } from '@/features/avaliacao/constants'
import type { AvaliacaoDetalhe, CategoriaRespostas, RecomendacaoGestante } from '@/features/avaliacao/types/historico'
import { calcularIdade } from '@/features/core/utils/date'
import type { Vulnerabilidade } from '@/features/gestantes/types/gestante'

export interface HistoricoAplicacao {
	id: string
	gestante: string
	data: string
	vulnerabilidade: Vulnerabilidade
	aplicadoPor: string
}

export const HISTORICO: HistoricoAplicacao[] = [
	{ id: 'h1', gestante: 'Antonietta Silva', data: '2026-08-12', vulnerabilidade: 'baixa', aplicadoPor: 'José Victor' },
	{ id: 'h2', gestante: 'Patricia Ferreira', data: '2026-08-05', vulnerabilidade: 'alta', aplicadoPor: 'José Victor' },
	{ id: 'h3', gestante: 'Claudiana Cruz', data: '2026-07-28', vulnerabilidade: 'moderada', aplicadoPor: 'José Victor' },
]

const VULNERABILIDADE_PARA_CLASSIFICACAO: Record<Vulnerabilidade, Classificacao> = {
	baixa: 'BAIXA',
	moderada: 'MODERADA',
	alta: 'ALTA',
}

const PONTUACAO_POR_CLASSIFICACAO: Record<Classificacao, number> = {
	BAIXA: 2,
	MODERADA: 6,
	ALTA: 10,
}

const CATEGORIAS_MOCK: CategoriaRespostas[] = [
	{
		id: 'condicoes-socioeconomicas',
		titulo: 'Condições socioeconômicas',
		respostas: [
			{ id: 'renda', pergunta: 'A renda familiar é suficiente para atender às necessidades básicas?', resposta: 'Sim' },
			{ id: 'vinculo', pergunta: 'A gestante possui vínculo empregatício?', resposta: 'Trabalho informal' },
		],
	},
	{
		id: 'moradia-saneamento',
		titulo: 'Moradia e Saneamento',
		respostas: [
			{ id: 'moradia-1', pergunta: 'A residência possui saneamento básico adequado?', resposta: 'Sim' },
			{ id: 'moradia-2', pergunta: 'A moradia oferece condições adequadas de segurança?', resposta: 'Parcialmente' },
		],
	},
	{
		id: 'seguranca-alimentar',
		titulo: 'Segurança Alimentar',
		respostas: [
			{ id: 'alimentar-1', pergunta: 'A gestante tem acesso regular a alimentos?', resposta: 'Sim' },
			{ id: 'alimentar-2', pergunta: 'A alimentação atende às necessidades nutricionais da gestação?', resposta: 'Parcialmente' },
		],
	},
]

const RECOMENDACOES_GESTANTE_MOCK: RecomendacaoGestante[] = [
	{
		id: 'alcool',
		titulo: 'Não ingerir bebida alcoolica',
		observacoes:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis maximus, mauris at tempor finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 'cigarro',
		titulo: 'Não fumar cigarros',
		observacoes:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis maximus, mauris at tempor finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
]

export function formatarEmitidoEm(data: Date): string {
	const dia = String(data.getDate()).padStart(2, '0')
	const mes = String(data.getMonth() + 1).padStart(2, '0')
	const ano = data.getFullYear()
	const hora = String(data.getHours()).padStart(2, '0')
	const minuto = String(data.getMinutes()).padStart(2, '0')
	return `${dia}/${mes}/${ano} às ${hora}:${minuto}`
}

export function criarAvaliacaoDetalheMock(id: string): AvaliacaoDetalhe {
	const historico = HISTORICO.find((item) => item.id === id)
	const classificacao = VULNERABILIDADE_PARA_CLASSIFICACAO[historico?.vulnerabilidade ?? 'baixa']
	const dataNascimento = '2001-04-01'

	return {
		id,
		resumo: {
			dataAplicacao: historico?.data ?? '2026-08-12',
			ubs: 'UBS Country Club',
			aplicador: historico?.aplicadoPor ?? 'José Victor Cruz Rebouças',
			categoriaProfissional: 'Médico',
			crmCoren: 'CRM/BA 123456',
			email: 'j.victor@email.com',
		},
		gestante: {
			nome: historico?.gestante ?? 'Antonietta Silva',
			dataNascimento,
			idade: calcularIdade(dataNascimento),
			cpf: '000.000.000-00',
			cns: '0000 0000 0000 000',
		},
		pontuacao: PONTUACAO_POR_CLASSIFICACAO[classificacao],
		classificacao,
		categorias: CATEGORIAS_MOCK,
		recomendacoesGestante: RECOMENDACOES_GESTANTE_MOCK,
	}
}
