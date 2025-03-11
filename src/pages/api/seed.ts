import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// 示例产品数据 - 用于开发，包含原价信息
const sampleProducts = [
  // BESTSELLERS 产品
  {
    name: 'Rose Gold Minimalist Ring',
    description: 'Elegant and simple rose gold ring, perfect for everyday wear.',
    price: 79.99,
    originalPrice: 79.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Rose Gold',
    featured: true,
    isNew: false,
    onSale: false,
    rating: 4.5,
    stock: 100
  },
  {
    name: 'Men\'s Signet Ring',
    description: 'Classic signet ring for men, made with sterling silver.',
    price: 129.99,
    originalPrice: 129.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Silver',
    featured: true,
    isNew: false,
    onSale: false,
    rating: 4.7,
    stock: 50
  },
  {
    name: 'Solitaire Engagement Ring',
    description: 'Beautiful solitaire engagement ring with cubic zirconia.',
    price: 149.99,
    originalPrice: 149.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Silver',
    featured: true,
    isNew: false,
    onSale: false,
    rating: 4.9,
    stock: 30
  },
  {
    name: '925 Silver Minimalist Bracelet',
    description: 'Delicate sterling silver bracelet with minimalist design.',
    price: 89.99,
    originalPrice: 89.99,
    images: ['/images/bracelet.jpg'],
    category: 'Bracelets',
    material: 'Silver',
    featured: true,
    isNew: false,
    onSale: false,
    rating: 4.6,
    stock: 75
  },
  
  // HOT DEALS 产品 - 包含原价和折扣价
  {
    name: '18K Gold Diamond Ring',
    description: 'Luxurious 18K gold ring with real diamond accent.',
    price: 599.99,
    originalPrice: 799.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Gold',
    featured: false,
    isNew: false,
    onSale: true,
    rating: 4.8,
    stock: 15
  },
  {
    name: 'Silver Twisted Band Ring',
    description: 'Unique twisted band design in sterling silver.',
    price: 49.99,
    originalPrice: 69.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Silver',
    featured: false,
    isNew: false,
    onSale: true,
    rating: 4.5,
    stock: 40
  },
  {
    name: 'Rose Gold Minimalist Ring',
    description: 'Simple and elegant rose gold ring at a special price.',
    price: 59.99,
    originalPrice: 79.99,
    images: ['/images/ring.jpg'],
    category: 'Rings',
    material: 'Rose Gold',
    featured: false,
    isNew: false,
    onSale: true,
    rating: 4.7,
    stock: 25
  },
  {
    name: 'Rose Gold Hoop Earrings',
    description: 'Classic rose gold hoop earrings, perfect for any occasion.',
    price: 39.99,
    originalPrice: 59.99,
    images: ['/images/earrings.jpg'],
    category: 'Earrings',
    material: 'Rose Gold',
    featured: false,
    isNew: false,
    onSale: true,
    rating: 4.6,
    stock: 35
  },
  
  // NEW ARRIVALS 产品
  {
    name: 'Elegant Freshwater Pearl Necklace',
    description: 'Beautiful freshwater pearl necklace with sterling silver chain.',
    price: 129.99,
    originalPrice: 129.99,
    images: ['/images/necklace.jpg'],
    category: 'Necklaces',
    material: 'Silver, Pearl',
    featured: false,
    isNew: true,
    onSale: false,
    rating: 4.4,
    stock: 20
  },
  {
    name: '925 Silver CZ Hook Earrings',
    description: 'Stylish sterling silver earrings with cubic zirconia stones.',
    price: 69.99,
    originalPrice: 69.99,
    images: ['/images/earrings.jpg'],
    category: 'Earrings',
    material: 'Silver',
    featured: false,
    isNew: true,
    onSale: false,
    rating: 4.5,
    stock: 45
  },
  {
    name: '925 Silver Chain Bracelet',
    description: 'Sleek and modern sterling silver chain bracelet.',
    price: 79.99,
    originalPrice: 79.99,
    images: ['/images/bracelet.jpg'],
    category: 'Bracelets',
    material: 'Silver',
    featured: false,
    isNew: true,
    onSale: false,
    rating: 4.3,
    stock: 30
  },
  {
    name: 'Minimalist Silver Stud Earrings',
    description: 'Simple yet elegant sterling silver stud earrings.',
    price: 45.99,
    originalPrice: 65.99,
    images: ['/images/earrings.jpg'],
    category: 'Earrings',
    material: 'Silver',
    featured: false,
    isNew: true,
    onSale: true, // 新品同时打折
    rating: 4.4,
    stock: 60
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 只允许POST请求，以防止意外触发
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // 清空现有产品（谨慎使用！）
    await prisma.product.deleteMany({});
    
    // 插入示例产品
    const createdProducts = await Promise.all(
      sampleProducts.map(product => prisma.product.create({
        data: product
      }))
    );
    
    return res.status(200).json({
      message: `成功创建 ${createdProducts.length} 个产品`,
      products: createdProducts
    });
  } catch (error) {
    console.error('种子数据创建失败:', error);
    return res.status(500).json({
      message: '种子数据创建失败',
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 