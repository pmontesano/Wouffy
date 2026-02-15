import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('¡Seleccioná un rol para continuar!');
      return;
    }

    setLoading(true);
    try {
      const response = await api.patch('/auth/role', { role: selectedRole });
      updateUser(response.data);
      toast.success('¡Rol seleccionado correctamente!');

      if (selectedRole === 'WALKER') {
        navigate('/walker/profile/create');
      } else {
        navigate('/walkers');
      }
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      toast.error('Error al seleccionar rol. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-white px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-[#1F2937] mb-4"
            style={{ fontFamily: 'Outfit' }}
            data-testid="select-role-title"
          >
            ¿Cómo querés usar Wouffy?
          </h1>
          <p className="text-lg text-gray-600">
            Seleccioná tu rol para empezar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setSelectedRole('OWNER')}
            className={`bg-white rounded-3xl p-8 shadow-lg transition-all ${
              selectedRole === 'OWNER'
                ? 'ring-4 ring-[#88D8B0] scale-105'
                : 'hover:shadow-xl hover:scale-102'
            }`}
            data-testid="role-owner-button"
          >
            <div className="w-20 h-20 bg-[#88D8B0] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={40} className="text-[#88D8B0]" />
            </div>
            <h2
              className="text-2xl font-bold text-[#1F2937] mb-3"
              style={{ fontFamily: 'Outfit' }}
            >
              Soy Dueño
            </h2>
            <p className="text-gray-600 mb-4">
              Buscá paseadores profesionales para tu mascota y programa paseos cuando lo necesites.
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-[#88D8B0]">✓</span>
                <span>Buscar paseadores cercanos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#88D8B0]">✓</span>
                <span>Solicitar paseos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#88D8B0]">✓</span>
                <span>Ver historial de paseos</span>
              </li>
            </ul>
          </button>

          <button
            onClick={() => setSelectedRole('WALKER')}
            className={`bg-white rounded-3xl p-8 shadow-lg transition-all ${
              selectedRole === 'WALKER'
                ? 'ring-4 ring-[#FFCC99] scale-105'
                : 'hover:shadow-xl hover:scale-102'
            }`}
            data-testid="role-walker-button"
          >
            <div className="w-20 h-20 bg-[#FFCC99] bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={40} className="text-[#FFCC99]" />
            </div>
            <h2
              className="text-2xl font-bold text-[#1F2937] mb-3"
              style={{ fontFamily: 'Outfit' }}
            >
              Soy Paseador
            </h2>
            <p className="text-gray-600 mb-4">
              Ofrecé tus servicios de paseo, gestía solicitudes y generá ingresos haciendo lo que amás.
            </p>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-[#FFCC99]">✓</span>
                <span>Crear perfil profesional</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#FFCC99]">✓</span>
                <span>Recibir solicitudes</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#FFCC99]">✓</span>
                <span>Gestionar tu agenda</span>
              </li>
            </ul>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="confirm-role-button"
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}