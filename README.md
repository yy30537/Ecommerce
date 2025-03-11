# 珠宝电商网站

基于Next.js、PostgreSQL/Prisma和Bootstrap的全栈电商平台，专为珠宝产品展示和销售设计。

## 技术栈

- **前端框架**：Next.js 14 (React框架，支持SSR)
- **样式处理**：Bootstrap 5
- **数据库**：PostgreSQL
- **ORM工具**：Prisma
- **认证系统**：NextAuth.js
- **数据获取**：SWR
- **类型检查**：TypeScript

## 主要特性

- 响应式设计，适配所有设备尺寸
- 高性能产品展示，支持轮播和图片优化
- 用户账户管理和订单追踪
- 产品分类浏览和筛选
- 优化的SEO性能
- 强类型约束的API

## 项目结构

```
Ecommerce/
│
├── public/                      # 静态资源
│   ├── images/                  # 产品图片和网站图形
│   │   ├── ring.jpg             # 首饰类型示例图片
│   │   ├── necklace.jpg         # 首饰类型示例图片
│   │   ├── earrings.jpg         # 首饰类型示例图片
│   │   ├── bracelet.jpg         # 首饰类型示例图片
│   │   ├── hero-jewelry.jpg     # 首页横幅图
│   │   └── about-us.jpg         # 关于我们图片
│   └── favicon.ico              # 网站图标
│
├── src/                         # 应用源代码
│   ├── components/              # 可复用UI组件
│   │   ├── common/              # 通用组件
│   │   │   ├── Header.tsx       # 网站头部导航
│   │   │   └── Footer.tsx       # 网站底部
│   │   │
│   │   ├── home/                # 首页特定组件
│   │   │
│   │   ├── products/            # 产品相关组件
│   │   │   ├── ProductCard.tsx  # 产品卡片组件
│   │   │   └── ProductCarousel.tsx # 产品轮播组件
│   │   │
│   │   └── ui/                  # 基础UI组件
│   │       ├── Button.tsx       # 按钮组件
│   │       └── Badge.tsx        # 徽章组件
│   │
│   ├── pages/                   # Next.js页面（路由）
│   │   ├── _app.tsx             # 自定义App组件
│   │   ├── index.tsx            # 首页
│   │   ├── products/            # 产品页面
│   │   │   ├── index.tsx        # 产品列表页
│   │   │   └── [id].tsx         # 产品详情页
│   │   └── api/                 # API路由（后端功能）
│   │       ├── auth/            # 认证相关API
│   │       └── products/        # 产品相关API
│   │           ├── index.ts     # 产品列表API
│   │           └── [id].ts      # 单个产品API
│   │
│   ├── types/                   # 类型定义
│   │   └── product.ts           # 产品相关类型
│   │
│   ├── lib/                     # 工具库和函数
│   │   ├── prisma.ts            # Prisma客户端实例
│   │   └── formatters.ts        # 格式化工具函数
│   │
│   ├── hooks/                   # 自定义React钩子
│   │   └── useProducts.ts       # 产品数据获取钩子
│   │
│   └── styles/                  # 样式文件
│       └── globals.css          # 全局CSS样式
│
├── prisma/                      # Prisma ORM配置
│   ├── schema.prisma            # 数据库模式定义
│   ├── migrations/              # 数据库迁移
│   └── seed.ts                  # 数据库种子脚本
│
├── scripts/                     # 实用脚本
│   └── products-manager.ts      # 产品管理脚本
│
├── middleware.ts                # Next.js中间件
├── .env                         # 环境变量（不提交到版本控制）
├── .env.example                 # 环境变量模板示例
├── .gitignore                   # Git忽略文件
├── .eslintrc.json               # ESLint配置
├── tailwind.config.js           # Tailwind CSS配置
├── postcss.config.js            # PostCSS配置
├── next.config.js               # Next.js配置
├── tsconfig.json                # TypeScript配置
├── package.json                 # 项目依赖和脚本
└── README.md                    # 项目文档
```

## 数据模型

### 产品 (Product)

```typescript
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  onSale?: boolean;
  material?: string;
  collection?: string;
  stock?: number;
  featured?: boolean;
  isNew?: boolean;
};
```

## 开发指南

### 安装

```bash
# 克隆项目
git clone [项目URL]
cd Ecommerce

# 安装依赖
npm install

# 复制环境变量模板并配置
cp .env.example .env
```

### 数据库设置

```bash
# 创建并应用迁移
npx prisma migrate dev

# 生成Prisma客户端
npx prisma generate

# 填充开发数据
npx prisma db seed
```

### 运行开发服务器

```bash
npm run dev
```

开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

### 产品管理

项目提供了一个产品管理脚本，可以用于批量添加、标记产品：

```bash
# 添加样本产品
npm run manage-products add

# 标记产品（精选、新品、促销）
npm run manage-products tag

# 执行完整操作
npm run manage-products all
```

### 构建生产版本

```bash
npm run build
npm run start
```

## 故障排除

### 产品不显示

如果主页产品不显示，可尝试以下解决方案：

1. **重置数据库并重新添加产品**
   ```bash
   npx prisma migrate reset --force
   ```

2. **刷新浏览器缓存**
   使用 Ctrl+F5 强制刷新页面

3. **检查产品标记**
   确保数据库中有产品被标记为"featured"、"isNew"或"onSale"
   ```bash
   npx prisma studio
   ```

4. **重启开发服务器**
   ```bash
   npm run dev
   ```

### 轮播组件问题

如果产品轮播组件有渲染问题：

1. **检查浏览器控制台错误**
2. **清除浏览器缓存**
3. **确保所有CSS加载正确**

## 贡献

请参阅[贡献指南](CONTRIBUTING.md)了解如何为项目做出贡献。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
