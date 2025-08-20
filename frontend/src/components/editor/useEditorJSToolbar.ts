'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ToolbarPosition } from './EditorJSToolbar';

export interface UseEditorJSToolbarOptions {
  editorInstance?: any;
  enabled?: boolean;
  plusButtonDelay?: number;
  inlineToolbarDelay?: number;
}

export interface UseEditorJSToolbarResult {
  plusButtonPosition: ToolbarPosition;
  inlineToolbarPosition: ToolbarPosition;
  currentBlock: HTMLElement | null;
  selectedText: string;
  showPlusButton: (x: number, y: number, blockElement: HTMLElement) => void;
  hidePlusButton: () => void;
  showInlineToolbar: (x: number, y: number, text: string) => void;
  hideInlineToolbar: () => void;
}

/**
 * EditorJS 标准工具栏 Hook
 * 管理 Plus 按钮和内联工具栏的显示逻辑
 */
export const useEditorJSToolbar = ({
  editorInstance,
  enabled = true,
  plusButtonDelay = 200,
  inlineToolbarDelay = 100
}: UseEditorJSToolbarOptions): UseEditorJSToolbarResult => {
  const [plusButtonPosition, setPlusButtonPosition] = useState<ToolbarPosition>({
    x: 0,
    y: 0,
    visible: false
  });
  
  const [inlineToolbarPosition, setInlineToolbarPosition] = useState<ToolbarPosition>({
    x: 0,
    y: 0,
    visible: false
  });

  const [currentBlock, setCurrentBlock] = useState<HTMLElement | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  const plusButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inlineToolbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredBlock = useRef<HTMLElement | null>(null);

  // 显示 Plus 按钮
  const showPlusButton = useCallback((x: number, y: number, blockElement: HTMLElement) => {
    if (plusButtonTimeoutRef.current) {
      clearTimeout(plusButtonTimeoutRef.current);
    }

    // 如果是同一个块，只更新位置
    if (lastHoveredBlock.current === blockElement) {
      setPlusButtonPosition(prev => ({ ...prev, x, y }));
      return;
    }

    plusButtonTimeoutRef.current = setTimeout(() => {
      setCurrentBlock(blockElement);
      setPlusButtonPosition({ x, y, visible: true });
      lastHoveredBlock.current = blockElement;
    }, plusButtonDelay);
  }, [plusButtonDelay]);

  // 隐藏 Plus 按钮
  const hidePlusButton = useCallback(() => {
    if (plusButtonTimeoutRef.current) {
      clearTimeout(plusButtonTimeoutRef.current);
      plusButtonTimeoutRef.current = null;
    }

    setTimeout(() => {
      setPlusButtonPosition(prev => ({ ...prev, visible: false }));
      setCurrentBlock(null);
      lastHoveredBlock.current = null;
    }, 150);
  }, []);

  // 显示内联工具栏
  const showInlineToolbar = useCallback((x: number, y: number, text: string) => {
    if (inlineToolbarTimeoutRef.current) {
      clearTimeout(inlineToolbarTimeoutRef.current);
    }

    inlineToolbarTimeoutRef.current = setTimeout(() => {
      setSelectedText(text);
      setInlineToolbarPosition({ x, y, visible: true });
    }, inlineToolbarDelay);
  }, [inlineToolbarDelay]);

  // 隐藏内联工具栏
  const hideInlineToolbar = useCallback(() => {
    if (inlineToolbarTimeoutRef.current) {
      clearTimeout(inlineToolbarTimeoutRef.current);
      inlineToolbarTimeoutRef.current = null;
    }

    setInlineToolbarPosition(prev => ({ ...prev, visible: false }));
    setSelectedText('');
  }, []);

  // 获取块元素
  const getBlockElement = useCallback((element: HTMLElement): HTMLElement | null => {
    let current = element;
    while (current && current !== document.body) {
      // 检查是否为 EditorJS 块
      if (current.classList.contains('ce-block') ||
          current.classList.contains('cdx-block') ||
          current.hasAttribute('data-block-id') ||
          current.classList.contains('ce-paragraph') ||
          current.classList.contains('ce-header') ||
          current.classList.contains('cdx-list') ||
          current.classList.contains('cdx-quote') ||
          current.classList.contains('tc-table') ||
          current.classList.contains('image-tool')) {
        return current;
      }
      current = current.parentElement as HTMLElement;
    }
    return null;
  }, []);

  // 计算 Plus 按钮位置
  const calculatePlusButtonPosition = useCallback((blockElement: HTMLElement) => {
    const rect = blockElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      x: rect.left + scrollLeft,
      y: rect.top + scrollTop + rect.height / 2
    };
  }, []);

  // 计算内联工具栏位置
  const calculateInlineToolbarPosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (rect.width === 0 && rect.height === 0) return null;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop
    };
  }, []);

  // 处理块悬停
  useEffect(() => {
    if (!enabled || !editorInstance) {
      console.log('EditorJSToolbar: Not enabled or no editor instance');
      return;
    }

    let currentHoveredBlock: HTMLElement | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查是否在编辑器区域内
      const editorContainer = target.closest('[data-editor-js="true"], .codex-editor, .feishu-editor');
      if (!editorContainer) {
        if (currentHoveredBlock) {
          currentHoveredBlock = null;
          hidePlusButton();
        }
        return;
      }
      
      const blockElement = getBlockElement(target);
      
      if (blockElement && blockElement !== currentHoveredBlock) {
        currentHoveredBlock = blockElement;
        const { x, y } = calculatePlusButtonPosition(blockElement);
        
        console.log('EditorJSToolbar: Found block', { blockElement });
        showPlusButton(x, y, blockElement);
      } else if (!blockElement && currentHoveredBlock) {
        currentHoveredBlock = null;
        hidePlusButton();
      }
    };

    // 监听鼠标移动
    document.addEventListener('mousemove', handleMouseMove);
    
    console.log('EditorJSToolbar: Plus button event listeners attached');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (plusButtonTimeoutRef.current) {
        clearTimeout(plusButtonTimeoutRef.current);
      }
      
      console.log('EditorJSToolbar: Plus button event listeners removed');
    };
  }, [enabled, editorInstance, showPlusButton, hidePlusButton, getBlockElement, calculatePlusButtonPosition]);

  // 处理文本选择
  useEffect(() => {
    if (!enabled || !editorInstance) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        hideInlineToolbar();
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) {
        hideInlineToolbar();
        return;
      }

      // 检查选择是否在编辑器内
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const editorContainer = (container.nodeType === Node.TEXT_NODE ? 
        container.parentElement : container as HTMLElement)
        ?.closest('[data-editor-js="true"], .codex-editor, .feishu-editor');

      if (!editorContainer) {
        hideInlineToolbar();
        return;
      }

      const position = calculateInlineToolbarPosition();
      if (position) {
        console.log('EditorJSToolbar: Text selected', { selectedText, position });
        showInlineToolbar(position.x, position.y, selectedText);
      }
    };

    // 监听选择变化
    document.addEventListener('selectionchange', handleSelectionChange);
    
    console.log('EditorJSToolbar: Inline toolbar event listeners attached');

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      
      if (inlineToolbarTimeoutRef.current) {
        clearTimeout(inlineToolbarTimeoutRef.current);
      }
      
      console.log('EditorJSToolbar: Inline toolbar event listeners removed');
    };
  }, [enabled, editorInstance, showInlineToolbar, hideInlineToolbar, calculateInlineToolbarPosition]);

  // 处理滚动和键盘事件
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      hidePlusButton();
      hideInlineToolbar();
    };

    const handleKeydown = () => {
      hideInlineToolbar();
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [enabled, hidePlusButton, hideInlineToolbar]);

  return {
    plusButtonPosition,
    inlineToolbarPosition,
    currentBlock,
    selectedText,
    showPlusButton,
    hidePlusButton,
    showInlineToolbar,
    hideInlineToolbar
  };
};