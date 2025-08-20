'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useMemo, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EditorJSProps, EditorJSRef } from '@/types/editor';
import SlashCommand from './SlashCommand';
import { useSlashCommand } from './useSlashCommand';
// 悬浮工具栏相关导入（已注释，等待后续启用）
// import HoverToolbar from './HoverToolbar';
// import { useHoverToolbar } from './useHoverToolbar';
// import { hoverToolbarPluginManager, registerDefaultPlugins, pluginPresets } from './HoverToolbarPlugins';
// import { DebugHoverToolbar } from './DebugHoverToolbar';
import EditorJSToolbar from './EditorJSToolbar';
import { useEditorJSToolbar } from './useEditorJSToolbar';

// EditorJS 工具导入
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
// @ts-expect-error - Embed 插件类型兼容性问题
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
// @ts-expect-error - Link 插件类型兼容性问题
import LinkTool from '@editorjs/link';
// @ts-expect-error - Marker 插件类型兼容性问题
import Marker from '@editorjs/marker';
import Warning from '@editorjs/warning';
// @ts-expect-error - Checklist 插件类型兼容性问题
import Checklist from '@editorjs/checklist';

// 新增的 awesome-editorjs 插件
import Underline from '@editorjs/underline';
// @ts-expect-error - 类型兼容性问题
import TextColor from 'editorjs-text-color-plugin';
// @ts-expect-error - 类型兼容性问题
import AttachesTool from '@editorjs/attaches';
// @ts-expect-error - 类型兼容性问题
import Button from 'editorjs-button';
// @ts-expect-error - 类型兼容性问题
import ToggleBlock from 'editorjs-toggle-block';
// @ts-expect-error - 类型兼容性问题
import Columns from '@calumk/editorjs-columns';
// @ts-expect-error - 类型兼容性问题
import DragDrop from 'editorjs-drag-drop';
// @ts-expect-error - 类型兼容性问题
import Undo from 'editorjs-undo';

// 新增的 awesome-editorjs 插件
// @ts-expect-error - 类型兼容性问题
import Alert from 'editorjs-alert';
// @ts-expect-error - 类型兼容性问题
import SpoilerTool from 'editorjs-inline-spoiler-tool';
// @ts-expect-error - 类型兼容性问题
import Tooltip from 'editorjs-tooltip';

/**
 * EditorJS 组件封装
 * 提供类似AO文档的编辑体验
 */
