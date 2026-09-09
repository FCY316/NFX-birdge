import { useEffect } from "react";

import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-dom";

import { RouteObjects } from "@/interface";

//递归查询对应的路由
/**
 * 查询路由
 * @param path 路径
 * @param routes 路由对象数组
 * @returns 匹配的路由对象或null
 */
const queryRouting = (
  path: string,
  routes: RouteObjects[]
): RouteObjects | null => {
  for (let item of routes) {
    if (item.path === path) return item;
    if (item.children) {
      const routerItem = queryRouting(path, item.children);
      if (routerItem) return routerItem;
    }
  }
  return null;
};
//全局路由守卫
function guard(
  pathname: string, //类型在react-router-dom中导入
  navigate: NavigateFunction, //类型在react-router-dom中导入
  routes: RouteObjects[]
) {
  //找到对应的路由信息，判断有没有权限控制
  const routeDetail = queryRouting(pathname, routes);

  //没有找到路由，跳转404
  if (!routeDetail) {
    return navigate("/noPage");
  }
}
export const RouterGuard = (routes: RouteObjects[]) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    guard(pathname, navigate, routes);
  }, [pathname, navigate, routes]);
  const Route = useRoutes(routes);
  return Route;
};
