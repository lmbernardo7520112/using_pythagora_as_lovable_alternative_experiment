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
    address: { street: '', number: '', neighborhood: '', city: '', zipCode: '' },
    nightlyRate: 0,
    photos: [],
    amenities: [],
    blockedDates: [],
    status: 'published',
  });
  const [error, setError] = useState<string | null>(null);

  // estados para API de análise
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { property } = await getProperty(id!);
        if (property) {
          setFormData({
            ...property,
            photos: property.photos || [],
            amenities: property.amenities || [],
            blockedDates: property.blockedDates || [],
            address: property.address || {
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              zipCode: '',
            },
          });
        }
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
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Partial<Property>] as any),
          [child]: value,
        },
      }));
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

  // chamada à API de análise
  const handleAnalyzeDescription = async () => {
    if (!formData.description) {
      setError('Preencha a descrição antes de analisar.');
      return;
    }
    setLoadingAnalysis(true);
    setError(null);
    setSuggestion(null);
    setRating(null);
    try {
      const response = await fetch(
        'https://lmbernardo.app.n8n.cloud/webhook/6619eebc-ab50-4541-8076-368e633437d4',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Description: formData.description }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro na chamada da API');
      }

      const data = await response.json();

      // 🔧 Ajuste: tratar resposta encapsulada em "output"
      const output = data.output || data;
      setSuggestion(output.suggestion || 'Sem sugestão recebida.');
      setRating(output.rating ?? null);
    } catch (err: any) {
      setError('Falha ao analisar descrição.');
    } finally {
      setLoadingAnalysis(false);
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
          placeholder="Título"
          required
        />

        {/* Campo de descrição + botão analisar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="border p-2 flex-1"
            placeholder="Descrição"
            required
          />
          <button
            type="button"
            onClick={handleAnalyzeDescription}
            className="bg-green-500 text-white p-2 rounded"
            disabled={loadingAnalysis}
          >
            {loadingAnalysis ? 'Analisando...' : 'Analisar'}
          </button>
        </div>

        {/* Exibir resultado da análise */}
        {suggestion && (
          <div className="p-3 border rounded bg-gray-50">
            <p>
              <strong>Sugestão:</strong> {suggestion}
            </p>
            {rating !== null && (
              <p>
                <strong>Nota:</strong> {rating} / 5
              </p>
            )}
          </div>
        )}

        <input
          type="number"
          name="nightlyRate"
          value={formData.nightlyRate || 0}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Preço por noite"
          required
        />

        {/* Endereço completo */}
        <input
          type="text"
          name="address.street"
          value={formData.address?.street || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Rua"
        />
        <input
          type="text"
          name="address.number"
          value={formData.address?.number || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Número"
        />
        <input
          type="text"
          name="address.neighborhood"
          value={formData.address?.neighborhood || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Bairro"
        />
        <input
          type="text"
          name="address.city"
          value={formData.address?.city || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Cidade"
        />
        <input
          type="text"
          name="address.zipCode"
          value={formData.address?.zipCode || ''}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="CEP"
        />

        {/* Fotos */}
        <input
          type="text"
          name="photos"
          value={formData.photos?.join(', ') || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              photos: e.target.value.split(',').map((url) => url.trim()),
            }))
          }
          className="border p-2 w-full"
          placeholder="URLs das fotos (separadas por vírgula)"
        />

        {/* Amenidades */}
        <input
          type="text"
          name="amenities"
          value={formData.amenities?.join(', ') || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              amenities: e.target.value.split(',').map((a) => a.trim()),
            }))
          }
          className="border p-2 w-full"
          placeholder="Amenidades (separadas por vírgula)"
        />

        {/* Datas bloqueadas */}
        <input
          type="text"
          name="blockedDates"
          value={(formData.blockedDates as string[])?.join(', ') || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              blockedDates: e.target.value.split(',').map((d) => d.trim()),
            }))
          }
          className="border p-2 w-full"
          placeholder="Datas bloqueadas (YYYY-MM-DD, separadas por vírgula)"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
