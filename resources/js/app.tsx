import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLoginLayout from '@/layouts/auth/auth-login-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import "leaflet/dist/leaflet.css";

createInertiaApp({
  title: (title) => (title ? `${title} - Perpustakaan Ibrahimy` : 'Perpustakaan Ibrahimy'),
  layout: (name) => {
  switch (true) {
    case name === 'welcome':
      return null;

    case name === 'result':
      return null; 

    case name === 'docs' :
      return null;

    case name === 'titikbaca':
      return null;

    case name.startsWith('titikbaca/'):
      return null;

    case name === 'ebook/baca':
      return null;

    case name === 'tentang/show':
      return null;

    case name === 'layanan/public':
      return null;

    case name === 'berita/public':
      return null;

    case name === 'berita/show':
      return null;

    case name === 'buletin/public':
      return null;

    case name === 'buletin/show':
      return null;

    case name === 'pengumuman/public':
      return null;

    case name === 'pengumuman/show':
      return null;

    case name === 'kegiatan/public':
      return null;

    case name === 'pengunjung/public':
      return null;

    case name === 'hari-libur/public':
      return null;

    case name === 'lokasi/show':
      return null;

    case name === 'auth/login':
      return AuthLoginLayout;

    case name.startsWith('auth/'):
      return AuthLayout;

    case name.startsWith('settings/'):
      return [AppLayout, SettingsLayout];

    default:
      return AppLayout;
  }
},
  strictMode: true,
  withApp(app) {
    return (
    <TooltipProvider delayDuration={0}>
      {app}

      {/* ✅ Tambahkan ini */}
      <Toaster richColors position="top-center" />
    </TooltipProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
