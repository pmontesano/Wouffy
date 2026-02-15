import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Star, DollarSign, Search, Filter, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Walkers() {
  const [walkers, setWalkers] = useState([]);
  const [filteredWalkers, setFilteredWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-34.6037, -58.3816]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalkers();
  }, []);

  const fetchWalkers = async () => {
    try {
      const response = await api.get('/walkers');
      setWalkers(response.data);
      setFilteredWalkers(response.data);
    } catch (error) {
      console.error('Error al cargar paseadores:', error);
      toast.error('Error al cargar paseadores');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          toast.success('Ubicación detectada correctamente');
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          toast.error('No se pudo obtener tu ubicación');
        }
      );
    } else {
      toast.error('Tu navegador no soporta geolocalización');
    }
  };

  const handleFilter = () => {
    let filtered = [...walkers];

    if (location) {
      filtered = filtered.filter((walker) =>
        walker.service_area_text.toLowerCase().includes(location.toLowerCase()) ||
        walker.base_location_text.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minRating) {
      filtered = filtered.filter((walker) => walker.rating_avg >= parseFloat(minRating));
    }

    if (maxPrice) {
      filtered = filtered.filter((walker) => walker.price_per_hour <= parseFloat(maxPrice));
    }

    setFilteredWalkers(filtered);
  };

  const handleReset = () => {
    setLocation('');
    setMinRating('');
    setMaxPrice('');
    setFilteredWalkers(walkers);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88D8B0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-[#1F2937] mb-2"
            style={{ fontFamily: 'Outfit' }}
            data-testid="walkers-page-title"
          >
            Paseadores Disponibles
          </h1>
          <p className="text-gray-600">Encuentra el paseador ideal para tu mascota</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por ubicación..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                  data-testid="location-search-input"
                />
              </div>
              <button
                onClick={handleGetLocation}
                className="btn-secondary flex items-center space-x-2"
                data-testid="get-location-button"
              >
                <Navigation size={18} />
                <span>Mi ubicación</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Calificación mínima
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                  data-testid="min-rating-filter"
                >
                  <option value="">Todas</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.7">4.7+</option>
                  <option value="4.9">4.9+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio máximo
                </label>
                <input
                  type="number"
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#88D8B0] focus:border-[#88D8B0] outline-none"
                  data-testid="max-price-filter"
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={handleFilter}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  data-testid="apply-filters-button"
                >
                  <Filter size={18} />
                  <span>Filtrar</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  data-testid="reset-filters-button"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden mb-6">
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredWalkers.map((walker) => {
                  if (walker.latitude && walker.longitude) {
                    return (
                      <Marker key={walker.walker_id} position={[walker.latitude, walker.longitude]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold">{walker.display_name}</p>
                            <p className="text-sm">${walker.price_per_hour}/hora</p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  }
                  return null;
                })}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Tu ubicación</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <div className="text-sm text-gray-600">
              Mostrando {filteredWalkers.length} de {walkers.length} paseadores
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>
              Consejos de búsqueda
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-[#88D8B0] font-bold">•</span>
                <span>Usa la geolocalización para encontrar paseadores cerca tuyo</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#88D8B0] font-bold">•</span>
                <span>Lee las reseñas y calificaciones de otros dueños</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#88D8B0] font-bold">•</span>
                <span>Verifica la experiencia y disponibilidad del paseador</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#88D8B0] font-bold">•</span>
                <span>Compara precios y servicios antes de solicitar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWalkers.map((walker, index) => (
            <motion.div
              key={walker.walker_id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/walkers/${walker.walker_id}`} data-testid={`walker-card-${walker.walker_id}`}>
                <div className="bg-white rounded-3xl p-6 shadow-lg card-hover cursor-pointer">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={walker.photo_url || 'https://via.placeholder.com/80'}
                      alt={walker.display_name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#88D8B0]"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Outfit' }}>
                        {walker.display_name}
                      </h3>
                      <div className="flex items-center space-x-1 mb-2">
                        <Star size={16} className="text-[#FFCC99]" fill="#FFCC99" />
                        <span className="font-semibold">{walker.rating_avg}</span>
                        <span className="text-sm text-gray-500">({walker.rating_count})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{walker.bio}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-[#88D8B0]" />
                      <span>{walker.base_location_text}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign size={16} className="text-[#FFCC99]" />
                      <span className="font-semibold">${walker.price_per_hour}/hora</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    {walker.experience_years} años de experiencia
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredWalkers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No se encontraron paseadores con esos filtros</p>
            <button onClick={handleReset} className="btn-primary mt-4">
              Ver todos los paseadores
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
