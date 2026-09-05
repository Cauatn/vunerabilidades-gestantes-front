import { AppRoutes } from "@/appRoutes";
import { PerguntasProvider } from "@/features/avaliacao/composables/usePerguntasStore";
import { Toaster } from "./components/ui/sonner";

function App() {
	return (
		<PerguntasProvider>
			<AppRoutes />
			<Toaster />
		</PerguntasProvider>
	);
}

export default App;
