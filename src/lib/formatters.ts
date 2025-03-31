/**
 * Price formatter function
 * Formats a number as a currency string
 * Example: 1234.56 -> $1,234.56
 * 
 * @param price - Price value
 * @param locale - Locale settings, default English
 * @param currency - Currency code, default USD
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | string | null | undefined,
  locale = 'en-US',
  currency = 'USD'
): string {
  // Handle null or undefined values
  if (price === null || price === undefined) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(0);
  }

  // Convert string to number if needed
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(numericPrice);
}

/**
 * Date formatter function
 * 
 * @param date - Date to format
 * @param locale - Locale settings, default English
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Order status formatter function
 *
 * @param status - Order status
 * @returns Formatted status text
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
    'completed': 'Completed'
  };

  return statusMap[status.toLowerCase()] || status;
}

/**
 * Truncate text
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + '...';
}

/**
 * Format phone number
 *
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // International format
  const pattern = /^(\d{1,3})(\d{3})(\d{3})(\d{4})$/;
  return phone.replace(pattern, '+$1 $2 $3 $4');
}

/**
 * Format number with thousand separators
 * Example: 1234 -> 1,234
 * 
 * @param number - Number to format
 * @param locale - Locale settings, default English
 * @returns Formatted number string
 */
export function formatNumber(number: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * 处理产品图片路径
 * 确保图片路径格式正确，并提供默认图片
 * 
 * @param product - 产品对象
 * @returns 处理后的图片路径
 */
export function getProductImagePath(product: any): string {
  // 检查控制台日志
  console.log('处理图片:', product?.id, product?.name);
  console.log('图片数据:', product?.images);
  
  try {
    // 如果product.images是字符串（已序列化的JSON）
    if (typeof product?.images === 'string') {
      try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          console.log('解析后的图片路径:', parsedImages[0]);
          return parsedImages[0];
        }
      } catch (e) {
        console.error('解析图片路径失败:', e);
      }
    }
    
    // 如果product.images是数组
    else if (Array.isArray(product?.images) && product.images.length > 0) {
      const image = product.images[0];
      
      // 如果数组元素是字符串
      if (typeof image === 'string') {
        console.log('原始图片路径:', image);
        // 去除可能的引号
        return image.replace(/^"|"$/g, '');
      }
      
      // 如果数组元素是对象，可能有path属性
      else if (image && typeof image === 'object' && 'path' in image) {
        return image.path;
      }
    }
    
    // 如果按类别使用默认图片
    const category = product?.category?.toLowerCase();
    if (category === 'rings') return '/images/ring.jpg';
    if (category === 'necklaces') return '/images/necklace.jpg';
    if (category === 'earrings') return '/images/earrings.jpg';
    if (category === 'bracelets') return '/images/bracelet.jpg';
    
    // 最后备用图片
    return '/images/default-product.jpg';
  } catch (err) {
    console.error('获取图片路径出错:', err);
    return '/images/default-product.jpg';
  }
} 