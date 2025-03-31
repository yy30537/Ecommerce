import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Product, ProductsResponse } from '@/types/product';

/**
 * 产品 API 路由处理函数
 * 
 * 支持以下查询参数:
 * - page: 页码 (默认为 1)
 * - limit: 每页项目数 (默认为 12)
 * - category: 按类别筛选
 * - material: 按材质筛选
 * - collection: 按系列筛选
 * - minPrice/maxPrice: 价格范围筛选
 * - featured: 是否精选商品
 * - isNew: 是否新品
 * - onSale: 是否促销
 * - sort: 排序方式
 * - search: 搜索关键词
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 解析查询参数
    const {
      page = '1',
      limit = '12',
      category,
      material,
      collection,
      minPrice,
      maxPrice,
      featured,
      isNew,
      onSale,
      sort = 'newest',
      search,
    } = req.query;

    // 构建查询条件
    const where: any = {};
    
    if (category) where.category = category;
    if (material) where.material = material;
    if (collection) where.collection = collection;
    
    // 价格范围筛选
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    
    // 其他布尔条件
    if (featured === 'true') where.featured = true;
    if (isNew === 'true') where.isNew = true;
    if (onSale === 'true') where.onSale = true;
    
    // 搜索功能
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    // 确定排序方式
    let orderBy: any = { createdAt: 'desc' }; // 默认按创建时间降序（最新）
    
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'name_desc') orderBy = { name: 'desc' };
    if (sort === 'popular') orderBy = { rating: 'desc' };
    
    // 计算分页
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // 获取产品总数
    const totalCount = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalCount / limitNum);
    
    // 获取产品数据
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        category: true,
        rating: true,
        material: true,
        collection: true,
        onSale: true,
        featured: true,
        isNew: true,
      },
    });
    
    // 返回结果
    res.status(200).json({
      products: products as Product[],
      totalCount,
      currentPage: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
} 