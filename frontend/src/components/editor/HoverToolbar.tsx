'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Space, Tooltip, Dropdown, Divider } from 'antd';
import {
  // BoldOutlined,
  // ItalicOutlined,
  // UnderlineOutlined,
  // HighlightOutlined,
  // FontColorsOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  QuestionCircleOutlined,
  BlockOutlined,
  MoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  DragOutlined
} from '@ant-design/icons';

export interface HoverToolbarPosition {
  x: number;
  y: number;
  visible: boolean;
}

export interface HoverToolbarPlugin {
  id: string;
  icon: React.ReactNode;
  title: string;
  action: (editorInstance: unknown, blockElement: HTMLElement) => void;
  shortcut?: string;
  group?: 'format' | 'insert' | 'block' | 'custom';
}

export interface HoverToolbarProps {
  editorInstance?: unknown;
  position: HoverToolbarPosition;
  currentBlock?: HTMLElement;
  plugins?: HoverToolbarPlugin[];
  onAction?: (action: string, params?: unknown) => void;
  className?: string;
}

/**
 * EditorJS 风格的悬浮工具栏
 * 在鼠标悬停时显示，提供快捷操作
 */
export const HoverToolbar: React.FC<HoverToolbarProps> = ({
  editorInstance,
  position,
  currentBlock,
  plugins = [],
  onAction,
  className = ''
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarSize, setToolbarSize] = useState({ width: 0, height: 0 });

  // 默认工具配置
  const defaultTools: HoverToolbarPlugin[] = [
    {
      id: 'header',
      icon: <span className="ao-font-bold ao-text-lg">H</span>,
      title: '标题',
      group: 'format',
      action: () => insertBlock('header', { text: '', level: 2 })
    },
    {
      id: 'paragraph',
      icon: <span className="ao-text-sm">¶</span>,
      title: '段落',
      group: 'format',
      action: () => insertBlock('paragraph', { text: '' })
    },
    {
      id: 'list',
      icon: <UnorderedListOutlined />,
      title: '无序列表',
      group: 'format',
      action: () => insertBlock('list', { style: 'unordered', items: [''] })
    },
    {
      id: 'numbered-list',
      icon: <OrderedListOutlined />,
      title: '有序列表',
      group: 'format',
      action: () => insertBlock('list', { style: 'ordered', items: [''] })
    },
    {
      id: 'checklist',
      icon: <CheckSquareOutlined />,
      title: '任务列表',
      group: 'format',
      action: () => insertBlock('checklist', { items: [{ text: '', checked: false }] })
    },
    {
      id: 'quote',
      icon: <BlockOutlined />,
      title: '引用',
      group: 'format',
      action: () => insertBlock('quote', { text: '', caption: '' })
    },
    {
      id: 'code',
      icon: <CodeOutlined />,
      title: '代码块',
      group: 'insert',
      action: () => insertBlock('code', { code: '' })
    },
    {
      id: 'image',
      icon: <PictureOutlined />,
      title: '图片',
      group: 'insert',
      action: () => insertBlock('image', { url: '', caption: '' })
    },
    {
      id: 'table',
      icon: <TableOutlined />,
      title: '表格',
      group: 'insert',
      action: () => insertBlock('table', { withHeadings: true, content: [] })
    },
    {
      id: 'link',
      icon: <LinkOutlined />,
      title: '链接',
      group: 'insert',
      action: () => insertBlock('linkTool', { link: '', meta: {} })
    }
  ];

  // 块级操作工具
  const blockActions: HoverToolbarPlugin[] = [
    {
      id: 'move',
      icon: <DragOutlined />,
      title: '拖拽移动',
      group: 'block',
      action: () => onAction?.('move')
    },
    {
      id: 'copy',
      icon: <CopyOutlined />,
      title: '复制块',
      group: 'block',
      action: () => copyBlock()
    },
    {
      id: 'delete',
      icon: <DeleteOutlined />,
      title: '删除块',
      group: 'block',
      action: () => deleteBlock()
    }
  ];

  // 合并所有工具
  const allTools = [...defaultTools, ...plugins];

  // 按组分类工具
  const groupedTools = {
    format: allTools.filter(tool => tool.group === 'format'),
    insert: allTools.filter(tool => tool.group === 'insert'),
    block: [...blockActions, ...allTools.filter(tool => tool.group === 'block')],
    custom: allTools.filter(tool => tool.group === 'custom')
  };

  // 插入新块
  const insertBlock = useCallback(async (type: string, data: unknown) => {
    if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;

    try {
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      await editor.blocks.insert(type, data, {}, currentIndex + 1);
      
      // 设置焦点到新块
      setTimeout(() => {
        if (editor.caret) {
          editor.caret.setToBlock(currentIndex + 1);
        }
      }, 100);

      onAction?.('insert', { type, data });
    } catch {
      // 插入块失败
    }
  }, [editorInstance, onAction]);

  // 复制当前块
  const copyBlock = useCallback(async () => {
    if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;

    try {
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      const currentBlock = editor.blocks.getBlockByIndex(currentIndex);
      const blockData = await currentBlock.save();
      
      await editor.blocks.insert(blockData.tool, blockData.data, {}, currentIndex + 1);
      onAction?.('copy');
    } catch {
      // 复制块失败
    }
  }, [editorInstance, onAction]);

  // 删除当前块
  const deleteBlock = useCallback(async () => {
    if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;

    try {
      const editor = editorInstance as any;
      const currentIndex = editor.blocks.getCurrentBlockIndex();
      editor.blocks.delete(currentIndex);
      onAction?.('delete');
    } catch {
      // 删除块失败
    }
  }, [editorInstance, onAction]);

  // 获取工具栏尺寸
  useEffect(() => {
    if (toolbarRef.current) {
      const rect = toolbarRef.current.getBoundingClientRect();
      setToolbarSize({ width: rect.width, height: rect.height });
    }
  }, [position.visible]);

  // 计算工具栏位置，确保不超出视窗
  const getToolbarStyle = useCallback(() => {
    if (!position.visible) {
      return {
        opacity: 0,
        visibility: 'hidden' as const,
        transform: 'translateY(10px) scale(0.95)'
      };
    }

    const { x, y } = position;
    const { width, height } = toolbarSize;
    const viewportWidth = window.innerWidth;

    // 计算最佳位置
    let finalX = x - width / 2;
    let finalY = y - height - 10; // 默认显示在上方

    // 水平边界检查
    if (finalX < 10) {
      finalX = 10;
    } else if (finalX + width > viewportWidth - 10) {
      finalX = viewportWidth - width - 10;
    }

    // 垂直边界检查 - 如果上方空间不足，显示在下方
    if (finalY < 10) {
      finalY = y + 10; // 显示在下方
    }

    return {
      left: finalX,
      top: finalY,
      opacity: 1,
      visibility: 'visible' as const,
      transform: 'translateY(0) scale(1)'
    };
  }, [position, toolbarSize]);

  // 更多工具菜单
  const moreToolsMenu = {
    items: [
      ...groupedTools.custom.map(tool => ({
        key: tool.id,
        label: tool.title,
        icon: tool.icon,
        onClick: () => tool.action(editorInstance, currentBlock!)
      })),
      { type: 'divider' as const },
      {
        key: 'settings',
        label: '块设置',
        icon: <QuestionCircleOutlined />,
        onClick: () => onAction?.('settings')
      }
    ]
  };

  if (!position.visible) return null;

  return (
    <div
      ref={toolbarRef}
      className={`ao-fixed ao-z-50 ao-bg-white ao-rounded-lg ao-shadow-lg ao-border ao-border-gray-200 ao-p-2 ao-transition-all ao-duration-200 ${className}`}
      style={getToolbarStyle()}
    >
      <div className="ao-flex ao-items-center ao-gap-1">
        
        {/* 格式化工具组 */}
        <Space size={2}>
          {groupedTools.format.slice(0, 4).map(tool => (
            <Tooltip key={tool.id} title={tool.title} placement="top">
              <Button
                type="text"
                size="small"
                icon={tool.icon}
                onClick={() => tool.action(editorInstance, currentBlock!)}
                className="ao-w-8 ao-h-8 ao-flex ao-items-center ao-justify-center hover:ao-bg-gray-100"
              />
            </Tooltip>
          ))}
        </Space>

        <Divider type="vertical" className="ao-h-6 ao-mx-1" />

        {/* 插入工具组 */}
        <Space size={2}>
          {groupedTools.insert.slice(0, 3).map(tool => (
            <Tooltip key={tool.id} title={tool.title} placement="top">
              <Button
                type="text"
                size="small"
                icon={tool.icon}
                onClick={() => tool.action(editorInstance, currentBlock!)}
                className="ao-w-8 ao-h-8 ao-flex ao-items-center ao-justify-center hover:ao-bg-gray-100"
              />
            </Tooltip>
          ))}
        </Space>

        <Divider type="vertical" className="ao-h-6 ao-mx-1" />

        {/* 块操作工具组 */}
        <Space size={2}>
          {groupedTools.block.slice(0, 2).map(tool => (
            <Tooltip key={tool.id} title={tool.title} placement="top">
              <Button
                type="text"
                size="small"
                icon={tool.icon}
                onClick={() => tool.action(editorInstance, currentBlock!)}
                className="ao-w-8 ao-h-8 ao-flex ao-items-center ao-justify-center hover:ao-bg-gray-100"
              />
            </Tooltip>
          ))}
        </Space>

        {/* 更多工具 */}
        {(groupedTools.custom.length > 0 || groupedTools.format.length > 4 || groupedTools.insert.length > 3) && (
          <>
            <Divider type="vertical" className="ao-h-6 ao-mx-1" />
            <Dropdown
              menu={moreToolsMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                className="ao-w-8 ao-h-8 ao-flex ao-items-center ao-justify-center hover:ao-bg-gray-100"
              />
            </Dropdown>
          </>
        )}
      </div>

      {/* 三角形指示器 */}
      <div 
        className="ao-absolute ao-w-3 ao-h-3 ao-bg-white ao-border-l ao-border-b ao-border-gray-200 ao-transform ao-rotate-45"
        style={{
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)'
        }}
      />
    </div>
  );
};

export default HoverToolbar;