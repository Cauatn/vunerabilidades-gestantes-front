import { AppRoutes } from '@/appRoutes'
import { PerguntasProvider } from '@/features/avaliacao/composables/usePerguntasStore'

function App() {
	return (
		<PerguntasProvider>
			<AppRoutes />
		</PerguntasProvider>
	)
}

export default App
