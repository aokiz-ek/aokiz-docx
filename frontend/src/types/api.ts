// API 接口类型定义

// 登录注册相关
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
  };
  token: string;
}

// 文档操作相关
export interface CreateDocumentRequest {
  title: string;
  folder_id?: string;
  template_id?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: any;
  is_public?: boolean;
}

export interface ShareDocumentRequest {
  user_emails: string[];
  permission_level: 'read' | 'write';
  message?: string;
}

// 协作相关
export interface JoinDocumentRequest {
  document_id: string;
}

export interface SendOperationRequest {
  document_id: string;
  operation: {
    type: 'insert' | 'delete' | 'retain';
    position: number;
    content?: string;
    length?: number;
    attributes?: Record<string, any>;
  };
  user_id: string;
}

// 评论相关
export interface CreateCommentRequest {
  document_id: string;
  content: string;
  position: number;
  thread_id?: string;
}

export interface UpdateCommentRequest {
  content?: string;
  resolved?: boolean;
}

// 文件夹操作
export interface CreateFolderRequest {
  name: string;
  parent_id?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  parent_id?: string;
}

// 查询参数
export interface DocumentQueryParams {
  folder_id?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
}

export interface UserQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'operation' | 'cursor' | 'user_join' | 'user_leave' | 'comment';
  data: any;
  user_id: string;
  timestamp: number;
}

export interface OperationMessage extends WebSocketMessage {
  type: 'operation';
  data: {
    document_id: string;
    operation: {
      type: string;
      position: number;
      content?: string;
      length?: number;
      attributes?: Record<string, any>;
    };
  };
}

export interface CursorMessage extends WebSocketMessage {
  type: 'cursor';
  data: {
    document_id: string;
    position: number;
    selection?: {
      start: number;
      end: number;
    };
  };
}