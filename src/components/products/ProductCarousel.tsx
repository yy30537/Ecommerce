import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

type ProductCarouselProps = {
  title: string;
  products: Product[];
  viewAllLink?: string;
};

/**
 * 产品轮播组件 - 一个一个产品轮播
 */
const ProductCarousel = ({ title, products = [], viewAllLink }: ProductCarouselProps) => {
  // 状态
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Refs
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 计算真正的最大索引
  const maxIndex = Math.max(0, products.length - 1);
  
  // 根据屏幕尺寸设置可视数量
  useEffect(() => {
    function updateSlidesPerView() {
      let count = 5; // 默认大屏幕显示5个
      
      if (window.innerWidth < 640) count = 1; // 手机屏幕
      else if (window.innerWidth < 768) count = 2; // 平板竖屏
      else if (window.innerWidth < 1024) count = 3; // 平板横屏
      else if (window.innerWidth < 1280) count = 4; // 小桌面
      
      setSlidesPerView(count);
      
      // 确保当前索引不超过最大值
      if (currentIndex > maxIndex) {
        setCurrentIndex(0);
      }
    }
    
    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [products.length, currentIndex, maxIndex]);
  
  // 自动轮播 - 不再有产品数量限制
  useEffect(() => {
    if (isAutoPlaying && products.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        goToNext();
      }, 3000);
    }
    
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, products.length]);
  
  // 导航函数 - 循环轮播
  const goToNext = () => {
    if (products.length <= 1) return;
    setCurrentIndex(prev => (prev >= maxIndex) ? 0 : prev + 1);
  };
  
  const goToPrev = () => {
    if (products.length <= 1) return;
    setCurrentIndex(prev => (prev <= 0) ? maxIndex : prev - 1);
  };
  
  // 轮播控制
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);
  
  // 没有产品时显示空状态
  if (!products || products.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-light tracking-wider uppercase">{title}</h2>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-gray-700 hover:underline">
                View All
              </Link>
            )}
          </div>
          <div className="text-center py-5">
            <p className="text-gray-600 text-lg">暂无{title}商品</p>
          </div>
        </div>
      </section>
    );
  }
  
  // 计算单个卡片的宽度百分比 - 独立于轮播逻辑
  const cardWidth = 100 / slidesPerView;
  
  // 计算位移百分比 - 根据当前索引
  const translateX = () => {
    // 如果产品数量小于等于显示数量，不需要滚动
    if (products.length <= slidesPerView) return 0;
    
    // 第一页特殊处理，不需要偏移
    if (currentIndex === 0) return 0;
    
    // 计算需要偏移的卡片数量 - 确保循环到开头时正确显示
    if (currentIndex + slidesPerView > products.length) {
      return 0; // 如果已经显示到末尾，回到起点
    }
    
    // 正常偏移一个卡片宽度
    return currentIndex * cardWidth;
  };
  
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 标题行 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-light tracking-wider uppercase">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-gray-700 border border-gray-300 px-3 py-1 text-sm rounded hover:bg-gray-100">
              View All
            </Link>
          )}
        </div>
        
        {/* 主轮播区域 */}
        <div className="relative">
          <div 
            className="overflow-hidden" 
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
          >
            <div 
              ref={trackRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${Math.max(100, cardWidth * products.length)}%`, // 确保宽度至少是100%
                transform: `translateX(-${translateX()}%)`
              }}
            >
              {products.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  style={{ width: `${cardWidth}%`, minWidth: `${cardWidth}%` }} // 添加minWidth确保一致性
                  className="px-2"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* 导航按钮 - 只要有多个产品就显示 */}
          {products.length > 1 && (
            <>
              <button 
                onClick={goToPrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center focus:outline-none z-10"
                aria-label="Previous product"
              >
                <i className="fas fa-chevron-left text-gray-600"></i>
              </button>
              <button 
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center focus:outline-none z-10"
                aria-label="Next product"
              >
                <i className="fas fa-chevron-right text-gray-600"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel; 