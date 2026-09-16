import { format, isValid, parseISO } from 'date-fns'

export function calcularIdade(dataNascimentoIso: string): number {
	const nascimento = parseISO(dataNascimentoIso.slice(0, 10))
	const hoje = new Date()

	let idade = hoje.getFullYear() - nascimento.getFullYear()
	const aindaNaoFezAniversario =
		hoje.getMonth() < nascimento.getMonth() ||
		(hoje.getMonth() === nascimento.getMonth() &&
			hoje.getDate() < nascimento.getDate())

	if (aindaNaoFezAniversario) idade -= 1

	return idade
}

/** Datas civis, como nascimento, mantêm o dia informado pela API, sem conversão de fuso. */
export function formatarDataBr(dataIso: string | null | undefined): string {
	const data = parseISO(dataIso?.slice(0, 10) ?? '')
	return isValid(data) ? format(data, 'dd/MM/yyyy') : '—'
}

/** Instantes usam o fuso local do navegador; datas sem horário não ganham uma hora fictícia. */
export function formatarDataHoraBr(
	valor: string | Date | null | undefined,
): string {
	if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
		return formatarDataBr(valor)
	}
	const data = valor instanceof Date ? valor : parseISO(valor ?? '')
	return isValid(data) ? format(data, "dd/MM/yyyy 'às' HH:mm") : '—'
}
