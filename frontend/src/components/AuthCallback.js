import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        const hash = location.hash;
        if (!hash || !hash.includes('session_id=')) {
          navigate('/');
          return;
        }

        const sessionId = hash.split('session_id=')[1].split('&')[0];

        const response = await api.post('/auth/session', null, {
          headers: {
            'X-Session-ID': sessionId,
          },
        });

        const userData = response.data;
        login(userData);

        if (!userData.role) {
          navigate('/select-role', { state: { user: userData } });
        } else if (userData.role === 'WALKER') {
          navigate('/walker/requests', { state: { user: userData } });
        } else {
          // OWNER: redirigir a cuenta
          navigate('/app/account', { state: { user: userData } });
        }
      } catch (error) {
        console.error('Error procesando autenticación:', error);
        navigate('/');
      }
    };

    processSession();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88D8B0] mx-auto mb-4"></div>
        <p className="text-gray-600">Iniciando sesión...</p>
      </div>
    </div>
  );
}