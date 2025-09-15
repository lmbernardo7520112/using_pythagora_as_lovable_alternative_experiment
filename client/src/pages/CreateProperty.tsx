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
    blockedDates: [],
    status: 'published',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Partial<Property>] as any),
          [child]: value,
        },
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
      console.error(err);
      setError('Falha ao criar propriedade.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Propriedade</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Título"
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="nightlyRate"
          placeholder="Preço por noite"
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        {/* Endereço completo */}
        <input
          type="text"
          name="address.street"
          placeholder="Rua"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="address.number"
          placeholder="Número"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="address.neighborhood"
          placeholder="Bairro"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="address.city"
          placeholder="Cidade"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="address.zipCode"
          placeholder="CEP"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {/* Fotos */}
        <input
          type="text"
          name="photos"
          placeholder="URLs das fotos (separadas por vírgula)"
          onChange={(e) =>
            setFormData({
              ...formData,
              photos: e.target.value.split(',').map((url) => url.trim()),
            })
          }
          className="border p-2 w-full"
        />

        {/* Amenidades */}
        <input
          type="text"
          name="amenities"
          placeholder="Amenidades (separadas por vírgula)"
          onChange={(e) =>
            setFormData({
              ...formData,
              amenities: e.target.value.split(',').map((a) => a.trim()),
            })
          }
          className="border p-2 w-full"
        />

        {/* Datas bloqueadas */}
        <input
          type="text"
          name="blockedDates"
          placeholder="Datas bloqueadas (YYYY-MM-DD, separadas por vírgula)"
          onChange={(e) =>
            setFormData({
              ...formData,
              blockedDates: e.target.value
                .split(',')
                .map((d) => d.trim()),
            })
          }
          className="border p-2 w-full"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
