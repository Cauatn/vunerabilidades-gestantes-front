import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
	assessmentFilterParams,
	activeFilterCount,
} from '../src/features/shared/types/listFilters.ts'

process.env.TZ = 'America/Bahia'

test('período abrange o primeiro e o último dia no fuso local', () => {
	const params = assessmentFilterParams({
		from: '2026-09-01',
		to: '2026-09-18',
		patientId: 'patient',
	})
	assert.equal(params.appliedFrom, '2026-09-01T03:00:00.000Z')
	assert.equal(params.appliedTo, '2026-09-19T02:59:59.999Z')
	assert.equal(params.patientId, 'patient')
})

test('permite período com apenas um limite e limpar todos os filtros', () => {
	assert.equal(
		assessmentFilterParams({ from: '2026-09-01' }).appliedTo,
		undefined,
	)
	assert.equal(
		assessmentFilterParams({ to: '2026-09-01' }).appliedFrom,
		undefined,
	)
	assert.ok(
		Object.values(assessmentFilterParams({})).every(
			(value) => value === undefined,
		),
	)
	assert.equal(
		activeFilterCount({
			healthUnitId: '',
			from: '2026-09-01',
			to: '2026-09-18',
			patientId: 'patient',
		}),
		2,
	)
	assert.equal(activeFilterCount({}), 0)
})
