import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import Loader from 'components/common/Loader/Loader';

const Home = lazy(() => import('pages/Home'));
const About = lazy(() => import('pages/About'));
const Career = lazy(() => import('pages/Career'));
const Contact = lazy(() => import('pages/Contact'));
const NotFound = lazy(() => import('pages/NotFound'));

const wrap = (El: React.ComponentType) => (
  <Suspense fallback={<Loader />}>
    <El />
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true,          element: wrap(Home) },
        { path: 'about',        element: wrap(About) },
        { path: 'career',       element: wrap(Career) },
        { path: 'contact',      element: wrap(Contact) },
        { path: '*',            element: wrap(NotFound) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
