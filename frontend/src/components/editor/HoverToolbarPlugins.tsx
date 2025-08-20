'use client';

import React from 'react';
import { message } from 'antd';
import {
  WarningOutlined,
  BulbOutlined,
  AlertOutlined,
  // FileTextOutlined,
  CalendarOutlined,
  // TagOutlined,
  // EyeOutlined,
  EyeInvisibleOutlined,
  // SpoilerOutlined,
  BookOutlined,
  StarOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  TrophyOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { HoverToolbarPlugin } from './HoverToolbar';

/**
 * 工具栏插件管理器
 */
export class HoverToolbarPluginManager {
  private plugins: Map<string, HoverToolbarPlugin> = new Map();
  private groups: Map<string, HoverToolbarPlugin[]> = new Map();

  /**
   * 注册插件
   */
  register(plugin: HoverToolbarPlugin): void {
    this.plugins.set(plugin.id, plugin);
    
    // 按组分类
    const group = plugin.group || 'custom';
    if (!this.groups.has(group)) {
      this.groups.set(group, []);
    }
    this.groups.get(group)!.push(plugin);
  }

  /**
   * 注册多个插件
   */
  registerMany(plugins: HoverToolbarPlugin[]): void {
    plugins.forEach(plugin => this.register(plugin));
  }

  /**
   * 获取插件
   */
  get(id: string): HoverToolbarPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * 获取所有插件
   */
  getAll(): HoverToolbarPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 按组获取插件
   */
  getByGroup(group: string): HoverToolbarPlugin[] {
    return this.groups.get(group) || [];
  }

  /**
   * 获取所有组
   */
  getGroups(): string[] {
    return Array.from(this.groups.keys());
  }

  /**
   * 移除插件
   */
  unregister(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    this.plugins.delete(id);
    
    // 从组中移除
    const group = plugin.group || 'custom';
    const groupPlugins = this.groups.get(group);
    if (groupPlugins) {
      const index = groupPlugins.findIndex(p => p.id === id);
      if (index > -1) {
        groupPlugins.splice(index, 1);
      }
    }

    return true;
  }

  /**
   * 清空所有插件
   */
  clear(): void {
    this.plugins.clear();
    this.groups.clear();
  }
}

// 全局插件管理器实例
export const hoverToolbarPluginManager = new HoverToolbarPluginManager();

/**
 * 扩展插件集合
 */

// 提示和警告插件
export const alertPlugins: HoverToolbarPlugin[] = [
  {
    id: 'alert-info',
    icon: <AlertOutlined style={{ color: '#1890ff' }} />,
    title: '信息提示',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('alert', {
        type: 'info',
        message: '这是一条信息提示'
      }, {}, currentIndex + 1);
      message.success('已插入信息提示');
    }
  },
  {
    id: 'alert-warning',
    icon: <WarningOutlined style={{ color: '#faad14' }} />,
    title: '警告提示',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('alert', {
        type: 'warning',
        message: '这是一条警告提示'
      }, {}, currentIndex + 1);
      message.success('已插入警告提示');
    }
  },
  {
    id: 'alert-danger',
    icon: <AlertOutlined style={{ color: '#ff4d4f' }} />,
    title: '危险提示',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('alert', {
        type: 'danger',
        message: '这是一条危险提示'
      }, {}, currentIndex + 1);
      message.success('已插入危险提示');
    }
  }
];

// 特殊内容插件
export const contentPlugins: HoverToolbarPlugin[] = [
  {
    id: 'spoiler',
    icon: <EyeInvisibleOutlined />,
    title: '隐藏内容',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('spoiler', {
        title: '点击查看隐藏内容',
        message: '这里是隐藏的内容'
      }, {}, currentIndex + 1);
      message.success('已插入隐藏内容');
    }
  },
  {
    id: 'tooltip',
    icon: <BulbOutlined />,
    title: '工具提示',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('tooltip', {
        text: '悬停查看提示',
        tooltip: '这是工具提示内容'
      }, {}, currentIndex + 1);
      message.success('已插入工具提示');
    }
  },
  {
    id: 'toggle',
    icon: <BookOutlined />,
    title: '折叠面板',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('toggle', {
        title: '点击展开/折叠',
        content: '这里是折叠的内容'
      }, {}, currentIndex + 1);
      message.success('已插入折叠面板');
    }
  }
];

