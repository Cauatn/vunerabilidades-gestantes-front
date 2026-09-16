import type { LevelConfig } from '../types/scale'
import type { AnswerOption, SectionConfig } from '../types/questionnaire'

function option(text: string, score: number): AnswerOption {
	return { id: crypto.randomUUID(), text, scorable: true, score }
}

function unscored(text: string): AnswerOption {
	return { id: crypto.randomUUID(), text, scorable: false, score: null }
}

export const INITIAL_QUESTIONNAIRE: SectionConfig[] = [
	{
		id: 'sec-socioeconomicas',
		name: 'Condições socioeconômicas',
		questions: [
			{
				id: 'vspn01',
				statement:
					'Qual foi o maior nível de estudo que você concluiu?',
				type: 'multipla',
				options: [
					option('Não estudou', 7),
					option('Fundamental incompleto', 6),
					option('Fundamental completo', 5),
					option('Médio incompleto', 4),
					option('Médio completo', 3),
					option('Superior incompleto', 2),
					unscored('Superior completo'),
				],
			},
			{
				id: 'vspn02',
				statement: 'Atualmente, você está trabalhando?',
				type: 'multipla',
				options: [
					option('Sim, com carteira assinada', 7),
					option('Sim, sem carteira assinada', 6),
					option('Sim, por conta própria', 5),
					option('Não estou trabalhando', 4),
					option('Estou afastada temporariamente', 3),
					option('Outra situação', 2),
				],
			},
			{
				id: 'vspn15',
				statement:
					'Durante a gravidez, você sofreu ou está sofrendo algum tipo de violência ou ameaça de alguém?',
				type: 'dicotomica_complementar',
				options: [
					option('Sim', 7),
					option('Não', 6),
					unscored('Prefiro não responder'),
				],
				subQuestions: [
					{
						id: 'vspn15a',
						statement:
							'Qual foi o maior nível de estudo que você concluiu?',
						type: 'multipla',
						options: [
							option('Física', 7),
							option('Psicológica', 6),
							option('Sexual', 5),
							option('Financeira/patrimonial', 4),
						],
					},
				],
			},
		],
	},
	{
		id: 'sec-materiais',
		name: 'Condições materiais e segurança alimentar',
		questions: [
			{
				id: 'vspn05',
				statement:
					'Nos últimos meses, os alimentos acabaram antes de você ter dinheiro para comprar mais?',
				type: 'dicotomica',
				options: [option('Sim', 5), option('Não', 0)],
			},
		],
	},
]

function recommendation(text: string) {
	return { id: crypto.randomUUID(), text }
}

const DEFAULT_RECOMMENDATIONS = () => [
	recommendation('Registrar os resultados no prontuário'),
	recommendation('Discutir o caso com a equipe de saúde'),
]

export const INITIAL_SCALE_LEVELS: LevelConfig[] = [
	{
		id: 'grau-baixa',
		name: 'Baixa',
		color: '#2db981',
		min: 0,
		max: 22,
		recommendations: DEFAULT_RECOMMENDATIONS(),
	},
	{
		id: 'grau-moderada',
		name: 'Moderada',
		color: '#f6bd5a',
		min: 23,
		max: 46,
		recommendations: DEFAULT_RECOMMENDATIONS(),
	},
	{
		id: 'grau-alta',
		name: 'Alta',
		color: '#f3596c',
		min: 47,
		max: 60,
		recommendations: DEFAULT_RECOMMENDATIONS(),
	},
]
