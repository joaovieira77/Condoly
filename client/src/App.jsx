import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Quotas from './pages/Quotas';
import Despesas from './pages/Despesas';
import Ocorrencias from './pages/Ocorrencias';
import Reunioes from './pages/Reunioes';
import Notificacoes from './pages/Notificacoes';
import GestaoAnual from './pages/GestaoAnual';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quotas" element={<ProtectedRoute><Quotas /></ProtectedRoute>} />
      <Route path="/despesas" element={<ProtectedRoute><Despesas /></ProtectedRoute>} />
      <Route path="/ocorrencias" element={<ProtectedRoute><Ocorrencias /></ProtectedRoute>} />
      <Route path="/reunioes" element={<ProtectedRoute><Reunioes /></ProtectedRoute>} />
      <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
      <Route
        path="/gestao-anual"
        element={
          <ProtectedRoute adminOnly>
            <GestaoAnual />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
}
