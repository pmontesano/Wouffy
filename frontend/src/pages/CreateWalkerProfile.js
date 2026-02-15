import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, DollarSign, Calendar, Clock, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateWalkerProfile() {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    experience_years: '1',
    service_area_text: '',
    base_location_text: '',
    price_per_hour: '',
    availability_days: [],
    availability_hours: '',
  });

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    if (!user || user.role !== 'WALKER') {
      toast.error('Solo los paseadores pueden crear perfil');
      navigate('/');
      return;
    }

    if (window.location.pathname.includes('edit')) {
      setIsEdit(true);
      fetchProfile();
    } else {
      setFormData((prev) => ({ ...prev, display_name: user.name || '' }));
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/walkers/me/profile');
      const profile = response.data;
      setFormData({
        display_name: profile.display_name,
        bio: profile.bio,
        experience_years: profile.experience_years.toString(),
        service_area_text: profile.service_area_text,
        base_location_text: profile.base_location_text,
        price_per_hour: profile.price_per_hour.toString(),
        availability_days: profile.availability_days || [],
        availability_hours: profile.availability_hours || '',
      });
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      if (error.response?.status === 404) {
        toast.error('Perfil no encontrado');
        navigate('/walker/profile/create');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability_days: prev.availability_days.includes(day)
        ? prev.availability_days.filter((d) => d !== day)
        : [...prev.availability_days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.display_name ||
      !formData.bio ||
      !formData.service_area_text ||
      !formData.base_location_text ||
      !formData.price_per_hour
    ) {
      toast.error('Por favor completá todos los campos obligatorios');
      return;
    }

    if (parseFloat(formData.price_per_hour) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        display_name: formData.display_name,
        bio: formData.bio,
        experience_years: parseInt(formData.experience_years),
        service_area_text: formData.service_area_text,
        base_location_text: formData.base_location_text,
        price_per_hour: parseFloat(formData.price_per_hour),
        availability_days: formData.availability_days,
        availability_hours: formData.availability_hours,
      };

      if (isEdit) {
        await api.put('/walkers/me/profile', profileData);
        toast.success('¡Perfil actualizado correctamente!');
      } else {
        await api.post('/walkers/me/profile', profileData);
        toast.success('¡Perfil creado correctamente!');
      }

      navigate('/walker/requests');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1
            className="text-3xl font-bold text-[#1F2937] mb-2"
            style={{ fontFamily: 'Outfit' }}
            data-testid="create-profile-title"
          >
            {isEdit ? 'Editar Perfil' : 'Crear Perfil de Paseador'}
          </h1>
          <p className="text-gray-600 mb-8">
            Completá tu información para empezar a recibir solicitudes
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Nombre para mostrar *
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                placeholder="Ej: María González"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                required
                data-testid="display-name-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Biografía *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Contanos sobre tu experiencia con mascotas..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none resize-none"
                required
                data-testid="bio-input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Años de experiencia *
                </label>
                <select
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                  required
                  data-testid="experience-select"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                    <option key={year} value={year}>
                      {year} {year === 1 ? 'año' : 'años'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Precio por hora *
                </label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={formData.price_per_hour}
                  onChange={handleChange}
                  placeholder="Ej: 800"
                  min="0"
                  step="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                  required
                  data-testid="price-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Ubicación base *
              </label>
              <input
                type="text"
                name="base_location_text"
                value={formData.base_location_text}
                onChange={handleChange}
                placeholder="Ej: Palermo, Buenos Aires"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                required
                data-testid="base-location-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zonas de servicio *
              </label>
              <input
                type="text"
                name="service_area_text"
                value={formData.service_area_text}
                onChange={handleChange}
                placeholder="Ej: Palermo, Recoleta, Belgrano"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                required
                data-testid="service-area-input"
              />
              <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar size={16} className="inline mr-2" />
                Días disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      formData.availability_days.includes(day)
                        ? 'bg-[#88D8B0] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    data-testid={`day-${day}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Horarios disponibles
              </label>
              <input
                type="text"
                name="availability_hours"
                value={formData.availability_hours}
                onChange={handleChange}
                placeholder="Ej: 9:00 - 18:00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                data-testid="availability-hours-input"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/walker/requests')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                data-testid="cancel-button"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-profile-button"
              >
                {loading ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Perfil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
