import React from 'react';

type BadgeProps = {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children: React.ReactNode;
};

/**
 * 通用徽章组件
 * 
 * 可用于商品标签、状态指示等
 */
const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  className = '',
  position = 'top-right',
  children,
  ...rest
}) => {
  // 构建徽章样式类
  const baseClassName = `badge bg-${variant}`;
  const positionClassName = position ? `position-absolute ${position.replace('-', '-')}` : '';
  const badgeClassName = `${baseClassName} ${positionClassName} ${className}`.trim();
  
  return (
    <span 
      className={badgeClassName}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge; 