import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

/**
 * 自定义App组件
 * 
 * 这是Next.js应用的入口点，用于：
 * - 包装全局状态管理（Context Providers）
 * - 应用全局样式
 * - 集成身份验证系统
 * - 添加全局布局组件
 */
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      {/* 这里可以添加全局布局组件 */}
      <Component {...pageProps} />
    </SessionProvider>
  );
} 