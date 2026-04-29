import { RequestMethod } from '@nestjs/common';

export const WEB_ROUTE_EXCLUDES = [
  {
    path: '/',
    method: RequestMethod.GET,
  },
  {
    path: 'login',
    method: RequestMethod.GET,
  },
  {
    path: 'login',
    method: RequestMethod.POST,
  },
  {
    path: 'register',
    method: RequestMethod.GET,
  },
  {
    path: 'register',
    method: RequestMethod.POST,
  },
  {
    path: 'forgot-password',
    method: RequestMethod.GET,
  },
  {
    path: 'forgot-password',
    method: RequestMethod.POST,
  },
  {
    path: 'reset-password',
    method: RequestMethod.GET,
  },
  {
    path: 'reset-password',
    method: RequestMethod.POST,
  },
  {
    path: 'logout',
    method: RequestMethod.POST,
  },

  /*
   * Auth views - route cũ
   * Giữ lại tạm thời nếu còn link /auth/login trong giao diện
   */
  {
    path: 'auth/(.*)',
    method: RequestMethod.ALL,
  },

  /*
   * Admin views
   */
  {
    path: 'admin',
    method: RequestMethod.GET,
  },
  {
    path: 'admin/(.*)',
    method: RequestMethod.ALL,
  },

  /*
   * Client views
   */
  {
    path: 'products',
    method: RequestMethod.GET,
  },
  {
    path: 'products/:slug',
    method: RequestMethod.GET,
  },
  {
    path: 'cart',
    method: RequestMethod.GET,
  },
  {
    path: 'cart/(.*)',
    method: RequestMethod.ALL,
  },
  {
    path: 'checkout',
    method: RequestMethod.ALL,
  },
  {
    path: 'orders',
    method: RequestMethod.GET,
  },
  {
    path: 'orders/:id',
    method: RequestMethod.GET,
  },
  {
    path: 'profile',
    method: RequestMethod.ALL,
  },
  {
    path: 'contact',
    method: RequestMethod.ALL,
  },

  /*
   * Error views
   */
  {
    path: 'error/(.*)',
    method: RequestMethod.ALL,
  },

  /*
   * System
   */
  {
    path: 'health',
    method: RequestMethod.GET,
  },
  {
    path: 'favicon.ico',
    method: RequestMethod.GET,
  },
];
