import { PrismaClient } from '@prisma/client';

/**
 * 商品管理脚本
 * 集成了添加商品和标记商品的功能
 * 可以通过命令行参数控制行为
 */

const prisma = new PrismaClient();

// 定义类别类型
type ProductCategory = 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';

// 商品分类
const categories: ProductCategory[] = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];

// 打折范围配置
const DISCOUNT_RANGES = {
  min: 10,  // 最低折扣10%
  max: 50   // 最高折扣50%
};

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'all'; // 默认执行所有操作
  
  if (['all', 'add', 'reset'].includes(mode)) {
    await addProducts(mode === 'reset');
  }
  
  if (['all', 'update', 'tag'].includes(mode)) {
    await updateProductTags();
  }
  
  console.log('操作完成!');
}

/**
 * 添加商品到数据库
 */
async function addProducts(reset: boolean = false) {
  // 如果需要重置，则先清空现有产品
  if (reset) {
    console.log('删除现有商品数据...');
    await prisma.product.deleteMany({});
  }
  
  // 商品模板数据 - 确保包含originalPrice字段
  const productsData = {
    'Necklaces': [
      {
        name: '925 Sterling Silver Moon Necklace',
        description: 'Elegant 925 Sterling Silver moon pendant necklace with delicate chain',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.5,
        images: ['/images/necklace.jpg']
      },
      // 其他项链数据...
      {
        name: 'Gold Chain Pendant Necklace',
        description: 'Classic gold chain pendant necklace with adjustable length',
        price: 129.99,
        originalPrice: 129.99,
        material: '18K Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.2,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Pearl Strand Necklace',
        description: 'Beautiful freshwater pearl strand necklace with sterling silver clasp',
        price: 99.99,
        originalPrice: 99.99,
        material: 'Freshwater Pearl, Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.8,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Rose Gold Locket Necklace',
        description: 'Lovely rose gold locket necklace that holds two photos',
        price: 79.99,
        originalPrice: 79.99,
        material: 'Rose Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 30,
        rating: 4.0,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Sapphire Pendant Necklace',
        description: 'Magnificent sapphire pendant set in sterling silver with delicate chain',
        price: 159.99,
        originalPrice: 159.99,
        material: 'Sapphire, 925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 8,
        rating: 4.9,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Layered Chain Necklace',
        description: 'Trendy multi-layered chain necklace in sterling silver finish',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.3,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Choker Necklace with Pendant',
        description: 'Modern choker style necklace with elegant pendant',
        price: 59.99,
        originalPrice: 59.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.1,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Heart Pendant Necklace',
        description: 'Romantic heart pendant necklace in sterling silver',
        price: 75.99,
        originalPrice: 75.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 27,
        rating: 4.7,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Statement Bib Necklace',
        description: 'Bold statement bib necklace with crystal embellishments',
        price: 119.99,
        originalPrice: 119.99,
        material: 'Crystal, Alloy',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.4,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Minimalist Bar Necklace',
        description: 'Simple and elegant horizontal bar necklace in sterling silver',
        price: 49.99,
        originalPrice: 49.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 35,
        rating: 4.6,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Cascading Pendant Necklace',
        description: 'Elegant cascading pendant necklace with multiple elements',
        price: 109.99,
        originalPrice: 109.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.6,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Gemstone Y-Necklace',
        description: 'Modern Y-style necklace with gemstone accent',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver, Natural Gemstone',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.5,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Twisted Rope Chain Necklace',
        description: 'Classic twisted rope chain necklace with lobster clasp',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.3,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Emerald Pendant Necklace',
        description: 'Elegant emerald pendant necklace with delicate chain',
        price: 149.99,
        originalPrice: 149.99,
        material: '925 Sterling Silver, Lab-Created Emerald',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 8,
        rating: 4.9,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Filigree Medallion Necklace',
        description: 'Vintage inspired filigree medallion necklace with intricate details',
        price: 99.99,
        originalPrice: 99.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.6,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Station Chain Necklace',
        description: 'Elegant station chain necklace with spaced gemstones',
        price: 129.99,
        originalPrice: 129.99,
        material: '925 Sterling Silver, CZ',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.7,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Initial Pendant Necklace',
        description: 'Personalized initial pendant necklace with delicate chain',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.5,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Byzantine Chain Necklace',
        description: 'Bold byzantine chain necklace with intricate links',
        price: 119.99,
        originalPrice: 119.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.8,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Beaded Chain Necklace',
        description: 'Delicate beaded chain necklace with polished finish',
        price: 59.99,
        originalPrice: 59.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.2,
        images: ['/images/necklace.jpg']
      },
      {
        name: 'Tassel Pendant Necklace',
        description: 'Fashion-forward tassel pendant necklace with long chain',
        price: 84.99,
        originalPrice: 84.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.4,
        images: ['/images/necklace.jpg']
      }
    ],
    'Rings': [
      {
        name: '925 Sterling Silver Round CZ Ring',
        description: 'Elegant 925 Sterling Silver ring with brilliant cubic zirconia stone',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.7,
        images: ['/images/ring.jpg']
      },
      {
        name: '18K Gold Diamond Ring',
        description: 'Luxurious 18K Gold Diamond Ring with brilliant cut diamonds',
        price: 599.99,
        originalPrice: 599.99,
        material: '18K Gold',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 5,
        rating: 4.9,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Silver Twisted Band Ring',
        description: 'Beautiful twisted band silver ring for everyday wear',
        price: 49.99,
        originalPrice: 49.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 30,
        rating: 4.3,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Rose Gold Minimalist Ring',
        description: 'Minimalist rose gold ring with delicate design',
        price: 79.99,
        originalPrice: 79.99,
        material: 'Rose Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.4,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Stackable Rings Set',
        description: 'Set of 3 stackable rings in different finishes',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.6,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Eternity Band Ring',
        description: 'Classic eternity band with cubic zirconia stones',
        price: 109.99,
        originalPrice: 109.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.5,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Men\'s Signet Ring',
        description: 'Traditional men\'s signet ring in sterling silver',
        price: 129.99,
        originalPrice: 129.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.2,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Solitaire Engagement Ring',
        description: 'Classic solitaire engagement ring with cubic zirconia center stone',
        price: 149.99,
        originalPrice: 149.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.8,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Vintage Style Ring',
        description: 'Ornate vintage-inspired ring with marcasite details',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 14,
        rating: 4.4,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Adjustable Open Ring',
        description: 'Modern open design adjustable ring in sterling silver',
        price: 59.99,
        originalPrice: 59.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.1,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Two-Tone Wedding Band',
        description: 'Elegant two-tone wedding band with brushed finish',
        price: 129.99,
        originalPrice: 129.99,
        material: '925 Sterling Silver, 18K Gold Plating',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.7,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Gemstone Cluster Ring',
        description: 'Beautiful cluster ring with colorful gemstones',
        price: 119.99,
        originalPrice: 119.99,
        material: '925 Sterling Silver, Mixed Gemstones',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.4,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Wide Band Statement Ring',
        description: 'Bold wide band statement ring with textured design',
        price: 99.99,
        originalPrice: 99.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.3,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Infinity Knot Ring',
        description: 'Symbolic infinity knot ring representing endless love',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.6,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Double Band Ring',
        description: 'Modern double band ring with minimalist design',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.5,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Emerald Halo Ring',
        description: 'Stunning emerald center stone surrounded by cubic zirconia halo',
        price: 149.99,
        originalPrice: 149.99,
        material: '925 Sterling Silver, Lab-Created Emerald, CZ',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.8,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Braided Band Ring',
        description: 'Intricate braided design band ring with polished finish',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.4,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Bypass Style Ring',
        description: 'Modern bypass style ring with open design',
        price: 74.99,
        originalPrice: 74.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 16,
        rating: 4.3,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Channel Set Band',
        description: 'Elegant channel set band with cubic zirconia stones',
        price: 119.99,
        originalPrice: 119.99,
        material: '925 Sterling Silver, CZ',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 14,
        rating: 4.5,
        images: ['/images/ring.jpg']
      },
      {
        name: 'Filigree Detailed Ring',
        description: 'Vintage inspired filigree detailed ring with intricate metalwork',
        price: 94.99,
        originalPrice: 94.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.7,
        images: ['/images/ring.jpg']
      }
    ],
    'Earrings': [
      {
        name: 'Sterling Silver Stud Earrings',
        description: 'Elegant sterling silver stud earrings with cubic zirconia',
        price: 49.99,
        originalPrice: 49.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 28,
        rating: 4.6,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Gold Hoop Earrings',
        description: 'Classic gold hoop earrings for everyday wear',
        price: 69.99,
        originalPrice: 69.99,
        material: '18K Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.4,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Freshwater Pearl Earrings',
        description: 'Beautiful freshwater pearl drop earrings with silver posts',
        price: 59.99,
        originalPrice: 59.99,
        material: 'Freshwater Pearl, 925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.7,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Rose Gold Drop Earrings',
        description: 'Lovely rose gold drop earrings with delicate design',
        price: 79.99,
        originalPrice: 79.99,
        material: 'Rose Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.5,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Chandelier Earrings',
        description: 'Dramatic chandelier earrings with crystal accents',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.3,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Minimalist Bar Earrings',
        description: 'Simple and modern bar earrings in sterling silver',
        price: 45.99,
        originalPrice: 45.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.2,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Huggie Hoop Earrings',
        description: 'Small huggie hoop earrings with crystal details',
        price: 54.99,
        originalPrice: 54.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.1,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Statement Earrings',
        description: 'Bold statement earrings for special occasions',
        price: 94.99,
        originalPrice: 94.99,
        material: 'Crystal, Alloy',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.0,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Threader Earrings',
        description: 'Modern threader earrings that elegantly pass through the ear',
        price: 49.99,
        originalPrice: 49.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.8,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Stud and Jacket Earrings',
        description: 'Versatile stud earrings with removable jackets for multiple looks',
        price: 64.99,
        originalPrice: 64.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 17,
        rating: 4.4,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Climber Earrings',
        description: 'Trendy ear climber earrings with curved design',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.6,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Gemstone Drop Earrings',
        description: 'Elegant gemstone drop earrings with secure backs',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver, Mixed Gemstones',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.7,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Twisted Hoop Earrings',
        description: 'Classic twisted design hoop earrings with secure closure',
        price: 59.99,
        originalPrice: 59.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.4,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'CZ Cluster Earrings',
        description: 'Sparkling cubic zirconia cluster stud earrings',
        price: 74.99,
        originalPrice: 74.99,
        material: '925 Sterling Silver, CZ',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.5,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Emerald Stud Earrings',
        description: 'Elegant emerald stud earrings with silver setting',
        price: 99.99,
        originalPrice: 99.99,
        material: '925 Sterling Silver, Lab-Created Emerald',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.8,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Filigree Drop Earrings',
        description: 'Vintage inspired filigree drop earrings with intricate details',
        price: 84.99,
        originalPrice: 84.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 14,
        rating: 4.6,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Jacket Stud Earrings',
        description: 'Versatile jacket stud earrings with detachable elements',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 16,
        rating: 4.5,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Cuff Earrings',
        description: 'Modern ear cuff earrings with no piercing required',
        price: 49.99,
        originalPrice: 49.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.3,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Chandelier Crystal Earrings',
        description: 'Glamorous chandelier earrings with crystal accents',
        price: 109.99,
        originalPrice: 109.99,
        material: '925 Sterling Silver, Crystal',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 8,
        rating: 4.9,
        images: ['/images/earrings.jpg']
      },
      {
        name: 'Ball Stud Earrings',
        description: 'Classic ball stud earrings with high polish finish',
        price: 39.99,
        originalPrice: 39.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 30,
        rating: 4.4,
        images: ['/images/earrings.jpg']
      }
    ],
    'Bracelets': [
      {
        name: 'Sterling Silver Chain Bracelet',
        description: 'Elegant sterling silver chain bracelet with lobster clasp',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.5,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Gold Tennis Bracelet',
        description: 'Luxurious gold tennis bracelet with cubic zirconia stones',
        price: 149.99,
        originalPrice: 149.99,
        material: '18K Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 8,
        rating: 4.8,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Pearl Beaded Bracelet',
        description: 'Beautiful freshwater pearl beaded bracelet with silver accents',
        price: 69.99,
        originalPrice: 69.99,
        material: 'Freshwater Pearl, 925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.3,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Rose Gold Bangle',
        description: 'Fashionable rose gold bangle with delicate design',
        price: 89.99,
        originalPrice: 89.99,
        material: 'Rose Gold Plated',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.4,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Adjustable Cuff Bracelet',
        description: 'Modern adjustable cuff bracelet in sterling silver',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.2,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Charm Bracelet',
        description: 'Delightful charm bracelet with various decorative charms',
        price: 99.99,
        originalPrice: 99.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.6,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Chain Link Bracelet',
        description: 'Bold chain link bracelet with toggle clasp',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 10,
        rating: 4.1,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Woven Leather Bracelet',
        description: 'Handcrafted woven leather bracelet with sterling silver accents',
        price: 59.99,
        originalPrice: 59.99,
        material: 'Leather, 925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.0,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Beaded Stretch Bracelet',
        description: 'Versatile beaded stretch bracelet with semi-precious stones',
        price: 49.99,
        originalPrice: 49.99,
        material: 'Semi-precious Stones, Elastic',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 30,
        rating: 4.3,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Men\'s ID Bracelet',
        description: 'Classic men\'s ID bracelet in sterling silver',
        price: 109.99,
        originalPrice: 109.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 14,
        rating: 4.7,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Diamond Tennis Bracelet',
        description: 'Elegant diamond tennis bracelet with secure clasp',
        price: 199.99,
        originalPrice: 199.99,
        material: '925 Sterling Silver, CZ',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 8,
        rating: 4.9,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Multi-Strand Bracelet',
        description: 'Luxurious multi-strand bracelet with delicate chains',
        price: 129.99,
        originalPrice: 129.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 12,
        rating: 4.6,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Gemstone Bracelet',
        description: 'Colorful gemstone bracelet with various natural stones',
        price: 89.99,
        originalPrice: 89.99,
        material: '925 Sterling Silver, Natural Gemstones',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 15,
        rating: 4.5,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Cuff Bangle Bracelet',
        description: 'Bold cuff bangle bracelet with modern design',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 18,
        rating: 4.3,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Infinity Bracelet',
        description: 'Symbolic infinity bracelet representing endless love',
        price: 69.99,
        originalPrice: 69.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 22,
        rating: 4.4,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Rope Chain Bracelet',
        description: 'Classic rope chain bracelet with secure lobster clasp',
        price: 79.99,
        originalPrice: 79.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 20,
        rating: 4.2,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Heart Charm Bracelet',
        description: 'Delicate bracelet with heart charm pendant',
        price: 59.99,
        originalPrice: 59.99,
        material: '925 Sterling Silver',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 25,
        rating: 4.7,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Emerald Tennis Bracelet',
        description: 'Stunning emerald tennis bracelet with silver setting',
        price: 189.99,
        originalPrice: 189.99,
        material: '925 Sterling Silver, Lab-Created Emerald',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 5,
        rating: 4.9,
        images: ['/images/bracelet.jpg']
      },
      {
        name: 'Sapphire Link Bracelet',
        description: 'Elegant sapphire link bracelet with secure clasp',
        price: 169.99,
        originalPrice: 169.99,
        material: '925 Sterling Silver, Lab-Created Sapphire',
        featured: false,
        isNew: false,
        onSale: false,
        stock: 7,
        rating: 4.8,
        images: ['/images/bracelet.jpg']
      }
    ]
  };
  
  console.log('开始添加商品...');
  
  // 添加所有商品
  for (const category of categories) {
    console.log(`正在添加${category}类别的商品...`);
    
    for (const productData of productsData[category]) {
      try {
        await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.originalPrice,
            category: category,
            material: productData.material,
            featured: productData.featured,
            isNew: productData.isNew,
            onSale: productData.onSale,
            stock: productData.stock,
            rating: productData.rating,
            images: productData.images
          }
        });
        console.log(`  - 已添加: ${productData.name}`);
      } catch (error) {
        console.error(`  - 添加失败: ${productData.name}`, error);
      }
    }
  }
  
  console.log('商品数据添加完成!');
}

