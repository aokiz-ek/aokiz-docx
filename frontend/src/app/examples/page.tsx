'use client';

import { ConfigProvider, Typography, Layout } from 'antd';
import { antdTheme } from '@/lib/antd-config';
import StyleExample from '@/components/examples/StyleExample';

const { Title } = Typography;
const { Content } = Layout;

export default function ExamplesPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className="ao-min-h-screen">
        <Content className="ao-p-8 ao-bg-gray-50">
          <div className="ao-max-w-4xl ao-mx-auto">
            <div className="ao-text-center ao-mb-8">
              <Title level={1} className="ao-mb-4">
                Aokiz Docx 样式系统示例
              </Title>
              <Title level={3} className="ao-text-gray-600 ao-font-normal">
                展示 ao- 前缀的 Tailwind CSS 使用方法
              </Title>
            </div>
            
            <div className="ao-flex ao-justify-center">
              <StyleExample />
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}