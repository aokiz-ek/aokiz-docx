import { Button as AntButton } from 'antd';
import { ButtonProps as AntButtonProps } from 'antd/es/button';
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends Omit<AntButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'middle',
  className,
  ...props
}: ButtonProps) => {
  const getType = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'ghost':
        return 'text';
      case 'danger':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getDanger = () => {
    return variant === 'danger';
  };

  return (
    <AntButton
      type={getType()}
      size={size}
      danger={getDanger()}
      className={cn(className)}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;