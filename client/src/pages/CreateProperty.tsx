import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../api/properties';
import { Property } from '../types';

const CreateProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    address: { street: '', number: '', neighborhood: '', city: '', zipCode: '' },
    nightlyRate: 0,
    photos: [],
    amenities: [],
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent as keyof Partial<Property>], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProperty(formData);
      navigate('/my-properties');
    } catch (err) {
      setError('Falha ao criar propriedade.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Propriedade</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Título" onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="description" placeholder="Descrição" onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="nightlyRate" placeholder="Preço por noite" onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="address.street" placeholder="Rua" onChange={handleChange} className="border p-2 w-full" />
        {/* Adicione mais campos para photos, amenities se quiser */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Salvar</button>
      </form>
    </div>
  );
};

export default CreateProperty;