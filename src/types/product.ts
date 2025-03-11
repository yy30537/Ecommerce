/**
 * 产品相关类型定义
 */

/**
 * 基础产品类型
 */
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
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

/**
 * 带有标志的产品类型（用于内部数据处理）
 */
export type ProductWithFlags = Product & { 
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
};

/**
 * 产品过滤条件
 */
export type ProductFilters = {
  category?: string;
  material?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
};

/**
 * 产品排序选项
 */
export type ProductSortOption = 
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest'
  | 'popular';

/**
 * 产品查询响应
 */
export type ProductsResponse = {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters?: ProductFilters;
}; 