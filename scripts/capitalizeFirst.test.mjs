import assert from 'node:assert/strict'
import { test } from 'node:test'
import { capitalizeFirst } from '../src/features/shared/utils/capitalizeFirst.ts'

test('cadastros sem cidade não causam erro de renderização', () => {
	for (const city of [undefined, null, '', '   ']) {
		assert.equal(capitalizeFirst(city) || '—', '—')
	}
})

test('formata cidades preenchidas', () => {
	assert.equal(capitalizeFirst('SALVADOR'), 'Salvador')
	assert.equal(capitalizeFirst('  SÃO PAULO  '), 'São paulo')
})
