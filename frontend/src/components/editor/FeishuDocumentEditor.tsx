'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input, Typography, Button, Space, Tooltip, Divider, message, Avatar, Dropdown } from 'antd';
import { 
  SaveOutlined, 
  ShareAltOutlined, 
  MoreOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  HistoryOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  FileTextOutlined,
  CloudOutlined,
  BookOutlined,
  TeamOutlined,
  SearchOutlined,
  UserOutlined,
  FolderOutlined,
  SyncOutlined,
  PlusOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { OutputData } from '@editorjs/editorjs';
import EditorJS from './EditorJS';
import DocumentToolbar from './DocumentToolbar';
import { EditorJSRef, DocumentEditorData } from '@/types/editor';
import './editor.css';

const { Title, Text } = Typography;

export interface FeishuDocumentEditorProps {
  document?: DocumentEditorData;
  onSave?: (data: DocumentEditorData) => Promise<void>;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: OutputData) => void;
  readOnly?: boolean;
  className?: string;
  enableHoverToolbar?: boolean;
  hoverToolbarPlugins?: 'basic' | 'advanced' | 'full' | any[];
}

// 生成协作者颜色
const generateUserColor = (name: string): string => {
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 50%)`;
};

// 导航菜单项
const navigationItems = [
  { key: 'home', icon: <HomeOutlined />, label: '主页', active: false },
  { key: 'documents', icon: <FileTextOutlined />, label: '我的文档', active: true },
  { key: 'cloud', icon: <CloudOutlined />, label: '云盘', active: false },
  { key: 'knowledge', icon: <BookOutlined />, label: '知识库', active: false },
  { key: 'team', icon: <TeamOutlined />, label: '团队空间', active: false },
  { key: 'recent', icon: <ClockCircleOutlined />, label: '最近访问', active: false },
];

/**
 * 飞书风格文档编辑器 - 专业三栏布局设计
 * 左侧导航栏 + 中央编辑区 + 右侧协作面板
 */
const FeishuDocumentEditor: React.FC<FeishuDocumentEditorProps> = ({
  document,
  onSave,
  onTitleChange,
  onContentChange,
  readOnly = false,
  className = '',
  enableHoverToolbar = true,
  hoverToolbarPlugins = 'advanced'
}) => {
  // 核心数据管理
  const titleRef = useRef(document?.title || '无标题文档');
  const contentRef = useRef<OutputData | undefined>(document?.content);
  
  // UI 状态管理
  const [displayTitle, setDisplayTitle] = useState(document?.title || '无标题文档');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(document?.lastModified || null);
  const lastSavedRef = useRef<Date | null>(document?.lastModified || null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(true);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  
  const editorRef = useRef<EditorJSRef>(null);

  // 处理标题变更
  const handleTitleChange = (newTitle: string) => {
    titleRef.current = newTitle;
    setDisplayTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  // 处理内容变更
  const handleContentChange = useCallback((newContent: OutputData) => {
    contentRef.current = newContent;
    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [onContentChange]);

  // 处理保存
  const handleSave = useCallback(async (showMessage = true) => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      
      const currentContent = contentRef.current;
      const currentTitle = titleRef.current;
      
      if (!currentContent) return;
      
      const documentData: DocumentEditorData = {
        documentId: document?.documentId || 'new',
        title: currentTitle,
        content: currentContent,
        lastModified: new Date(),
        owner: document?.owner || 'current-user',
        collaborators: document?.collaborators || []
      };

      await onSave(documentData);
      
      const now = new Date();
      lastSavedRef.current = now;
      
      if (showMessage) {
        setLastSaved(now);
        message.success('文档已保存');
      }
    } catch (error) {
      console.error('保存失败:', error);
      if (showMessage) {
        message.error('保存失败，请重试');
      }
    } finally {
      setIsSaving(false);
    }
  }, [onSave, document?.documentId, document?.owner, document?.collaborators]);

  // 编辑器内容
  const editorContent = useMemo(() => contentRef.current, []);

  // 自动保存
  useEffect(() => {
    if (readOnly) return;
    
    const autoSaveTimer = setInterval(async () => {
      if (!readOnly && onSave && contentRef.current) {
        await handleSave(false);
      }
    }, 300000);

    return () => clearInterval(autoSaveTimer);
  }, [readOnly, onSave, handleSave]);

  // 格式化最后保存时间
  const formatLastSaved = useCallback(() => {
    const date = lastSavedRef.current || lastSaved;
    if (!date) return '未保存';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚保存';
    if (minutes < 60) return `${minutes}分钟前保存`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前保存`;
    
    return date.toLocaleDateString();
  }, [lastSaved]);

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

  // 最近活动数据（模拟）
  const recentActivities = [
    { type: 'edit', user: '张三', time: '2分钟前', content: '编辑了第3段落' },
    { type: 'comment', user: '李四', time: '5分钟前', content: '添加了评论' },
    { type: 'save', user: '王五', time: '10分钟前', content: '保存了文档' },
  ];

  // 版本历史数据（模拟）
  const versionHistory = [
    { version: 'v1.3', time: '刚刚', author: '张三' },
    { version: 'v1.2', time: '1小时前', author: '李四' },
    { version: 'v1.1', time: '昨天', author: '王五' },
  ];

  return (
    <div className={`feishu-editor-container ${className}`}>
      {/* 左侧导航栏 */}
      <div className={`feishu-left-sidebar ${leftSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* 品牌区域 */}
        <div className="sidebar-header">
          <div className="brand-section">
            <div className="brand-logo">
              <FileTextOutlined className="logo-icon" />
            </div>
            {!leftSidebarCollapsed && (
              <div className="brand-text">
                <div className="brand-title">Aokiz Docx</div>
                <div className="brand-subtitle">智能文档编辑</div>
              </div>
            )}
          </div>
          
          <Button
            type="text"
            icon={leftSidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
            size="small"
            className="sidebar-toggle"
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          />
        </div>

        {/* 搜索栏 */}
        {!leftSidebarCollapsed && (
          <div className="sidebar-search">
            <Input
              placeholder="搜索文档..."
              prefix={<SearchOutlined />}
              className="search-input"
              size="middle"
            />
          </div>
        )}

        {/* 导航菜单 */}
        <div className="sidebar-navigation">
          {navigationItems.map(item => (
            <div
              key={item.key}
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              {!leftSidebarCollapsed && (
                <span className="nav-label">{item.label}</span>
              )}
              {item.active && <div className="active-indicator" />}
            </div>
          ))}
        </div>

        {/* 快速操作 */}
        {!leftSidebarCollapsed && (
          <div className="sidebar-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-button"
              block
            >
              新建文档
            </Button>
          </div>
        )}

        {/* 用户信息 */}
        <div className="sidebar-footer">
          <div className="user-section">
            <Avatar 
              size={leftSidebarCollapsed ? 32 : 40}
              className="user-avatar"
              style={{ backgroundColor: '#1890ff' }}
            >
              U
            </Avatar>
            {!leftSidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">当前用户</div>
                <div className="user-status">在线</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="feishu-main-content">
        {/* 顶部工具栏 */}
        <div className="feishu-header">
          {/* 左侧区域 - 面包屑和标题 */}
          <div className="header-left">
            <div className="breadcrumb">
              <span className="breadcrumb-item">
                <FolderOutlined className="breadcrumb-icon" />
                我的文档
              </span>
              <RightOutlined className="breadcrumb-separator" />
              <span className="breadcrumb-item current">
                {displayTitle}
              </span>
            </div>
            
            <div className="title-section">
              {isEditingTitle ? (
                <Input
                  value={displayTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onPressEnter={() => setIsEditingTitle(false)}
                  className="title-input"
                  autoFocus
                  maxLength={100}
                />
              ) : (
                <div 
                  className="title-display"
                  onClick={() => !readOnly && setIsEditingTitle(true)}
                  title={displayTitle}
                >
                  {displayTitle}
                  {!readOnly && (
                    <EditOutlined className="title-edit-icon" />
                  )}
                </div>
              )}
            </div>

            <div className="save-status">
              <span className={`save-indicator ${isSaving ? 'saving' : 'saved'}`}>
                {isSaving ? <SyncOutlined spin /> : <ClockCircleOutlined />}
              </span>
              <span className="save-text">{formatLastSaved()}</span>
            </div>
          </div>

          {/* 中央区域 - 快捷操作 */}
          <div className="header-center">
            <Space size="small">
              <Tooltip title="评论">
                <Button
                  type="text"
                  icon={<CommentOutlined />}
                  className="quick-action-btn"
                />
              </Tooltip>
              
              <Tooltip title="版本历史">
                <Button
                  type="text"
                  icon={<HistoryOutlined />}
                  className="quick-action-btn"
                />
              </Tooltip>
            </Space>
          </div>

          {/* 右侧区域 - 协作者和主要操作 */}
          <div className="header-right">
            {/* 协作者头像组 */}
            {document?.collaborators && document.collaborators.length > 0 && (
              <div className="collaborators-group">
                {document.collaborators.slice(0, 3).map((collaborator, index) => (
                  <Tooltip key={index} title={collaborator}>
                    <Avatar 
                      size={32}
                      className="collaborator-avatar"
                      style={{ 
                        backgroundColor: generateUserColor(collaborator),
                        marginLeft: index > 0 ? -8 : 0
                      }}
                    >
                      {collaborator.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
                {document.collaborators.length > 3 && (
                  <Tooltip title={`还有 ${document.collaborators.length - 3} 位协作者`}>
                    <Avatar 
                      size={32}
                      className="collaborator-avatar more-avatar"
                    >
                      +{document.collaborators.length - 3}
                    </Avatar>
                  </Tooltip>
                )}
              </div>
            )}

            <Divider type="vertical" className="header-divider" />

            {/* 主要操作按钮 */}
            <Space size="middle">
              <Tooltip title={showCollaborationPanel ? '隐藏协作面板' : '显示协作面板'}>
                <Button
                  type="text"
                  icon={showCollaborationPanel ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                  onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
                  className="panel-toggle-btn"
                />
              </Tooltip>

              {!readOnly && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={isSaving}
                  onClick={() => handleSave(true)}
                  className="save-btn"
                >
                  保存
                </Button>
              )}

              <Button
                type="default"
                icon={<ShareAltOutlined />}
                onClick={() => message.info('分享功能开发中')}
                className="share-btn"
              >
                分享
              </Button>

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
                  className="more-btn"
                />
              </Dropdown>
            </Space>
          </div>
        </div>

        {/* 文档工具栏 */}
        {!readOnly && (
          <DocumentToolbar 
            editorInstance={editorRef.current?.getInstance()}
            onCommand={(command, params) => {
              console.log('Toolbar command:', command, params);
            }}
          />
        )}

        {/* 编辑器主体区域 */}
        <div className="feishu-editor-body">
          <div className="editor-container">
            <div className="editor-wrapper">
              <EditorJS
                ref={editorRef}
                value={editorContent}
                onChange={handleContentChange}
                readOnly={readOnly}
                placeholder={readOnly ? '这是一个只读文档' : '输入 / 来查看所有命令'}
                minHeight={600}
                autoFocus={!readOnly}
                className="feishu-editor-content"
                enableHoverToolbar={enableHoverToolbar}
                hoverToolbarPlugins={hoverToolbarPlugins}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 右侧协作面板 */}
      {showCollaborationPanel && (
        <div className="feishu-collaboration-panel">
          {/* 面板头部 */}
          <div className="panel-header">
            <Title level={5} className="panel-title">协作面板</Title>
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => setShowCollaborationPanel(false)}
              className="panel-close-btn"
            />
          </div>

          {/* 面板内容 */}
          <div className="panel-content">
            {/* 在线用户模块 */}
            <div className="panel-section">
              <div className="section-header">
                <UserOutlined className="section-icon" />
                <span className="section-title">在线用户</span>
                <span className="section-count">
                  ({document?.collaborators?.length || 0})
                </span>
              </div>
              
              <div className="users-list">
                {document?.collaborators?.map((collaborator, index) => (
                  <div key={index} className="user-item">
                    <Avatar 
                      size={28} 
                      style={{ backgroundColor: generateUserColor(collaborator) }}
                      className="user-item-avatar"
                    >
                      {collaborator.charAt(0)}
                    </Avatar>
                    <span className="user-item-name">{collaborator}</span>
                    <div className="user-status-indicator online" />
                  </div>
                ))}
              </div>
            </div>

            {/* 最近活动模块 */}
            <div className="panel-section">
              <div className="section-header">
                <ClockCircleOutlined className="section-icon" />
                <span className="section-title">最近活动</span>
              </div>
              
              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-indicator ${activity.type}`} />
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.user}</strong> {activity.content}
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 版本历史模块 */}
            <div className="panel-section">
              <div className="section-header">
                <HistoryOutlined className="section-icon" />
                <span className="section-title">版本历史</span>
              </div>
              
              <div className="versions-list">
                {versionHistory.map((version, index) => (
                  <div key={index} className="version-item">
                    <div className="version-info">
                      <span className="version-number">{version.version}</span>
                      <span className="version-author">by {version.author}</span>
                    </div>
                    <div className="version-time">{version.time}</div>
                  </div>
                ))}
                
                <Button 
                  type="link" 
                  size="small"
                  className="view-all-versions"
                >
                  查看完整历史
                </Button>
              </div>
            </div>

            {/* 评论模块 */}
            <div className="panel-section">
              <div className="section-header">
                <CommentOutlined className="section-icon" />
                <span className="section-title">评论</span>
                <span className="section-count">(0)</span>
              </div>
              
              <div className="comments-section">
                <div className="no-comments">
                  <Text type="secondary">暂无评论</Text>
                </div>
                
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />}
                  size="small"
                  block
                  className="add-comment-btn"
                >
                  添加评论
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeishuDocumentEditor;