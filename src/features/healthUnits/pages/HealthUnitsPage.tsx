import { useState } from 'react';

import { Page } from '@/components/Layout/Page';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/features/core/constants/pagination';
import { Modal } from '@/features/core/components/Modal';
import { HealthUnitSheet } from '@/features/healthUnits/components/HealthUnitSheet';
import { createHealthUnitsColumns } from '@/features/healthUnits/components/healthUnitsDataTable/columns';
import { useActivateHealthUnit } from '@/features/healthUnits/composables/useActivateHealthUnit';
import { useCreateHealthUnit } from '@/features/healthUnits/composables/useCreateHealthUnit';
import { useDeactivateHealthUnit } from '@/features/healthUnits/composables/useDeactivateHealthUnit';
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits';
import { useUpdateHealthUnit } from '@/features/healthUnits/composables/useUpdateHealthUnit';
import type { CreateHealthUnitPayload, HealthUnit } from '@/features/healthUnits/types/healthUnit';
import { toast } from 'sonner';

export function HealthUnitsPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useGetHealthUnits();

	const [searchTerm, setSearchTerm] = useState(busca);
	const [editingUnit, setEditingUnit] = useState<HealthUnit | undefined>(undefined);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [statusChangeTarget, setStatusChangeTarget] = useState<
		{ data: HealthUnit; action: 'Ativar' | 'Desativar'; } | undefined
	>(undefined);

	const create = useCreateHealthUnit({ onSuccess: onMutateSuccess, onError: onMutateError });
	const update = useUpdateHealthUnit({ onSuccess: onMutateSuccess, onError: onMutateError });
	const deactivate = useDeactivateHealthUnit({
		onSuccess: () => toast.success('A UBS foi desativada com sucesso.'),
		onError: () =>
			toast.error('Houve um erro ao desativar a UBS', {
				description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.',
			}),
	});
	const activate = useActivateHealthUnit({
		onSuccess: () => toast.success('A UBS foi ativada com sucesso.'),
		onError: () =>
			toast.error('Houve um erro ao ativar a UBS', {
				description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.',
			}),
	});

	function search() {
		void setBusca(searchTerm.trim());
		void setPage(1);
	}

	function handleSubmit(payload: CreateHealthUnitPayload) {
		if (editingUnit) {
			update.mutate({
				id: editingUnit.id,
				payload: {
					name: payload.name,
					city: payload.city,
					state: payload.state,
					address: payload.address ?? null,
				},
			});
		} else {
			create.mutate(payload);
		}
	}

	function onMutateSuccess() {
		const action = editingUnit ? 'editada' : 'cadastrada';

		setSheetOpen(false);
		toast.success(`UBS ${action} com sucesso.`);
	}

	function onMutateError() {
		const action = editingUnit ? 'editar' : 'cadastrar';

		toast.error(`Houve um erro ao ${action} a UBS`, {
			description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.',
		});
	}

	function handleToggleStatus(healthUnit: HealthUnit) {
		setStatusChangeTarget({
			data: healthUnit,
			action: healthUnit.active ? 'Desativar' : 'Ativar',
		});
	}

	function buildStatusChangeModalDescription() {
		if (statusChangeTarget?.action === 'Ativar') {
			return 'Ao ativar, esta UBS volta a ser oferecida em novos atendimentos.';
		}
		return 'Ao desativar, esta UBS deixa de ser oferecida em novos atendimentos. Atendimentos já registrados continuam apontando para ela normalmente.';
	}

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
	const columns = createHealthUnitsColumns({
		onEdit: (row) => {
			setEditingUnit(row);
			setSheetOpen(true);
		},
		onToggleStatus: handleToggleStatus,
	});

	return (
		<>
			<Page
				title="Unidades de saúde"
				description="Gerencie as UBS disponíveis para os atendimentos."
				withButton
				buttonText="Cadastrar UBS"
				buttonProps={{
					onClick: () => {
						setEditingUnit(undefined);
						setSheetOpen(true);
					},
				}}
			>
				<div className="flex flex-col gap-8">
					<div className="flex items-center gap-3">
						<Input
							placeholder="Buscar por nome..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') search();
							}}
							className="flex-1"
						/>
						<Button type="button" onClick={search}>
							Buscar
						</Button>
					</div>

					<DataTable
						columns={columns}
						data={data?.items}
						isLoading={isLoading}
						emptyStateTitle="Nenhuma UBS encontrada."
						emptyStateDescription="Cadastre uma UBS para disponibilizá-la nos atendimentos."
					/>

					{data ? (
						<div className="flex justify-center pt-4">
							<Pagination page={page} totalPages={totalPages} onPageChange={(next) => void setPage(next)} />
						</div>
					) : null}
				</div>
			</Page>

			<HealthUnitSheet
				healthUnit={editingUnit}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={create.isPending || update.isPending}
			/>

			<Modal
				open={!!statusChangeTarget}
				onOpenChange={(open) => !open && setStatusChangeTarget(undefined)}
				variant="warning"
				title={`${statusChangeTarget?.action} UBS`}
				description={buildStatusChangeModalDescription()}
				confirmLabel={statusChangeTarget?.action as string}
				onConfirm={() => {
					const data = statusChangeTarget?.data;
					if (!statusChangeTarget || !data) return;

					if (data.active) {
						deactivate.mutate(data.id);
					} else {
						activate.mutate(data.id);
					}
					setStatusChangeTarget(undefined);
				}}
			/>
		</>
	);
}
