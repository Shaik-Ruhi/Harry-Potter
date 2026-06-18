import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CharacterListPage = () => {
  const { authAxios, logout } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState('');
  const [house, setHouse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/characters', { params: { search, house } });
      setCharacters(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, [search, house]);

  return (
    <div className="page">
      <div className="header-row">
        <h1>Character List</h1>
        <Link className="button" to="/characters/add">Add New Character</Link>
      </div>
      <div className="filters">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" />
        <select value={house} onChange={(e) => setHouse(e.target.value)}>
          <option value="">All Houses</option>
          <option>Gryffindor</option>
          <option>Slytherin</option>
          <option>Ravenclaw</option>
          <option>Hufflepuff</option>
        </select>
      </div>
      {loading && <p>Loading characters...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {characters.map((character) => (
          <div key={character._id} className="card">
            <img src={character.image || 'https://via.placeholder.com/300x200'} alt={character.name} />
            <div className="card-content">
              <h2>{character.name}</h2>
              <p>{character.house}</p>
              <div className="card-actions">
                <Link to={`/characters/${character._id}`}>View</Link>
                <Link to={`/characters/${character._id}/edit`}>Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default CharacterListPage;
