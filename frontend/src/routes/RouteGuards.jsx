import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGuestRedirect, getHomeDestination, getProtectedRedirect } from './routePolicy';

export function ProtectedRoute() {
  const { isAuthenticated, sessionNotice } = useAuth();
  const location = useLocation();

  const redirect = getProtectedRedirect(isAuthenticated, location.pathname, sessionNotice);
  if (redirect) return <Navigate to={redirect.to} replace state={redirect.state} />;
  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  const redirect = getGuestRedirect(isAuthenticated);
  return redirect ? <Navigate to={redirect} replace /> : <Outlet />;
}

export function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={getHomeDestination(isAuthenticated)} replace />;
}
