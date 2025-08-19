import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

// Ant Design 主题配置
export const antdTheme: ThemeConfig = {
  token: {
    // 基础颜色配置
    colorPrimary: '#0066cc',
    colorSuccess: '#16a34a',
    colorWarning: '#eab308',
    colorError: '#dc2626',
    colorInfo: '#3b82f6',
    
    // 字体配置
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 18,
    
    // 圆角配置
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // 间距配置
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    // 阴影配置
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  
  components: {
    // Button 组件配置
    Button: {
      borderRadius: 6,
      paddingInline: 16,
    },
    
    // Input 组件配置
    Input: {
      borderRadius: 6,
      paddingInline: 12,
    },
    
    // Card 组件配置
    Card: {
      borderRadius: 8,
      paddingLG: 24,
    },
    
    // Menu 组件配置
    Menu: {
      borderRadius: 6,
      itemPaddingInline: 16,
    },
    
    // Table 组件配置
    Table: {
      borderRadius: 6,
      paddingContentHorizontalLG: 16,
    },
    
    // Modal 组件配置
    Modal: {
      borderRadius: 8,
      paddingContentHorizontal: 24,
    },
    
    // Drawer 组件配置
    Drawer: {
      paddingLG: 24,
    },
    
    // Tooltip 组件配置
    Tooltip: {
      borderRadius: 4,
    },
    
    // Layout 组件配置
    Layout: {
      headerBg: '#ffffff',
      headerPadding: '0 24px',
      siderBg: '#fafafa',
    },
  },
};

// 暗色主题配置
export const antdDarkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: theme.darkAlgorithm,
  token: {
    ...antdTheme.token,
    colorBgContainer: '#171717',
    colorBgLayout: '#0a0a0a',
    colorBgElevated: '#262626',
  },
  components: {
    ...antdTheme.components,
    Layout: {
      headerBg: '#171717',
      headerPadding: '0 24px',
      siderBg: '#262626',
    },
  },
};