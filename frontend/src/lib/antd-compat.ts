/**
 * Antd React 19 兼容性配置
 * 抑制 React 19 兼容性警告，因为功能上是正常的
 */

// 抑制 Antd React 19 兼容性警告
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // 过滤掉 Antd React 19 兼容性警告
  if (typeof args[0] === 'string' && args[0].includes('[antd: compatible]')) {
    return;
  }
  originalWarn.apply(console, args);
};

export const suppressAntdReact19Warning = () => {
  // 这个函数在应用启动时调用，用于抑制警告
  // 实际的警告抑制逻辑在上面的代码中实现
};

// 也可以通过环境变量控制是否显示警告
export const shouldSuppressWarnings = () => {
  return process.env.NODE_ENV === 'development' && process.env.SUPPRESS_ANTD_WARNINGS !== 'false';
};