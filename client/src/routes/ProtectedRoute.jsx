import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/common/Loader';
export default function ProtectedRoute() {
  const { user, loading } = useAuthStore(); const location = useLocation();
  if (loading) return <Loader/>;
  return user ? <Outlet/> : <Navigate to="/login" state={{ from: location.pathname }} replace/>;
}
