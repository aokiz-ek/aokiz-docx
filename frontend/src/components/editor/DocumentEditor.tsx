'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Typography, Button, Space, Tooltip, Divider, message } from 'antd';
import { 
  SaveOutlined, 
  ShareAltOutlined, 
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { OutputData } from '@editorjs/editorjs';
import EditorJS from './EditorJS';
import { EditorJSRef, DocumentEditorData } from '@/types/editor';
import './editor.css';

const { Title } = Typography;

export interface DocumentEditorProps {
  document?: DocumentEditorData;
  onSave?: (data: DocumentEditorData) => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: OutputData) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  showCollaborators?: boolean;
  className?: string;
}

/**
 * AO风格的文档编辑器组件
 * 包含标题编辑、工具栏、协作者显示等功能
 */
const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onTitleChange,
  onContentChange,
  readOnly = false,
  showToolbar = true,
  showCollaborators = true,
  className = ''
}) => {
  const [title, setTitle] = useState(document?.title || '无标题文档');
  const [content, setContent] = useState<OutputData | undefined>(document?.content);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(document?.lastModified || null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const editorRef = useRef<EditorJSRef>(null);

  // 处理标题变更
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  // 处理内容变更 - 使用防抖避免频繁更新导致焦点丢失
  const handleContentChange = useCallback((newContent: OutputData) => {
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [onContentChange]);

  // 处理保存
  const handleSave = useCallback(async (showMessage = true) => {
    if (!onSave || !content) return;

    try {
      setIsSaving(true);
      
      const documentData: DocumentEditorData = {
        documentId: document?.documentId || 'new',
        title,
        content,
        lastModified: new Date(),
        owner: document?.owner || 'current-user',
        collaborators: document?.collaborators || []
      };

      await onSave(documentData);
      setLastSaved(new Date());
      
      if (showMessage) {
        message.success('文档已保存');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存失败:', error);
      if (showMessage) {
        message.error('保存失败，请重试');
      }
    } finally {
      setIsSaving(false);
    }
  }, [onSave, content, title, document?.documentId, document?.owner, document?.collaborators]);

  // 自动保存功能
  useEffect(() => {
    const autoSaveTimer = setInterval(async () => {
      if (!readOnly && onSave && (content || title !== document?.title)) {
        await handleSave(false);
      }
    }, 30000); // 30秒自动保存

    return () => clearInterval(autoSaveTimer);
  }, [content, title, readOnly, onSave, document?.title, handleSave]);

  // 处理分享
  const handleShare = () => {
    // TODO: 实现分享功能
    message.info('分享功能开发中');
  };

  // 格式化最后保存时间
  const formatLastSaved = (date: Date | null) => {
    if (!date) return '未保存';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚保存';
    if (minutes < 60) return `${minutes}分钟前保存`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前保存`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`ao-flex ao-flex-col ao-h-full ao-bg-white ${className}`}>
      {/* 顶部工具栏 */}
      {showToolbar && (
        <div className="ao-flex ao-items-center ao-justify-between ao-px-6 ao-py-3 ao-border-b ao-border-gray-200 ao-bg-white">
          <div className="ao-flex ao-items-center ao-space-x-4">
            {/* 文档标题 */}
            <div className="ao-flex ao-items-center ao-space-x-2">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onPressEnter={() => setIsEditingTitle(false)}
                  className="ao-text-lg ao-font-semibold ao-border-none ao-shadow-none"
                  style={{ padding: 0 }}
                  autoFocus
                />
              ) : (
                <Title 
                  level={4} 
                  className="!ao-mb-0 ao-cursor-pointer ao-text-gray-800 hover:ao-text-blue-600"
                  onClick={() => !readOnly && setIsEditingTitle(true)}
                >
                  {title}
                </Title>
              )}
              
              {!readOnly && !isEditingTitle && (
                <Tooltip title="编辑标题">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => setIsEditingTitle(true)}
                    className="ao-text-gray-400 hover:ao-text-blue-600"
                  />
                </Tooltip>
              )}
            </div>

            {/* 保存状态 */}
            <div className="ao-flex ao-items-center ao-space-x-2 ao-text-sm ao-text-gray-500">
              <ClockCircleOutlined />
              <span>{formatLastSaved(lastSaved)}</span>
            </div>
          </div>

          <div className="ao-flex ao-items-center ao-space-x-2">
            {/* 协作者头像 */}
            {showCollaborators && document?.collaborators && (
              <div className="ao-flex ao-items-center ao--space-x-2">
                {document.collaborators.slice(0, 3).map((collaborator, index) => (
                  <Tooltip key={index} title={collaborator}>
                    <div className="ao-w-8 ao-h-8 ao-rounded-full ao-bg-blue-500 ao-flex ao-items-center ao-justify-center ao-text-white ao-text-sm ao-font-medium ao-border-2 ao-border-white">
                      <UserOutlined />
                    </div>
                  </Tooltip>
                ))}
                {document.collaborators.length > 3 && (
                  <div className="ao-w-8 ao-h-8 ao-rounded-full ao-bg-gray-300 ao-flex ao-items-center ao-justify-center ao-text-gray-600 ao-text-sm ao-font-medium ao-border-2 ao-border-white">
                    +{document.collaborators.length - 3}
                  </div>
                )}
              </div>
            )}

            <Divider type="vertical" />

            {/* 操作按钮 */}
            <Space size="small">
              {!readOnly && (
                <Tooltip title="保存文档">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={isSaving}
                    onClick={() => handleSave(true)}
                  >
                    保存
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="分享文档">
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                >
                  分享
                </Button>
              </Tooltip>

              {readOnly && (
                <Tooltip title="只读模式">
                  <Button icon={<EyeOutlined />}>
                    只读
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="更多操作">
                <Button
                  icon={<MoreOutlined />}
                  onClick={() => message.info('更多功能开发中')}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      )}

      {/* 编辑器主体 */}
      <div className="ao-flex-1 ao-overflow-hidden">
        <div className="ao-h-full ao-overflow-y-auto">
          <div className="ao-max-w-4xl ao-mx-auto ao-px-6 ao-py-8">
            {/* EditorJS 编辑器 */}
            <EditorJS
              ref={editorRef}
              value={content}
              onChange={handleContentChange}
              readOnly={readOnly}
              placeholder={readOnly ? '这是一个只读文档' : '输入 / 来查看所有命令'}
              minHeight={400}
              autoFocus={!readOnly}
              className="ao-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;