import type { Classificacao } from "@/features/avaliacao/constants";
import { cn } from "@/lib/utils";
import { ScoreMeter } from "./ScoreMeter";

interface ResultadoAvaliacaoProps {
	nomeGestante: string;
	pontuacao: number;
	classificacao: Classificacao;
	className?: string;
}

export function ResultadoAvaliacao({
	nomeGestante,
	pontuacao,
	classificacao,
	className,
}: ResultadoAvaliacaoProps) {
	//! A cor da classificação tem que vir do back de acordo com as configurações da escala
	// const cor = CLASSIFICACAO_COR_TEXTO[classificacao];

	return (
		<div className={cn("flex w-full flex-col items-center gap-10", className)}>
			<div className="flex flex-col items-center gap-3">
				<div
					className={cn(
						"flex size-47.75 shrink-0 items-center justify-center rounded-full border-4",
					)}
				>
					<div className="flex flex-col items-center gap-1 px-2 text-center">
						<span className={cn("text-5xl font-bold")}>{pontuacao}</span>
						<span className="max-w-37.75 text-caption font-semibold text-n-500">
							Pontuação na escala de vulnerabilidade
						</span>
					</div>
				</div>

				<p className="max-w-133.5 text-center text-sm text-n-900">
					Com base nas respostas do formulário, a gestante{" "}
					<span className="font-semibold">{nomeGestante}</span> foi
					categorizada como vulnerabilidade{" "}
					<span className={cn("font-semibold")}>{classificacao}</span>.
				</p>

				<ScoreMeter pontuacao={pontuacao} classificacao={classificacao} />
			</div>
		</div>
	);
}
