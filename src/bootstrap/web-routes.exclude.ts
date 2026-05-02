import { RequestMethod } from '@nestjs/common';

export const WEB_ROUTE_EXCLUDES = [
  /*
   * Home view
   */
  {
    path: '/',
    method: RequestMethod.GET,
  },

  /*
   * Auth views
   * Các route dưới đây phục vụ render giao diện.
   *
   * Lưu ý:
   * - Không exclude path 'auth/(.*)' ở đây.
   * - Auth API sẽ đi qua global prefix /api.
   *
   * Ví dụ:
   * - GET  /login              => render giao diện đăng nhập
   * - POST /login              => xử lý form đăng nhập nếu WebModule còn dùng
   * - POST /api/auth/login     => API đăng nhập chính
   */
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
    path: 'san-pham',
    method: RequestMethod.GET,
  },
  {
    path: 'san-pham/:slug',
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
  {
    path: '403',
    method: RequestMethod.GET,
  },
  {
    path: '404',
    method: RequestMethod.GET,
  },
  {
    path: '500',
    method: RequestMethod.GET,
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
