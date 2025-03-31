import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js 中间件
 * 
 * 在请求到达页面或API路由之前执行的中间件，可用于：
 * - 路由保护（验证用户是否已登录）
 * - 重定向处理
 * - 请求修改
 * - 响应修改
 * - 国际化路由处理
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 保护管理员路由
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'ADMIN') {
      const url = new URL('/account/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  // 保护用户专属路由
  if (pathname.startsWith('/account') && pathname !== '/account/login' && pathname !== '/account/register') {
    const token = await getToken({ req: request });
    if (!token) {
      const url = new URL('/account/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}; 