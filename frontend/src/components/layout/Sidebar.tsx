'use client';

import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { 
  FileTextOutlined, 
  TeamOutlined, 
  SettingOutlined,
  FolderOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;

export interface SidebarProps {
  selectedKey?: string;
  onMenuSelect?: (key: string) => void;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'documents',
    icon: <FileTextOutlined />,
    label: '我的文档',
  },
  {
    key: 'folders',
    icon: <FolderOutlined />,
    label: '文件夹',
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
];

export const Sidebar = ({ 
  selectedKey = 'documents', 
  onMenuSelect,
  collapsed = false,
  onCollapse
}: SidebarProps) => {
  return (
    <Sider 
      width={250} 
      className="ao-bg-muted"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="ao-h-full ao-border-none ao-bg-transparent"
        items={menuItems}
        onSelect={({ key }) => onMenuSelect?.(key)}
      />
    </Sider>
  );
};

export default Sidebar;