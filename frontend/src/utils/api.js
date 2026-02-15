import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getWalkStatusLabel = (status) => {
  const labels = {
    REQUESTED: 'Solicitado',
    ACCEPTED: 'Aceptado',
    REJECTED: 'Rechazado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Completado',
  };
  return labels[status] || status;
};

export const getWalkStatusClass = (status) => {
  const classes = {
    REQUESTED: 'status-requested',
    ACCEPTED: 'status-accepted',
    REJECTED: 'status-rejected',
    CANCELLED: 'status-cancelled',
    COMPLETED: 'status-completed',
  };
  return classes[status] || '';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} a las ${formatTime(dateString)}`;
};