import {
	Baby,
	Building2,
	ChevronRight,
	ClipboardPlus,
	DoorOpen,
	Loader2,
	PanelLeftClose,
	PanelLeftOpen,
	Stethoscope,
	UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSession } from '@/features/auth/composables/useSession'
import { Restricted } from '@/features/core/components/Restricted'
import { useHasCapability } from '@/features/core/composables/useHasCapability'
import { useGetMyUbs } from '@/features/usuarios/composables/useGetMyUbs'
import type { Capability } from '@/features/roles/types/roles'
import { useSetCurrentHealthUnit } from '@/features/usuarios/composables/useSetCurrentHealthUnit'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA } from '@/features/usuarios/types/usuario'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type NavChild = { label: string; to: string; capability?: Capability }

type NavItem = {
	label: string
	icon: typeof UsersRound
	to?: string
	match?: (pathname: string) => boolean
	children?: NavChild[]
	capability?: Capability
}

const items: NavItem[] = [
	{
		label: 'Profissionais',
		icon: UsersRound,
		to: '/usuarios',
		capability: 'users.manage',
	},
	{
		label: 'Unidades de saúde',
		icon: Building2,
		to: '/unidades',
		capability: 'health-units.manage',
	},
	{
		label: 'Gestantes',
		icon: Baby,
		to: '/',
		match: (p) => p === '/' || p.startsWith('/gestantes'),
	},
	{
		label: 'Avaliações',
		icon: Stethoscope,
		children: [
			{
				label: 'Nova',
				to: '/formulario',
				capability: 'assessments.apply',
			},
			{ label: 'Histórico', to: '/historico' },
		],
	},
	{
		label: 'Instrumentos',
		icon: ClipboardPlus,
		capability: 'questionnaire.configure',
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

function pathMatches(url: string, pathname: string) {
	return pathname === url || pathname.startsWith(`${url}/`)
}

/** subitem com URL mais específica que casa com a rota atual */
function activeChildUrl(children: NavChild[], pathname: string) {
	let best: string | null = null
	for (const child of children) {
		if (
			pathMatches(child.to, pathname) &&
			child.to.length > (best?.length ?? -1)
		) {
			best = child.to
		}
	}
	return best
}

export function AppSidebar() {
	const can = useHasCapability()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { user, logout } = useSession()
	const { data: minhasUbs = [] } = useGetMyUbs()
	const trocarUbs = useSetCurrentHealthUnit({
		onSuccess: () => toast.success('Troca de UBS realizada com sucesso.'),
		onError: () =>
			toast.error(
				'Houve um error ao realizar a troca de UBS. Tente novamente e, se o erro persistir, contate o suporte.',
			),
	})
	const [open, setOpen] = useState(true)


	const categoria = user
		? CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[user.role]]
		: ''

	const targetUbsName = trocarUbs.isPending
		? minhasUbs.find((u) => u.id === trocarUbs.variables)?.name
		: null

	function sair() {
		logout()
		toast.success(
			'Você foi deslogado da plataforma com sucesso. Até a próxima!',
		)
		navigate('/login', { replace: true })
	}

	const overlay = trocarUbs.isPending ? (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
			<Loader2 className="mb-4 size-10 animate-spin text-primary" />
			<p className="animate-pulse text-lg font-semibold text-n-700">
				Indo para a {targetUbsName}...
			</p>
		</div>
	) : null

	if (!open) {
		return (
			<>
				{overlay}
				<aside className="flex h-screen w-14 shrink-0 flex-col items-center border-r border-n-40 pt-4 pb-5">
					<div className="flex h-18.5 shrink-0 items-center justify-center">
						<button
							type="button"
							aria-label="Exibir menu"
							onClick={() => setOpen(true)}
							className="rounded-md p-1.5 text-n-500 hover:bg-n-20 hover:text-n-700"
						>
							<PanelLeftOpen className="size-5" />
						</button>
					</div>
				</aside>
			</>
		)
	}

	return (
		<>
			{overlay}
			<aside className="flex h-screen w-63 shrink-0 flex-col gap-4 overflow-hidden border-r border-n-40 px-4 pt-4 pb-5">
				<div className="flex h-18.5 shrink-0 items-center justify-between">
					<Logo className="h-9 w-auto" />
					<button
						type="button"
						aria-label="Ocultar menu"
						onClick={() => setOpen(false)}
						className="rounded-md p-1.5 text-n-500 hover:bg-n-20 hover:text-n-700"
					>
						<PanelLeftClose className="size-5" />
					</button>
				</div>

				<div className="h-px w-full shrink-0 bg-n-40" />

				<nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
					{items.map((item) => {
						const row = item.children ? (
							<NavGroup
								key={item.label}
								item={{
									...item,
									children: item.children.filter(
										(child) =>
											!child.capability ||
											can(child.capability),
									),
								}}
								pathname={pathname}
							/>
						) : (
							<NavRow
								key={item.label}
								item={item}
								pathname={pathname}
							/>
						)

						if (!item.capability) return row

						return (
							<Restricted
								key={item.label}
								capability={item.capability}
							>
								{row}
							</Restricted>
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
							<span className="sidebar-footer-avatar">
								{user ? iniciais(user.name) : '--'}
							</span>
							<div className="min-w-0 leading-none">
								<p className="truncate text-sm font-semibold text-n-700">
									{user?.name ?? ''}
								</p>
								<p className="mt-1.5 truncate text-xs text-n-500">
									{categoria}
								</p>
							</div>
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									aria-label="Sair"
									onClick={sair}
									className="shrink-0 cursor-pointer"
								>
									<DoorOpen className="size-5 text-n-500 hover:text-n-700 transition-colors duration-200" />
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Sair</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</aside>
		</>
	)
}

/** Item simples (rota única), mesmos tamanhos/espaçamentos do vinea. */
function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
	const active = item.match
		? item.match(pathname)
		: pathMatches(item.to!, pathname)

	return (
		<NavLink to={item.to!} className={navBtnClass(active)}>
			<span className="flex size-5 shrink-0 items-center justify-center">
				<item.icon className="size-5" />
			</span>
			<span className="min-w-0 flex-1 truncate text-sm">
				{item.label}
			</span>
		</NavLink>
	)
}

/** Item com subitens: abre/fecha no clique; autoabre quando a rota casa com um filho. */
function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
	const children = item.children!
	const activeUrl = activeChildUrl(children, pathname)
	const groupActive = activeUrl != null
	const [open, setOpen] = useState(groupActive)

	useEffect(() => {
		if (groupActive) setOpen(true)
	}, [groupActive])

	return (
		<div>
			<button
				type="button"
				aria-expanded={open}
				className={navBtnClass(groupActive)}
				onClick={() => setOpen((prev) => !prev)}
			>
				<span className="flex size-5 shrink-0 items-center justify-center">
					<item.icon className="size-5" />
				</span>
				<span className="min-w-0 flex-1 truncate text-left text-sm">
					{item.label}
				</span>
				<ChevronRight
					className={cn(
						'size-4 shrink-0 text-n-500 transition-transform duration-200',
						open && 'rotate-90',
					)}
				/>
			</button>

			<div
				className={cn(
					'grid transition-[grid-template-rows] duration-200 ease-out',
					open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
				)}
			>
				<div className="overflow-hidden">
					<div className="mx-3.5 mt-1 flex flex-col gap-1 border-l border-n-40 px-2.5 py-0.5">
						{children.map((child) => (
							<NavLink
								key={child.to}
								to={child.to}
								className={cn(
									'flex h-7 items-center gap-2 rounded-lg px-2 text-sm',
									child.to === activeUrl
										? 'sidebar-nav-sub-btn-active'
										: 'sidebar-nav-sub-btn-idle',
								)}
							>
								<span className="min-w-0 flex-1 truncate">
									{child.label}
								</span>
							</NavLink>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

function navBtnClass(active: boolean) {
	return cn(
		'sidebar-nav-item-icon flex h-12 w-full items-center gap-2 rounded-lg border px-3',
		active ? 'sidebar-nav-btn-active' : 'sidebar-nav-btn-idle',
	)
}
