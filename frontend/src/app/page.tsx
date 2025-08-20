'use client';

import Link from 'next/link';
import { ConfigProvider, Button, Card, Space, Typography, Layout, Menu, Avatar } from 'antd';
import { 
  FileTextOutlined, 
  TeamOutlined, 
  SettingOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { antdTheme } from '@/lib/antd-config';

const { Title, Paragraph } = Typography;
const { Header, Content, Sider } = Layout;

export default function Home() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className="ao-min-h-screen">
        {/* Header */}
        <Header className="ao-bg-white ao-border-b ao-border-gray-200 ao-px-6 ao-flex ao-items-center ao-justify-between">
          <div className="ao-flex ao-items-center ao-space-x-4">
            <Title level={3} className="!ao-mb-0 !ao-text-primary">
              Aokiz Docx
            </Title>
          </div>
          <div className="ao-flex ao-items-center ao-space-x-4">
            <Link href="/editor">
              <Button type="primary" icon={<PlusOutlined />}>
                新建文档
              </Button>
            </Link>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>

        <Layout>
          {/* Sidebar */}
          <Sider width={250} className="ao-bg-muted">
            <Menu
              mode="inline"
              defaultSelectedKeys={['documents']}
              className="ao-h-full ao-border-none ao-bg-transparent"
              items={[
                {
                  key: 'documents',
                  icon: <FileTextOutlined />,
                  label: '我的文档',
                },
                {
                  key: 'shared',
                  icon: <TeamOutlined />,
                  label: '协作文档',
                },
                {
                  key: 'settings',
                  icon: <SettingOutlined />,
                  label: '设置',
                },
              ]}
            />
          </Sider>

          {/* Main Content */}
          <Content className="ao-p-6 ao-bg-gray-50">
            <div className="ao-max-w-6xl ao-mx-auto">
              {/* Welcome Section */}
              <div className="ao-mb-8">
                <Title level={2}>欢迎使用 Aokiz Docx</Title>
                <Paragraph className="ao-text-lg ao-text-gray-600">
                  专业的团队协作文档编辑平台，让创作和协作变得更简单
                </Paragraph>
              </div>

              {/* Feature Cards */}
              <div className="ao-grid ao-grid-cols-1 md:ao-grid-cols-2 lg:ao-grid-cols-3 ao-gap-6 ao-mb-8">
                <Card 
                  hoverable
                  className="ao-text-center"
                  actions={[
                    <Link key="start" href="/editor/feishu">
                      <Button type="primary" icon={<EditOutlined />}>
                        AO风格编辑器
                      </Button>
                    </Link>
                  ]}
                >
                  <FileTextOutlined className="ao-text-4xl ao-text-primary ao-mb-4" />
                  <Title level={4}>AO风格编辑</Title>
                  <Paragraph>
                    专业的AO风格文档编辑器，流畅的编辑体验，无焦点丢失问题
                  </Paragraph>
                </Card>

                <Card 
                  hoverable
                  className="ao-text-center"
                  actions={[
                    <Button key="collaborate" type="primary" icon={<TeamOutlined />}>
                      立即协作
                    </Button>
                  ]}
                >
                  <TeamOutlined className="ao-text-4xl ao-text-success ao-mb-4" />
                  <Title level={4}>实时协作</Title>
                  <Paragraph>
                    多人同时编辑，实时同步，支持评论和批注功能
                  </Paragraph>
                </Card>

                <Card 
                  hoverable
                  className="ao-text-center"
                  actions={[
                    <Button key="manage" type="primary" icon={<SettingOutlined />}>
                      文档管理
                    </Button>
                  ]}
                >
                  <SettingOutlined className="ao-text-4xl ao-text-warning ao-mb-4" />
                  <Title level={4}>版本控制</Title>
                  <Paragraph>
                    完整的版本历史记录，随时恢复到任意版本
                  </Paragraph>
                </Card>
              </div>

              {/* Tech Stack Demo */}
              <Card title="技术栈验证" className="ao-mb-6">
                <Space direction="vertical" className="ao-w-full">
                  <div className="ao-p-4 ao-bg-blue-50 ao-rounded-lg">
                    <Title level={5} className="!ao-text-blue-700 !ao-mb-2">
                      ✅ Next.js 15 + TypeScript
                    </Title>
                    <Paragraph className="!ao-mb-0 ao-text-blue-600">
                      现代化的 React 框架，支持服务端渲染和静态生成
                    </Paragraph>
                  </div>
                  
                  <div className="ao-p-4 ao-bg-green-50 ao-rounded-lg">
                    <Title level={5} className="!ao-text-green-700 !ao-mb-2">
                      ✅ Tailwind CSS 4.x (ao- 前缀)
                    </Title>
                    <Paragraph className="!ao-mb-0 ao-text-green-600">
                      原子化 CSS 框架，支持自定义主题和响应式设计
                    </Paragraph>
                  </div>
                  
                  <div className="ao-p-4 ao-bg-purple-50 ao-rounded-lg">
                    <Title level={5} className="!ao-text-purple-700 !ao-mb-2">
                      ✅ Ant Design 5.x
                    </Title>
                    <Paragraph className="!ao-mb-0 ao-text-purple-600">
                      企业级 UI 组件库，提供丰富的交互组件
                    </Paragraph>
                  </div>
                </Space>
              </Card>

              {/* Action Buttons */}
              <Card>
                <div className="ao-text-center">
                  <Title level={4} className="!ao-mb-4">
                    开始您的文档协作之旅
                  </Title>
                  <Space size="large">
                    <Link href="/editor/feishu">
                      <Button type="primary" size="large" icon={<PlusOutlined />}>
                        AO风格编辑器
                      </Button>
                    </Link>
                    <Link href="/editor">
                      <Button size="large" icon={<EditOutlined />}>
                        标准编辑器
                      </Button>
                    </Link>
                    <Button size="large" icon={<TeamOutlined />}>
                      邀请团队
                    </Button>
                  </Space>
                </div>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
