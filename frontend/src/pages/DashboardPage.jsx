import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      <div className="actions">
        <Link to="/characters">Character List</Link>
        <Link to="/characters/add">Add Character</Link>
      </div>
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
