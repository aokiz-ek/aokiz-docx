'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BlockIndicatorPosition } from './BlockIndicator';

export interface UseBlockIndicatorOptions {
  editorInstance?: any;
  enabled?: boolean;
  delay?: number; // 显示延迟
  hideDelay?: number; // 隐藏延迟
}

export interface UseBlockIndicatorResult {
  indicatorPosition: BlockIndicatorPosition;
  currentBlock: HTMLElement | null;
  blockType: string;
  showIndicator: (x: number, y: number, blockElement: HTMLElement, type: string) => void;
  hideIndicator: () => void;
}

/**
 * 块标识器 Hook
 * 管理两阶段悬浮交互的块标识器
 */
export const useBlockIndicator = ({
  editorInstance,
  enabled = true,
  delay = 200,
  hideDelay = 300
}: UseBlockIndicatorOptions): UseBlockIndicatorResult => {
  const [indicatorPosition, setIndicatorPosition] = useState<BlockIndicatorPosition>({
    x: 0,
    y: 0,
    visible: false
  });
  const [currentBlock, setCurrentBlock] = useState<HTMLElement | null>(null);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoveredBlock = useRef<HTMLElement | null>(null);

  // 显示标识器
  const showIndicator = useCallback((x: number, y: number, blockElement: HTMLElement, type: string) => {
    // 清除隐藏定时器
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // 如果是同一个块，只更新位置
    if (lastHoveredBlock.current === blockElement) {
      setIndicatorPosition(prev => ({ ...prev, x, y }));
      return;
    }

    // 清除之前的显示定时器
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    // 设置新的显示定时器
    showTimeoutRef.current = setTimeout(() => {
      setCurrentBlock(blockElement);
      setBlockType(type);
      setIndicatorPosition({ x, y, visible: true });
      lastHoveredBlock.current = blockElement;
    }, delay);
  }, [delay]);

  // 隐藏标识器
  const hideIndicator = useCallback(() => {
    // 清除显示定时器
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // 设置隐藏定时器
    hideTimeoutRef.current = setTimeout(() => {
      setIndicatorPosition(prev => ({ ...prev, visible: false }));
      setCurrentBlock(null);
      lastHoveredBlock.current = null;
    }, hideDelay);
  }, [hideDelay]);

  // 立即隐藏
  const hideImmediately = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIndicatorPosition(prev => ({ ...prev, visible: false }));
    setCurrentBlock(null);
    lastHoveredBlock.current = null;
  }, []);

  // 获取块类型
  const getBlockType = useCallback((blockElement: HTMLElement): string => {
    // 检查不同的块类型
    if (blockElement.classList.contains('ce-header') || 
        blockElement.querySelector('h1, h2, h3, h4, h5, h6')) {
      return 'header';
    }
    if (blockElement.classList.contains('ce-paragraph') || 
        blockElement.querySelector('p') ||
        blockElement.tagName === 'P') {
      return 'paragraph';
    }
    if (blockElement.classList.contains('cdx-list') || 
        blockElement.querySelector('ul, ol')) {
      return 'list';
    }
    if (blockElement.classList.contains('cdx-quote') || 
        blockElement.querySelector('blockquote')) {
      return 'quote';
    }
    if (blockElement.classList.contains('ce-code') || 
        blockElement.querySelector('pre, code')) {
      return 'code';
    }
    if (blockElement.classList.contains('tc-table') || 
        blockElement.querySelector('table')) {
      return 'table';
    }
    if (blockElement.classList.contains('image-tool') || 
        blockElement.querySelector('img')) {
      return 'image';
    }
    
    // 默认为段落
    return 'paragraph';
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
          current.classList.contains('cdx-quote')) {
        return current;
      }
      current = current.parentElement as HTMLElement;
    }
    return null;
  }, []);

  // 计算标识器位置
  const calculateIndicatorPosition = useCallback((blockElement: HTMLElement) => {
    const rect = blockElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      x: rect.left + scrollLeft,
      y: rect.top + scrollTop + rect.height / 2
    };
  }, []);

  // 鼠标事件处理
  useEffect(() => {
    if (!enabled || !editorInstance) {
      console.log('BlockIndicator: Not enabled or no editor instance');
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
          hideIndicator();
        }
        return;
      }
      
      const blockElement = getBlockElement(target);
      
      if (blockElement && blockElement !== currentHoveredBlock) {
        currentHoveredBlock = blockElement;
        const { x, y } = calculateIndicatorPosition(blockElement);
        const type = getBlockType(blockElement);
        
        console.log('BlockIndicator: Found block', { blockElement, type });
        showIndicator(x, y, blockElement, type);
      } else if (!blockElement && currentHoveredBlock) {
        currentHoveredBlock = null;
        hideIndicator();
      }
    };

    // 监听鼠标移动
    document.addEventListener('mousemove', handleMouseMove);
    
    // 监听滚动事件，隐藏标识器
    const handleScroll = () => {
      hideImmediately();
    };
    window.addEventListener('scroll', handleScroll, true);

    // 监听键盘事件，隐藏标识器
    const handleKeydown = () => {
      hideImmediately();
    };
    document.addEventListener('keydown', handleKeydown);

    console.log('BlockIndicator: Event listeners attached');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeydown);
      
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      console.log('BlockIndicator: Event listeners removed');
    };
  }, [enabled, editorInstance, showIndicator, hideIndicator, hideImmediately, getBlockElement, calculateIndicatorPosition, getBlockType]);

  return {
    indicatorPosition,
    currentBlock,
    blockType,
    showIndicator,
    hideIndicator
  };
};