import { Badge } from "@/components/ui/badge";
import { formatarDataBr } from "@/features/core/utils/date";
import type { ColumnDef } from "@tanstack/react-table";
import AcoesTabelaAvaliacoes from "../components/AcoesTabelaAvaliacoes";
import type { Assessment, QuestionnaireSnapshot } from "../types/assessment";

export const columns: ColumnDef<Assessment>[] = [
	{
		accessorKey: "id",
		header: "Identificador",
		cell: ({ getValue }) => `#${getValue()}`,
	},
	{
		accessorKey: "appliedAt",
		header: "Data da aplicação",
		cell: ({ getValue }) => formatarDataBr(getValue() as string),
	},
	{
		accessorKey: "snapshot",
		header: "Versão do questionário",
		cell: ({ getValue }) => {
			const { questionnaireVersionId } = getValue() as QuestionnaireSnapshot;
			return <Badge variant="neutral">{questionnaireVersionId}</Badge>;
		},
	},
	//TODO: colocar dados do aplicador quando o back retornar
	{
		accessorKey: "appliedByUserId",
		header: "Dados do aplicador",
	},
	//TODO: colocar dados da UBS quando o back retornar
	{
		accessorKey: "healthUnitId",
		header: "UBS de aplicação",
	},
	//TODO: colocar dados da gestante quando o back retornar
	{
		accessorKey: "patientId",
		header: "Gestante",
		cell: ({ getValue }) => (
			<span className="font-medium text-n-700">{getValue() as string}</span>
		),
	},
	//TODO: a cor tem que vir da configuração da escala, não da pra hardcodar no front
	{
		accessorKey: "result.vulnerabilityLevel",
		header: "Vulnerabilidade",
		cell: ({ getValue }) => {
			const vulnerabilityLevel = getValue() as string;
			return <Badge variant="neutral">{vulnerabilityLevel}</Badge>;
		},
	},
	//TODO: a cor tem que vir da configuração da escala, não da pra hardcodar no front
	{
		accessorKey: "result.totalScore",
		header: "Score",
		cell: ({ getValue }) => {
			const totalScore = getValue() as number;
			return <Badge variant="neutral">{totalScore}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return <AcoesTabelaAvaliacoes id={row.original.id} />;
		},
	},
];
