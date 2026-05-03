
import { Toaster } from 'sonner';

export default function AdminToast() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        style: {
          background: 'hsl(var(--admin-sidebar-bg))',
          color: 'hsl(var(--admin-text))',
          border: '1px solid hsl(var(--admin-border))',
        },
      }} 
    />
  );
}
