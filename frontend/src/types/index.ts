// 全局类型定义

// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// 文档相关类型
export interface Document {
  id: string;
  title: string;
  content: any; // JSON content from editor
  owner_id: string;
  folder_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_modified_by: string;
}

// 文档权限类型
export type PermissionLevel = 'read' | 'write' | 'admin';

export interface DocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  permission_level: PermissionLevel;
  granted_by: string;
  created_at: string;
}

// 协作相关类型
export interface CollaboratorCursor {
  userId: string;
  username: string;
  position: number;
  color: string;
}

export interface CollaborationOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
}

// 评论相关类型
export interface Comment {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  position: number;
  thread_id?: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

// 版本控制类型
export interface DocumentVersion {
  id: string;
  document_id: string;
  content: any;
  version_number: number;
  created_by: string;
  created_at: string;
  description?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// 编辑器相关类型
export interface EditorState {
  content: any;
  selection: {
    start: number;
    end: number;
  };
  collaborators: CollaboratorCursor[];
}

// 文件夹类型
export interface Folder {
  id: string;
  name: string;
  parent_id?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// 模板类型
export interface Template {
  id: string;
  name: string;
  description?: string;
  content: any;
  category: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

// 系统状态类型
export interface AppState {
  user: User | null;
  currentDocument: Document | null;
  documents: Document[];
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
}