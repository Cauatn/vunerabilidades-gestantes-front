import type { Assessment } from '../types/assessment'

export function groupAnswersBySection(assessment: Assessment | undefined) {
	if (!assessment) return {}

	return assessment.answers.reduce(
		(acc, answer) => {
			const question = assessment.snapshot.props.questions.find(
				(q) => q.id === answer.questionId,
			)
			const section = question?.section || 'Outros'

			if (!acc[section]) {
				acc[section] = { answers: [], totalScore: 0 }
			}
			acc[section].answers.push(answer)
			acc[section].totalScore += answer.score || 0

			return acc
		},
		{} as Record<
			string,
			{ answers: typeof assessment.answers; totalScore: number }
		>,
	)
}
