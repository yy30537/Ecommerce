import { PrismaClient } from '@prisma/client';

/**
 * Prisma客户端实例
 * 
 * 为应用提供数据库访问能力，确保在整个应用中只使用单个Prisma实例
 */

// 声明一个全局变量prisma以避免在开发过程中创建多个PrismaClient实例
// 这是一个常见的Next.js + Prisma最佳实践
declare global {
  var prisma: PrismaClient | undefined;
}

// 为了确保连接可靠，添加更多配置选项
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

// 导出prisma实例以在整个应用程序中使用
export const prisma = global.prisma || prismaClientSingleton();

// 防止在开发环境中创建多个实例
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// 确保在应用关闭前断开连接
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 