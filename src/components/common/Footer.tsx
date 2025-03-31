import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * 页脚组件
 * 
 * 包含:
 * - 品牌介绍
 * - 商店导航
 * - 客户服务链接
 * - 关于我们链接
 * - 支付方式
 * - 版权信息
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [emailAddress, setEmailAddress] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [tiktokDropdownOpen, setTiktokDropdownOpen] = useState(false);
  const tiktokDropdownRef = useRef<HTMLDivElement>(null);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加订阅逻辑
    console.log('Subscribed:', emailAddress, 'Privacy agreed:', privacyAgreed);
    // 重置表单
    setEmailAddress('');
    setPrivacyAgreed(false);
  };
  
  // 点击外部关闭TikTok下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tiktokDropdownRef.current && !tiktokDropdownRef.current.contains(event.target as Node)) {
        setTiktokDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      {/* 订阅区域 */}
      <section className="py-16 bg-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light tracking-wider uppercase mb-4">JOIN OUR NEWSLETTER</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="max-w-md mx-auto">
            <form className="space-y-4" onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row">
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-t-md sm:rounded-l-md sm:rounded-r-none text-gray-900 focus:outline-none" 
                  placeholder="Your email address" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
                <button 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-b-md sm:rounded-r-md sm:rounded-l-none uppercase tracking-wider font-light"
                  type="submit"
                >
                  Subscribe
                </button>
              </div>
              <div className="flex items-left space-x-2">
                <input 
                  className="h-4 w-4" 
                  type="checkbox" 
                  id="privacy-check"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  required
                />
                <label htmlFor="privacy-check" className="text-sm">
                  I agree to the privacy policy
                </label>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* 主页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* 品牌部分 */}
            <div>
              <h5 className="text-xl font-light tracking-wider uppercase mb-4">PURESSENCE</h5>
              <p className="mb-4 text-gray-300 text-sm">
                Dedicated to bringing you elegant and authentic sterling silver jewelry that elevates your style and captures your essence.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <div className="relative" ref={tiktokDropdownRef}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setTiktokDropdownOpen(!tiktokDropdownOpen);
                    }} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                  <ul className={`absolute left-0 mt-2 py-2 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 ${tiktokDropdownOpen ? '' : 'hidden'}`}>
                    <li><a className="text-gray-400 hover:text-white py-2 px-4 block" href="https://tiktok.com/@singapore" target="_blank" rel="noopener noreferrer">Singapore</a></li>
                    <li><a className="text-gray-400 hover:text-white py-2 px-4 block" href="https://tiktok.com/@malaysia" target="_blank" rel="noopener noreferrer">Malaysia</a></li>
                    <li><a className="text-gray-400 hover:text-white py-2 px-4 block" href="https://tiktok.com/@thailand" target="_blank" rel="noopener noreferrer">Thailand</a></li>
                    <li><a className="text-gray-400 hover:text-white py-2 px-4 block" href="https://tiktok.com/@philippines" target="_blank" rel="noopener noreferrer">Philippines</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 商店链接 */}
            <div>
              <h5 className="text-xl font-light tracking-wider uppercase mb-4">SHOP</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/products?category=rings" className="text-gray-400 hover:text-white transition-colors">
                    Rings
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=necklaces" className="text-gray-400 hover:text-white transition-colors">
                    Necklaces
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=earrings" className="text-gray-400 hover:text-white transition-colors">
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=bracelets" className="text-gray-400 hover:text-white transition-colors">
                    Bracelets
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?sale=true" className="text-gray-400 hover:text-white transition-colors">
                    Sale Items
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* 客户服务链接 */}
            <div>
              <h5 className="text-xl font-light tracking-wider uppercase mb-4">CUSTOMER SERVICE</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* 关于我们 */}
            <div>
              <h5 className="text-xl font-light tracking-wider uppercase mb-4">ABOUT US</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/materials" className="text-gray-400 hover:text-white transition-colors">
                    Our Materials
                  </Link>
                </li>
                <li>
                  <Link href="/jewelry-care" className="text-gray-400 hover:text-white transition-colors">
                    Jewelry Care
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* 支付方式 */}
            <div>
              <h5 className="text-xl font-light tracking-wider uppercase mb-4">PAYMENT METHODS</h5>
              <div className="flex flex-wrap gap-3">
                <div className="text-gray-500 text-2xl" title="Visa"><i className="fab fa-cc-visa"></i></div>
                <div className="text-gray-500 text-2xl" title="Mastercard"><i className="fab fa-cc-mastercard"></i></div>
                <div className="text-gray-500 text-2xl" title="American Express"><i className="fab fa-cc-amex"></i></div>
                <div className="text-gray-500 text-2xl" title="PayPal"><i className="fab fa-cc-paypal"></i></div>
                <div className="text-gray-500 text-2xl" title="Bank Transfer"><i className="fas fa-university"></i></div>
              </div>
            </div>
          </div>
          
          {/* 版权信息 */}
          <div className="mt-10 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">&copy; {currentYear} Puressence. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 