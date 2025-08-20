'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Dropdown, Space, Divider } from 'antd';
import { 
  PlusOutlined,
  DragOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  LinkOutlined,
  CodeOutlined,
  HighlightOutlined
} from '@ant-design/icons';

export interface ToolbarPosition {
  x: number;
  y: number;
  visible: boolean;
}

export interface EditorJSToolbarProps {
  plusButtonPosition: ToolbarPosition;
  inlineToolbarPosition: ToolbarPosition;
  editorInstance?: any;
  onInsertBlock?: (type: string, data?: any) => void;
  onFormatText?: (format: string) => void;
  className?: string;
}

/**
 * EditorJS 标准工具栏组件
 * 包含 Plus 按钮和内联工具栏
 */
export const EditorJSToolbar: React.FC<EditorJSToolbarProps> = ({
  plusButtonPosition,
  inlineToolbarPosition,
  editorInstance,
  onInsertBlock,
  onFormatText,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // 块类型菜单
  const blockTypes = [
    {
      key: 'paragraph',
      label: '段落',
      icon: '¶',
      description: '普通文本段落'
    },
    {
      key: 'header-1',
      label: '标题 1',
      icon: 'H1',
      description: '大标题'
    },
    {
      key: 'header-2',
      label: '标题 2',
      icon: 'H2',
      description: '中标题'
    },
    {
      key: 'header-3',
      label: '标题 3',
      icon: 'H3',
      description: '小标题'
    },
    {
      key: 'list-unordered',
      label: '无序列表',
      icon: '•',
      description: '创建一个无序列表'
    },
    {
      key: 'list-ordered',
      label: '有序列表',
      icon: '1.',
      description: '创建一个有序列表'
    },
    {
      key: 'checklist',
      label: '任务列表',
      icon: '☑',
      description: '创建一个任务清单'
    },
    {
      key: 'quote',
      label: '引用',
      icon: '"',
      description: '创建一个引用块'
    },
    {
      key: 'code',
      label: '代码块',
      icon: '</>',
      description: '创建一个代码块'
    },
    {
      key: 'delimiter',
      label: '分割线',
      icon: '***',
      description: '插入一个分割线'
    },
    {
      key: 'table',
      label: '表格',
      icon: '⊞',
      description: '插入一个表格'
    },
    {
      key: 'image',
      label: '图片',
      icon: '⊡',
      description: '插入一张图片'
    }
  ];

  // 内联格式化工具
  const inlineTools = [
    {
      key: 'bold',
      icon: <BoldOutlined />,
      title: '加粗',
      shortcut: 'Ctrl+B'
    },
    {
      key: 'italic',
      icon: <ItalicOutlined />,
      title: '斜体',
      shortcut: 'Ctrl+I'
    },
    {
      key: 'underline',
      icon: <UnderlineOutlined />,
      title: '下划线',
      shortcut: 'Ctrl+U'
    },
    {
      key: 'code',
      icon: <CodeOutlined />,
      title: '行内代码',
      shortcut: 'Ctrl+`'
    },
    {
      key: 'marker',
      icon: <HighlightOutlined />,
      title: '高亮',
      shortcut: 'Ctrl+Shift+M'
    },
    {
      key: 'link',
      icon: <LinkOutlined />,
      title: '链接',
      shortcut: 'Ctrl+K'
    }
  ];

  // 处理块插入
  const handleBlockInsert = (blockType: string) => {
    const [type, subtype] = blockType.split('-');
    
    switch (type) {
      case 'paragraph':
        onInsertBlock?.('paragraph', { text: '' });
        break;
      case 'header':
        onInsertBlock?.('header', { text: '', level: parseInt(subtype) });
        break;
      case 'list':
        onInsertBlock?.('list', { 
          style: subtype === 'ordered' ? 'ordered' : 'unordered',
          items: ['']
        });
        break;
      case 'checklist':
        onInsertBlock?.('checklist', { items: [{ text: '', checked: false }] });
        break;
      case 'quote':
        onInsertBlock?.('quote', { text: '', caption: '' });
        break;
      case 'code':
        onInsertBlock?.('code', { code: '' });
        break;
      case 'delimiter':
        onInsertBlock?.('delimiter', {});
        break;
      case 'table':
        onInsertBlock?.('table', { withHeadings: true, content: [] });
        break;
      case 'image':
        onInsertBlock?.('image', { url: '', caption: '' });
        break;
    }
  };

  // 块类型下拉菜单
  const blockTypeMenu = {
    items: blockTypes.map(block => ({
      key: block.key,
      label: (
        <div className="ao-flex ao-items-center ao-gap-3 ao-p-2">
          <div className="ao-w-8 ao-h-8 ao-flex ao-items-center ao-justify-center ao-bg-gray-100 ao-rounded ao-text-sm ao-font-medium">
            {block.icon}
          </div>
          <div className="ao-flex-1">
            <div className="ao-font-medium ao-text-gray-900">{block.label}</div>
            <div className="ao-text-xs ao-text-gray-500">{block.description}</div>
          </div>
        </div>
      ),
      onClick: () => handleBlockInsert(block.key)
    }))
  };

  return (
    <div className={className}>
      {/* Plus 按钮工具栏 */}
      {plusButtonPosition.visible && (
        <div
          className="ao-fixed ao-z-50"
          style={{
            left: plusButtonPosition.x - 40,
            top: plusButtonPosition.y,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="ao-flex ao-items-center ao-gap-1">
            {/* 拖拽手柄 */}
            <div
              className={`ao-w-6 ao-h-6 ao-rounded ao-cursor-grab ao-flex ao-items-center ao-justify-center ao-transition-all ao-duration-200 ${
                isDragging ? 'ao-bg-gray-400' : 'ao-bg-gray-300 hover:ao-bg-gray-400'
              }`}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              title="拖拽移动块"
            >
              <DragOutlined className="ao-text-white ao-text-xs" />
            </div>

            {/* Plus 按钮 */}
            <Dropdown
              menu={blockTypeMenu}
              trigger={['click']}
              placement="bottomLeft"
              overlayClassName="editor-block-menu"
            >
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                size="small"
                className="ao-bg-blue-500 ao-border-blue-500 hover:ao-bg-blue-600 ao-shadow-md hover:ao-shadow-lg ao-transition-all"
                title="添加块"
              />
            </Dropdown>
          </div>
        </div>
      )}

      {/* 内联工具栏 */}
      {inlineToolbarPosition.visible && (
        <div
          className="ao-fixed ao-z-50 ao-bg-white ao-border ao-border-gray-200 ao-rounded-lg ao-shadow-lg ao-p-2"
          style={{
            left: inlineToolbarPosition.x,
            top: inlineToolbarPosition.y - 50,
            transform: 'translateX(-50%)'
          }}
        >
          <Space size={2} split={<Divider type="vertical" className="ao-h-6" />}>
            {inlineTools.map(tool => (
              <Button
                key={tool.key}
                type="text"
                size="small"
                icon={tool.icon}
                className="ao-w-8 ao-h-8 ao-text-gray-600 hover:ao-text-blue-600 hover:ao-bg-blue-50"
                title={`${tool.title} (${tool.shortcut})`}
                onClick={() => onFormatText?.(tool.key)}
              />
            ))}
          </Space>

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
      )}
    </div>
  );
};

export default EditorJSToolbar;