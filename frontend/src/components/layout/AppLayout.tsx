'use client';

import { Layout } from 'antd';
import { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

export interface AppLayoutProps {
  children: ReactNode;
  selectedMenuItem?: string;
  onMenuSelect?: (key: string) => void;
  onCreateDocument?: () => void;
  onUserProfile?: () => void;
}

export const AppLayout = ({
  children,
  selectedMenuItem = 'documents',
  onMenuSelect,
  onCreateDocument,
  onUserProfile,
}: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Layout className="ao-min-h-screen">
      <Header 
        onCreateDocument={onCreateDocument}
        onUserProfile={onUserProfile}
      />
      <Layout>
        <Sidebar
          selectedKey={selectedMenuItem}
          onMenuSelect={onMenuSelect}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
        <Content className="ao-p-6 ao-bg-gray-50">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;