# Aokiz Docx Frontend

专业的团队协作文档编辑平台前端应用

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm 9.0+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
npm run build
npm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局组件
│   └── page.tsx            # 首页组件
├── components/             # React 组件
│   ├── ui/                 # 基础 UI 组件
│   ├── layout/             # 布局组件
│   ├── document/           # 文档相关组件
│   └── index.ts            # 组件导出
├── types/                  # TypeScript 类型定义
│   ├── index.ts            # 基础类型
│   ├── api.ts              # API 接口类型
│   └── editor.ts           # 编辑器相关类型
├── lib/                    # 工具库
│   └── antd-config.ts      # Ant Design 配置
├── utils/                  # 工具函数
│   └── cn.ts               # 类名合并工具
├── hooks/                  # React Hooks
├── store/                  # 状态管理
└── api/                    # API 接口
```

## 🛠 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4.x (ao- 前缀)
- **组件库**: Ant Design 5.x
- **代码规范**: ESLint + Prettier
- **构建工具**: Next.js (内置)

## 🎨 设计系统

### 颜色主题

- **主色调**: #0066cc (primary)
- **成功色**: #16a34a (success)
- **警告色**: #eab308 (warning)
- **错误色**: #dc2626 (error)

### 协作光标颜色

- 蓝色: #3b82f6
- 绿色: #10b981
- 紫色: #8b5cf6
- 橙色: #f59e0b
- 红色: #ef4444

### 字体

- **主要字体**: Inter, system fonts
- **等宽字体**: Geist Mono

## 📋 开发脚本

```bash
# 开发模式（使用 Turbopack）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
npm run lint:fix

# 代码格式化
npm run prettier
npm run prettier:fix
npm run format

# TypeScript 类型检查
npm run typecheck

# 清理构建文件
npm run clean
```

## 🧩 组件使用

### 基础组件

```tsx
import { Button, AppLayout, DocumentCard } from '@/components';

// 按钮组件
<Button variant="primary" size="large">
  创建文档
</Button>

// 应用布局
<AppLayout onCreateDocument={() => console.log('创建文档')}>
  <YourContent />
</AppLayout>

// 文档卡片
<DocumentCard 
  document={documentData}
  onClick={() => openDocument(documentData.id)}
/>
```

### 主题配置

```tsx
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/lib/antd-config';

<ConfigProvider theme={antdTheme}>
  <App />
</ConfigProvider>
```

## 🎯 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint + Prettier 配置
- 组件使用 PascalCase 命名
- 文件名使用 kebab-case 或 PascalCase

### 组件开发

- 优先使用函数式组件和 Hooks
- 提供完整的 TypeScript 类型定义
- 组件应该是可复用和可测试的
- 使用 Ant Design 组件作为基础

### 样式规范

- 使用 Tailwind CSS 工具类 (ao- 前缀)
- 避免内联样式
- 使用 CSS 变量定义主题色彩
- 响应式设计优先

#### Tailwind CSS 前缀使用
```jsx
// ✅ 正确 - 使用 ao- 前缀
<div className="ao-flex ao-items-center ao-space-x-4">

// ❌ 错误 - 无前缀
<div className="flex items-center space-x-4">
```

## 🔧 配置文件

- **TypeScript**: `tsconfig.json`
- **ESLint**: `eslint.config.mjs`
- **Prettier**: `.prettierrc.json`
- **Tailwind**: `tailwind.config.js` + `postcss.config.mjs` + `globals.css`
- **Next.js**: `next.config.ts`

### Tailwind CSS 配置
项目已配置 `ao-` 前缀，确保样式类不与其他框架冲突：
```js
// tailwind.config.js
module.exports = {
  prefix: 'ao-',
  // ... 其他配置
}
```

## 🚧 待实现功能

- [ ] 富文本编辑器集成
- [ ] 实时协作功能
- [ ] 文档版本控制
- [ ] 用户权限管理
- [ ] 评论和批注系统
- [ ] 文件导入导出
- [ ] 移动端适配
- [ ] 离线编辑支持

## 📄 许可证

本项目仅供开发学习使用。
