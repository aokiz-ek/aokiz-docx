'use client';

import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { PlusOutlined, BoldOutlined, ItalicOutlined } from '@ant-design/icons';

export const DebugHoverToolbar: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查是否在编辑器区域内
      const editorContainer = target.closest('[data-editor-js="true"]');
      if (editorContainer) {
        console.log('DebugHoverToolbar: Mouse in editor area', target);
        
        // 查找块元素
        let blockElement = target;
        while (blockElement && blockElement !== editorContainer) {
          if (blockElement.classList.contains('ce-block') ||
              blockElement.classList.contains('ce-paragraph') ||
              blockElement.classList.contains('ce-header') ||
              blockElement.tagName === 'P' ||
              blockElement.tagName === 'H1' ||
              blockElement.tagName === 'H2' ||
              blockElement.tagName === 'H3') {
            
            console.log('DebugHoverToolbar: Found block element', blockElement);
            const rect = blockElement.getBoundingClientRect();
            setPosition({
              x: rect.left + rect.width / 2,
              y: rect.top,
              visible: true
            });
            return;
          }
          blockElement = blockElement.parentElement as HTMLElement;
        }
      } else {
        setPosition(prev => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!position.visible) return null;

  return (
    <div
      className="ao-fixed ao-z-50 ao-bg-white ao-rounded-lg ao-shadow-lg ao-border ao-border-gray-200 ao-p-2"
      style={{
        left: position.x - 80,
        top: position.y - 50,
        transform: 'translateY(-10px)'
      }}
    >
      <Space size={2}>
        <Tooltip title="添加块">
          <Button type="text" size="small" icon={<PlusOutlined />} />
        </Tooltip>
        <Tooltip title="加粗">
          <Button type="text" size="small" icon={<BoldOutlined />} />
        </Tooltip>
        <Tooltip title="斜体">
          <Button type="text" size="small" icon={<ItalicOutlined />} />
        </Tooltip>
      </Space>
      
      {/* 三角形指示器 */}
      <div 
        className="ao-absolute ao-w-3 ao-h-3 ao-bg-white ao-border-l ao-border-b ao-border-gray-200"
        style={{
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)'
        }}
      />
    </div>
  );
};