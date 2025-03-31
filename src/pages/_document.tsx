import { Html, Head, Main, NextScript } from 'next/document';

/**
 * 自定义文档组件
 * 
 * 用于自定义 HTML 文档结构，允许：
 * - a. 添加自定义字体
 * - b. 设置语言属性
 * - c. 添加外部脚本或样式
 * - d. 修改初始 HTML 结构
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" />
        {/* 只保留 Font Awesome 图标库，移除 Bootstrap */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* 移除所有 jQuery 和 Bootstrap JS */}
      </body>
    </Html>
  );
} 