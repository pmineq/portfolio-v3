import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import Loader from 'components/common/Loader/Loader';
const Home = lazy(() => import('pages/Home'));
const About = lazy(() => import('pages/About'));
const Career = lazy(() => import('pages/Career'));
const Contact = lazy(() => import('pages/Contact'));
const NotFound = lazy(() => import('pages/NotFound'));
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(RootLayout, {}),
        children: [
            {
                index: true,
                element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(Home, {}) })),
            },
            {
                path: 'about',
                element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(About, {}) })),
            },
            {
                path: 'career',
                element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(Career, {}) })),
            },
            {
                path: 'contact',
                element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(Contact, {}) })),
            },
            {
                path: '*',
                element: (_jsx(Suspense, { fallback: _jsx(Loader, {}), children: _jsx(NotFound, {}) })),
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL,
});
