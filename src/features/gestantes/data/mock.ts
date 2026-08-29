export type Vulnerabilidade = 'baixa' | 'moderada' | 'alta' | 'media'

export type AvaliacaoTimelineItem = {
	id: string
	data: string
	titulo: string
	vulnerabilidade: Vulnerabilidade
	descricao: string
}

export const avaliacoesMock: AvaliacaoTimelineItem[] = [
	{
		id: '202608201223510300',
		data: '27/12/2026',
		titulo: 'Avaliação #202608201223510300',
		vulnerabilidade: 'media',
		descricao:
			'Avaliação realizada por José Victor Cruz Rebouças, Médico, CRM/BA 123456 na UBS Country Club.',
	},
	{
		id: '202608201223510302',
		data: '27/12/2025',
		titulo: 'Avaliação #202608201223510302',
		vulnerabilidade: 'baixa',
		descricao:
			'Avaliação realizada por José Victor Cruz Rebouças, Médico, CRM/BA 123456 na UBS Country Club.',
	},
	{
		id: '202608201223510355',
		data: '27/12/2024',
		titulo: 'Avaliação #202608201223510355',
		vulnerabilidade: 'alta',
		descricao:
			'Avaliação realizada por José Victor Cruz Rebouças, Médico, CRM/BA 123456 na UBS Country Club.',
	},
]
