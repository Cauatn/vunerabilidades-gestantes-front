import { ChevronDown, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PregnantIcon } from '@/features/avaliacao/components/icons'

interface AvaliacaoExportarMenuProps {
	avaliacaoId: string
}

export function AvaliacaoExportarMenu({ avaliacaoId }: AvaliacaoExportarMenuProps) {
	const navigate = useNavigate()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button">
					Imprimir
					<ChevronDown className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onSelect={() => navigate(`/historico/${avaliacaoId}/imprimir/visao-gestante`)}>
					<PregnantIcon className="h-3.5 w-2.5" />
					Visão da gestante
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => navigate(`/historico/${avaliacaoId}/imprimir/visao-geral`)}>
					<Stethoscope className="size-3.5" />
					Visão geral
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
