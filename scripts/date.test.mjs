import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calcularIdade, formatarDataBr, formatarDataHoraBr } from '../src/features/core/utils/date.ts'

process.env.TZ = 'America/Bahia'

test('nascimento mantém o dia mesmo quando a API envia meia-noite UTC', () => {
	assert.equal(formatarDataBr('2001-04-01'), '01/04/2001')
	assert.equal(formatarDataBr('2001-04-01T00:00:00.000Z'), '01/04/2001')
	assert.equal(formatarDataBr('2024-02-29'), '29/02/2024')
})

test('avaliações usam o horário local, inclusive ao mudar de dia', () => {
	assert.equal(formatarDataHoraBr('2026-09-11T02:05:59.000Z'), '10/09/2026 às 23:05')
	assert.equal(formatarDataHoraBr(new Date('2026-09-11T03:00:00Z')), '11/09/2026 às 00:00')
	assert.equal(formatarDataHoraBr('2026-09-11T00:05:00-03:00'), '11/09/2026 às 00:05')
	assert.equal(formatarDataHoraBr('2026-09-11'), '11/09/2026')
})

test('datas ausentes ou inválidas não expõem ISO quebrado nem lançam erro', () => {
	for (const value of [null, undefined, '', 'invalid', '2026-02-30']) {
		assert.equal(formatarDataBr(value), '—')
		assert.equal(formatarDataHoraBr(value), '—')
	}
	assert.equal(formatarDataHoraBr(new Date(NaN)), '—')
})

test('idade não antecipa o aniversário por interpretar nascimento em UTC', () => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	const birthYear = tomorrow.getFullYear() - 20
	const birthday = `${birthYear}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
	assert.equal(calcularIdade(birthday), 19)
	assert.equal(calcularIdade(`${birthday}T00:00:00.000Z`), 19)
})
