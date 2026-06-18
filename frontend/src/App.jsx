import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CharacterListPage from './pages/CharacterListPage.jsx';
import AddCharacterPage from './pages/AddCharacterPage.jsx';
import EditCharacterPage from './pages/EditCharacterPage.jsx';
import CharacterDetailsPage from './pages/CharacterDetailsPage.jsx';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <CharacterListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/add"
          element={
            <ProtectedRoute>
              <AddCharacterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/:id/edit"
          element={
            <ProtectedRoute>
              <EditCharacterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/:id"
          element={
            <ProtectedRoute>
              <CharacterDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
