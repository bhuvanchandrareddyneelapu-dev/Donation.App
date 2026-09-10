import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const token = localStorage.getItem('donationapp_token');
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/admin" state={{ from: location, sessionExpired: true }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin" state={{ from: location, unauthorized: true }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
