import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toSections, toReplaceQuestionsPayload } from '../src/features/instrumentos/utils/questionarioMapper.ts'

test('publicação usa IDs antigos apenas como referências do lote, incluindo condicionais', () => {
	const source = { id: 'published', questions: [
		{ id: '665f1a2b3c4d5e6f70819501', section: 'Seção', statement: 'Pergunta principal', type: 'YES_NO', order: 0, required: true,
			options: [{ id: '665f1a2b3c4d5e6f70819502', label: 'Sim', score: 2, order: 0 }, { id: '665f1a2b3c4d5e6f70819503', label: 'Não', score: 0, order: 1 }] },
		{ id: '665f1a2b3c4d5e6f70819504', section: 'Seção', statement: 'Complemento', type: 'MULTIPLE_CHOICE', order: 1, required: true,
			visibleWhenQuestionId: '665f1a2b3c4d5e6f70819501', visibleWhenOptionId: '665f1a2b3c4d5e6f70819502',
			options: [{ id: '665f1a2b3c4d5e6f70819505', label: 'Opção', score: 0, order: 0 }] },
	] }
	const sections = toSections(source)
	sections[0].perguntas[0].enunciado = 'Pergunta editada'
	const payload = toReplaceQuestionsPayload(sections)
	assert.equal(payload.questions[0].statement, 'Pergunta editada')
	assert.equal(payload.questions[1].visibleWhenClientId, payload.questions[0].clientId)
	assert.equal(payload.questions[1].visibleWhenOptionClientId, payload.questions[0].options[0].clientId)
	for (const question of payload.questions) {
		assert.equal(Object.hasOwn(question, 'questionId'), false)
		for (const option of question.options) assert.equal(Object.hasOwn(option, 'optionId'), false)
	}
	assert.deepEqual(toReplaceQuestionsPayload(sections), payload)
})
