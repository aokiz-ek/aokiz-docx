'use client';

import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/lib/antd-config';
import { FeishuDocumentEditor } from '@/components/editor';
import { DocumentEditorData } from '@/types/editor';
import { OutputData } from '@editorjs/editorjs';

/**
 * 编辑器页面
 * 展示飞书风格的文档编辑功能
 */
export default function EditorPage() {
  // 示例文档数据
  const [documentData, setDocumentData] = useState<DocumentEditorData>({
    documentId: 'demo-doc-001',
    title: '飞书风格文档编辑器演示',
    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: {
            text: '欢迎使用 Aokiz Docx 编辑器',
            level: 1
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '这是一个基于 Editor.js 构建的飞书风格文档编辑器。支持丰富的文本格式和交互功能。'
          }
        },
        {
          type: 'header',
          data: {
            text: '主要特性',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '📝 丰富的文本编辑功能',
              '🎨 飞书风格的界面设计', 
              '🔧 基于 Editor.js 的块编辑器',
              '💾 自动保存和版本管理',
              '👥 协作功能支持（开发中）',
              '🌙 暗色主题支持'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '快捷操作',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '输入 <code>/</code> 可以快速插入各种内容块，包括标题、列表、代码块、表格、图片等。'
          }
        },
        {
          type: 'quote',
          data: {
            text: '好的工具能够提高工作效率，让创作变得更加愉悦。',
            caption: '设计理念'
          }
        }
      ],
      version: '2.30.8'
    },
    lastModified: new Date(),
    owner: 'demo-user',
    collaborators: ['张三', '李四', '王五', '赵六']
  });

  // 处理文档保存
  const handleSave = async (data: DocumentEditorData): Promise<void> => {
    try {
      // 模拟保存到服务器
      // eslint-disable-next-line no-console
      console.log('保存文档:', data);
      
      // 在实际项目中，这里会调用 API 保存到后端
      setDocumentData(prev => ({
        ...prev,
        ...data,
        lastModified: new Date()
      }));
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // eslint-disable-next-line no-console
      console.log('文档保存成功');
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