// 装饰性插件
export const decorativePlugins: HoverToolbarPlugin[] = [
  {
    id: 'star-divider',
    icon: <StarOutlined style={{ color: '#faad14' }} />,
    title: '星形分割线',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('delimiter', {
        style: 'star'
      }, {}, currentIndex + 1);
      message.success('已插入星形分割线');
    }
  },
  {
    id: 'heart-divider',
    icon: <HeartOutlined style={{ color: '#eb2f96' }} />,
    title: '心形分割线',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('delimiter', {
        style: 'heart'
      }, {}, currentIndex + 1);
      message.success('已插入心形分割线');
    }
  }
];

// 高级功能插件
export const advancedPlugins: HoverToolbarPlugin[] = [
  {
    id: 'columns',
    icon: <span className="ao-text-xs ao-font-bold">≡</span>,
    title: '多列布局',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('columns', {
        cols: [
          { blocks: [] },
          { blocks: [] }
        ]
      }, {}, currentIndex + 1);
      message.success('已插入多列布局');
    }
  },
  {
    id: 'button',
    icon: <ThunderboltOutlined />,
    title: '按钮',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('button', {
        text: '点击按钮',
        link: '#',
        style: 'primary'
      }, {}, currentIndex + 1);
      message.success('已插入按钮');
    }
  },
  {
    id: 'embed-advanced',
    icon: <RocketOutlined />,
    title: '高级嵌入',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.insert('embed', {
        service: 'custom',
        source: '',
        embed: '',
        width: 580,
        height: 320
      }, {}, currentIndex + 1);
      message.success('已插入高级嵌入');
    }
  }
];

// 模板插件
export const templatePlugins: HoverToolbarPlugin[] = [
  {
    id: 'meeting-notes',
    icon: <CalendarOutlined />,
    title: '会议记录模板',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      
      // 插入会议记录模板
      const template = [
        { type: 'header', data: { text: '会议记录', level: 2 } },
        { type: 'paragraph', data: { text: '会议时间：' } },
        { type: 'paragraph', data: { text: '参会人员：' } },
        { type: 'paragraph', data: { text: '会议议题：' } },
        { type: 'header', data: { text: '讨论内容', level: 3 } },
        { type: 'list', data: { style: 'unordered', items: ['议题1', '议题2', '议题3'] } },
        { type: 'header', data: { text: '行动项', level: 3 } },
        { type: 'checklist', data: { items: [{ text: '待办事项1', checked: false }, { text: '待办事项2', checked: false }] } }
      ];

      template.forEach((block, index) => {
        setTimeout(() => {
          editor.blocks.insert(block.type, block.data, {}, currentIndex + index + 1);
        }, index * 100);
      });

      message.success('已插入会议记录模板');
    }
  },
  {
    id: 'project-plan',
    icon: <TrophyOutlined />,
    title: '项目计划模板',
    group: 'custom',
    action: (editorInstance) => {
      if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      
      const template = [
        { type: 'header', data: { text: '项目计划', level: 2 } },
        { type: 'header', data: { text: '项目概述', level: 3 } },
        { type: 'paragraph', data: { text: '项目描述...' } },
        { type: 'header', data: { text: '项目目标', level: 3 } },
        { type: 'list', data: { style: 'ordered', items: ['目标1', '目标2', '目标3'] } },
        { type: 'header', data: { text: '时间线', level: 3 } },
        { type: 'table', data: { withHeadings: true, content: [['阶段', '时间', '负责人'], ['准备阶段', '第1周', ''], ['执行阶段', '第2-4周', ''], ['收尾阶段', '第5周', '']] } }
      ];

      template.forEach((block, index) => {
        setTimeout(() => {
          editor.blocks.insert(block.type, block.data, {}, currentIndex + index + 1);
        }, index * 100);
      });

      message.success('已插入项目计划模板');
    }
  }
];

/**
 * 注册所有默认插件
 */
export const registerDefaultPlugins = () => {
  hoverToolbarPluginManager.registerMany([
    ...alertPlugins,
    ...contentPlugins,
    ...decorativePlugins,
    ...advancedPlugins,
    ...templatePlugins
  ]);
};

/**
 * 创建自定义插件的辅助函数
 */
export const createPlugin = (config: Partial<HoverToolbarPlugin> & { id: string; title: string }): HoverToolbarPlugin => {
  return {
    icon: <GiftOutlined />,
    group: 'custom',
    action: () => message.info('自定义插件'),
    ...config
  };
};

/**
 * 插件配置预设
 */
export const pluginPresets = {
  basic: [...alertPlugins.slice(0, 2), ...contentPlugins.slice(0, 2)],
  advanced: [...alertPlugins, ...contentPlugins, ...advancedPlugins.slice(0, 2)],
  full: [...alertPlugins, ...contentPlugins, ...decorativePlugins, ...advancedPlugins, ...templatePlugins]
};