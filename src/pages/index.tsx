import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatPrice } from '@/lib/formatters';
import ProductCarousel from '@/components/products/ProductCarousel';
import { Product, ProductWithFlags } from '@/types/product';
import { useEffect } from 'react';

/**
 * 首页组件
 * 
 * 网站的主页，包含：
 * - 顶部横幅
 * - 精选产品展示
 * - 品类导航
 * - 促销信息
 * - 品牌故事简介
 */

// 首页属性类型定义
type HomeProps = {
  featuredProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
};

// 板块常量定义，用于统一管理
const SECTIONS = {
  BESTSELLERS: {
    title: "BESTSELLERS",
    viewAllLink: "/products?featured=true"
  },
  HOT_DEALS: {
    title: "HOT DEALS",
    viewAllLink: "/products?sale=true"
  },
  NEW_ARRIVALS: {
    title: "NEW ARRIVALS",
    viewAllLink: "/products?new=true"
  }
};

export default function Home({ featuredProducts, newArrivals, onSaleProducts }: HomeProps) {
  
  // 更详细的调试产品数据
  useEffect(() => {
    // 打印数据结构
    console.log('=== 首页产品数据调试 ===');
    console.log('精选产品数量:', featuredProducts?.length || 0);
    console.log('新品数量:', newArrivals?.length || 0);
    console.log('促销产品数量:', onSaleProducts?.length || 0);

    // 检查产品数据：每类产品打印前两个产品的详细信息
    const debugProduct = (product: any, category: string) => {
      console.log(`${category} 产品详情:`, product);
      console.log(`- ID:`, product.id);
      console.log(`- 名称:`, product.name);
      console.log(`- 图片:`, product.images);
      // 检查图片数组的格式
      if (product.images) {
        console.log(`- 图片类型:`, typeof product.images);
        console.log(`- 是否数组:`, Array.isArray(product.images));
        if (Array.isArray(product.images) && product.images.length > 0) {
          console.log(`- 第一张图片路径:`, product.images[0]);
          console.log(`- 图片路径类型:`, typeof product.images[0]);
        }
      }
    };
    
    // 打印每个板块的前两个产品
    if (featuredProducts && featuredProducts.length > 0) {
      console.log('===== BESTSELLERS 板块产品 =====');
      debugProduct(featuredProducts[0], 'BESTSELLERS #1');
      if (featuredProducts.length > 1) {
        debugProduct(featuredProducts[1], 'BESTSELLERS #2');
      }
    }
    
    if (onSaleProducts && onSaleProducts.length > 0) {
      console.log('===== HOT DEALS 板块产品 =====');
      debugProduct(onSaleProducts[0], 'HOT DEALS #1');
      if (onSaleProducts.length > 1) {
        debugProduct(onSaleProducts[1], 'HOT DEALS #2');
      }
    }
    
    if (newArrivals && newArrivals.length > 0) {
      console.log('===== NEW ARRIVALS 板块产品 =====');
      debugProduct(newArrivals[0], 'NEW ARRIVALS #1');
      if (newArrivals.length > 1) {
        debugProduct(newArrivals[1], 'NEW ARRIVALS #2');
      }
    }
  }, [featuredProducts, newArrivals, onSaleProducts]);
  
  return (
    <>
      <Head>
        <title>Puressence Silver Jewelry</title>
        <meta name="description" content="Discover our curated collection of 925 sterling silver pieces that blend timeless elegance with contemporary design." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center lg:space-x-16">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-light tracking-wider leading-tight mb-4">AUTHENTIC STERLING <br />SILVER JEWELRY</h1>
                <p className="text-xl text-gray-600 mb-6">Discover our curated collection of 925 sterling silver pieces that blend timeless elegance with contemporary design.</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/products" className="border border-gray-300 text-gray-700 px-6 py-3 transition hover:bg-gray-100">
                    SHOP COLLECTION
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <Image 
                    src="/images/hero-jewelry.webp" 
                    alt="Sterling Silver Jewelry" 
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white p-4 shadow-sm rounded-r-md">
                    <p className="uppercase mb-0 text-xs">NEW COLLECTION</p>
                    <h5 className="mb-0 text-lg">Spring 2023</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 产品轮播 - 三个板块统一结构 */}
        {/* Bestsellers */}
        <ProductCarousel 
          title={SECTIONS.BESTSELLERS.title}
          products={featuredProducts} 
          viewAllLink={SECTIONS.BESTSELLERS.viewAllLink}
        />

        {/* Hot Deals */}
        <ProductCarousel 
          title={SECTIONS.HOT_DEALS.title}
          products={onSaleProducts} 
          viewAllLink={SECTIONS.HOT_DEALS.viewAllLink}
        />

        {/* New Arrivals - 移除了外层的section标签 */}
        <ProductCarousel 
          title={SECTIONS.NEW_ARRIVALS.title}
          products={newArrivals} 
          viewAllLink={SECTIONS.NEW_ARRIVALS.viewAllLink}
        />

        {/* Shop By Category */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-light tracking-wider uppercase text-center mb-8">SHOP BY CATEGORY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Link href="/products?category=rings" className="block group">
                  <div className="relative overflow-hidden rounded-lg shadow-sm mb-3">
                    <div className="h-48 relative">
                      <Image 
                        src="/images/ring.jpg" 
                        alt="Rings" 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="text-center text-gray-800 font-medium uppercase tracking-wider">RINGS</div>
                </Link>
              </div>
              <div>
                <Link href="/products?category=necklaces" className="block group">
                  <div className="relative overflow-hidden rounded-lg shadow-sm mb-3">
                    <div className="h-48 relative">
                      <Image 
                        src="/images/necklace.jpg" 
                        alt="Necklaces" 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="text-center text-gray-800 font-medium uppercase tracking-wider">NECKLACES</div>
                </Link>
              </div>
              <div>
                <Link href="/products?category=earrings" className="block group">
                  <div className="relative overflow-hidden rounded-lg shadow-sm mb-3">
                    <div className="h-48 relative">
                      <Image 
                        src="/images/earrings.jpg" 
                        alt="Earrings" 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="text-center text-gray-800 font-medium uppercase tracking-wider">EARRINGS</div>
                </Link>
              </div>
              <div>
                <Link href="/products?category=bracelets" className="block group">
                  <div className="relative overflow-hidden rounded-lg shadow-sm mb-3">
                    <div className="h-48 relative">
                      <Image 
                        src="/images/bracelet.jpg" 
                        alt="Bracelets" 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="text-center text-gray-800 font-medium uppercase tracking-wider">BRACELETS</div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-8 lg:mb-0 flex justify-center">
                <Image 
                  src="/images/about-us.webp" 
                  alt="Our Story" 
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12">
                <h2 className="text-2xl font-light tracking-wider uppercase mb-4">Our Story</h2>
                <p className="text-xl text-gray-600 mb-4">Crafting timeless silver jewelry since 2015</p>
                <p className="mb-4 text-gray-700">At Puressence, we believe that jewelry should be more than just an accessory – it should be an extension of your personal style and a reflection of your unique essence.</p>
                <p className="mb-4 text-gray-700">Each piece in our collection is meticulously crafted using only the finest 925 sterling silver, ensuring both beauty and longevity. Our designs blend timeless elegance with contemporary aesthetics, creating pieces that transcend trends and become cherished parts of your jewelry collection.</p>
                <Link href="/about" className="inline-block border border-gray-300 text-gray-700 px-6 py-2 transition hover:bg-gray-100 tracking-wider">
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    console.log('开始执行首页数据查询...');
    
    // 获取所有产品的计数
    const totalCount = await prisma.product.count();
    const featuredCount = await prisma.product.count({ where: { featured: true } });
    const isNewCount = await prisma.product.count({ where: { isNew: true } });
    const onSaleCount = await prisma.product.count({ where: { onSale: true } });
    
    console.log('产品统计:', {
      total: totalCount,
      featured: featuredCount,
      isNew: isNewCount,
      onSale: onSaleCount
    });
    
    // 如果没有产品，以空数组返回
    if (totalCount === 0) {
      console.log('警告: 数据库中没有产品数据');
      return {
        props: {
          featuredProducts: [],
          newArrivals: [],
          onSaleProducts: [],
        }
      };
    }
    
    // 按照优先级逻辑查询产品
    const [featured, newProducts, saleProducts] = await Promise.all([
      // 获取精选产品（featured = true，最高优先级）
      prisma.product.findMany({
        where: { 
          featured: true 
        },
        orderBy: {
          name: 'asc'
        }
      }),
      
      // 获取新品（featured = false, isNew = true，第二优先级）
      prisma.product.findMany({
        where: { 
          featured: false, 
          isNew: true 
        },
        orderBy: {
          name: 'asc'
        }
      }),
      
      // 获取促销产品（featured = false, isNew = false, onSale = true，第三优先级）
      prisma.product.findMany({
        where: { 
          featured: false, 
          isNew: false, 
          onSale: true 
        },
        orderBy: {
          price: 'asc'
        }
      }),
    ]);
    
    console.log(`优先级查询结果: ${featured.length} 个精选, ${newProducts.length} 个新品, ${saleProducts.length} 个促销`);
    
    // 如果有产品数据，打印第一个查询到的产品的图片信息
    if (featured.length > 0) {
      console.log('数据示例 - 图片路径:', featured[0].images);
    }
    
    // 返回找到的产品，使用 JSON.stringify 和 JSON.parse 确保序列化正确
    return { 
      props: {
        featuredProducts: JSON.parse(JSON.stringify(featured)),
        newArrivals: JSON.parse(JSON.stringify(newProducts)),
        onSaleProducts: JSON.parse(JSON.stringify(saleProducts)),
      }
    };
  } catch (error) {
    console.error('获取首页数据失败:', error);
    
    // 出错时返回空数据，避免构建失败
    return {
      props: {
        featuredProducts: [],
        newArrivals: [],
        onSaleProducts: [],
      },
    };
  }
} 