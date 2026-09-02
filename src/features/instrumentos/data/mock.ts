import type { GrauConfig } from '../types/escala'
import type { OpcaoResposta, SecaoConfig } from '../types/questionario'

function opcao(texto: string, pontuacao: number): OpcaoResposta {
	return { id: crypto.randomUUID(), texto, pontuavel: true, pontuacao }
}

function semPontuacao(texto: string): OpcaoResposta {
	return { id: crypto.randomUUID(), texto, pontuavel: false, pontuacao: null }
}

export const QUESTIONARIO_INICIAL: SecaoConfig[] = [
	{
		id: 'sec-socioeconomicas',
		nome: 'Condições socioeconômicas',
		perguntas: [
			{
				id: 'vspn01',
				codigo: 'VSPN01',
				enunciado: 'Qual foi o maior nível de estudo que você concluiu?',
				tipo: 'multipla',
				opcoes: [
					opcao('Não estudou', 7),
					opcao('Fundamental incompleto', 6),
					opcao('Fundamental completo', 5),
					opcao('Médio incompleto', 4),
					opcao('Médio completo', 3),
					opcao('Superior incompleto', 2),
					semPontuacao('Superior completo'),
				],
			},
			{
				id: 'vspn02',
				codigo: 'VSPN02',
				enunciado: 'Atualmente, você está trabalhando?',
				tipo: 'multipla',
				opcoes: [
					opcao('Sim, com carteira assinada', 7),
					opcao('Sim, sem carteira assinada', 6),
					opcao('Sim, por conta própria', 5),
					opcao('Não estou trabalhando', 4),
					opcao('Estou afastada temporariamente', 3),
					opcao('Outra situação', 2),
				],
			},
			{
				id: 'vspn15',
				codigo: 'VSPN15',
				enunciado:
					'Durante a gravidez, você sofreu ou está sofrendo algum tipo de violência ou ameaça de alguém?',
				tipo: 'dicotomica_complementar',
				opcoes: [opcao('Sim', 7), opcao('Não', 6), semPontuacao('Prefiro não responder')],
				subPerguntas: [
					{
						id: 'vspn15a',
						codigo: 'VSPN15A',
						enunciado: 'Qual foi o maior nível de estudo que você concluiu?',
						tipo: 'multipla',
						opcoes: [
							opcao('Física', 7),
							opcao('Psicológica', 6),
							opcao('Sexual', 5),
							opcao('Financeira/patrimonial', 4),
						],
					},
				],
			},
		],
	},
	{
		id: 'sec-materiais',
		nome: 'Condições materiais e segurança alimentar',
		perguntas: [
			{
				id: 'vspn05',
				codigo: 'VSPN05',
				enunciado:
					'Nos últimos meses, os alimentos acabaram antes de você ter dinheiro para comprar mais?',
				tipo: 'dicotomica',
				opcoes: [opcao('Sim', 5), opcao('Não', 0)],
			},
		],
	},
]

function recomendacao(texto: string) {
	return { id: crypto.randomUUID(), texto }
}

const RECOMENDACOES_PADRAO = () => [
	recomendacao('Registrar os resultados no prontuário'),
	recomendacao('Discutir o caso com a equipe de saúde'),
]

export const ESCALA_GRAUS_INICIAIS: GrauConfig[] = [
	{ id: 'grau-baixa', nome: 'Baixa', cor: '#2db981', min: 0, max: 22, recomendacoes: RECOMENDACOES_PADRAO() },
	{ id: 'grau-moderada', nome: 'Moderada', cor: '#f6bd5a', min: 23, max: 46, recomendacoes: RECOMENDACOES_PADRAO() },
	{ id: 'grau-alta', nome: 'Alta', cor: '#f3596c', min: 47, max: 60, recomendacoes: RECOMENDACOES_PADRAO() },
]
