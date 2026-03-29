import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import HomePortal from './pages/HomePortal';
import Welcome from './pages/Welcome';
import Survey from './pages/Survey';
import ThankYou from './pages/ThankYou';
import GasReference from './pages/GasReference';
import GestorLayout from '@/components/gestor/GestorLayout';
import GestorDashboard from './pages/GestorDashboard.jsx';
import GestorLogin from './pages/GestorLogin';
import GestorPesquisas from './pages/GestorPesquisas';
import GestorJornada from './pages/GestorJornada';
import GestorEquipamentos from './pages/GestorEquipamentos';
import GestorQualidadePage from './pages/GestorQualidade';
import GestorLGPD from './pages/GestorLGPD';
import GestorTreinamentos from './pages/GestorTreinamentos';
import GestorMelhoria from './pages/GestorMelhoria';
import GestorPerfis from './pages/GestorPerfis';
import GestorEnfermagem from './pages/GestorEnfermagem';
import GestorFuncionarios from './pages/GestorFuncionarios';
import GestorPDI from './pages/GestorPDI';
import GestorEventosNaoConformidades from './pages/GestorEventosNaoConformidades';
import GestorQualidadeJornada from './pages/GestorQualidadeJornada';
import GestorQualidadeCarrinho from './pages/GestorQualidadeCarrinho';
import GestorDocumentos from './pages/GestorDocumentos';
const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<HomePortal />} />
      <Route path="/pesquisa-inicial" element={<Welcome />} />
      <Route path="/pesquisa" element={<Survey />} />
      <Route path="/obrigado" element={<ThankYou />} />
      <Route path="/gas-reference" element={<GasReference />} />
      <Route path="/gestor-inicial" element={<GestorLogin />} />
      <Route path="/gestor-master" element={<GestorLayout />}>
        <Route path="" element={<GestorDashboard />} />
        <Route path="jornada" element={<GestorJornada />} />
        <Route path="equipamentos" element={<GestorEquipamentos />} />
        <Route path="qualidade" element={<GestorQualidadePage />} />
        <Route path="lgpd" element={<GestorLGPD />} />
        <Route path="treinamentos" element={<GestorTreinamentos />} />
        <Route path="melhoria" element={<GestorMelhoria />} />
        <Route path="pesquisas" element={<GestorPesquisas />} />
        <Route path="perfis" element={<GestorPerfis />} />
        <Route path="funcionarios" element={<GestorFuncionarios />} />
        <Route path="pdi" element={<GestorPDI />} />
        <Route path="carrinho" element={<GestorQualidadeCarrinho />} />
        <Route path="documentos" element={<GestorDocumentos />} />
      </Route>
      <Route path="/gerente-enfermagem" element={<GestorLayout />}>
        <Route path="" element={<GestorEnfermagem />} />
        <Route path="pdi" element={<GestorPDI />} />
        <Route path="evento-adverso" element={<GestorEventosNaoConformidades />} />
        <Route path="documentos" element={<GestorDocumentos />} />
      </Route>
      <Route path="/gestor-qualidade" element={<GestorLayout />}>
        <Route path="" element={<GestorQualidadePage />} />
        <Route path="jornada" element={<GestorQualidadeJornada />} />
        <Route path="equipamentos" element={<GestorEquipamentos />} />
        <Route path="eventos-nao-conformidades" element={<GestorEventosNaoConformidades />} />
        <Route path="treinamentos" element={<GestorTreinamentos />} />
        <Route path="pdi" element={<GestorPDI />} />
        <Route path="funcionarios" element={<GestorFuncionarios />} />
        <Route path="melhoria" element={<GestorMelhoria />} />
        <Route path="pesquisas" element={<GestorPesquisas />} />
        <Route path="carrinho" element={<GestorQualidadeCarrinho />} />
        <Route path="documentos" element={<GestorDocumentos />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App