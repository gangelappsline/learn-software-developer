import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Navigate,
  useRouteError,
} from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { Button } from '@/components/ui';

function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? 'No encontramos ese reto.'
      : error.statusText || 'Algo no salió como esperábamos.'
    : error instanceof Error
      ? error.message
      : 'Ha ocurrido un error inesperado.';
  return (
    <div className="route-error-page">
      <span>🛰️</span>
      <h2>Hemos perdido la señal</h2>
      <p>{message}</p>
      <Link to="/dashboard">
        <Button>Volver a tu aventura</Button>
      </Link>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: async () => {
          const page = await import('@/pages/DashboardPage');
          return { Component: page.default, loader: page.loader };
        },
      },
      {
        path: 'missions',
        lazy: async () => {
          const page = await import('@/pages/MissionsPage');
          return { Component: page.default, loader: page.loader };
        },
      },
      {
        path: 'missions/:missionId',
        lazy: async () => {
          const page = await import('@/pages/MissionDetailPage');
          return { Component: page.default, loader: page.loader };
        },
      },
      {
        path: 'languages',
        lazy: async () => {
          const page = await import('@/pages/LanguagePage');
          return { Component: page.default, loader: page.loader };
        },
      },
      {
        path: 'languages/:languageId',
        lazy: async () => {
          const page = await import('@/pages/LanguageDetailPage');
          return { Component: page.default, loader: page.loader };
        },
      },
      {
        path: 'achievements',
        lazy: async () => ({ Component: (await import('@/pages/AchievementsPage')).default }),
      },
      {
        path: 'profile',
        lazy: async () => ({ Component: (await import('@/pages/ProfilePage')).default }),
      },
      {
        path: 'leaderboard',
        lazy: async () => ({ Component: (await import('@/pages/LeaderboardPage')).default }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/NotFoundPage')).default }),
      },
    ],
  },
]);
