'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SlashCommandItem } from './SlashCommand';

export interface SlashCommandState {
  visible: boolean;
  position: { x: number; y: number };
  searchTerm: string;
  triggerPosition: number;
}

export interface UseSlashCommandOptions {
  editorInstance?: any;
  onCommand?: (command: SlashCommandItem) => void;
}

/**
 * 斜杠命令Hook
 * 检测用户输入"/"并显示命令菜单
 */
export const useSlashCommand = (options: UseSlashCommandOptions = {}) => {
  const { editorInstance, onCommand } = options;
  
  const [slashState, setSlashState] = useState<SlashCommandState>({
    visible: false,
    position: { x: 0, y: 0 },
    searchTerm: '',
    triggerPosition: -1
  });

  const keyHandlerRef = useRef<((e: Event) => void) | null>(null);
  const isHandlingSlashRef = useRef(false);

  // 获取光标位置
  const getCursorPosition = useCallback((): { x: number; y: number } | null => {
    if (typeof window === 'undefined') return null;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (rect.width === 0 && rect.height === 0) {
      // 如果光标矩形无效，尝试获取容器位置
      const container = range.startContainer;
      if (container && container.nodeType === Node.TEXT_NODE) {
        const parent = container.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          return {
            x: parentRect.left,
            y: parentRect.bottom + 4
          };
        }
      }
    }

    return {
      x: rect.left,
      y: rect.bottom + 4
    };
  }, []);

  // 检查是否应该显示斜杠命令
  const checkForSlashCommand = useCallback((text: string, cursorPosition: number) => {
    // 查找最后一个斜杠的位置
    const lastSlashIndex = text.lastIndexOf('/', cursorPosition);
    
    if (lastSlashIndex === -1) {
      return null;
    }

    // 检查斜杠之前是否是空格、换行或者字符串开头
    const beforeSlash = lastSlashIndex > 0 ? text[lastSlashIndex - 1] : ' ';
    const isValidSlash = beforeSlash === ' ' || beforeSlash === '\n' || lastSlashIndex === 0;
    
    if (!isValidSlash) {
      return null;
    }

    // 获取斜杠后的搜索词
    const searchTerm = text.substring(lastSlashIndex + 1, cursorPosition);
    
    // 搜索词不应该包含空格或换行
    if (searchTerm.includes(' ') || searchTerm.includes('\n')) {
      return null;
    }

    return {
      triggerPosition: lastSlashIndex,
      searchTerm
    };
  }, []);

  // 处理文本输入
  const handleTextInput = useCallback((text: string, cursorPosition: number) => {
    if (isHandlingSlashRef.current) return;

    const slashInfo = checkForSlashCommand(text, cursorPosition);
    
    if (slashInfo) {
      const position = getCursorPosition();
      if (position) {
        setSlashState({
          visible: true,
          position,
          searchTerm: slashInfo.searchTerm,
          triggerPosition: slashInfo.triggerPosition
        });
      }
    } else {
      setSlashState(prev => ({
        ...prev,
        visible: false,
        searchTerm: '',
        triggerPosition: -1
      }));
    }
  }, [checkForSlashCommand, getCursorPosition]);

  // 监听编辑器变化
  useEffect(() => {
    if (!editorInstance) return;

    // 创建一个全局键盘事件监听器来捕获所有按键
    const handleGlobalKeydown = (e: Event) => {
      // 检查是否在编辑器内
      const target = e.target as HTMLElement;
      if (!target || !target.closest('[data-cy="editorjs"]') && !target.closest('.codex-editor')) {
        return;
      }

      // 如果斜杠菜单可见，让 SlashCommand 组件处理键盘事件
      if (slashState.visible && ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes((e as KeyboardEvent).key)) {
        return;
      }

      // 处理输入事件
      setTimeout(() => {
        try {
          const currentBlock = editorInstance.blocks.getCurrentBlockIndex();
          const block = editorInstance.blocks.getBlockByIndex(currentBlock);
          
          if (block && block.holder) {
            // 获取当前块的文本内容
            const textElement = block.holder.querySelector('[contenteditable="true"]');
            if (textElement) {
              const text = textElement.textContent || '';
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const cursorPosition = range.startOffset;
                handleTextInput(text, cursorPosition);
              }
            }
          }
        } catch (error) {
          console.warn('处理文本输入失败:', error);
        }
      }, 0);
    };

    keyHandlerRef.current = handleGlobalKeydown;
    document.addEventListener('keyup', handleGlobalKeydown);
    document.addEventListener('input', handleGlobalKeydown);
    document.addEventListener('click', handleGlobalKeydown);

    return () => {
      if (keyHandlerRef.current) {
        document.removeEventListener('keyup', keyHandlerRef.current);
        document.removeEventListener('input', keyHandlerRef.current);
        document.removeEventListener('click', keyHandlerRef.current);
        keyHandlerRef.current = null;
      }
    };
  }, [editorInstance, handleTextInput, slashState.visible]);

  // 处理命令选择
  const handleCommandSelect = useCallback((command: SlashCommandItem) => {
    if (!editorInstance || slashState.triggerPosition === -1) return;

    isHandlingSlashRef.current = true;

    try {
      // 获取当前块
      const currentBlockIndex = editorInstance.blocks.getCurrentBlockIndex();
      const currentBlock = editorInstance.blocks.getBlockByIndex(currentBlockIndex);
      
      if (currentBlock && currentBlock.holder) {
        const textElement = currentBlock.holder.querySelector('[contenteditable="true"]');
        if (textElement) {
          const text = textElement.textContent || '';
          
          // 移除斜杠和搜索词
          const beforeSlash = text.substring(0, slashState.triggerPosition);
          const afterSearchTerm = text.substring(slashState.triggerPosition + 1 + slashState.searchTerm.length);
          const newText = beforeSlash + afterSearchTerm;
          
          // 如果新文本为空且不是段落块，删除当前块
          if (newText.trim() === '' && currentBlock.name !== 'paragraph') {
            editorInstance.blocks.delete(currentBlockIndex);
          } else {
            // 更新当前块的文本
            textElement.textContent = newText;
            
            // 如果当前块是空的段落，我们将在下一个位置插入新块
            if (newText.trim() === '' && currentBlock.name === 'paragraph') {
              // 空段落将被新块替换
            }
          }
        }
      }

      // 调用命令的 action
      if (command.action) {
        command.action();
      }

      // 通知外部
      if (onCommand) {
        onCommand(command);
      }
    } catch (error) {
      console.error('处理命令选择失败:', error);
    } finally {
      setTimeout(() => {
        isHandlingSlashRef.current = false;
      }, 100);
    }
  }, [editorInstance, slashState.triggerPosition, slashState.searchTerm, onCommand]);

  // 关闭斜杠菜单
  const closeSlashCommand = useCallback(() => {
    setSlashState(prev => ({
      ...prev,
      visible: false,
      searchTerm: '',
      triggerPosition: -1
    }));
  }, []);

  return {
    slashState,
    handleCommandSelect,
    closeSlashCommand
  };
};

export default useSlashCommand;