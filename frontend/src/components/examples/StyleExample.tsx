'use client';

import { Card, Typography, Space, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * 样式使用示例组件
 * 展示如何正确使用 ao- 前缀的 Tailwind CSS 类名
 */
export const StyleExample = () => {
  return (
    <Card 
      title="样式系统使用示例" 
      className="ao-w-full ao-max-w-2xl"
    >
      <Space direction="vertical" className="ao-w-full" size="large">
        
        {/* 布局示例 */}
        <div>
          <Title level={4} className="ao-mb-4">
            布局系统 (ao- 前缀)
          </Title>
          <div className="ao-flex ao-items-center ao-justify-between ao-p-4 ao-bg-blue-50 ao-rounded-lg ao-border">
            <span className="ao-text-blue-700">左侧内容</span>
            <span className="ao-text-blue-700">右侧内容</span>
          </div>
        </div>

        {/* 网格系统示例 */}
        <div>
          <Title level={4} className="ao-mb-4">
            网格系统
          </Title>
          <div className="ao-grid ao-grid-cols-1 md:ao-grid-cols-2 lg:ao-grid-cols-3 ao-gap-4">
            <div className="ao-p-4 ao-bg-green-50 ao-rounded-lg ao-text-center">
              <div className="ao-text-green-700 ao-font-medium">卡片 1</div>
            </div>
            <div className="ao-p-4 ao-bg-green-50 ao-rounded-lg ao-text-center">
              <div className="ao-text-green-700 ao-font-medium">卡片 2</div>
            </div>
            <div className="ao-p-4 ao-bg-green-50 ao-rounded-lg ao-text-center">
              <div className="ao-text-green-700 ao-font-medium">卡片 3</div>
            </div>
          </div>
        </div>

        {/* 颜色系统示例 */}
        <div>
          <Title level={4} className="ao-mb-4">
            颜色系统
          </Title>
          <div className="ao-space-y-3">
            <div className="ao-p-3 ao-bg-primary ao-text-white ao-rounded">主色调 Primary</div>
            <div className="ao-p-3 ao-bg-success ao-text-white ao-rounded">成功色 Success</div>
            <div className="ao-p-3 ao-bg-warning ao-text-white ao-rounded">警告色 Warning</div>
            <div className="ao-p-3 ao-bg-error ao-text-white ao-rounded">错误色 Error</div>
          </div>
        </div>

        {/* 协作光标示例 */}
        <div>
          <Title level={4} className="ao-mb-4">
            协作光标系统
          </Title>
          <div className="ao-p-4 ao-bg-gray-50 ao-rounded-lg ao-relative ao-min-h-24">
            <p className="ao-text-gray-600">这里是编辑区域的文本内容...</p>
            
            {/* 模拟协作光标 */}
            <div 
              className="ao-collaboration-cursor ao-blue" 
              style={{ top: '20px', left: '120px' }}
              data-user="用户1"
            />
            <div 
              className="ao-collaboration-cursor ao-green" 
              style={{ top: '20px', left: '180px' }}
              data-user="用户2"
            />
          </div>
        </div>

        {/* 响应式示例 */}
        <div>
          <Title level={4} className="ao-mb-4">
            响应式设计
          </Title>
          <div className="ao-grid ao-grid-cols-1 md:ao-grid-cols-2 ao-gap-4">
            <div className="ao-p-4 ao-bg-purple-50 ao-rounded-lg">
              <div className="ao-text-purple-700">
                移动端: 1列<br />
                桌面端: 2列
              </div>
            </div>
            <div className="ao-p-4 ao-bg-purple-50 ao-rounded-lg ao-hidden md:ao-block">
              <div className="ao-text-purple-700">
                仅在桌面端显示
              </div>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="ao-p-4 ao-bg-yellow-50 ao-border ao-border-yellow-200 ao-rounded-lg">
          <div className="ao-flex ao-items-start ao-space-x-3">
            <InfoCircleOutlined className="ao-text-yellow-600 ao-mt-1" />
            <div>
              <Title level={5} className="ao-text-yellow-800 ao-mb-2">
                使用提示
              </Title>
              <Paragraph className="ao-text-yellow-700 ao-mb-0">
                所有 Tailwind CSS 类名都使用 <code className="ao-bg-yellow-100 ao-px-1 ao-rounded">ao-</code> 前缀，
                确保与其他 CSS 框架不冲突。例如：<code className="ao-bg-yellow-100 ao-px-1 ao-rounded">ao-flex</code>、
                <code className="ao-bg-yellow-100 ao-px-1 ao-rounded">ao-items-center</code>、
                <code className="ao-bg-yellow-100 ao-px-1 ao-rounded">ao-space-x-4</code>
              </Paragraph>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="ao-flex ao-justify-center ao-space-x-4 ao-pt-4">
          <Button type="primary">主要按钮</Button>
          <Button>次要按钮</Button>
        </div>

      </Space>
    </Card>
  );
};

export default StyleExample;