'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ConfigProvider, Spin } from 'antd';
import { antdTheme } from '@/lib/antd-config';
import { DocumentEditorData } from '@/types/editor';
import { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';

// 动态导入编辑器组件，确保只在客户端加载
const FeishuDocumentEditor = dynamic(
  () => import('@/components/editor').then(mod => ({ default: mod.FeishuDocumentEditor })),
  { 
    ssr: false,
    loading: () => (
      <div className="ao-flex ao-items-center ao-justify-center ao-h-screen">
        <Spin size="large" tip="加载编辑器中..." />
      </div>
    )
  }
);

/**
 * AO风格编辑器页面
 * 展示重新设计的专业文档编辑体验
 */
export default function FeishuEditorPage() {
  // 使用 ref 存储文档数据，避免状态更新导致重新渲染
  const documentDataRef = useRef<DocumentEditorData>({
    documentId: 'feishu-demo-001',
    title: '🚀 Aokiz Docx AO风格编辑器',
    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: {
            text: '欢迎使用AO风格文档编辑器',
            level: 1
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '这是一个重新设计的专业文档编辑器，采用AO风格的界面设计和交互体验。我们已经解决了焦点丢失问题，现在可以流畅地进行编辑。'
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
                text: '重新设计了AO风格的界面布局',
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
          type: 'delimiter',
          data: {}
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

  // 初始状态仅用于传递给组件，之后不再更新
  const [initialDocumentData] = useState<DocumentEditorData>(documentDataRef.current);

  // 处理文档保存 - 完全避免状态更新
  const handleSave = async (data: DocumentEditorData): Promise<void> => {
    try {
      // 直接更新 ref，不触发重新渲染
      documentDataRef.current = {
        ...documentDataRef.current,
        ...data,
        lastModified: new Date()
      };
      
      // 模拟保存到服务器
      // eslint-disable-next-line no-console
      console.log('保存AO风格文档:', documentDataRef.current);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // eslint-disable-next-line no-console
      console.log('AO风格文档保存成功');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存失败:', error);
      throw error;
    }
  };

  // 处理标题变更 - 直接更新 ref
  const handleTitleChange = (title: string) => {
    documentDataRef.current = {
      ...documentDataRef.current,
      title
    };
  };

  // 处理内容变更 - 直接更新 ref，无防抖，无状态更新
  const handleContentChange = useCallback((content: OutputData) => {
    documentDataRef.current = {
      ...documentDataRef.current,
      content,
      lastModified: new Date()
    };
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <FeishuDocumentEditor
        document={initialDocumentData}
        onSave={handleSave}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        className="ao-h-screen"
      />
    </ConfigProvider>
  );
}