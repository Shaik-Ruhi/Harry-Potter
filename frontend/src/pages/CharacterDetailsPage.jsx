import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CharacterDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authAxios, setError, setLoading } = useAuth();
  const [character, setCharacter] = useState(null);

  const loadCharacter = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/characters/${id}`);
      setCharacter(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacter();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this character?')) return;
    try {
      await authAxios.delete(`/characters/${id}`);
      navigate('/characters');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete character');
    }
  };

  if (!character) return <div className="page"><p>Loading character...</p></div>;

  return (
    <div className="page">
      <h1>{character.name}</h1>
      <img src={character.image || 'https://via.placeholder.com/700x400'} alt={character.name} className="details-image" />
      <div className="details-card">
        <p><strong>House:</strong> {character.house}</p>
        <p><strong>Wand:</strong> {character.wand}</p>
        <p><strong>Patronus:</strong> {character.patronus}</p>
        <p><strong>Blood Status:</strong> {character.bloodStatus}</p>
        <p><strong>Description:</strong> {character.description}</p>
      </div>
      <div className="actions">
        <Link className="button" to={`/characters/${id}/edit`}>Edit Character</Link>
        <button className="button button-danger" onClick={handleDelete}>Delete Character</button>
      </div>
    </div>
  );
};

export default CharacterDetailsPage;
