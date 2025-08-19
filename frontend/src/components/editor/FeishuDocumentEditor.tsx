'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Typography, Button, Space, Tooltip, Divider, message, Avatar, Dropdown } from 'antd';
import { 
  SaveOutlined, 
  ShareAltOutlined, 
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  HistoryOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { OutputData } from '@editorjs/editorjs';
import EditorJS from './EditorJS';
import { EditorJSRef, DocumentEditorData } from '@/types/editor';
import './editor.css';

const { Title } = Typography;

export interface FeishuDocumentEditorProps {
  document?: DocumentEditorData;
  onSave?: (data: DocumentEditorData) => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: OutputData) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * 飞书风格文档编辑器 - 重新设计版本
 * 专业的文档编辑体验，解决焦点丢失和布局问题
 */
const FeishuDocumentEditor: React.FC<FeishuDocumentEditorProps> = ({
  document,
  onSave,
  onTitleChange,
  onContentChange,
  readOnly = false,
  className = ''
}) => {
  const [title, setTitle] = useState(document?.title || '无标题文档');
  const [content, setContent] = useState<OutputData | undefined>(document?.content);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(document?.lastModified || null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  
  const editorRef = useRef<EditorJSRef>(null);

  // 处理标题变更
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  // 处理内容变更 - 防止焦点丢失
  const handleContentChange = useCallback((newContent: OutputData) => {
    // 立即更新本地状态以保持编辑器响应性
    setContent(newContent);
    
    // 使用防抖延迟通知父组件，避免频繁重新渲染导致焦点丢失
    if (onContentChange) {
      // 这里不应该返回清理函数，而是在外部管理防抖
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

  // 更多操作菜单
  const moreMenuItems = [
    {
      key: 'export',
      label: '导出文档',
      icon: <DownloadOutlined />
    },
    {
      key: 'print',
      label: '打印',
      icon: <PrinterOutlined />
    },
    {
      key: 'settings',
      label: '文档设置',
      icon: <SettingOutlined />
    }
  ];

  return (
    <div className={`ao-flex ao-h-screen ao-bg-gray-50 ${className}`}>
      {/* 主要内容区域 */}
      <div className="ao-flex-1 ao-flex ao-flex-col ao-min-w-0">
        
        {/* 顶部工具栏 - 飞书风格 */}
        <div className="ao-bg-white ao-border-b ao-border-gray-200 ao-px-6 ao-py-3 ao-flex ao-items-center ao-justify-between ao-h-16">
          <div className="ao-flex ao-items-center ao-space-x-4 ao-flex-1">
            {/* 文档标题 */}
            <div className="ao-flex ao-items-center ao-space-x-2 ao-max-w-md">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onPressEnter={() => setIsEditingTitle(false)}
                  className="ao-text-lg ao-font-medium ao-border-none ao-shadow-none ao-bg-transparent"
                  style={{ padding: '4px 0' }}
                  autoFocus
                  maxLength={100}
                />
              ) : (
                <div 
                  className="ao-cursor-pointer ao-text-lg ao-font-medium ao-text-gray-900 hover:ao-text-blue-600 ao-py-1 ao-px-2 ao-rounded hover:ao-bg-gray-50 ao-transition-colors ao-truncate"
                  onClick={() => !readOnly && setIsEditingTitle(true)}
                  title={title}
                >
                  {title}
                </div>
              )}
              
              {!readOnly && !isEditingTitle && (
                <Tooltip title="编辑标题">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => setIsEditingTitle(true)}
                    className="ao-text-gray-400 hover:ao-text-blue-600 ao-opacity-0 group-hover:ao-opacity-100 ao-transition-opacity"
                  />
                </Tooltip>
              )}
            </div>

            {/* 保存状态 */}
            <div className="ao-flex ao-items-center ao-space-x-2 ao-text-sm ao-text-gray-500">
              <ClockCircleOutlined className="ao-w-4 ao-h-4" />
              <span>{formatLastSaved(lastSaved)}</span>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="ao-flex ao-items-center ao-space-x-3">
            {/* 协作者头像组 */}
            {document?.collaborators && document.collaborators.length > 0 && (
              <div className="ao-flex ao-items-center ao--space-x-2">
                {document.collaborators.slice(0, 3).map((collaborator, index) => (
                  <Tooltip key={index} title={collaborator}>
                    <Avatar 
                      size={32}
                      className="ao-border-2 ao-border-white ao-shadow-sm"
                      style={{ backgroundColor: '#87d068' }}
                    >
                      {collaborator.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
                {document.collaborators.length > 3 && (
                  <Tooltip title={`还有 ${document.collaborators.length - 3} 位协作者`}>
                    <Avatar 
                      size={32}
                      className="ao-border-2 ao-border-white ao-bg-gray-300 ao-text-gray-600"
                    >
                      +{document.collaborators.length - 3}
                    </Avatar>
                  </Tooltip>
                )}
              </div>
            )}

            <Divider type="vertical" className="ao-h-6" />

            {/* 操作按钮 */}
            <Space size="small">
              {/* 协作面板切换 */}
              <Tooltip title={showCollaborationPanel ? '隐藏协作面板' : '显示协作面板'}>
                <Button
                  type="text"
                  icon={showCollaborationPanel ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                  onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
                  className="ao-w-8 ao-h-8"
                />
              </Tooltip>

              {/* 评论 */}
              <Tooltip title="评论">
                <Button
                  type="text"
                  icon={<CommentOutlined />}
                  className="ao-w-8 ao-h-8"
                  onClick={() => message.info('评论功能开发中')}
                />
              </Tooltip>

              {/* 保存 */}
              {!readOnly && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={isSaving}
                  onClick={() => handleSave(true)}
                  size="middle"
                >
                  保存
                </Button>
              )}

              {/* 分享 */}
              <Button
                type="default"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                size="middle"
              >
                分享
              </Button>

              {/* 更多操作 */}
              <Dropdown
                menu={{ 
                  items: moreMenuItems,
                  onClick: ({ key }) => message.info(`${key} 功能开发中`)
                }}
                trigger={['click']}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className="ao-w-8 ao-h-8"
                />
              </Dropdown>
            </Space>
          </div>
        </div>

        {/* 编辑器主体区域 */}
        <div className="ao-flex-1 ao-overflow-hidden ao-bg-gray-50">
          <div className="ao-h-full ao-overflow-y-auto">
            {/* 文档容器 - 飞书风格的居中布局 */}
            <div className="ao-max-w-4xl ao-mx-auto ao-py-8 ao-px-6">
              <div className="ao-bg-white ao-shadow-sm ao-rounded-lg ao-overflow-hidden">
                {/* 编辑器内容区 */}
                <div className="ao-p-12">
                  <EditorJS
                    ref={editorRef}
                    value={content}
                    onChange={handleContentChange}
                    readOnly={readOnly}
                    placeholder={readOnly ? '这是一个只读文档' : '输入 / 来查看所有命令'}
                    minHeight={500}
                    autoFocus={!readOnly}
                    className="feishu-editor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧协作面板 */}
      {showCollaborationPanel && (
        <div className="ao-w-80 ao-bg-white ao-border-l ao-border-gray-200 ao-flex ao-flex-col">
          {/* 面板头部 */}
          <div className="ao-p-4 ao-border-b ao-border-gray-200 ao-flex ao-items-center ao-justify-between">
            <Title level={5} className="!ao-mb-0">协作面板</Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => setShowCollaborationPanel(false)}
            />
          </div>

          {/* 面板内容 */}
          <div className="ao-flex-1 ao-p-4 ao-space-y-6">
            {/* 在线用户 */}
            <div>
              <div className="ao-text-sm ao-font-medium ao-text-gray-700 ao-mb-3">在线用户</div>
              <div className="ao-space-y-2">
                {document?.collaborators?.map((collaborator, index) => (
                  <div key={index} className="ao-flex ao-items-center ao-space-x-3">
                    <Avatar size={24} style={{ backgroundColor: '#87d068' }}>
                      {collaborator.charAt(0)}
                    </Avatar>
                    <span className="ao-text-sm ao-text-gray-700">{collaborator}</span>
                    <div className="ao-w-2 ao-h-2 ao-rounded-full ao-bg-green-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* 版本历史 */}
            <div>
              <div className="ao-text-sm ao-font-medium ao-text-gray-700 ao-mb-3 ao-flex ao-items-center">
                <HistoryOutlined className="ao-mr-2" />
                版本历史
              </div>
              <div className="ao-text-sm ao-text-gray-500">
                暂无版本历史
              </div>
            </div>

            {/* 评论 */}
            <div>
              <div className="ao-text-sm ao-font-medium ao-text-gray-700 ao-mb-3 ao-flex ao-items-center">
                <CommentOutlined className="ao-mr-2" />
                评论
              </div>
              <div className="ao-text-sm ao-text-gray-500">
                暂无评论
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeishuDocumentEditor;