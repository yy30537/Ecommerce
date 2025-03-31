import useSWR from 'swr';
import { Product, ProductFilters, ProductsResponse, ProductSortOption } from '@/types/product';

type UseProductsParams = {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: ProductSortOption;
  search?: string;
};

/**
 * 产品列表钩子
 * 
 * 获取并管理产品列表数据，支持分页、筛选、排序和搜索
 */
export function useProducts({
  page = 1,
  limit = 12,
  filters,
  sort = 'newest',
  search,
}: UseProductsParams = {}) {
  // 构建 API URL 和参数
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (sort) params.append('sort', sort);
  if (search) params.append('search', search);
  
  // 添加筛选条件到参数
  if (filters) {
    if (filters.category) params.append('category', filters.category);
    if (filters.material) params.append('material', filters.material);
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.featured) params.append('featured', 'true');
    if (filters.isNew) params.append('isNew', 'true');
    if (filters.onSale) params.append('onSale', 'true');
  }
  
  const url = `/api/products?${params.toString()}`;
  
  // 使用 SWR 获取数据
  const { data, error, mutate, isLoading, isValidating } = useSWR<ProductsResponse>(
    url,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    }
  );
  
  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || page,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

/**
 * 单个产品详情钩子
 * 
 * 获取单个产品的详细信息
 */
export function useProduct(productId: string | undefined) {
  const { data, error, mutate, isLoading } = useSWR<Product>(
    productId ? `/api/products/${productId}` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      return res.json();
    }
  );
  
  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
} 