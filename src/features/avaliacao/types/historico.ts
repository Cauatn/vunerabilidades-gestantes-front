import type { Classificacao } from '@/features/avaliacao/constants'

export interface ResumoAplicacao {
	dataAplicacao: string
	ubs: string
	aplicador: string
	categoriaProfissional: string
	crmCoren: string
	email: string
}

export interface DadosGestante {
	nome: string
	dataNascimento: string
	idade: number
	cpf: string
	cns: string
}

export interface RespostaPergunta {
	id: string
	pergunta: string
	resposta: string
}

export interface CategoriaRespostas {
	id: string
	titulo: string
	respostas: RespostaPergunta[]
}

export interface RecomendacaoGestante {
	id: string
	titulo: string
	observacoes: string
}

export interface AvaliacaoDetalhe {
	id: string
	resumo: ResumoAplicacao
	gestante: DadosGestante
	pontuacao: number
	classificacao: Classificacao
	categorias: CategoriaRespostas[]
	recomendacoesGestante: RecomendacaoGestante[]
}
