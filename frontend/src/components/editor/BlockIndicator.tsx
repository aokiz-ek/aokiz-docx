'use client';

import React, { useState } from 'react';
import { Button, Dropdown, Space, Divider } from 'antd';
import { 
  DragOutlined,
  PlusOutlined,
  MoreOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined
} from '@ant-design/icons';

export interface BlockIndicatorPosition {
  x: number;
  y: number;
  visible: boolean;
}

export interface BlockIndicatorProps {
  position: BlockIndicatorPosition;
  blockType: string;
  blockElement?: HTMLElement;
  editorInstance?: any;
  onAction?: (action: string, params?: any) => void;
  className?: string;
}

/**
 * 块标识器组件 - 两阶段悬浮交互
 * 第一阶段：显示块类型标识
 * 第二阶段：悬浮时展开工具栏
 */
export const BlockIndicator: React.FC<BlockIndicatorProps> = ({
  position,
  blockType,
  blockElement,
  editorInstance,
  onAction,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 获取块类型显示名称和图标
  const getBlockDisplay = (type: string) => {
    switch (type) {
      case 'header':
        const level = blockElement?.querySelector('[data-level]')?.getAttribute('data-level') || '1';
        return { label: `H${level}`, icon: null };
      case 'paragraph':
        return { label: 'P', icon: null };
      case 'list':
        return { label: '•', icon: null };
      case 'quote':
        return { label: '"', icon: null };
      case 'code':
        return { label: '</>', icon: null };
      case 'table':
        return { label: '⊞', icon: null };
      case 'image':
        return { label: '⊡', icon: null };
      default:
        return { label: '¶', icon: null };
    }
  };

  const blockDisplay = getBlockDisplay(blockType);

  // 快速操作菜单
  const quickActions = [
    {
      key: 'bold',
      icon: <BoldOutlined />,
      label: '加粗',
      action: () => onAction?.('format', { type: 'bold' })
    },
    {
      key: 'italic',
      icon: <ItalicOutlined />,
      label: '斜体',
      action: () => onAction?.('format', { type: 'italic' })
    },
    {
      key: 'underline',
      icon: <UnderlineOutlined />,
      label: '下划线',
      action: () => onAction?.('format', { type: 'underline' })
    },
    {
      key: 'link',
      icon: <LinkOutlined />,
      label: '链接',
      action: () => onAction?.('insert', { type: 'link' })
    }
  ];

  // 更多操作菜单
  const moreActions = {
    items: [
      {
        key: 'copy',
        label: '复制块',
        icon: <CopyOutlined />,
        onClick: () => onAction?.('copy')
      },
      {
        key: 'delete',
        label: '删除块',
        icon: <DeleteOutlined />,
        onClick: () => onAction?.('delete')
      },
      { type: 'divider' as const },
      {
        key: 'moveUp',
        label: '上移',
        onClick: () => onAction?.('move', { direction: 'up' })
      },
      {
        key: 'moveDown',
        label: '下移',
        onClick: () => onAction?.('move', { direction: 'down' })
      }
    ]
  };

  if (!position.visible) return null;

  return (
    <div
      className={`ao-fixed ao-z-50 ao-transition-all ao-duration-200 ${className}`}
      style={{
        left: position.x - 50,
        top: position.y,
        transform: 'translateY(-50%)'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {!isExpanded ? (
        // 第一阶段：块标识器
        <div className="ao-flex ao-items-center ao-gap-2">
          {/* 拖拽手柄 */}
          <div 
            className="ao-w-4 ao-h-4 ao-bg-gray-300 ao-rounded ao-cursor-grab ao-flex ao-items-center ao-justify-center hover:ao-bg-gray-400 ao-transition-colors"
            title="拖拽移动"
          >
            <DragOutlined className="ao-text-xs ao-text-white" />
          </div>
          
          {/* 块类型标识 */}
          <div 
            className="ao-bg-white ao-border ao-border-gray-200 ao-rounded-md ao-px-2 ao-py-1 ao-text-xs ao-font-medium ao-text-gray-600 ao-shadow-sm hover:ao-shadow-md ao-transition-all ao-cursor-pointer"
            title={`${blockType} 块 - 悬浮查看更多选项`}
          >
            {blockDisplay.label}
          </div>
        </div>
      ) : (
        // 第二阶段：展开的工具栏
        <div className="ao-bg-white ao-border ao-border-gray-200 ao-rounded-lg ao-shadow-lg ao-p-2 ao-flex ao-items-center ao-gap-1">
          {/* 拖拽手柄 */}
          <Button
            type="text"
            size="small"
            icon={<DragOutlined />}
            className="ao-w-8 ao-h-8 ao-text-gray-500 hover:ao-text-gray-700 ao-cursor-grab"
            title="拖拽移动"
          />
          
          {/* 添加块 */}
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            className="ao-w-8 ao-h-8 ao-text-gray-500 hover:ao-text-blue-600"
            title="添加新块"
            onClick={() => onAction?.('add')}
          />
          
          <Divider type="vertical" className="ao-h-6 ao-mx-1" />
          
          {/* 快速格式化工具 */}
          <Space size={1}>
            {quickActions.map(action => (
              <Button
                key={action.key}
                type="text"
                size="small"
                icon={action.icon}
                className="ao-w-8 ao-h-8 ao-text-gray-500 hover:ao-text-blue-600"
                title={action.label}
                onClick={action.action}
              />
            ))}
          </Space>
          
          <Divider type="vertical" className="ao-h-6 ao-mx-1" />
          
          {/* 更多操作 */}
          <Dropdown
            menu={moreActions}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              className="ao-w-8 ao-h-8 ao-text-gray-500 hover:ao-text-blue-600"
              title="更多操作"
            />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default BlockIndicator;