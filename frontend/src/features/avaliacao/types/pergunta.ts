export interface Opcao {
	id: string
	texto: string
	pontuacao: number
}

export interface Pergunta {
	id: string
	categoria: string
	texto: string
	opcoes: Opcao[]
}