const EditorJSComponent = forwardRef<EditorJSRef, EditorJSProps>(({
  value,
  onChange,
  onReady,
  placeholder = '输入 / 来查看所有命令',
  readOnly = false,
  className = '',
  minHeight = 300,
  autoFocus = false,
  tools,
  enableHoverToolbar = true,
  hoverToolbarPlugins: _hoverToolbarPlugins = 'basic'
}, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  
  // 使用状态来跟踪编辑器实例，这样hooks可以正确响应变化
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);

  // 合并工具配置
  const mergedTools = useMemo(() => {
    console.log('EditorJS: Checklist tool imported:', Checklist);
    // 默认工具配置 - AO风格
    const defaultTools = {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        config: {
          preserveBlank: true,
          placeholder: placeholder
        }
      },
      header: {
        class: Header,
        config: {
          placeholder: '标题',
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 2
        }
      },
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
        config: {
          defaultChecked: false
        }
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: '输入引用内容',
          captionPlaceholder: '引用来源（可选）'
        }
      },
      code: {
        class: Code,
        config: {
          placeholder: '输入代码'
        }
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        }
      },
      image: {
        class: Image,
        config: {
          /**
           * 自定义上传器
           * TODO: 集成文件上传服务
           */
          uploader: {
            uploadByFile(file: File) {
              return Promise.resolve({
                success: 1,
                file: {
                  url: URL.createObjectURL(file),
                  name: file.name,
                  size: file.size
                }
              });
            }
          }
        }
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            vimeo: true,
            codepen: true,
            figma: true
          }
        }
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: '/api/link-preview' // TODO: 实现链接预览API
        }
      },
      delimiter: Delimiter,
      warning: {
        class: Warning,
        inlineToolbar: true,
        config: {
          titlePlaceholder: '警告标题',
          messagePlaceholder: '警告内容'
        }
      },
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M'
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M'
      },
      
      // 新增的 awesome-editorjs 插件工具
      underline: {
        class: Underline,
        shortcut: 'CMD+U'
      },
      
      textColor: {
        class: TextColor,
        config: {
          colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFC107'],
          defaultColor: '#FF1744',
          type: 'text', 
          customPicker: true
        }
      },
      
      attaches: {
        class: AttachesTool,
        config: {
          endpoint: '/api/upload-file', // TODO: 实现文件上传API
          field: 'file',
          types: 'image/*,video/*,.pdf,.doc,.docx,.txt,.zip',
          buttonText: '选择文件',
          errorMessage: '文件上传失败'
        }
      },
      
      button: {
        class: Button,
        inlineToolbar: false,
        config: {
          css: {
            'btn-primary': 'btn btn-primary'
          }
        }
      },
      
      toggle: {
        class: ToggleBlock,
        inlineToolbar: true
      },
      
      columns: {
        class: Columns,
        config: {
          EditorJsLibrary: EditorJS,
          tools: {
            header: Header,
            paragraph: {
              class: Paragraph,
              inlineToolbar: true
            }
          }
        }
      },
      
      // 新增的 awesome-editorjs 插件工具
      alert: {
        class: Alert,
        inlineToolbar: true,
        config: {
          alertTypes: {
            primary: {
              backgroundColor: '#e3f2fd',
              borderColor: '#2196f3',
              color: '#1976d2'
            },
            secondary: {
              backgroundColor: '#f3e5f5',
              borderColor: '#9c27b0',
              color: '#7b1fa2'
            },
            success: {
              backgroundColor: '#e8f5e8',
              borderColor: '#4caf50',
              color: '#388e3c'
            },
            danger: {
              backgroundColor: '#ffebee',
              borderColor: '#f44336',
              color: '#d32f2f'
            },
            warning: {
              backgroundColor: '#fff3e0',
              borderColor: '#ff9800',
              color: '#f57c00'
            },
            info: {
              backgroundColor: '#e0f2f1',
              borderColor: '#009688',
              color: '#00796b'
            }
          },
          defaultType: 'info',
          messagePlaceholder: '输入提示信息',
          titlePlaceholder: '提示标题（可选）'
        }
      },
      
      spoiler: {
        class: SpoilerTool,
        inlineToolbar: true,
        config: {
          spoilerText: '显示隐藏内容',
          revealedText: '隐藏内容'
        }
      },
      
      tooltip: {
        class: Tooltip,
        inlineToolbar: true,
        config: {
          placeholder: '输入提示文本',
          tooltipPlaceholder: '输入提示内容',
          position: 'top'
        }
      }
    };

    const mergedResult = { ...defaultTools, ...tools };
    console.log('EditorJS: Merged tools with checklist:', mergedResult.checklist);
    return mergedResult;
  }, [tools, placeholder]);

  // 初始化编辑器
  const initializeEditor = useCallback(async () => {
    if (!holderRef.current || isInitialized.current) return;

    // 确保在浏览器环境中执行
    if (typeof window === 'undefined') return;

    try {
      const editor = new EditorJS({
        holder: holderRef.current,
        placeholder,
        readOnly,
        autofocus: autoFocus,
        data: value,
        tools: mergedTools as any,
        onChange: async (api) => {
          if (onChange) {
            try {
              // 标记用户正在编辑，避免外部重新渲染
              isUserEditingRef.current = true;
              
              const outputData = await api.saver.save();
              lastValueRef.current = outputData;
              onChange(outputData);
              
              // 延迟重置编辑状态，给其他操作留出时间
              setTimeout(() => {
                isUserEditingRef.current = false;
              }, 100);
            } catch {
              // 保存编辑器数据失败
              isUserEditingRef.current = false;
            }
          }
        },
        onReady: () => {
          // EditorJS 已准备就绪
          isInitialized.current = true;
          if (onReady) onReady();
        }
      });

      editorRef.current = editor;
      setEditorInstance(editor);

      // 初始化拖拽功能
      if (!readOnly) {
        try {
          new DragDrop(editor);
          // 拖拽功能已启用
        } catch {
          // 拖拽功能初始化失败
        }

        // 初始化撤销功能
        try {
          new Undo({ editor, maxLength: 30 });
          // 撤销功能已启用
        } catch {
          // 撤销功能初始化失败
        }
      }
    } catch {
      // 初始化 EditorJS 失败
    }
  }, [placeholder, readOnly, autoFocus, value, mergedTools, onChange, onReady]);

  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    save: async (): Promise<OutputData> => {
      if (!editorRef.current) throw new Error('编辑器未初始化');
      return await editorRef.current.save();
    },
    clear: async (): Promise<void> => {
      if (!editorRef.current) return;
      await editorRef.current.clear();
    },
    render: async (data: OutputData): Promise<void> => {
      if (!editorRef.current) return;
      await editorRef.current.render(data);
    },
    focus: (): void => {
      if (!editorRef.current) return;
      editorRef.current.focus();
    },
    destroy: (): void => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch {
          // 编辑器销毁失败
        }
        editorRef.current = null;
        setEditorInstance(null);
        isInitialized.current = false;
      }
    },
    getInstance: () => editorRef.current
  }));

  // 组件挂载时初始化编辑器
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeEditor();
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch {
          // 编辑器销毁失败
        }
        editorRef.current = null;
        setEditorInstance(null);
        isInitialized.current = false;
      }
    };
  }, [initializeEditor]);

  // 保存上一次的内容引用，避免无意义的重新渲染
  const lastValueRef = useRef<OutputData | undefined>(undefined);
  const isUserEditingRef = useRef(false);
  const initialRenderDoneRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  

  // 完全禁用 value 变化导致的重新渲染 - 解决焦点丢失的根本问题
  useEffect(() => {
    // 只在编辑器第一次初始化时渲染内容，之后永远不再重新渲染
    if (editorRef.current && value && isInitialized.current && !initialRenderDoneRef.current) {
      lastValueRef.current = value;
      initialRenderDoneRef.current = true;
      
      editorRef.current.render(value).catch(() => {
        // 渲染编辑器内容失败
      });
    }
    
    // 标记初始化完成后，完全忽略后续的 value 变化
    // 这是修复焦点丢失的关键：编辑器内容完全由用户控制，不受外部状态影响
    
  }, [value, isInitialized]); // 只依赖初始化状态
  
  // 斜杠命令功能
  const { slashState, handleCommandSelect, closeSlashCommand } = useSlashCommand({
    editorInstance: editorInstance
  });
  
  // 调试日志
  useEffect(() => {
    console.log('EditorJS: Editor instance changed for slash command:', {
      hasInstance: !!editorInstance,
      isInitialized: isInitialized.current,
      slashVisible: slashState.visible
    });
  }, [editorInstance, slashState.visible]);

  // EditorJS 标准工具栏功能
  const { 
    plusButtonPosition, 
    inlineToolbarPosition, 
    currentBlock: _toolbarBlock, 
    selectedText: _selectedText 
  } = useEditorJSToolbar({
    editorInstance: editorInstance,
    enabled: enableHoverToolbar && !readOnly,
    plusButtonDelay: 200,
    inlineToolbarDelay: 100
  });

  // 初始化插件系统
  useEffect(() => {
    if (enableHoverToolbar) {
      // registerDefaultPlugins(); // 暂时注释，等待悬浮工具栏完整实现
    }
  }, [enableHoverToolbar]);

  // 获取插件配置（暂时注释，等待悬浮工具栏完整实现）
  // const _getHoverToolbarPlugins = useCallback(() => {
  //   if (Array.isArray(hoverToolbarPlugins)) {
  //     return hoverToolbarPlugins;
  //   }
  //   
  //   switch (hoverToolbarPlugins) {
  //     case 'advanced':
  //       return pluginPresets.advanced;
  //     case 'full':
  //       return pluginPresets.full;
  //     case 'basic':
  //     default:
  //       return pluginPresets.basic;
  //   }
  // }, [hoverToolbarPlugins]);

  // 处理块插入
  const handleInsertBlock = useCallback(async (type: string, data?: any) => {
    if (!editorRef.current) return;

    try {
      const currentIndex = editorRef.current.blocks.getCurrentBlockIndex();
      await editorRef.current.blocks.insert(type, data || {}, {}, currentIndex + 1);
      
      // 设置焦点到新块
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.caret.setToBlock(currentIndex + 1);
        }
      }, 100);
      
      // EditorJS: Block inserted
    } catch {
      // Insert block failed
    }
  }, []);

  // 处理文本格式化
  const handleFormatText = useCallback((format: string) => {
    // 这里可以实现内联格式化逻辑
    // 由于 EditorJS 的内联工具通常由工具本身处理，
    // 我们主要是触发相应的格式化命令
    // EditorJS: Format text
    
    // 可以根据格式类型执行不同的操作
    switch (format) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'code':
      case 'marker':
        // 这些格式化通常由 EditorJS 的内联工具处理
        break;
      case 'link':
        // 可以打开链接输入对话框
        const url = prompt('请输入链接地址:');
        if (url) {
          // 处理链接插入逻辑
        }
        break;
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    const currentTimer = debounceTimerRef.current;
    return () => {
      if (currentTimer) {
        clearTimeout(currentTimer);
      }
    };
  }, []);

  // 当 readOnly 变化时重新初始化编辑器
  useEffect(() => {
    if (isInitialized.current && editorRef.current) {
      // EditorJS 不支持动态切换只读模式，需要重新初始化
      if (typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch {
          // 编辑器重新初始化时销毁失败
        }
      }
      editorRef.current = null;
      setEditorInstance(null);
      isInitialized.current = false;
      setTimeout(() => {
        initializeEditor();
      }, 100);
    }
  }, [readOnly, initializeEditor]);

  return (
    <div className={`ao-w-full ao-relative ${className}`} data-editor-js="true">
      <div
        ref={holderRef}
        className="ao-w-full ao-outline-none"
        style={{ minHeight }}
      />
      
      {/* 斜杠命令菜单 */}
      <SlashCommand
        visible={slashState.visible}
        position={slashState.position}
        onSelect={handleCommandSelect}
        onClose={closeSlashCommand}
        editorInstance={editorInstance}
      />
      
      {/* EditorJS 标准工具栏 */}
      {enableHoverToolbar && !readOnly && (
        <EditorJSToolbar
          plusButtonPosition={plusButtonPosition}
          inlineToolbarPosition={inlineToolbarPosition}
          editorInstance={editorInstance}
          onInsertBlock={handleInsertBlock}
          onFormatText={handleFormatText}
          className="editorjs-toolbar"
        />
      )}
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJS';

export default EditorJSComponent;