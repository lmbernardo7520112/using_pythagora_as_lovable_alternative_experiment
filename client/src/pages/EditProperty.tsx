import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProperty, updateProperty } from '../api/properties';
import { Property } from '../types';

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    address: { street: '', number: '', neighborhood: '', city: '', zipCode: '' }, // Estado inicial com address
    nightlyRate: 0,
    photos: [],
    amenities: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { property } = await getProperty(id!);
        setFormData(property || {}); // Usa o valor retornado ou o estado inicial
      } catch (err) {
        setError('Falha ao carregar propriedade.');
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => {
        // Verifica se o parent existe e é um objeto
        if (prev[parent as keyof Partial<Property>] && typeof prev[parent as keyof Partial<Property>] === 'object') {
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof Partial<Property>] as any), // Type assertion segura
              [child]: value,
            },
          };
        }
        // Se não for um objeto, cria um novo ou mantém o estado
        return {
          ...prev,
          [parent]: { [child]: value },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProperty(id!, formData);
      navigate('/my-properties');
    } catch (err) {
      setError('Falha ao atualizar propriedade.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Propriedade</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="nightlyRate"
          value={formData.nightlyRate || 0}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="address.street"
          value={formData.address?.street || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default EditProperty;