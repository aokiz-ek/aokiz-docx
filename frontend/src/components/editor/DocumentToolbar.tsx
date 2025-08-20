'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Dropdown, 
  Divider, 
  Tooltip, 
  Modal, 
  Input, 
  message,
  Typography,
  Popover,
  ColorPicker
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  HighlightOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  CodeOutlined,
  BlockOutlined,
  BgColorsOutlined,
  UndoOutlined,
  RedoOutlined,
  FileOutlined,
  FileAddOutlined,
  FolderOpenOutlined,
  SaveOutlined,
  PrinterOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SearchOutlined,
  CommentOutlined,
  MoreOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

export interface DocumentToolbarProps {
  editorInstance?: unknown;
  onCommand?: (command: string, params?: unknown) => void;
  className?: string;
}

/**
 * AO风格的文档工具栏
 * 提供丰富的文档编辑功能
 */
export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  editorInstance,
  onCommand,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  // 格式化命令
  const formatCommands = [
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
      key: 'highlight',
      icon: <HighlightOutlined />,
      title: '高亮',
      shortcut: 'Ctrl+H'
    }
  ];

  // 字体和颜色设置
  const fontSizeOptions = [
    { label: '小', value: 12 },
    { label: '正常', value: 16 },
    { label: '大', value: 20 },
    { label: '特大', value: 24 },
    { label: '巨大', value: 32 }
  ];

  // 对齐选项
  const alignmentOptions = [
    { key: 'left', icon: <AlignLeftOutlined />, title: '左对齐' },
    { key: 'center', icon: <AlignCenterOutlined />, title: '居中' },
    { key: 'right', icon: <AlignRightOutlined />, title: '右对齐' }
  ];

  // 列表选项
  const listOptions = [
    { 
      key: 'bullet', 
      icon: <UnorderedListOutlined />, 
      title: '无序列表',
      action: () => insertBlock('list', { style: 'unordered' })
    },
    { 
      key: 'numbered', 
      icon: <OrderedListOutlined />, 
      title: '有序列表',
      action: () => insertBlock('list', { style: 'ordered' })
    },
    { 
      key: 'todo', 
      icon: <CheckSquareOutlined />, 
      title: '待办列表',
      action: () => insertBlock('checklist', { 
        items: [
          { text: '待办事项', checked: false }
        ]
      })
    }
  ];

  // 插入选项
  const insertOptions = [
    {
      key: 'link',
      icon: <LinkOutlined />,
      label: '链接',
      action: () => insertBlock('linkTool', {})
    },
    {
      key: 'image',
      icon: <PictureOutlined />,
      label: '图片',
      action: () => insertBlock('image', {})
    },
    {
      key: 'table',
      icon: <TableOutlined />,
      label: '表格',
      action: () => insertBlock('table', { withHeadings: true, rows: 3, cols: 3 })
    },
    {
      key: 'code',
      icon: <CodeOutlined />,
      label: '代码块',
      action: () => insertBlock('code', {})
    },
    {
      key: 'quote',
      icon: <BlockOutlined />,
      label: '引用',
      action: () => insertBlock('quote', {})
    }
  ];

  // 文件操作
  const fileOperations = [
    {
      key: 'new',
      icon: <FileAddOutlined />,
      label: '新建文档',
      action: () => handleFileOperation('new')
    },
    {
      key: 'open',
      icon: <FolderOpenOutlined />,
      label: '打开文档',
      action: () => handleFileOperation('open')
    },
    {
      key: 'save',
      icon: <SaveOutlined />,
      label: '保存文档',
      shortcut: 'Ctrl+S',
      action: () => handleFileOperation('save')
    },
    {
      key: 'export',
      icon: <FileOutlined />,
      label: '导出文档',
      action: () => handleFileOperation('export')
    },
    {
      key: 'print',
      icon: <PrinterOutlined />,
      label: '打印',
      shortcut: 'Ctrl+P',
      action: () => handleFileOperation('print')
    }
  ];

  // 插入块的函数
  const insertBlock = async (type: string, data: unknown) => {
    if (!editorInstance || typeof editorInstance !== 'object' || !('blocks' in editorInstance)) return;

    try {
      const editor = editorInstance as any;
      const currentBlock = editor.blocks.getCurrentBlockIndex();
      await editor.blocks.insert(type, data, {}, currentBlock + 1);
      setTimeout(() => {
        editor.caret.setToBlock(currentBlock + 1);
      }, 100);
      message.success(`已插入${type}`);
    } catch {
      // 插入块失败处理
      message.error('插入失败');
    }
  };

  // 处理格式化命令
  const handleFormat = (command: string) => {
    // 由于 EditorJS 的限制，这里主要是触发内联工具
    message.info(`${command} 功能 - 请选择文本后使用内联工具栏`);
    if (onCommand) {
      onCommand('format', { type: command });
    }
  };

  // 处理文件操作
  const handleFileOperation = (operation: string) => {
    switch (operation) {
      case 'new':
        Modal.confirm({
          title: '新建文档',
          content: '确定要创建新文档吗？当前未保存的内容可能会丢失。',
          onOk: () => {
            if (editorInstance && typeof editorInstance === 'object' && 'clear' in editorInstance) {
              (editorInstance as any).clear();
              message.success('已创建新文档');
            }
          }
        });
        break;
        
      case 'open':
        // 模拟文件选择器
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,.txt,.md';
        fileInput.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const content = JSON.parse(e.target?.result as string);
                if (editorInstance && typeof editorInstance === 'object' && 'render' in editorInstance) {
                  (editorInstance as any).render(content);
                  message.success('文档已加载');
                }
              } catch {
                message.error('文件格式不正确');
              }
            };
            reader.readAsText(file);
          }
        };
        fileInput.click();
        break;
        
      case 'save':
        if (editorInstance && typeof editorInstance === 'object' && 'save' in editorInstance) {
          (editorInstance as any).save().then((data: unknown) => {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.json';
            a.click();
            URL.revokeObjectURL(url);
            message.success('文档已保存');
          });
        }
        break;
        
      case 'export':
        if (editorInstance && typeof editorInstance === 'object' && 'save' in editorInstance) {
          (editorInstance as any).save().then((data: { blocks: Array<{ type: string; data: unknown }> }) => {
            // 转换为纯文本
            const textContent = data.blocks.map((block: { type: string; data: unknown }) => {
              const blockData = block.data as any; // 临时类型断言处理
              switch (block.type) {
                case 'header':
                  return '#'.repeat(blockData.level || 1) + ' ' + (blockData.text || '');
                case 'paragraph':
                  return blockData.text || '';
                case 'list':
                  return (blockData.items || []).map((item: string, index: number) => 
                    blockData.style === 'ordered' 
                      ? `${index + 1}. ${item}`
                      : `• ${item}`
                  ).join('\n');
                case 'quote':
                  return `> ${blockData.text || ''}`;
                case 'code':
                  return `\`\`\`\n${blockData.code || ''}\n\`\`\``;
                default:
                  return blockData.text || '';
              }
            }).join('\n\n');
            
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.txt';
            a.click();
            URL.revokeObjectURL(url);
            message.success('文档已导出');
          });
        }
        break;
        
      case 'print':
        window.print();
        break;
    }
    
    if (onCommand) {
      onCommand('file', { operation });
    }
  };

  // 切换全屏模式
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onCommand) {
      onCommand('fullscreen', { enabled: !isFullscreen });
    }
  };

  // 添加评论
  const handleAddComment = () => {
    if (commentText.trim()) {
      message.success('评论已添加');
      setCommentText('');
      setShowCommentModal(false);
      if (onCommand) {
        onCommand('comment', { text: commentText });
      }
    }
  };

  // 字体颜色选择器
  const fontColorPicker = (
    <div style={{ padding: '12px' }}>
      <div style={{ marginBottom: '12px' }}>
        <Text strong>文字颜色</Text>
      </div>
      <ColorPicker 
        defaultValue="#000000"
        onChange={(color) => {
          message.info(`文字颜色已设置为 ${color.toHexString()}`);
        }}
      />
    </div>
  );

  // 背景颜色选择器
  const backgroundColorPicker = (
    <div style={{ padding: '12px' }}>
      <div style={{ marginBottom: '12px' }}>
        <Text strong>背景颜色</Text>
      </div>
      <ColorPicker 
        defaultValue="#ffffff"
        onChange={(color) => {
          message.info(`背景颜色已设置为 ${color.toHexString()}`);
        }}
      />
    </div>
  );

  return (
    <div className={`ao-bg-white ao-border-b ao-border-gray-100 ao-shadow-sm ${className}`}>
      {/* 主工具栏 - AO风格精简设计 */}
      <div className="ao-flex ao-items-center ao-px-4 ao-py-2 ao-space-x-1">
        
        {/* 撤销重做 */}
        <div className="ao-flex ao-items-center ao-space-x-0.5">
          <Tooltip title="撤销 (Ctrl+Z)" placement="bottom">
            <Button 
              type="text" 
              icon={<UndoOutlined />}
              onClick={() => handleFormat('undo')}
              className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
            />
          </Tooltip>
          
          <Tooltip title="重做 (Ctrl+Y)" placement="bottom">
            <Button 
              type="text" 
              icon={<RedoOutlined />}
              onClick={() => handleFormat('redo')}
              className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
            />
          </Tooltip>
        </div>

        <Divider type="vertical" className="ao-h-4 ao-mx-2" />

        {/* 格式化工具 - 核心功能 */}
        <div className="ao-flex ao-items-center ao-space-x-0.5">
          {formatCommands.map(cmd => (
            <Tooltip key={cmd.key} title={`${cmd.title} (${cmd.shortcut})`} placement="bottom">
              <Button 
                type="text" 
                icon={cmd.icon}
                onClick={() => handleFormat(cmd.key)}
                className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
              />
            </Tooltip>
          ))}
          
          <Popover 
            content={fontColorPicker} 
            trigger="click"
            placement="bottom"
          >
            <Button 
              type="text" 
              icon={<FontColorsOutlined />} 
              className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
            />
          </Popover>
          
          <Popover 
            content={backgroundColorPicker} 
            trigger="click"
            placement="bottom"
          >
            <Button 
              type="text" 
              icon={<BgColorsOutlined />} 
              className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
            />
          </Popover>

          <Dropdown
            menu={{
              items: fontSizeOptions.map(size => ({
                key: size.value.toString(),
                label: `${size.label} (${size.value}px)`,
                onClick: () => message.info(`字体大小设置为 ${size.value}px`)
              }))
            }}
            trigger={['click']}
            placement="bottom"
          >
            <Button 
              type="text" 
              icon={<FontSizeOutlined />} 
              className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
            />
          </Dropdown>
        </div>

        <Divider type="vertical" className="ao-h-4 ao-mx-2" />

        {/* 对齐和列表工具 */}
        <div className="ao-flex ao-items-center ao-space-x-0.5">
          {alignmentOptions.map(align => (
            <Tooltip key={align.key} title={align.title} placement="bottom">
              <Button 
                type="text" 
                icon={align.icon}
                onClick={() => handleFormat(`align-${align.key}`)}
                className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
              />
            </Tooltip>
          ))}
        </div>

        <Divider type="vertical" className="ao-h-4 ao-mx-2" />

        <div className="ao-flex ao-items-center ao-space-x-0.5">
          {listOptions.map(list => (
            <Tooltip key={list.key} title={list.title} placement="bottom">
              <Button 
                type="text" 
                icon={list.icon}
                onClick={list.action}
                className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
              />
            </Tooltip>
          ))}
        </div>

        <Divider type="vertical" className="ao-h-4 ao-mx-2" />

        {/* 插入工具 - 简化为下拉菜单 */}
        <Dropdown
          menu={{
            items: insertOptions.map(insert => ({
              key: insert.key,
              label: insert.label,
              icon: insert.icon,
              onClick: insert.action
            }))
          }}
          trigger={['click']}
          placement="bottom"
        >
          <Button 
            type="text" 
            icon={<FileAddOutlined />}
            className="ao-px-2 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors ao-text-sm"
          >
            插入
          </Button>
        </Dropdown>

        {/* 更多工具 - 收纳不常用功能 */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'comment',
                label: '添加评论',
                icon: <CommentOutlined />,
                onClick: () => setShowCommentModal(true)
              },
              {
                key: 'search',
                label: '搜索',
                icon: <SearchOutlined />,
                onClick: () => message.info('搜索功能开发中')
              },
              {
                key: 'fullscreen',
                label: isFullscreen ? '退出全屏' : '全屏模式',
                icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
                onClick: toggleFullscreen
              },
              {
                key: 'settings',
                label: '设置',
                icon: <SettingOutlined />,
                onClick: () => message.info('设置功能开发中')
              }
            ]
          }}
          trigger={['click']}
          placement="bottom"
        >
          <Button 
            type="text" 
            icon={<MoreOutlined />}
            className="ao-w-8 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors"
          />
        </Dropdown>

        {/* 灵活空间，用于右对齐 */}
        <div className="ao-flex-1" />

        {/* 右侧工具 - 文件操作 */}
        <div className="ao-flex ao-items-center ao-space-x-1">
          <Dropdown
            menu={{
              items: fileOperations.map(op => ({
                key: op.key,
                label: op.label,
                icon: op.icon,
                onClick: op.action
              }))
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<FileOutlined />}
              className="ao-px-2 ao-h-8 ao-rounded-md hover:ao-bg-gray-50 ao-transition-colors ao-text-sm"
            >
              文件
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* 评论弹窗 */}
      <Modal
        title={
          <div className="ao-flex ao-items-center ao-space-x-2">
            <CommentOutlined className="ao-text-blue-600" />
            <span>添加评论</span>
          </div>
        }
        open={showCommentModal}
        onOk={handleAddComment}
        onCancel={() => setShowCommentModal(false)}
        okText="添加评论"
        cancelText="取消"
        okButtonProps={{
          className: "ao-bg-blue-600 hover:ao-bg-blue-700 ao-border-blue-600"
        }}
        width={480}
      >
        <div className="ao-py-4">
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="输入您的评论..."
            rows={4}
            showCount
            maxLength={500}
            className="ao-resize-none"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
};

export default DocumentToolbar;