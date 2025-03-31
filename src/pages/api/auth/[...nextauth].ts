import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * NextAuth.js 配置
 * 
 * 这个文件配置了身份验证系统，包括：
 * - 身份验证提供者（例如凭证、OAuth等）
 * - 会话管理
 * - 回调函数
 * - 权限控制
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // 在这里实现凭证验证逻辑
      name: 'Credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 查找用户
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // 如果用户不存在或密码不匹配
          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role
          };
        } catch (error) {
          console.error('授权错误:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/account/login',
    // 可以自定义其他页面路径
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions); 