'use client';

import React, { useRef, useState } from 'react';
import { Button, message, Space } from 'antd';
import { EditorJS, EditorJSRef } from '@/components/editor';
import { OutputData } from '@editorjs/editorjs';

/**
 * 编辑器测试页面
 * 用于测试基础功能是否正常
 */
export default function EditorTestPage() {
  const editorRef = useRef<EditorJSRef>(null);
  const [content, setContent] = useState<OutputData | undefined>({
    time: Date.now(),
    blocks: [
      {
        type: 'paragraph',
        data: {
          text: '这是一个测试文档。请尝试编辑内容，输入 / 来插入新的块。'
        }
      }
    ],
    version: '2.30.8'
  });

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    try {
      const data = await editorRef.current.save();
      setContent(data);
      message.success('内容已保存');
      // eslint-disable-next-line no-console
      console.log('保存的内容:', data);
    } catch (error) {
      message.error('保存失败');
      // eslint-disable-next-line no-console
      console.error('保存失败:', error);
    }
  };

  const handleClear = async () => {
    if (!editorRef.current) return;
    
    try {
      await editorRef.current.clear();
      message.info('内容已清空');
    } catch (error) {
      message.error('清空失败');
      // eslint-disable-next-line no-console
      console.error('清空失败:', error);
    }
  };

  return (
    <div className="ao-min-h-screen ao-bg-gray-50 ao-p-6">
      <div className="ao-max-w-4xl ao-mx-auto">
        <div className="ao-mb-6">
          <h1 className="ao-text-2xl ao-font-bold ao-mb-4">
            Editor.js 测试页面
          </h1>
          <Space>
            <Button type="primary" onClick={handleSave}>
              保存内容
            </Button>
            <Button onClick={handleClear}>
              清空内容
            </Button>
          </Space>
        </div>

        <div className="ao-bg-white ao-rounded-lg ao-shadow-sm ao-p-6">
          <EditorJS
            ref={editorRef}
            value={content}
            onChange={(data) => {
              setContent(data);
              // eslint-disable-next-line no-console
              console.log('内容变更:', data);
            }}
            onReady={() => {
              // eslint-disable-next-line no-console
              console.log('编辑器准备就绪');
              message.info('编辑器已加载完成');
            }}
            placeholder="在这里开始编辑，输入 / 查看所有可用的块..."
            minHeight={400}
            autoFocus={true}
            className="ao-border ao-rounded"
          />
        </div>

        <div className="ao-mt-6 ao-p-4 ao-bg-blue-50 ao-rounded-lg">
          <h3 className="ao-text-lg ao-font-semibold ao-mb-2">测试说明:</h3>
          <ul className="ao-space-y-1 ao-text-sm ao-text-gray-600">
            <li>• 输入 <code className="ao-bg-white ao-px-1 ao-rounded">/</code> 来插入各种类型的内容块</li>
            <li>• 支持标题、列表、代码块、引用、表格等多种格式</li>
            <li>• 选中文本可以进行粗体、斜体等格式化</li>
            <li>• 点击保存按钮可以查看 JSON 数据输出</li>
          </ul>
        </div>
      </div>
    </div>
  );
}