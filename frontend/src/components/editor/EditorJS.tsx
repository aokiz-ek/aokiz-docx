'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EditorJSProps, EditorJSRef } from '@/types/editor';

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

/**
 * EditorJS 组件封装
 * 提供类似飞书文档的编辑体验
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
  tools
}, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // 合并工具配置
  const mergedTools = useMemo(() => {
    // 默认工具配置 - 飞书风格
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
      }
    };

    return { ...defaultTools, ...tools };
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
              const outputData = await api.saver.save();
              onChange(outputData);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('保存编辑器数据失败:', error);
            }
          }
        },
        onReady: () => {
          // eslint-disable-next-line no-console
          console.log('EditorJS is ready to work!');
          isInitialized.current = true;
          if (onReady) onReady();
        }
      });

      editorRef.current = editor;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('初始化 EditorJS 失败:', error);
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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('编辑器销毁失败:', error);
        }
        editorRef.current = null;
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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('编辑器销毁失败:', error);
        }
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, [initializeEditor]);

  // 当 value 变化时更新编辑器内容（仅在外部数据变化时）
  useEffect(() => {
    // 避免在用户编辑过程中重新渲染导致焦点丢失
    // 只在编辑器刚初始化或外部强制更新时才渲染
    if (editorRef.current && value && isInitialized.current) {
      // 检查是否是初始化时的数据设置
      const isInitialData = !editorRef.current.blocks || editorRef.current.blocks.length === 0;
      if (isInitialData) {
        editorRef.current.render(value).catch(error => {
          // eslint-disable-next-line no-console
          console.error('渲染编辑器内容失败:', error);
        });
      }
    }
  }, [value]);

  // 当 readOnly 变化时重新初始化编辑器
  useEffect(() => {
    if (isInitialized.current && editorRef.current) {
      // EditorJS 不支持动态切换只读模式，需要重新初始化
      if (typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('编辑器重新初始化时销毁失败:', error);
        }
      }
      editorRef.current = null;
      isInitialized.current = false;
      setTimeout(() => {
        initializeEditor();
      }, 100);
    }
  }, [readOnly, initializeEditor]);

  return (
    <div className={`ao-w-full ${className}`}>
      <div
        ref={holderRef}
        className="ao-w-full ao-outline-none"
        style={{ minHeight }}
      />
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJS';

export default EditorJSComponent;