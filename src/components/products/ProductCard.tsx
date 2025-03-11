import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getProductImagePath } from '@/lib/formatters';
import { Product } from '@/types/product';

/**
 * 产品卡片组件
 * 
 * 在产品列表页面展示单个产品的卡片，包含：
 * - 产品图片
 * - 产品名称
 * - 产品价格
 * - 促销标签（如有）
 * - 快速操作按钮（加入购物车、加入收藏等）
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.product - 产品数据对象
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative h-full bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="relative overflow-hidden rounded-t-lg">
        {/* 产品图片 */}
        <Link href={`/products/${product.id}`}>
          <div className="relative h-64 w-full">
            <Image 
              src={getProductImagePath(product)}
              alt={product.name}
              className="object-cover rounded-t-lg"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        {/* 折扣标签 - 放在左上角 */}
        {product.onSale && product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
        
        {/* 状态标签 - 放在右上角，基于优先级显示 */}
        <div className="absolute top-3 right-3">
          {product.featured && (
            <span className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-sm shadow-sm">
              BESTSELLER
            </span>
          )}
          
          {!product.featured && product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-sm shadow-sm">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-800 font-medium text-lg">
          <Link href={`/products/${product.id}`} className="hover:text-gray-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-gray-800 font-semibold">{formatPrice(product.price)}</p>
            {product.onSale && product.originalPrice && (
              <p className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
          
          {/* 星级评分 */}
          {/* <div className="flex">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fas fa-${i < Math.floor(product.rating) ? 'star' : i < product.rating ? 'star-half-alt' : 'star'} text-yellow-400 text-sm`}
              ></i>
            ))}
          </div> */}
        </div>
        
        <div className="mt-4 flex justify-between">
          <Link 
            href={`/products/${product.id}`} 
            className="text-sm border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100"
          >
            View Details
          </Link>
          <button className="text-sm bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800">
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 