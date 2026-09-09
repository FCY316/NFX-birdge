import { Suspense } from 'react';

import Layout from '@/Layout';
import Home from '@/page/home';

import { RouterGuard } from './RouteGuard';

const routeConfig = [
  {
    path: "/",
    element: <Layout />,
    auth: true,
    children: [
      {
        path: "/",
        element: <Home />,   // tab 首页
        auth: true,
      },
    ],
  },
];

const AppRouter = () => {
  const element = RouterGuard(routeConfig);
  return <Suspense> {element}</Suspense>;
};
export default AppRouter;
