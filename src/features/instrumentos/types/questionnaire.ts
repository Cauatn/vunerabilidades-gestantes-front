export type QuestionType = 'dicotomica' | 'dicotomica_complementar' | 'multipla'

export interface AnswerOption {
	id: string
	text: string
	scorable: boolean
	score: number | null
}

export interface QuestionConfig {
	id: string
	statement: string
	type: QuestionType
	options: AnswerOption[]
	/** perguntas exibidas quando a resposta principal é "Sim" */
	subQuestions?: QuestionConfig[]
}

export interface SectionConfig {
	id: string
	name: string
	questions: QuestionConfig[]
}
