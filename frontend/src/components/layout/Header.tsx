'use client';

import { Layout, Typography, Button, Avatar, Space } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export interface HeaderProps {
  onCreateDocument?: () => void;
  onUserProfile?: () => void;
}

export const Header = ({ onCreateDocument, onUserProfile }: HeaderProps) => {
  return (
    <AntHeader className="ao-bg-white ao-border-b ao-border-gray-200 ao-px-6 ao-flex ao-items-center ao-justify-between">
      <div className="ao-flex ao-items-center ao-space-x-4">
        <Title level={3} className="!ao-mb-0 !ao-text-primary">
          Aokiz Docx
        </Title>
      </div>
      <Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onCreateDocument}
        >
          新建文档
        </Button>
        <Avatar 
          icon={<UserOutlined />} 
          onClick={onUserProfile}
          className="ao-cursor-pointer"
        />
      </Space>
    </AntHeader>
  );
};

export default Header;