import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 配置支持 ao- 前缀的 tailwind-merge
 */
const twMerge = extendTailwindMerge({
  prefix: 'ao-',
});

/**
 * 合并和优化 CSS 类名
 * 结合 clsx 和 tailwind-merge 的功能，支持 ao- 前缀
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}