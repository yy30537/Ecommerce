import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * 扩展默认会话类型
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * 扩展默认用户类型
   */
  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * 扩展JWT类型
   */
  interface JWT {
    role?: string;
  }
} 