import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

/**
 * 通用按钮组件
 * 
 * 支持多种样式变体和尺寸，也可作为链接按钮使用
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  href,
  fullWidth = false,
  children,
  onClick,
  ...rest
}) => {
  // 构建按钮基础类名
  const baseClassName = `btn btn-${variant}`;
  const sizeClassName = size === 'md' ? '' : `btn-${size}`;
  const widthClassName = fullWidth ? 'w-100' : '';
  const buttonClassName = `${baseClassName} ${sizeClassName} ${widthClassName} ${className}`.trim();
  
  // 如果有 href，渲染为链接按钮
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClassName}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  
  // 普通按钮
  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 