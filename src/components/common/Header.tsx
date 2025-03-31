import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

/**
 * 页面头部组件
 * 
 * 网站主导航栏，包含：
 * - 网站logo
 * - 主导航菜单
 * - 搜索功能
 * - 用户菜单（登录/注册/账户）
 * - 购物车快速访问
 * - 移动响应式菜单
 */
export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const shopDropdownRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  // 设置激活的导航项
  const isActive = (path: string) => {
    return router.pathname === path ? 'active' : '';
  };

  const isCategoryActive = (category: string) => {
    return router.asPath.includes(`category=${category}`) ? 'active' : '';
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setShowShopDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* 品牌Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-gray-800 text-4xl font-light tracking-wider">
              puressence
            </Link>
          </div>

          {/* 移动设备菜单按钮 */}
          <button
            type="button"
            className="lg:hidden p-2 rounded border border-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* 主导航 - 桌面版 */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className={`text-gray-700 hover:text-gray-900 uppercase text-sm tracking-wider px-2 py-1 ${isActive('/') ? 'font-medium border-b-2 border-gray-800' : ''}`}>
                  Home
                </Link>
              </li>
              <li ref={shopDropdownRef} className="relative">
                <a 
                  className={`text-gray-700 hover:text-gray-900 uppercase text-sm tracking-wider px-2 py-1 cursor-pointer ${router.pathname.includes('/products') ? 'font-medium border-b-2 border-gray-800' : ''}`}
                  onClick={() => setShowShopDropdown(!showShopDropdown)}
                >
                  Shop
                  <i className={`fas fa-chevron-down ml-1 text-xs transition-transform ${showShopDropdown ? 'rotate-180' : ''}`}></i>
                </a>
                {showShopDropdown && (
                  <ul className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <li>
                      <Link href="/products?category=rings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Rings
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=necklaces" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Necklaces
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=bracelets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Bracelets
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=earrings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Earrings
                      </Link>
                    </li>
                    <li className="border-t border-gray-100 my-1"></li>
                    <li>
                      <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        All Products
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/about" className={`text-gray-700 hover:text-gray-900 uppercase text-sm tracking-wider px-2 py-1 ${isActive('/about') ? 'font-medium border-b-2 border-gray-800' : ''}`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-gray-700 hover:text-gray-900 uppercase text-sm tracking-wider px-2 py-1 ${isActive('/contact') ? 'font-medium border-b-2 border-gray-800' : ''}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* 购物车、用户账户和搜索 - 桌面版 */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 relative">
              <i className="fas fa-shopping-cart"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Link href={session ? '/account' : '/account/login'} className="text-gray-700 hover:text-gray-900">
              <i className="fas fa-user"></i>
            </Link>
            
            <form className="flex" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="ml-1 px-2 py-1 border border-gray-300 rounded">
                <i className="fas fa-search text-sm"></i>
              </button>
            </form>
          </div>
        </div>

        {/* 移动设备菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2 border-t border-gray-200 pt-3">
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`block py-2 text-gray-700 hover:text-gray-900 ${isActive('/') ? 'font-medium' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <button
                  className="flex justify-between w-full py-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setShowShopDropdown(!showShopDropdown)}
                >
                  Shop
                  <i className={`fas fa-chevron-down transition-transform ${showShopDropdown ? 'rotate-180' : ''}`}></i>
                </button>
                {showShopDropdown && (
                  <ul className="pl-4 mt-1 space-y-1">
                    <li>
                      <Link href="/products?category=rings" className="block py-1 text-gray-600 hover:text-gray-900">
                        Rings
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=necklaces" className="block py-1 text-gray-600 hover:text-gray-900">
                        Necklaces
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=bracelets" className="block py-1 text-gray-600 hover:text-gray-900">
                        Bracelets
                      </Link>
                    </li>
                    <li>
                      <Link href="/products?category=earrings" className="block py-1 text-gray-600 hover:text-gray-900">
                        Earrings
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="block py-1 text-gray-600 hover:text-gray-900">
                        All Products
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/about" className={`block py-2 text-gray-700 hover:text-gray-900 ${isActive('/about') ? 'font-medium' : ''}`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`block py-2 text-gray-700 hover:text-gray-900 ${isActive('/contact') ? 'font-medium' : ''}`}>
                  Contact
                </Link>
              </li>
            </ul>
            
            <div className="mt-4 flex items-center justify-between">
              <Link href="/cart" className="text-gray-700 hover:text-gray-900 relative">
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              <Link href={session ? '/account' : '/account/login'} className="text-gray-700 hover:text-gray-900">
                <i className="fas fa-user text-lg"></i>
              </Link>
              
              <form className="flex flex-1 ml-4" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ml-1 px-2 py-1 border border-gray-300 rounded">
                  <i className="fas fa-search text-sm"></i>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 