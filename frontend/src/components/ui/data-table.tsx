import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[] | undefined
	isLoading?: boolean
	emptyStateTitle?: string
	emptyStateDescription?: string
	onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	emptyStateTitle = 'Nenhum registro encontrado.',
	emptyStateDescription = 'Assim que houver dados, eles aparecerão aqui.',
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	if (!data || isLoading) {
		return <DataTableSkeleton columns={columns} />
	}

	if (!table.getRowModel().rows?.length) {
		return (
			<div className="rounded-xl border border-n-30 bg-n-0 p-10 text-center">
				<p className="text-base font-medium text-n-700">{emptyStateTitle}</p>
				<p className="mt-1 text-sm text-n-500">{emptyStateDescription}</p>
			</div>
		)
	}

	return (
		<div className="w-full min-w-0 overflow-x-auto rounded-lg border border-n-30">
			<Table className="min-w-max">
				<TableHeader className="bg-n-20">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="hover:bg-transparent">
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className={
										header.id === 'actions'
											? 'whitespace-nowrap px-4 py-3 font-semibold text-n-700'
											: 'px-4 py-3 font-semibold text-n-700'
									}
								>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							className={onRowClick ? 'cursor-pointer hover:bg-n-20' : 'hover:bg-n-20'}
							onClick={onRowClick ? () => onRowClick(row.original) : undefined}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cell.column.id === 'actions' ? 'whitespace-nowrap px-2 py-3 text-right' : 'px-4 py-3'}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

function DataTableSkeleton<TData, TValue>({ columns }: Pick<DataTableProps<TData, TValue>, 'columns'>) {
	const table = useReactTable({ data: [], columns, getCoreRowModel: getCoreRowModel() })

	return (
		<div className="w-full min-w-0 overflow-x-auto rounded-lg border border-n-30">
			<Table className="min-w-max">
				<TableHeader className="bg-n-20">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="hover:bg-transparent">
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id} className="px-4 py-3 font-semibold text-n-400">
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{Array.from({ length: 5 }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{columns.map((_, colIndex) => (
								<TableCell
									key={colIndex}
									className={colIndex === columns.length - 1 ? 'w-px whitespace-nowrap px-2 py-3' : 'px-4 py-3'}
								>
									<Skeleton className={colIndex === columns.length - 1 ? 'h-4 w-20' : 'h-4 w-full'} />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
