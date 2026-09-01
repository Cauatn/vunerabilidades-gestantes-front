import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
	className?: string
}

function getPaginaVisiveis(page: number, totalPages: number, janela = 5): number[] {
	const inicio = Math.max(1, Math.min(page - Math.floor(janela / 2), totalPages - janela + 1))
	const fim = Math.min(totalPages, inicio + janela - 1)
	return Array.from({ length: fim - Math.max(1, inicio) + 1 }, (_, i) => Math.max(1, inicio) + i)
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
	if (totalPages <= 1) return null

	const paginas = getPaginaVisiveis(page, totalPages)

	return (
		<nav className={cn('flex items-center justify-center gap-2', className)} aria-label="Paginação">
			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={page === 1}
				onClick={() => onPageChange(1)}
				aria-label="Primeira página"
			>
				<ChevronsLeft className="size-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={page === 1}
				onClick={() => onPageChange(page - 1)}
				aria-label="Página anterior"
			>
				<ChevronLeft className="size-4" />
			</Button>

			{paginas.map((numero) => (
				<Button
					key={numero}
					type="button"
					variant={numero === page ? 'default' : 'outline'}
					size="icon"
					onClick={() => onPageChange(numero)}
					aria-current={numero === page ? 'page' : undefined}
				>
					{numero}
				</Button>
			))}

			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={page === totalPages}
				onClick={() => onPageChange(page + 1)}
				aria-label="Próxima página"
			>
				<ChevronRight className="size-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={page === totalPages}
				onClick={() => onPageChange(totalPages)}
				aria-label="Última página"
			>
				<ChevronsRight className="size-4" />
			</Button>
		</nav>
	)
}
