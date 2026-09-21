import { useMemo, useState } from 'react'

import { INITIAL_QUESTIONNAIRE } from '../data/mock'
import type {
	AnswerOption,
	QuestionConfig,
	SectionConfig,
} from '../types/questionnaire'
import { reorderById } from '../utils/reorder'

function newOption(): AnswerOption {
	return {
		id: crypto.randomUUID(),
		text: '',
		scorable: true,
		score: null,
	}
}

function newQuestion(): QuestionConfig {
	return {
		id: crypto.randomUUID(),
		statement: '',
		type: 'multipla',
		options: [newOption(), newOption()],
	}
}

function updateQuestion(
	questions: QuestionConfig[],
	id: string,
	fn: (question: QuestionConfig) => QuestionConfig,
): QuestionConfig[] {
	return questions.map((question) => {
		if (question.id === id) return fn(question)
		if (question.subQuestions?.length) {
			return {
				...question,
				subQuestions: updateQuestion(question.subQuestions, id, fn),
			}
		}
		return question
	})
}

function removeQuestionFromList(
	questions: QuestionConfig[],
	id: string,
): QuestionConfig[] {
	return questions
		.filter((question) => question.id !== id)
		.map((question) =>
			question.subQuestions?.length
				? {
						...question,
						subQuestions: removeQuestionFromList(
							question.subQuestions,
							id,
						),
					}
				: question,
		)
}

export function useQuestionnaireConfig() {
	const [sections, setSections] = useState<SectionConfig[]>(
		INITIAL_QUESTIONNAIRE,
	)
	const [activeSectionId, setActiveSectionId] = useState<string>(
		INITIAL_QUESTIONNAIRE[0]?.id ?? '',
	)

	const activeSection = useMemo(
		() =>
			sections.find((section) => section.id === activeSectionId) ??
			sections[0],
		[sections, activeSectionId],
	)

	function mapActiveSection(fn: (section: SectionConfig) => SectionConfig) {
		setSections((current) =>
			current.map((section) =>
				section.id === activeSection?.id ? fn(section) : section,
			),
		)
	}

	function mapQuestions(
		fn: (questions: QuestionConfig[]) => QuestionConfig[],
	) {
		mapActiveSection((section) => ({
			...section,
			questions: fn(section.questions),
		}))
	}

	return {
		sections,
		activeSection,
		activeSectionId: activeSection?.id ?? '',
		selectSection: setActiveSectionId,
		replaceSections(nextSections: SectionConfig[]) {
			setSections(nextSections)
			setActiveSectionId(nextSections[0]?.id ?? '')
		},

		addSection() {
			const section: SectionConfig = {
				id: crypto.randomUUID(),
				name: `Nova seção ${sections.length + 1}`,
				questions: [],
			}
			setSections((current) => [...current, section])
			setActiveSectionId(section.id)
		},
		removeSection(id: string) {
			setSections((current) => {
				const remaining = current.filter((section) => section.id !== id)
				if (id === activeSectionId)
					setActiveSectionId(remaining[0]?.id ?? '')
				return remaining
			})
		},
		renameSection(id: string, name: string) {
			setSections((current) =>
				current.map((section) =>
					section.id === id ? { ...section, name } : section,
				),
			)
		},
		reorderSections(activeId: string, overId: string) {
			setSections((current) => reorderById(current, activeId, overId))
		},

		addQuestion() {
			mapQuestions((questions) => [...questions, newQuestion()])
		},
		addSubQuestion(parentId: string) {
			mapQuestions((questions) =>
				updateQuestion(questions, parentId, (question) => ({
					...question,
					subQuestions: [
						...(question.subQuestions ?? []),
						newQuestion(),
					],
				})),
			)
		},
		removeQuestion(id: string) {
			mapQuestions((questions) => removeQuestionFromList(questions, id))
		},
		updateFields(id: string, patch: Partial<QuestionConfig>) {
			mapQuestions((questions) =>
				updateQuestion(questions, id, (question) => ({
					...question,
					...patch,
				})),
			)
		},
		reorderQuestions(activeId: string, overId: string) {
			mapQuestions((questions) =>
				reorderById(questions, activeId, overId),
			)
		},

		addOption(questionId: string) {
			mapQuestions((questions) =>
				updateQuestion(questions, questionId, (question) => ({
					...question,
					options: [...question.options, newOption()],
				})),
			)
		},
		removeOption(questionId: string, optionId: string) {
			mapQuestions((questions) =>
				updateQuestion(questions, questionId, (question) => ({
					...question,
					options: question.options.filter(
						(option) => option.id !== optionId,
					),
				})),
			)
		},
		updateOption(
			questionId: string,
			optionId: string,
			patch: Partial<AnswerOption>,
		) {
			mapQuestions((questions) =>
				updateQuestion(questions, questionId, (question) => ({
					...question,
					options: question.options.map((option) =>
						option.id === optionId
							? { ...option, ...patch }
							: option,
					),
				})),
			)
		},
		reorderOptions(questionId: string, activeId: string, overId: string) {
			mapQuestions((questions) =>
				updateQuestion(questions, questionId, (question) => ({
					...question,
					options: reorderById(question.options, activeId, overId),
				})),
			)
		},
	}
}

export type QuestionnaireConfig = ReturnType<typeof useQuestionnaireConfig>
