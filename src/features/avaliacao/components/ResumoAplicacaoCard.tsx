import { SquareTextIcon } from "@/features/avaliacao/components/icons";
import { formatarDataBr } from "@/features/core/utils/date";
import { CATEGORIA_PROFISSIONAL_LABEL } from "@/features/usuarios/constants/categoriaProfissional";
import {
	ROLE_TO_CATEGORIA,
	type Usuario,
} from "@/features/usuarios/types/usuario";

interface ResumoAplicacaoCardProps {
	applier: Usuario;
	appliedAt: string;
	ubs: string;
}

export function ResumoAplicacaoCard({
	applier,
	appliedAt,
	ubs,
}: ResumoAplicacaoCardProps) {
	return (
		<div className="flex w-full items-center gap-5 rounded-xl border border-(--b-200) bg-b-50 p-4">
			<div className="flex shrink-0 items-center justify-center rounded-full bg-b-100 p-3">
				<SquareTextIcon className="size-7 text-b-400" />
			</div>

			<div className="grid flex-1 grid-cols-3 gap-x-3 gap-y-3 text-sm text-n-800">
				<p>
					<span className="font-semibold">Data de aplicação:</span>{" "}
					{formatarDataBr(appliedAt)}
				</p>
				<p className="col-span-2">
					<span className="font-semibold">UBS de aplicação:</span> {ubs}
				</p>
				<p>
					<span className="font-semibold">Aplicador:</span> {applier.name}
				</p>
				<p>
					<span className="font-semibold">Categoria profissional:</span>{" "}
					{CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[applier.role]]}
				</p>
				<p>
					<span className="font-semibold">CRM/COREN:</span>{" "}
					{applier.professionalRegistration}
				</p>
				<p>
					<span className="font-semibold">Email:</span> {applier.email}
				</p>
			</div>
		</div>
	);
}
