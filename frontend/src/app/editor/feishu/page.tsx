'use client';

import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/lib/antd-config';
import { FeishuDocumentEditor } from '@/components/editor';
import { DocumentEditorData } from '@/types/editor';
import { OutputData } from '@editorjs/editorjs';

/**
 * 飞书风格编辑器页面
 * 展示重新设计的专业文档编辑体验
 */
export default function FeishuEditorPage() {
  // 示例文档数据 - 更丰富的内容
  const [documentData, setDocumentData] = useState<DocumentEditorData>({
    documentId: 'feishu-demo-001',
    title: '🚀 Aokiz Docx 飞书风格编辑器',
    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: {
            text: '欢迎使用飞书风格文档编辑器',
            level: 1
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '这是一个重新设计的专业文档编辑器，采用飞书风格的界面设计和交互体验。我们已经解决了焦点丢失问题，现在可以流畅地进行编辑。'
          }
        },
        {
          type: 'header',
          data: {
            text: '🎨 设计亮点',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '🎯 专业的顶部工具栏设计',
              '📄 居中的文档内容区域', 
              '👥 右侧可折叠的协作面板',
              '💾 智能的自动保存功能',
              '🎨 统一的视觉设计语言',
              '⚡ 流畅的编辑体验，无焦点丢失'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '✨ 核心特性',
            level: 2
          }
        },
        {
          type: 'checklist',
          data: {
            items: [
              {
                text: '修复了编辑器焦点自动丢失的问题',
                checked: true
              },
              {
                text: '重新设计了飞书风格的界面布局',
                checked: true
              },
              {
                text: '优化了工具栏和协作者显示',
                checked: true
              },
              {
                text: '实现了专业的文档编辑体验',
                checked: true
              },
              {
                text: '添加了协作面板和版本控制',
                checked: false
              }
            ]
          }
        },
        {
          type: 'quote',
          data: {
            text: '设计的目标是让用户专注于内容创作，而不是与工具斗争。',
            caption: '设计理念'
          }
        },
        {
          type: 'header',
          data: {
            text: '🛠️ 技术实现',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '通过以下技术手段解决了焦点丢失问题：'
          }
        },
        {
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              '避免在用户编辑时触发编辑器重新渲染',
              '使用 useCallback 优化组件重新渲染',
              '改进了 useEffect 依赖项管理',
              '实现了更好的状态管理策略'
            ]
          }
        },
        {
          type: 'delimiter'
        },
        {
          type: 'paragraph',
          data: {
            text: '现在可以自由地编辑内容，输入 <code>/</code> 来插入新的内容块，体验流畅的编辑过程！'
          }
        }
      ],
      version: '2.30.8'
    },
    lastModified: new Date(),
    owner: 'design-team',
    collaborators: ['Alice Chen', 'Bob Wang', 'Carol Li', 'David Zhang', 'Eva Liu']
  });

  // 处理文档保存
  const handleSave = async (data: DocumentEditorData): Promise<void> => {
    try {
      // 模拟保存到服务器
      // eslint-disable-next-line no-console
      console.log('保存飞书风格文档:', data);
      
      setDocumentData(prev => ({
        ...prev,
        ...data,
        lastModified: new Date()
      }));
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // eslint-disable-next-line no-console
      console.log('飞书风格文档保存成功');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存失败:', error);
      throw error;
    }
  };

  // 处理标题变更
  const handleTitleChange = (title: string) => {
    setDocumentData(prev => ({
      ...prev,
      title
    }));
  };

  // 处理内容变更
  const handleContentChange = (content: OutputData) => {
    setDocumentData(prev => ({
      ...prev,
      content,
      lastModified: new Date()
    }));
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <FeishuDocumentEditor
        document={documentData}
        onSave={handleSave}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        className="ao-h-screen"
      />
    </ConfigProvider>
  );
}