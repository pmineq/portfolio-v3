import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import BootLoader from 'components/common/Loader/Loader';

const Home = lazy(() => import('pages/Home/Home'));
// const About = lazy(() => import('pages/About/About'));
// const Projects = lazy(() => import('pages/Projects/Projects'));
// const Contact = lazy(() => import('pages/Contact/Contact'));
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
            <Suspense fallback={<BootLoader />}>
              <Home />
            </Suspense>
          ),
        },
        // { path: 'about', element: <Suspense fallback={<Loader />}><About /></Suspense> },
        // { path: 'projects', element: <Suspense fallback={<Loader />}><Projects /></Suspense> },
        // { path: 'contact', element: <Suspense fallback={<Loader />}><Contact /></Suspense> },
        {
          path: '*',
          element: (
            <Suspense fallback={<BootLoader />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL, // ✅ GH Pages 하위 경로 인식
  },
);
