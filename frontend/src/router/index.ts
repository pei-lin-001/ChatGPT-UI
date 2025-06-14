import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Login from '@/pages/login/index.vue';

import Layout from '@/layouts/index.vue';

import pgRouter from './modules/homepage';
import componentsRouter from './modules/components';
import detailRouter from './modules/detail';
import resultRouter from './modules/result';
import formRouter from './modules/form';
import listRouter from './modules/list';
import userRouter from './modules/user';

export const homepageRouterList: Array<RouteRecordRaw> = [
  {
    path: '/homepage',
    component: Layout,
    redirect: '/homepage/base',
    name: 'homepage',
    meta: { title: '仪表盘', icon: 'dashboard' },
    children: pgRouter,
  },
];

export const toolRouterList: Array<RouteRecordRaw> = [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '个人页', icon: 'user-circle' },
    children: userRouter,
  },
];

// 存放动态路由
export const asyncRouterList: Array<RouteRecordRaw> = [...homepageRouterList, ...toolRouterList];

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/homepage/base',
  },
  ...resultRouter,
];

export const allRoutes = [...defaultRouterList, ...asyncRouterList];

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;