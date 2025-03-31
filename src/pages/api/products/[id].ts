import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';

/**
 * 单个产品 API 路由处理函数
 * 
 * 处理单个产品相关的 API 请求：
 * - GET: 获取单个产品详情
 * - PUT: 更新产品信息
 * - DELETE: 删除产品
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { error: string }>
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  try {
    switch (req.method) {
      case 'GET': {
        // 获取单个产品详情
        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        return res.status(200).json(product as unknown as Product);
      }
      
      // 仅管理员可以执行的操作
      case 'PUT': {
        // TODO: 添加身份验证和授权检查
        
        const { name, description, price, category, material, collection, featured, isNew, onSale, stock, images } = req.body;
        
        // 验证必要字段
        if (!name || !description || price === undefined || !category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // 更新产品
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name,
            description,
            price: typeof price === 'string' ? parseFloat(price) : price,
            category,
            material,
            collection,
            featured: featured === 'true' || featured === true,
            isNew: isNew === 'true' || isNew === true,
            onSale: onSale === 'true' || onSale === true,
            stock: typeof stock === 'string' ? parseInt(stock, 10) : stock,
            images: images ? Array.isArray(images) ? images : [images] : undefined,
            updatedAt: new Date(),
          },
        });
        
        return res.status(200).json(updatedProduct as unknown as Product);
      }
      
      case 'DELETE': {
        // TODO: 添加身份验证和授权检查
        
        // 删除产品
        await prisma.product.delete({
          where: { id },
        });
        
        return res.status(200).json({ error: 'Product deleted successfully' });
      }
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling product request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 