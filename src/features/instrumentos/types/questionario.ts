export type TipoPergunta =
	| 'categorica_ordinal'
	| 'categorica_nominal'
	| 'dicotomica'
	| 'dicotomica_complementar'
	| 'multipla'
	| 'numerica'

export interface OpcaoResposta {
	id: string
	texto: string
	pontuavel: boolean
	pontuacao: number | null
}

export interface PerguntaConfig {
	id: string
	codigo: string
	enunciado: string
	tipo: TipoPergunta
	opcoes: OpcaoResposta[]
	/** perguntas exibidas quando a resposta principal é "Sim" */
	subPerguntas?: PerguntaConfig[]
}

export interface SecaoConfig {
	id: string
	nome: string
	perguntas: PerguntaConfig[]
}
