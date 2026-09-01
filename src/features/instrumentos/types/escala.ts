export interface RecomendacaoConfig {
	id: string
	texto: string
}

export interface GrauConfig {
	id: string
	nome: string
	/** cor em hex, escolhida na paleta do color picker */
	cor: string
	min: number
	max: number
	recomendacoes: RecomendacaoConfig[]
}

export interface LimitesEscala {
	min: number
	max: number
}

export interface ValidacaoEscala {
	gerais: string[]
	porGrau: Record<string, string>
}
