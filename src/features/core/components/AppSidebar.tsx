import { Baby, ClipboardPlus, DoorOpen, PanelLeftClose, Stethoscope, UsersRound } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from '@/features/auth/composables/useSession'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { useSetCurrentHealthUnit } from '@/features/usuarios/composables/useSetCurrentHealthUnit'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA } from '@/features/usuarios/types/usuario'
import { cn } from '@/lib/utils'

type NavItem = {
	label: string
	icon: typeof UsersRound
	to?: string
	match?: (pathname: string) => boolean
	children?: { label: string; to: string }[]
}

const items: NavItem[] = [
	{ label: 'Profissionais', icon: UsersRound, to: '/usuarios' },
	{ label: 'Gestantes', icon: Baby, to: '/', match: (p) => p === '/' || p.startsWith('/gestantes') },
	{
		label: 'Avaliações',
		icon: Stethoscope,
		children: [
			{ label: 'Nova', to: '/formulario' },
			{ label: 'Histórico', to: '/historico' },
		],
	},
	{
		label: 'Instrumentos',
		icon: ClipboardPlus,
		children: [
			{ label: 'Configurar questionário', to: '/configuracao' },
			{ label: 'Configurar escala', to: '/configuracao/escala' },
		],
	},
]

function iniciais(nome: string) {
	const partes = nome.trim().split(/\s+/)
	return `${partes[0]?.[0] ?? ''}${partes.length > 1 ? (partes[partes.length - 1][0] ?? '') : ''}`.toUpperCase()
}

export function AppSidebar() {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { user, logout } = useSession()
	const { data: healthUnits } = useGetHealthUnits()
	const trocarUbs = useSetCurrentHealthUnit()

	const minhasUbs = healthUnits?.items.filter((unit) => user?.healthUnitIds.includes(unit.id)) ?? []
	const categoria = user ? CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[user.role]] : ''

	function sair() {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<aside className="flex h-screen w-[252px] shrink-0 flex-col gap-4 overflow-hidden border-r border-n-40 px-4 pt-4 pb-5">
			<div className="flex h-[74px] shrink-0 items-center justify-between">
				<Logo className="h-9 w-auto" />
				<PanelLeftClose className="size-5 text-n-500" />
			</div>

			<div className="h-px w-full shrink-0 bg-n-40" />

			<nav className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto">
				{items.map((item) => {
					const active = item.match ? item.match(pathname) : item.to === pathname
					return (
						<div key={item.label}>
							{item.to ? (
								<NavLink to={item.to} className={navClass(active)}>
									<item.icon className={cn('size-5', active ? 'text-t-500' : 'text-n-700')} />
									<span
										className={cn('flex-1 text-sm', active ? 'font-semibold text-t-500' : 'text-n-700')}
									>
										{item.label}
									</span>
								</NavLink>
							) : (
								<div className={navClass(false)}>
									<item.icon className="size-5 text-n-700" />
									<span className="flex-1 text-sm text-n-700">{item.label}</span>
								</div>
							)}

							{item.children ? (
								<div className="mt-2 flex gap-2.5 px-2">
									<span className="w-px self-stretch bg-n-40" />
									<div className="flex flex-col justify-center gap-2 py-0.5 text-xs">
										{item.children.map((child) => (
											<NavLink
												key={child.to}
												to={child.to}
												end
												className={({ isActive }) =>
													cn(isActive ? 'font-semibold text-t-500' : 'text-n-600 hover:text-n-800')
												}
											>
												{child.label}
											</NavLink>
										))}
									</div>
								</div>
							) : null}
						</div>
					)
				})}
			</nav>

			<div className="flex shrink-0 flex-col items-center gap-4 pt-2">
				{minhasUbs.length > 0 ? (
					<Select
						value={user?.currentHealthUnitId ?? undefined}
						onValueChange={(next) => trocarUbs.mutate(next)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecione a UBS" />
						</SelectTrigger>
						<SelectContent>
							{minhasUbs.map((unit) => (
								<SelectItem key={unit.id} value={unit.id}>
									{unit.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : null}

				<div className="flex w-full items-center justify-between">
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-t-500 text-base font-semibold text-n-0">
							{user ? iniciais(user.name) : '--'}
						</span>
						<div className="min-w-0 leading-none">
							<p className="truncate text-sm font-semibold text-n-700">{user?.name ?? ''}</p>
							<p className="mt-1.5 truncate text-xs text-n-500">{categoria}</p>
						</div>
					</div>
					<button type="button" aria-label="Sair" onClick={sair} className="shrink-0">
						<DoorOpen className="size-5 text-n-500" />
					</button>
				</div>
			</div>
		</aside>
	)
}

function navClass(active: boolean) {
	return cn(
		'flex items-center gap-2 rounded-lg px-4 py-3',
		active && 'border border-(--color-t-300) bg-t-100',
	)
}
