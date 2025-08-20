'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HoverToolbarPosition, HoverToolbarPlugin } from './HoverToolbar';

export interface UseHoverToolbarOptions {
  editorInstance?: any;
  plugins?: HoverToolbarPlugin[];
  delay?: number; // 悬停延迟时间（毫秒）
  hideDelay?: number; // 隐藏延迟时间（毫秒）
  enabled?: boolean;
}

export interface UseHoverToolbarResult {
  toolbarPosition: HoverToolbarPosition;
  currentBlock: HTMLElement | null;
  isToolbarVisible: boolean;
  showToolbar: (x: number, y: number, blockElement: HTMLElement) => void;
  hideToolbar: () => void;
  updatePosition: (x: number, y: number) => void;
}

/**
 * 悬浮工具栏 Hook
 * 管理工具栏的显示、隐藏和位置
 */
export const useHoverToolbar = ({
  editorInstance,
  plugins: _plugins = [],
  delay = 500,
  hideDelay = 200,
  enabled = true
}: UseHoverToolbarOptions): UseHoverToolbarResult => {
  const [toolbarPosition, setToolbarPosition] = useState<HoverToolbarPosition>({
    x: 0,
    y: 0,
    visible: false
  });
  const [currentBlock, setCurrentBlock] = useState<HTMLElement | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredBlock = useRef<HTMLElement | null>(null);

  // 显示工具栏
  const showToolbar = useCallback((x: number, y: number, blockElement: HTMLElement) => {
    // 清除隐藏定时器
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // 如果已经在显示相同的块，更新位置即可
    if (isToolbarVisible && lastHoveredBlock.current === blockElement) {
      setToolbarPosition(prev => ({ ...prev, x, y }));
      return;
    }

    // 清除之前的显示定时器
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    // 设置新的显示定时器
    showTimeoutRef.current = setTimeout(() => {
      setCurrentBlock(blockElement);
      setToolbarPosition({ x, y, visible: true });
      setIsToolbarVisible(true);
      lastHoveredBlock.current = blockElement;
    }, delay);
  }, [delay, isToolbarVisible]);

  // 隐藏工具栏
  const hideToolbar = useCallback(() => {
    // 清除显示定时器
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // 设置隐藏定时器
    hideTimeoutRef.current = setTimeout(() => {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
      setIsToolbarVisible(false);
      setCurrentBlock(null);
      lastHoveredBlock.current = null;
    }, hideDelay);
  }, [hideDelay]);

  // 更新位置
  const updatePosition = useCallback((x: number, y: number) => {
    setToolbarPosition(prev => ({ ...prev, x, y }));
  }, []);

  // 立即隐藏（无延迟）
  const hideImmediately = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setToolbarPosition(prev => ({ ...prev, visible: false }));
    setIsToolbarVisible(false);
    setCurrentBlock(null);
    lastHoveredBlock.current = null;
  }, []);

  // 检查元素是否为编辑器块（暂时注释，等待后续使用）
  // const _isEditorBlock = useCallback((element: HTMLElement): boolean => {
  //   // EditorJS 块通常有这些类名或特征
  //   return element.classList.contains('ce-block') ||
  //          element.classList.contains('ce-block__content') ||
  //          element.closest('.ce-block') !== null;
  // }, []);

  // 获取块元素
  const getBlockElement = useCallback((element: HTMLElement): HTMLElement | null => {
    // 向上查找到块元素
    let current = element;
    while (current && current !== document.body) {
      // 检查多种可能的 EditorJS 块类名
      if (current.classList.contains('ce-block') ||
          current.classList.contains('cdx-block') ||
          current.hasAttribute('data-block-id') ||
          current.querySelector('.ce-block__content') !== null) {
        console.log('HoverToolbar: Found block element', current);
        return current;
      }
      current = current.parentElement as HTMLElement;
    }
    console.log('HoverToolbar: No block element found');
    return null;
  }, []);

  // 计算工具栏位置
  const calculateToolbarPosition = useCallback((blockElement: HTMLElement) => {
    const rect = blockElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      x: rect.left + scrollLeft + rect.width / 2,
      y: rect.top + scrollTop
    };
  }, []);

  // 鼠标事件处理
  useEffect(() => {
    if (!enabled || !editorInstance) {
      console.log('HoverToolbar: Not enabled or no editor instance', { enabled, editorInstance });
      return;
    }

    let currentHoveredBlock: HTMLElement | null = null;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查是否在编辑器区域内
      const editorContainer = target.closest('.codex-editor, .feishu-editor, [data-editor-js="true"]');
      if (!editorContainer) {
        return;
      }
      
      const blockElement = getBlockElement(target);
      
      console.log('HoverToolbar: Mouse enter', { target, blockElement, editorContainer });
      
      if (blockElement && blockElement !== currentHoveredBlock) {
        currentHoveredBlock = blockElement;
        const { x, y } = calculateToolbarPosition(blockElement);
        console.log('HoverToolbar: Showing toolbar', { x, y, blockElement });
        showToolbar(x, y, blockElement);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement;
      
      // 检查是否移动到工具栏本身
      if (relatedTarget && (
        relatedTarget.closest('.hover-toolbar') ||
        relatedTarget.classList.contains('hover-toolbar')
      )) {
        return; // 不隐藏工具栏
      }

      // 只在编辑器区域内处理
      const editorContainer = target.closest('.codex-editor, .feishu-editor, [data-editor-js="true"]');
      if (!editorContainer) {
        return;
      }

      const blockElement = getBlockElement(target);
      if (blockElement === currentHoveredBlock) {
        currentHoveredBlock = null;
        console.log('HoverToolbar: Hiding toolbar');
        hideToolbar();
      }
    };

    const handleMouseMove = (_event: MouseEvent) => {
      if (currentHoveredBlock) {
        const { x, y } = calculateToolbarPosition(currentHoveredBlock);
        updatePosition(x, y);
      }
    };

    // 监听整个文档的鼠标移动事件
    document.addEventListener('mouseover', handleMouseEnter, true);
    document.addEventListener('mouseout', handleMouseLeave, true);
    document.addEventListener('mousemove', handleMouseMove);
    
    console.log('HoverToolbar: Event listeners attached');

    // 监听滚动事件，隐藏工具栏
    const handleScroll = () => {
      if (isToolbarVisible) {
        hideImmediately();
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    // 监听键盘事件，隐藏工具栏
    const handleKeydown = (_event: KeyboardEvent) => {
      if (isToolbarVisible) {
        hideImmediately();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      // 移除文档级别的事件监听器
      document.removeEventListener('mouseover', handleMouseEnter, true);
      document.removeEventListener('mouseout', handleMouseLeave, true);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeydown);
      
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      console.log('HoverToolbar: Event listeners removed');
    };
  }, [enabled, editorInstance, showToolbar, hideToolbar, updatePosition, calculateToolbarPosition, getBlockElement, isToolbarVisible, hideImmediately]);

  // 工具栏本身的鼠标事件处理
  useEffect(() => {
    const handleToolbarMouseEnter = () => {
      // 鼠标进入工具栏时，清除隐藏定时器
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const handleToolbarMouseLeave = () => {
      // 鼠标离开工具栏时，启动隐藏定时器
      hideToolbar();
    };

    // 为工具栏添加事件监听器
    const toolbarElements = document.querySelectorAll('.hover-toolbar');
    toolbarElements.forEach(toolbar => {
      toolbar.addEventListener('mouseenter', handleToolbarMouseEnter);
      toolbar.addEventListener('mouseleave', handleToolbarMouseLeave);
    });

    return () => {
      toolbarElements.forEach(toolbar => {
        toolbar.removeEventListener('mouseenter', handleToolbarMouseEnter);
        toolbar.removeEventListener('mouseleave', handleToolbarMouseLeave);
      });
    };
  }, [hideToolbar]);

  return {
    toolbarPosition,
    currentBlock,
    isToolbarVisible,
    showToolbar,
    hideToolbar,
    updatePosition
  };
};