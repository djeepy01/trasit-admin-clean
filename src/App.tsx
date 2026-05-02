import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FicheDetail from './pages/FicheDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fiche/:id"
          element={
            <ProtectedRoute>
              <FicheDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
