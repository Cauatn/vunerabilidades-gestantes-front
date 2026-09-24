import { Badge } from '@/components/ui/badge'
import type { AssessmentAnswer } from '../types/assessment'

export interface AvaliacaoRespostasAgrupadasProps {
	groupedAnswers: Record<
		string,
		{ answers: AssessmentAnswer[]; totalScore: number }
	>
}

export function AvaliacaoRespostasAgrupadas({
	groupedAnswers,
}: AvaliacaoRespostasAgrupadasProps) {
	return (
		<div className="flex flex-col gap-6 text-sm text-n-700">
			{Object.entries(groupedAnswers).map(([section, data], index) => {
				return (
					<div key={section} className="flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-t-400 text-lg">
								{index + 1}. {section}
							</h3>
							<Badge variant="blue">
								{data.totalScore} pts.
							</Badge>
						</div>
						<ul className="space-y-2">
							{data.answers.map((answer, index) => (
								<li key={answer.id}>
									<div className="flex gap-2 items-center">
										<p className="text-md font-semibold">
											{index + 1}. {answer.questionStatement}
										</p>
										<Badge variant="neutral">
											{answer.score} pts.
										</Badge>
									</div>
									<p className="text-n-500">
										R: {answer.optionLabel}
									</p>
								</li>
							))}
						</ul>
					</div>
				)
			})}
		</div>
	)
}
