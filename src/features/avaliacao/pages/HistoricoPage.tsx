import { Page } from "@/components/Layout/Page";
import { DataTable } from "@/components/ui/data-table";
import { useAssessments } from "@/features/avaliacao/composables/useAssessments";
import { columns } from "../constants/tabelaHistoricoAvaliacoes";

export function HistoricoPage() {
	const { data: assessments, isLoading } = useAssessments();

	return (
		<Page
			title="Avaliações"
			description="Verifique o histórico de avaliações aplicadas."
		>
			<DataTable
				columns={columns}
				data={assessments?.items}
				isLoading={isLoading}
				emptyStateTitle="Nenhuma aplicação registrada."
				emptyStateDescription="As aplicações da escala aparecerão aqui."
			/>
		</Page>
	);
}
