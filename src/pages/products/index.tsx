import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { prisma } from '@/lib/prisma';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { formatPrice } from '@/lib/formatters';

// 产品类型定义
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  material?: string;
  collection?: string;
};

// 产品列表页面属性类型定义
type ProductsPageProps = {
  products: Product[];
  categories: string[];
  collections: string[];
  materials: string[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  filters: {
    category?: string;
    collection?: string;
    material?: string;
    minPrice?: number;
    maxPrice?: number;
    sale?: boolean;
    sort?: string;
  };
};

export default function ProductsPage({
  products,
  categories,
  collections,
  materials,
  totalProducts,
  currentPage,
  totalPages,
  filters,
}: ProductsPageProps) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 10000,
  });
  const [sortOption, setSortOption] = useState(filters.sort || 'newest');

  // 处理价格范围变化
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // 应用价格筛选
  const applyPriceFilter = () => {
    const query = {
      ...router.query,
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
      page: '1', // 重置到第一页
    };
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理排序变化
  const handleSortChange = (value: string) => {
    setSortOption(value);
    const query = {
      ...router.query,
      sort: value,
      page: '1', // 重置到第一页
    };
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理分类筛选
  const handleCategoryFilter = (category: string) => {
    const query = { ...router.query };
    
    if (query.category === category) {
      delete query.category;
    } else {
      query.category = category;
    }
    
    query.page = '1'; // 重置到第一页
    
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理系列筛选
  const handleCollectionFilter = (collection: string) => {
    const query = { ...router.query };
    
    if (query.collection === collection) {
      delete query.collection;
    } else {
      query.collection = collection;
    }
    
    query.page = '1'; // 重置到第一页
    
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理材质筛选
  const handleMaterialFilter = (material: string) => {
    const query = { ...router.query };
    
    if (query.material === material) {
      delete query.material;
    } else {
      query.material = material;
    }
    
    query.page = '1'; // 重置到第一页
    
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理特价商品筛选
  const handleSaleFilter = () => {
    const query = { ...router.query };
    
    if (query.sale === 'true') {
      delete query.sale;
    } else {
      query.sale = 'true';
    }
    
    query.page = '1'; // 重置到第一页
    
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const query = {
      ...router.query,
      page: page.toString(),
    };
    
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  // 清除所有筛选
  const clearAllFilters = () => {
    router.push({
      pathname: router.pathname,
    });
  };

  // 生成分页按钮
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 添加上一页按钮
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>
      </li>
    );
    
    // 添加第一页按钮和省略号
    if (startPage > 1) {
      pages.push(
        <li key="1" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        pages.push(<li key="ellipsis1" className="page-item disabled"><span className="page-link">...</span></li>);
      }
    }
    
    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }
    
    // 添加最后一页按钮和省略号
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<li key="ellipsis2" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        </li>
      );
    }
    
    // 添加下一页按钮
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </li>
    );
    
    return (
      <nav aria-label="产品分页">
        <ul className="pagination justify-content-center">
          {pages}
        </ul>
      </nav>
    );
  };

  return (
    <>
      <Head>
        <title>产品列表 | puressence</title>
        <meta name="description" content="浏览我们的珠宝系列，包括戒指、项链、耳环等。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* 页面标题 */}
        <section className="page-banner py-4 bg-light">
          <div className="container">
            <h1 className="text-center mb-2">珠宝系列</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><Link href="/">首页</Link></li>
                <li className="breadcrumb-item active" aria-current="page">产品</li>
                {filters.category && (
                  <li className="breadcrumb-item active" aria-current="page">{filters.category}</li>
                )}
              </ol>
            </nav>
          </div>
        </section>

        {/* 产品区域 */}
        <section className="products-area py-5">
          <div className="container">
            <div className="row">
              {/* 筛选侧边栏 */}
              <div className="col-lg-3">
                <div className="filter-sidebar">
                  <div className="filter-header d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">筛选</h4>
                    <button 
                      className="btn btn-sm btn-outline-secondary" 
                      onClick={clearAllFilters}
                    >
                      清除全部
                    </button>
                  </div>

                  {/* 分类筛选 */}
                  <div className="filter-section mb-4">
                    <h5 className="filter-title">分类</h5>
                    <div className="filter-options">
                      {categories.map((category) => (
                        <div className="form-check" key={category}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${category}`}
                            checked={filters.category === category}
                            onChange={() => handleCategoryFilter(category)}
                          />
                          <label className="form-check-label" htmlFor={`category-${category}`}>
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 系列筛选 */}
                  <div className="filter-section mb-4">
                    <h5 className="filter-title">系列</h5>
                    <div className="filter-options">
                      {collections.map((collection) => (
                        <div className="form-check" key={collection}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`collection-${collection}`}
                            checked={filters.collection === collection}
                            onChange={() => handleCollectionFilter(collection)}
                          />
                          <label className="form-check-label" htmlFor={`collection-${collection}`}>
                            {collection}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 价格范围筛选 */}
                  <div className="filter-section mb-4">
                    <h5 className="filter-title">价格范围</h5>
                    <div className="price-range">
                      <div className="input-group mb-2">
                        <span className="input-group-text">¥</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="最低"
                          value={priceRange.min}
                          onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                        />
                      </div>
                      <div className="input-group mb-2">
                        <span className="input-group-text">¥</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="最高"
                          value={priceRange.max}
                          onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                        />
                      </div>
                      <button 
                        className="btn btn-sm btn-primary w-100" 
                        onClick={applyPriceFilter}
                      >
                        应用
                      </button>
                    </div>
                  </div>

                  {/* 材质筛选 */}
                  <div className="filter-section mb-4">
                    <h5 className="filter-title">材质</h5>
                    <div className="filter-options">
                      {materials.map((material) => (
                        <div className="form-check" key={material}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`material-${material}`}
                            checked={filters.material === material}
                            onChange={() => handleMaterialFilter(material)}
                          />
                          <label className="form-check-label" htmlFor={`material-${material}`}>
                            {material}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 特价商品筛选 */}
                  <div className="filter-section mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sale-items"
                        checked={filters.sale === true}
                        onChange={handleSaleFilter}
                      />
                      <label className="form-check-label" htmlFor="sale-items">
                        特价商品
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 产品列表 */}
              <div className="col-lg-9">
                {/* 排序和结果计数 */}
                <div className="products-header d-flex justify-content-between align-items-center mb-4">
                  <div className="results-count">
                    显示 <strong>{totalProducts}</strong> 个结果
                    {Object.keys(filters).length > 0 && ' (已筛选)'}
                  </div>
                  <div className="sort-options">
                    <select 
                      className="form-select" 
                      value={sortOption} 
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="newest">最新上架</option>
                      <option value="price_asc">价格: 从低到高</option>
                      <option value="price_desc">价格: 从高到低</option>
                      <option value="rating_desc">评分: 从高到低</option>
                    </select>
                  </div>
                </div>

                {/* 产品网格 */}
                <div className="row">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="col-md-4 mb-4">
                        <div className="card product-card h-100">
                          <div className="product-image-wrapper">
                            {product.collection === '新品' && <div className="new-tag">新品</div>}
                            {filters.sale && <div className="sale-tag">特价</div>}
                            <Image
                              src={product.images[0] || '/images/product-placeholder.jpg'}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="card-img-top product-image"
                            />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text price">{formatPrice(product.price)}</p>
                            <div className="rating mb-2">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < product.rating ? 'text-warning' : 'text-muted'}`}
                                ></i>
                              ))}
                            </div>
                            <div className="d-flex justify-content-between">
                              <Link href={`/products/${product.id}`} className="btn btn-outline-primary btn-sm">
                                查看详情
                              </Link>
                              <button className="btn btn-primary btn-sm">
                                加入购物车
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <div className="empty-results">
                        <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                        <h3>未找到产品</h3>
                        <p className="text-muted">尝试调整筛选条件或清除筛选。</p>
                        <button 
                          className="btn btn-outline-primary mt-2" 
                          onClick={clearAllFilters}
                        >
                          清除所有筛选
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="pagination-container mt-4">
                    {renderPagination()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 解析查询参数
  const page = Number(query.page) || 1;
  const limit = 12; // 每页显示的产品数量
  const skip = (page - 1) * limit;
  
  const category = query.category as string | undefined;
  const collection = query.collection as string | undefined;
  const material = query.material as string | undefined;
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const sale = query.sale === 'true';
  const sort = query.sort as string | undefined;

  // 构建查询条件
  const where: any = {};
  
  if (category) {
    where.category = category;
  }
  
  if (collection) {
    where.collection = collection;
  }
  
  if (material) {
    where.material = material;
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }
  
  if (sale) {
    where.onSale = true;
  }

  // 构建排序条件
  let orderBy: any = { createdAt: 'desc' }; // 默认按创建时间降序
  
  if (sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'rating_desc') {
    orderBy = { rating: 'desc' };
  }

  try {
    // 获取产品总数
    const totalProducts = await prisma.product.count({ where });
    
    // 计算总页数
    const totalPages = Math.ceil(totalProducts / limit);
    
    // 获取产品列表
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
      },
    });
    
    // 获取所有分类
    const categoriesResult = await prisma.product.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
    });
    const categories = categoriesResult.map(item => item.category);
    
    // 获取所有系列
    const collectionsResult = await prisma.product.findMany({
      distinct: ['collection'],
      select: {
        collection: true,
      },
      where: {
        collection: {
          not: null,
        },
      },
    });
    const collections = collectionsResult
      .map(item => item.collection)
      .filter((collection): collection is string => collection !== null);
    
    // 获取所有材质
    const materialsResult = await prisma.product.findMany({
      distinct: ['material'],
      select: {
        material: true,
      },
      where: {
        material: {
          not: null,
        },
      },
    });
    const materials = materialsResult
      .map(item => item.material)
      .filter((material): material is string => material !== null);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories,
        collections,
        materials,
        totalProducts,
        currentPage: page,
        totalPages,
        filters: {
          category,
          collection,
          material,
          minPrice,
          maxPrice,
          sale,
          sort: sort || 'newest',
        },
      },
    };
  } catch (error) {
    console.error('获取产品列表失败:', error);
    
    // 返回空数据，避免构建失败
    return {
      props: {
        products: [],
        categories: [],
        collections: [],
        materials: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 0,
        filters: {},
      },
    };
  }
} 