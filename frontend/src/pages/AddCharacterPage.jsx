import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AddCharacterPage = () => {
  const navigate = useNavigate();
  const { authAxios, setError, setLoading } = useAuth();
  const [form, setForm] = useState({ name: '', house: '', wand: '', patronus: '', bloodStatus: '', description: '' });
  const [image, setImage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);
      await authAxios.post('/characters', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/characters');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Add Character</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>House</label>
        <select name="house" value={form.house} onChange={handleChange} required>
          <option value="">Select house</option>
          <option>Gryffindor</option>
          <option>Slytherin</option>
          <option>Ravenclaw</option>
          <option>Hufflepuff</option>
        </select>
        <label>Wand</label>
        <input name="wand" value={form.wand} onChange={handleChange} required />
        <label>Patronus</label>
        <input name="patronus" value={form.patronus} onChange={handleChange} required />
        <label>Blood Status</label>
        <input name="bloodStatus" value={form.bloodStatus} onChange={handleChange} required />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
};

export default AddCharacterPage;
