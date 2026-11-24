import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/authStore';

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  useEffect(() => bootstrap(), [bootstrap]);

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3300,
          style: {
            background: 'var(--panel)',
            color: 'var(--text)',
            border: '1px solid var(--line)',
            borderRadius: '14px',
            boxShadow: '0 12px 34px rgba(73, 45, 35, .11)',
            padding: '13px 16px',
            maxWidth: '370px',
          },
          success: { iconTheme: { primary: '#b85f40', secondary: '#fff' } },
        }}
      />
    </>
  );
}
