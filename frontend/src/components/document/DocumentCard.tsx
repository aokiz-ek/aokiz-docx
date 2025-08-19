'use client';

import { Card, Avatar, Typography, Tag, Space, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { 
  FileTextOutlined, 
  MoreOutlined, 
  EditOutlined, 
  ShareAltOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { Document } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const { Text, Title } = Typography;
const { Meta } = Card;

export interface DocumentCardProps {
  document: Partial<Document>;
  onClick?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const DocumentCard = ({
  document,
  onClick,
  onEdit,
  onShare,
  onDelete,
  onDuplicate,
}: DocumentCardProps) => {
  const dropdownItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: onEdit,
    },
    {
      key: 'share',
      label: '分享',
      icon: <ShareAltOutlined />,
      onClick: onShare,
    },
    {
      key: 'duplicate',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: onDuplicate,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
    },
  ];

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: zhCN,
      });
    } catch {
      return date;
    }
  };

  return (
    <Card
      hoverable
      className="ao-w-full"
      actions={[
        <Button
          key="open"
          type="text"
          icon={<FileTextOutlined />}
          onClick={onClick}
        >
          打开
        </Button>,
        <Dropdown
          key="more"
          menu={{ items: dropdownItems }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>,
      ]}
    >
      <Meta
        avatar={<Avatar icon={<FileTextOutlined />} />}
        title={
          <div className="ao-flex ao-items-center ao-justify-between">
            <Title level={5} className="!ao-mb-0 ao-truncate">
              {document.title || '无标题文档'}
            </Title>
            {document.is_public && (
              <Tag color="blue" className="ao-ml-2">
                公开
              </Tag>
            )}
          </div>
        }
        description={
          <Space direction="vertical" className="ao-w-full">
            <Text type="secondary" className="ao-text-sm">
              最后修改：{formatDate(document.updated_at || document.created_at || '')}
            </Text>
            {document.folder_id && (
              <Tag color="default">文件夹</Tag>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default DocumentCard;