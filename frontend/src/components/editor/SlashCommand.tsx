'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Input
} from 'antd';
import {
  FileTextOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  TableOutlined,
  PictureOutlined,
  LinkOutlined,
  BlockOutlined,
  WarningOutlined,
  LineOutlined,
  YoutubeOutlined,
  FontSizeOutlined,
  AppstoreOutlined,
  UploadOutlined,
  CaretDownOutlined,
  ControlOutlined,
  BgColorsOutlined,
  UnderlineOutlined
} from '@ant-design/icons';
import {
  AlertOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

export interface SlashCommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  category: 'basic' | 'list' | 'media' | 'advanced';
  shortcut?: string;
  action: () => void;
}

export interface SlashCommandProps {
  visible: boolean;
  position: { x: number; y: number };
  onSelect: (item: SlashCommandItem) => void;
  onClose: () => void;
  editorInstance?: any;
}

/**
 * 飞书风格的斜杠命令菜单
 * 提供类似 Notion/飞书的块插入体验
 */
export const SlashCommand: React.FC<SlashCommandProps> = ({
  visible,
  position,
  onSelect,
  onClose,
  editorInstance
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  // 命令列表配置
  const commands: SlashCommandItem[] = useMemo(() => [
    // 基础块
    {
      id: 'paragraph',
      label: '段落',
      description: '普通文本段落',
      icon: <FileTextOutlined />,
      keywords: ['paragraph', 'text', '段落', '文字', 'p'],
      category: 'basic',
      action: () => insertBlock('paragraph', {})
    },
    {
      id: 'header1',
      label: '大标题',
      description: '一级标题',
      icon: <FontSizeOutlined style={{ fontSize: '20px', fontWeight: 'bold' }} />,
      keywords: ['heading', 'title', '标题', 'h1', 'header'],
      category: 'basic',
      shortcut: '#',
      action: () => insertBlock('header', { level: 1 })
    },
    {
      id: 'header2',
      label: '中标题',
      description: '二级标题',
      icon: <FontSizeOutlined style={{ fontSize: '18px' }} />,
      keywords: ['heading', 'title', '标题', 'h2', 'header'],
      category: 'basic',
      shortcut: '##',
      action: () => insertBlock('header', { level: 2 })
    },
    {
      id: 'header3',
      label: '小标题',
      description: '三级标题',
      icon: <FontSizeOutlined style={{ fontSize: '16px' }} />,
      keywords: ['heading', 'title', '标题', 'h3', 'header'],
      category: 'basic',
      shortcut: '###',
      action: () => insertBlock('header', { level: 3 })
    },

    // 列表类
    {
      id: 'unordered-list',
      label: '无序列表',
      description: '创建项目符号列表',
      icon: <UnorderedListOutlined />,
      keywords: ['list', 'bullet', '列表', '项目', 'ul'],
      category: 'list',
      shortcut: '-',
      action: () => insertBlock('list', { style: 'unordered' })
    },
    {
      id: 'ordered-list',
      label: '有序列表',
      description: '创建编号列表',
      icon: <OrderedListOutlined />,
      keywords: ['list', 'numbered', '列表', '编号', 'ol'],
      category: 'list',
      shortcut: '1.',
      action: () => insertBlock('list', { style: 'ordered' })
    },
    {
      id: 'checklist',
      label: '待办清单',
      description: '创建可勾选的任务列表',
      icon: <CheckSquareOutlined />,
      keywords: ['todo', 'task', 'checklist', '待办', '任务', '清单'],
      category: 'list',
      shortcut: '[]',
      action: () => insertBlock('checklist', { items: [{ text: '', checked: false }] })
    },

    // 媒体类
    {
      id: 'image',
      label: '图片',
      description: '上传或插入图片',
      icon: <PictureOutlined />,
      keywords: ['image', 'photo', 'picture', '图片', '图像'],
      category: 'media',
      action: () => insertBlock('image', {})
    },
    {
      id: 'table',
      label: '表格',
      description: '插入表格',
      icon: <TableOutlined />,
      keywords: ['table', 'grid', '表格', '表'],
      category: 'media',
      action: () => insertBlock('table', { withHeadings: true, rows: 3, cols: 3 })
    },
    {
      id: 'embed',
      label: '嵌入',
      description: '嵌入视频、链接等',
      icon: <YoutubeOutlined />,
      keywords: ['embed', 'video', 'youtube', '嵌入', '视频'],
      category: 'media',
      action: () => insertBlock('embed', {})
    },

    // 高级块
    {
      id: 'code',
      label: '代码块',
      description: '插入代码片段',
      icon: <CodeOutlined />,
      keywords: ['code', 'programming', '代码', '程序'],
      category: 'advanced',
      shortcut: '```',
      action: () => insertBlock('code', {})
    },
    {
      id: 'quote',
      label: '引用',
      description: '创建引用块',
      icon: <BlockOutlined />,
      keywords: ['quote', 'blockquote', '引用', '引言'],
      category: 'advanced',
      shortcut: '>',
      action: () => insertBlock('quote', {})
    },
    {
      id: 'warning',
      label: '警告',
      description: '创建警告提示块',
      icon: <WarningOutlined />,
      keywords: ['warning', 'alert', 'caution', '警告', '提示'],
      category: 'advanced',
      action: () => insertBlock('warning', {})
    },
    {
      id: 'delimiter',
      label: '分割线',
      description: '插入分割线',
      icon: <LineOutlined />,
      keywords: ['divider', 'separator', '分割', '分割线', 'hr'],
      category: 'advanced',
      shortcut: '---',
      action: () => insertBlock('delimiter', {})
    },
    {
      id: 'link',
      label: '链接',
      description: '插入链接卡片',
      icon: <LinkOutlined />,
      keywords: ['link', 'url', '链接', '网址'],
      category: 'advanced',
      action: () => insertBlock('linkTool', {})
    },

    // 新增的 awesome-editorjs 插件命令
    {
      id: 'columns',
      label: '多列布局',
      description: '创建多列内容布局',
      icon: <AppstoreOutlined />,
      keywords: ['columns', 'layout', '多列', '布局', '分栏'],
      category: 'advanced',
      action: () => insertBlock('columns', {})
    },
    
    {
      id: 'button',
      label: '按钮',
      description: '插入可点击按钮',
      icon: <ControlOutlined />,
      keywords: ['button', 'click', '按钮', '点击'],
      category: 'advanced',
      action: () => insertBlock('button', {
        text: '点击按钮',
        link: '',
        variant: 'primary'
      })
    },
    
    {
      id: 'toggle',
      label: '折叠块',
      description: '创建可折叠的内容区域',
      icon: <CaretDownOutlined />,
      keywords: ['toggle', 'collapse', 'accordion', '折叠', '收起', '展开'],
      category: 'advanced',
      action: () => insertBlock('toggle', {
        text: '点击展开',
        status: 'closed'
      })
    },
    
    {
      id: 'attaches',
      label: '文件附件',
      description: '上传和附加文件',
      icon: <UploadOutlined />,
      keywords: ['file', 'upload', 'attach', '文件', '上传', '附件'],
      category: 'media',
      action: () => insertBlock('attaches', {})
    },

    // 新增的 awesome-editorjs 插件命令
    {
      id: 'alert',
      label: '提示框',
      description: '创建彩色提示框',
      icon: <AlertOutlined />,
      keywords: ['alert', 'notice', 'info', '提示', '通知', '警告'],
      category: 'advanced',
      action: () => insertBlock('alert', {
        type: 'info',
        message: '这是一个提示信息',
        title: ''
      })
    },
    
    {
      id: 'spoiler',
      label: '剧透文本',
      description: '创建需要点击才能查看的隐藏文本',
      icon: <EyeInvisibleOutlined />,
      keywords: ['spoiler', 'hidden', 'secret', '剧透', '隐藏', '秘密'],
      category: 'advanced',
      action: () => insertBlock('spoiler', {
        text: '这是隐藏的剧透内容'
      })
    },
    
    {
      id: 'tooltip',
      label: '提示文本',
      description: '创建带提示的文本',
      icon: <InfoCircleOutlined />,
      keywords: ['tooltip', 'hint', 'help', '提示', '帮助', '说明'],
      category: 'advanced',
      action: () => insertBlock('tooltip', {
        text: '悬停查看提示',
        tooltip: '这是一个提示说明'
      })
    }
  ], []);

  // 插入块的函数
  const insertBlock = async (type: string, data: any) => {
    if (!editorInstance) return Promise.resolve();

    try {
      const currentBlock = editorInstance.blocks.getCurrentBlockIndex();
      await editorInstance.blocks.insert(type, data, {}, currentBlock + 1);
      // 聚焦到新插入的块
      setTimeout(() => {
        editorInstance.caret.setToBlock(currentBlock + 1);
      }, 100);
      return Promise.resolve();
    } catch (error) {
      console.error('插入块失败:', error);
      return Promise.reject(error);
    }
  };

  // 根据搜索词过滤命令
  const filteredCommands = useMemo(() => {
    if (!searchTerm.trim()) return commands;
    
    const term = searchTerm.toLowerCase().trim();
    return commands.filter(command => 
      command.label.toLowerCase().includes(term) ||
      command.description.toLowerCase().includes(term) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(term))
    );
  }, [commands, searchTerm]);

  // 按类别分组命令
  const groupedCommands = useMemo(() => {
    const groups: Record<string, SlashCommandItem[]> = {
      basic: [],
      list: [],
      media: [],
      advanced: []
    };

    filteredCommands.forEach(command => {
      groups[command.category].push(command);
    });

    return groups;
  }, [filteredCommands]);

  // 扁平化的命令列表（用于键盘导航）
  const flatCommands = useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < flatCommands.length - 1 ? prev + 1 : 0
          );
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : flatCommands.length - 1
          );
          break;
        
        case 'Enter':
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            handleCommandSelect(flatCommands[selectedIndex]);
          }
          break;
        
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, selectedIndex, flatCommands, onClose]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {};
  }, [visible, onClose]);

  // 自动聚焦搜索框
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  // 处理命令选择
  const handleCommandSelect = (command: SlashCommandItem) => {
    onSelect(command);
    command.action();
    onClose();
    return true;
  };

  // 类别标题映射
  const categoryTitles = {
    basic: '基础块',
    list: '列表',
    media: '媒体',
    advanced: '高级'
  };

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="ao-fixed ao-bg-white ao-rounded-lg ao-shadow-lg ao-border ao-border-gray-200 ao-z-50 ao-w-80 ao-max-h-96 ao-overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateY(-100%)'
      }}
    >
      {/* 搜索框 */}
      <div className="ao-p-3 ao-border-b ao-border-gray-100">
        <Input
          ref={inputRef}
          placeholder="搜索块类型..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ao-border-none ao-shadow-none"
          style={{ padding: '4px 8px' }}
        />
      </div>

      {/* 命令列表 */}
      <div className="ao-max-h-80 ao-overflow-y-auto">
        {Object.entries(groupedCommands).map(([category, categoryCommands]) => {
          if (categoryCommands.length === 0) return null;

          return (
            <div key={category}>
              <div className="ao-px-3 ao-py-2 ao-text-xs ao-font-medium ao-text-gray-500 ao-bg-gray-50">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </div>
              
              {categoryCommands.map((command) => {
                const globalIndex = flatCommands.indexOf(command);
                const isSelected = globalIndex === selectedIndex;
                
                return (
                  <div
                    key={command.id}
                    className={`ao-px-3 ao-py-2 ao-cursor-pointer ao-flex ao-items-center ao-space-x-3 hover:ao-bg-blue-50 ao-transition-colors ${
                      isSelected ? 'ao-bg-blue-50' : ''
                    }`}
                    onClick={() => handleCommandSelect(command)}
                  >
                    <div className={`ao-text-lg ${isSelected ? 'ao-text-blue-600' : 'ao-text-gray-600'}`}>
                      {command.icon}
                    </div>
                    
                    <div className="ao-flex-1">
                      <div className={`ao-text-sm ao-font-medium ${
                        isSelected ? 'ao-text-blue-900' : 'ao-text-gray-900'
                      }`}>
                        {command.label}
                        {command.shortcut && (
                          <span className="ao-ml-2 ao-text-xs ao-text-gray-400 ao-bg-gray-100 ao-px-1 ao-py-0.5 ao-rounded">
                            {command.shortcut}
                          </span>
                        )}
                      </div>
                      <div className="ao-text-xs ao-text-gray-500">
                        {command.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 无结果提示 */}
      {flatCommands.length === 0 && (
        <div className="ao-p-6 ao-text-center ao-text-gray-500">
          <div className="ao-text-sm">未找到匹配的块类型</div>
          <div className="ao-text-xs ao-mt-1">尝试其他关键词</div>
        </div>
      )}
    </div>
  );
};

export default SlashCommand;