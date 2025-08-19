// 编辑器相关类型定义

// 文档格式化类型
export type TextFormat = 'bold' | 'italic' | 'underline' | 'strikethrough';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type ListType = 'ordered' | 'unordered';
export type AlignType = 'left' | 'center' | 'right' | 'justify';

// 编辑器节点类型
export interface EditorNode {
  type: string;
  content?: EditorNode[];
  text?: string;
  marks?: EditorMark[];
  attrs?: Record<string, any>;
}

export interface EditorMark {
  type: string;
  attrs?: Record<string, any>;
}

// 文档内容结构
export interface DocumentContent {
  type: 'doc';
  content: EditorNode[];
  version?: number;
}

// 编辑器状态
export interface EditorTransaction {
  doc: DocumentContent;
  selection: {
    anchor: number;
    head: number;
  };
  time: number;
}

// 操作转换相关
export interface Operation {
  type: 'insert' | 'delete' | 'retain' | 'format';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
  format?: {
    type: TextFormat | 'heading' | 'list';
    level?: HeadingLevel;
    listType?: ListType;
    align?: AlignType;
  };
}

// 编辑器工具栏配置
export interface ToolbarConfig {
  groups: ToolbarGroup[];
}

export interface ToolbarGroup {
  name: string;
  items: ToolbarItem[];
}

export interface ToolbarItem {
  type: 'button' | 'dropdown' | 'separator';
  name: string;
  icon?: string;
  label?: string;
  action?: string;
  options?: ToolbarOption[];
  disabled?: boolean;
  active?: boolean;
}

export interface ToolbarOption {
  label: string;
  value: any;
  icon?: string;
}

// 编辑器插件接口
export interface EditorPlugin {
  name: string;
  init: (editor: any) => void;
  destroy?: (editor: any) => void;
  commands?: Record<string, any>;
  keymap?: Record<string, any>;
}

// 快捷键配置
export interface KeyBinding {
  key: string;
  command: string;
  preventDefault?: boolean;
}

// 编辑器配置
export interface EditorConfig {
  placeholder?: string;
  readonly?: boolean;
  autofocus?: boolean;
  spellcheck?: boolean;
  toolbar?: ToolbarConfig;
  plugins?: EditorPlugin[];
  keybindings?: KeyBinding[];
  collaboration?: {
    enabled: boolean;
    document_id: string;
    user_id: string;
  };
}

// 编辑器实例接口
export interface EditorInstance {
  getContent: () => DocumentContent;
  setContent: (content: DocumentContent) => void;
  focus: () => void;
  blur: () => void;
  destroy: () => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, data?: any) => void;
  executeCommand: (command: string, params?: any) => void;
  isActive: (format: string) => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
}

// 编辑器事件
export type EditorEvent = 
  | 'content-changed'
  | 'selection-changed'
  | 'focus'
  | 'blur'
  | 'operation'
  | 'collaboration-user-joined'
  | 'collaboration-user-left'
  | 'comment-added'
  | 'comment-resolved';

// 选择区域
export interface Selection {
  from: number;
  to: number;
  empty: boolean;
}

// 历史记录
export interface HistoryState {
  done: EditorTransaction[];
  undone: EditorTransaction[];
  depth: number;
}

// 导出格式选项
export type ExportFormat = 'html' | 'markdown' | 'docx' | 'pdf' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeComments?: boolean;
  includeVersionHistory?: boolean;
}

// ===== EditorJS 特定类型定义 =====

import { OutputData, OutputBlockData } from '@editorjs/editorjs';

export interface EditorJSProps {
  value?: OutputData;
  onChange?: (data: OutputData) => void;
  onReady?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
  autoFocus?: boolean;
  tools?: Record<string, any>;
}

export interface EditorJSRef {
  save: () => Promise<OutputData>;
  clear: () => Promise<void>;
  render: (data: OutputData) => Promise<void>;
  focus: () => void;
  destroy: () => void;
  getInstance: () => any;
}

export interface EditorJSConfig {
  holder: string | HTMLElement;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  autofocus?: boolean;
  data?: OutputData;
  tools?: Record<string, any>;
  onChange?: (api: any, event: any) => void;
  onReady?: () => void;
}

export interface EditorJSBlock extends OutputBlockData {
  id?: string;
}

export interface EditorJSSaveData extends OutputData {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export interface FeishuEditorTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  selectedColor: string;
  toolbarBackground: string;
  toolbarBorder: string;
  blockHoverColor: string;
  blockSelectedColor: string;
  inlineToolbarBackground: string;
  focusedBlockBorder: string;
}

export const defaultFeishuTheme: FeishuEditorTheme = {
  primaryColor: '#3370ff',
  backgroundColor: '#ffffff',
  textColor: '#1f2329',
  borderColor: '#e7e9e8',
  hoverColor: '#f5f6f7',
  selectedColor: '#eef0ff',
  toolbarBackground: '#ffffff',
  toolbarBorder: '#e7e9e8',
  blockHoverColor: '#f8f9fa',
  blockSelectedColor: '#e8f4ff',
  inlineToolbarBackground: '#ffffff',
  focusedBlockBorder: '#3370ff',
};

export interface DocumentEditorData {
  documentId: string;
  title: string;
  content: OutputData;
  lastModified: Date;
  owner: string;
  collaborators?: string[];
}

export interface EditorJSToolConfig {
  class: any;
  config?: Record<string, any>;
  inlineToolbar?: boolean;
  shortcut?: string;
}