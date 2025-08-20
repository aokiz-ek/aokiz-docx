/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: 'ao-',
  theme: {
    extend: {
      colors: {
        // 基础颜色
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        
        // 编辑器专用颜色
        'editor-bg': 'var(--editor-background)',
        'editor-border': 'var(--editor-border)',
        'toolbar-bg': 'var(--toolbar-background)',
        'toolbar-border': 'var(--toolbar-border)',
        
        // 协作光标颜色
        'cursor-blue': 'var(--cursor-blue)',
        'cursor-green': 'var(--cursor-green)',
        'cursor-purple': 'var(--cursor-purple)',
        'cursor-orange': 'var(--cursor-orange)',
        'cursor-red': 'var(--cursor-red)',
        
        // 状态颜色
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'page': 'var(--page-shadow)',
      },
      width: {
        'page': 'var(--width-page)',
      },
      height: {
        'page': 'var(--height-page)',
        'toolbar': 'var(--height-toolbar)',
      },
    },
  },
  plugins: [],
};