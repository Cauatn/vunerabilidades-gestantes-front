import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/AppShell'
import { RequireAuth } from '@/features/core/guards/requireAuth'
import { AvaliacaoDetalhePage } from '@/features/avaliacao/pages/AvaliacaoDetalhePage'
import { AvaliacaoImprimirVisaoGeralPage } from '@/features/avaliacao/pages/AvaliacaoImprimirVisaoGeralPage'
import { AvaliacaoImprimirVisaoGestantePage } from '@/features/avaliacao/pages/AvaliacaoImprimirVisaoGestantePage'
import { FormularioPage } from '@/features/avaliacao/pages/FormularioPage'
import { ConfigurarEscalaPage } from '@/features/instrumentos/pages/ConfigurarEscalaPage'
import { ConfigurarQuestionarioPage } from '@/features/instrumentos/pages/ConfigurarQuestionarioPage'
import { HistoricoPage } from '@/features/avaliacao/pages/HistoricoPage'
import { ResultadoPage } from '@/features/avaliacao/pages/ResultadoPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegistroPage } from '@/features/auth/pages/RegistroPage'
import { GestantesPage } from '@/features/gestantes/pages/GestantesPage'
import { GestantesImprimirPage } from '@/features/gestantes/pages/GestantesImprimirPage'
import { GestantesPerfilPage } from '@/features/gestantes/pages/GestantesPerfilPage'
import { UsuariosPage } from '@/features/usuarios/pages/UsuariosPage'

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/cadastro" element={<RegistroPage />} />
			<Route path="/convite" element={<RegistroPage />} />

			<Route element={<RequireAuth />}>
				<Route path="/gestantes/:id/imprimir" element={<GestantesImprimirPage />} />
				<Route path="/historico/:id/imprimir/visao-geral" element={<AvaliacaoImprimirVisaoGeralPage />} />
				<Route path="/historico/:id/imprimir/visao-gestante" element={<AvaliacaoImprimirVisaoGestantePage />} />

				<Route element={<AppShell />}>
					<Route path="/" element={<GestantesPage />} />
					<Route path="/gestantes/:id" element={<GestantesPerfilPage />} />
					<Route path="/usuarios" element={<UsuariosPage />} />
					<Route path="/formulario" element={<FormularioPage />} />
					<Route path="/historico" element={<HistoricoPage />} />
					<Route path="/historico/:id" element={<AvaliacaoDetalhePage />} />
					<Route path="/resultado" element={<ResultadoPage />} />
					<Route path="/configuracao" element={<ConfigurarQuestionarioPage />} />
					<Route path="/configuracao/escala" element={<ConfigurarEscalaPage />} />
				</Route>
			</Route>
		</Routes>
	)
}