/**
 * 生成随机折扣价格
 * @param originalPrice 原价
 * @returns 折扣价格
 */
function generateDiscountedPrice(originalPrice: number): number {
  // 随机折扣率，范围10%-50%
  const discountPercentage = Math.floor(Math.random() * (DISCOUNT_RANGES.max - DISCOUNT_RANGES.min + 1)) + DISCOUNT_RANGES.min;
  
  // 计算折扣后价格
  let discountedPrice = originalPrice * (1 - discountPercentage / 100);
  
  // 四舍五入到两位小数
  discountedPrice = Math.round(discountedPrice * 100) / 100;
  
  // 确保折扣价格至少比原价低1元
  if (originalPrice - discountedPrice < 1) {
    discountedPrice = originalPrice - 1;
  }
  
  return discountedPrice;
}

/**
 * 更新商品标签
 */
async function updateProductTags() {
  console.log('开始更新商品标签...');
  
  // 获取所有商品
  const allProducts = await prisma.product.findMany();
  
  // 确定应该更新多少产品
  const totalProducts = allProducts.length;
  const featuredCount = Math.min(20, Math.ceil(totalProducts * 0.5)); // 约50%为精选
  const newCount = Math.min(25, Math.ceil(totalProducts * 0.6)); // 约60%为新品
  const onSaleCount = Math.min(25, Math.ceil(totalProducts * 0.6)); // 约60%为促销
  
  console.log(`将标记 ${featuredCount} 个商品为精选`);
  console.log(`将标记 ${newCount} 个商品为新品`);
  console.log(`将标记 ${onSaleCount} 个商品为促销`);
  
  // 重置所有标签
  await prisma.product.updateMany({
    data: {
      featured: false,
      isNew: false,
      onSale: false
    }
  });
  
  // 随机选择产品并更新
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  
  // 设置精选
  for (let i = 0; i < featuredCount; i++) {
    if (i < shuffled.length) {
      const product = shuffled[i];
      await prisma.product.update({
        where: { id: product.id },
        data: { featured: true }
      });
      console.log(`已将 ${product.name} 标记为精选`);
    }
  }
  
  // 设置新品（可以有重叠）
  shuffled.sort(() => 0.5 - Math.random());
  for (let i = 0; i < newCount; i++) {
    if (i < shuffled.length) {
      const product = shuffled[i];
      await prisma.product.update({
        where: { id: product.id },
        data: { isNew: true }
      });
      console.log(`已将 ${product.name} 标记为新品`);
    }
  }
  
  // 设置促销（可以有重叠）并设置原价和折扣价
  shuffled.sort(() => 0.5 - Math.random());
  for (let i = 0; i < onSaleCount; i++) {
    if (i < shuffled.length) {
      const product = shuffled[i];
      
      // 确保有originalPrice，如果没有则设置为当前价格
      const originalPrice = product.originalPrice || product.price;
      
      // 生成折扣价
      const discountedPrice = generateDiscountedPrice(originalPrice);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { 
          onSale: true,
          originalPrice: originalPrice,
          price: discountedPrice
        }
      });
      
      // 计算折扣百分比
      const discountPercentage = Math.round((1 - discountedPrice / originalPrice) * 100);
      
      console.log(`已将 ${product.name} 标记为促销，原价: ${originalPrice}，折扣价: ${discountedPrice} (${discountPercentage}% 折扣)`);
    }
  }
  
  console.log('商品标签更新完成！');
}

main()
  .catch((e) => {
    console.error('执行失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 