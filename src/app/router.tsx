import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import Loader from 'components/common/Loader/Loader';

const Home = lazy(() => import('pages/Home'));
const About = lazy(() => import('pages/About'));
const Career = lazy(() => import('pages/Career'));
const Contact = lazy(() => import('pages/Contact'));
const NotFound = lazy(() => import('pages/NotFound'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: 'about',
          element: (
            <Suspense fallback={<Loader />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: 'career',
          element: (
            <Suspense fallback={<Loader />}>
              <Career />
            </Suspense>
          ),
        },
        {
          path: 'contact',
          element: (
            <Suspense fallback={<Loader />}>
              <Contact />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<Loader />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
