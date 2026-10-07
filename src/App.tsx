import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppLayout } from './layouts/AppLayout';
import { MekaiPageLoader } from './components/MekaiLogo';

// Lazy-loaded route views for optimized bundle splitting & instant initial render
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const DocsPage = lazy(() =>
  import('./pages/DocsPage').then((m) => ({ default: m.DocsPage }))
);
const CareersPage = lazy(() =>
  import('./pages/CareersPage').then((m) => ({ default: m.CareersPage }))
);
const PressPage = lazy(() =>
  import('./pages/PressPage').then((m) => ({ default: m.PressPage }))
);
const HelpPage = lazy(() =>
  import('./pages/HelpPage').then((m) => ({ default: m.HelpPage }))
);
const StatusPage = lazy(() =>
  import('./pages/StatusPage').then((m) => ({ default: m.StatusPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const LicensesPage = lazy(() =>
  import('./pages/LicensesPage').then((m) => ({ default: m.LicensesPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export type AppPage =
  | 'home'
  | 'auth'
  | 'docs'
  | 'careers'
  | 'press'
  | 'help'
  | 'status'
  | 'terms'
  | 'privacy'
  | 'licenses';

/**
 * Route View Switcher
 * Evaluates current route from RouterContext and mounts the modular view inside appropriate layout
 */
function AppRoutes() {
  const { currentPath } = useRouter();

  switch (currentPath) {
    case '/':
      return (
        <AppLayout>
          <HomePage />
        </AppLayout>
      );

    case '/dashboard':
      return <DashboardPage />;

    case '/auth':
      return <AuthPage />;

    case '/docs':
      return (
        <AppLayout>
          <DocsPage />
        </AppLayout>
      );

    case '/careers':
      return (
        <AppLayout>
          <CareersPage />
        </AppLayout>
      );

    case '/press':
      return (
        <AppLayout>
          <PressPage />
        </AppLayout>
      );

    case '/help':
      return (
        <AppLayout>
          <HelpPage />
        </AppLayout>
      );

    case '/status':
      return (
        <AppLayout>
          <StatusPage />
        </AppLayout>
      );

    case '/terms':
      return (
        <AppLayout>
          <TermsPage />
        </AppLayout>
      );

    case '/privacy':
      return (
        <AppLayout>
          <PrivacyPage />
        </AppLayout>
      );

    case '/licenses':
      return (
        <AppLayout>
          <LicensesPage />
        </AppLayout>
      );

    default:
      return (
        <AppLayout>
          <NotFoundPage />
        </AppLayout>
      );
  }
}

/**
 * Production-grade Application Root
 * Configures Session Auth Context & HTML5 History Router Context
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Suspense fallback={<MekaiPageLoader />}>
          <AppRoutes />
        </Suspense>
      </RouterProvider>
    </AuthProvider>
  );
}
