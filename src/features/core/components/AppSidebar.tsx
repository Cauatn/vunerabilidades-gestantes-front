import { DoorOpen, House, PanelLeft, PanelLeftClose, Settings, Stethoscope, Users } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from '@/features/auth/composables/useSession'
import { useHealthUnits } from '@/features/healthUnits/composables/useHealthUnits'
import { useSetCurrentHealthUnit } from '@/features/usuarios/composables/useUsuarios'
import { ROLE_TO_CATEGORIA } from '@/features/usuarios/types/usuario'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { cn } from '@/lib/utils'

const navItems: { url: string; title: string; icon: React.ReactNode }[] = [
	{ url: '/usuarios', title: 'Usuários', icon: <Users className="size-6 shrink-0" /> },
	{ url: '/', title: 'Gestantes', icon: <House className="size-6 shrink-0" /> },
]

const aplicacoesSubItens: { url: string; title: string }[] = [
	{ url: '/formulario', title: 'Nova' },
	{ url: '/historico', title: 'Histórico' },
]

function SidebarCollapseTrigger() {
	const { state, toggleSidebar } = useSidebar()
	const collapsed = state === 'collapsed'

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			className="size-11 shrink-0 text-n-700 hover:bg-n-20 md:size-8"
			onClick={toggleSidebar}
			aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
		>
			{collapsed ? <PanelLeft className="size-6 md:size-5" /> : <PanelLeftClose className="size-6 md:size-5" />}
		</Button>
	)
}

function iniciais(nome: string): string {
	const partes = nome.trim().split(/\s+/)
	return `${partes[0]?.[0] ?? ''}${partes.length > 1 ? (partes[partes.length - 1][0] ?? '') : ''}`.toUpperCase()
}

export function AppSidebar() {
	const location = useLocation()
	const navigate = useNavigate()
	const { user, logout } = useSession()
	const { data: healthUnits } = useHealthUnits()
	const trocarUbs = useSetCurrentHealthUnit()

	const minhasUbs = healthUnits?.data.filter((unit) => user?.healthUnitIds.includes(unit.id)) ?? []
	const categoria = user ? CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[user.role]] : ''

	function sair() {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<Sidebar collapsible="icon" className="border-r border-n-40 **:data-[sidebar=sidebar]:border-0">
			<SidebarHeader className="gap-0 border-b border-n-30 p-4">
				<div className="flex w-full items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<span className="block truncate text-2xl font-bold tracking-tight text-t-600">Pré-Natal</span>
					</div>
					<SidebarCollapseTrigger />
				</div>
			</SidebarHeader>
			<SidebarContent className="gap-0 px-3 py-4 group-data-[collapsible=icon]:px-0">
				<SidebarGroup className="gap-1 p-0">
					<SidebarMenu>
						{navItems.map((item) => {
							const isActive = location.pathname === item.url
							return (
								<SidebarMenuItem key={item.url}>
									<SidebarMenuButton
										asChild
										isActive={isActive}
										size="lg"
										className={cn(
											'sidebar-nav-item-icon gap-3 px-3 text-base',
											isActive ? 'sidebar-nav-btn-active' : 'sidebar-nav-btn-idle',
										)}
									>
										<Link to={item.url}>
											{item.icon}
											<span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							)
						})}

						<SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
							<div className="flex items-center gap-3 px-3 py-3 text-base text-n-700">
								<Stethoscope className="size-6 shrink-0" />
								<span>Aplicações</span>
							</div>
							<div className="flex gap-3 px-[calc(0.75rem+0.75rem)]">
								<div className="w-px shrink-0 bg-n-40" />
								<div className="flex flex-col gap-2 py-0.5 text-sm">
									{aplicacoesSubItens.map((item) => {
										const isActive = location.pathname === item.url
										return (
											<Link
												key={item.url}
												to={item.url}
												className={cn(
													isActive ? 'font-semibold text-t-600' : 'font-normal text-n-600 hover:text-n-800',
												)}
											>
												{item.title}
											</Link>
										)
									})}
								</div>
							</div>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<div className="my-4 h-px bg-n-30 group-data-[collapsible=icon]:hidden" />

				<SidebarGroup className="p-0">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={location.pathname === '/configuracao'}
								size="lg"
								className={cn(
									'sidebar-nav-item-icon gap-3 px-3 text-base',
									location.pathname === '/configuracao' ? 'sidebar-nav-btn-active' : 'sidebar-nav-btn-idle',
								)}
							>
								<Link to="/configuracao">
									<Settings className="size-6 shrink-0" />
									<span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">Configurações</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="gap-4 border-t border-n-30 p-4 group-data-[collapsible=icon]:hidden">
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

				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-3">
						<div className="sidebar-footer-avatar">{user ? iniciais(user.name) : '--'}</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-n-700">{user?.name ?? ''}</p>
							<p className="truncate text-xs text-n-500">{categoria}</p>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0 text-n-700 hover:bg-n-20"
						onClick={sair}
						aria-label="Sair"
					>
						<DoorOpen className="size-5" />
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
