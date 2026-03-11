import React from 'react';
import { Card, Descriptions, Avatar, Tag, Row, Col, Statistic, Tabs, List, Button } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const UserProfile = ({ user }) => {
  if (!user) {
    return <Card>Không tìm thấy thông tin người dùng.</Card>;
  }

  const age = user.birthday ? dayjs().diff(dayjs(user.birthday), 'year') : 'N/A';

  const documents = [
    { title: 'Hợp đồng lao động.pdf', date: user.contractDate },
    { title: 'Quyết định bổ nhiệm.pdf', date: '2023-01-15' },
    { title: 'Chứng chỉ đào tạo nội bộ.pdf', date: '2023-06-20' },
  ];

  const items = [
    {
      key: '1',
      label: 'Thông tin chung',
      children: (
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Mã nhân viên">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{user.birthday} ({age} tuổi)</Descriptions.Item>
          <Descriptions.Item label="Giới tính">Nam</Descriptions.Item>
          <Descriptions.Item label="Email"><MailOutlined /> {user.id.toLowerCase()}@company.com</Descriptions.Item>
          <Descriptions.Item label="Điện thoại"><PhoneOutlined /> 0909 123 456</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ"><HomeOutlined /> TP. Hồ Chí Minh, Việt Nam</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: 'Công việc & Hợp đồng',
      children: (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Phòng ban">{user.department}</Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Ngày vào làm">{user.joinDate}</Descriptions.Item>
          <Descriptions.Item label="Loại hợp đồng"><Tag color="blue">{user.contractType}</Tag></Descriptions.Item>
          <Descriptions.Item label="Ngày hết hạn HĐ">{user.contractDate}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái"><Tag color="success">{user.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Người quản lý trực tiếp">Nguyễn Vũ Trọng (CEO)</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '3',
      label: 'Tài liệu & Hồ sơ',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={documents}
          renderItem={item => (
            <List.Item actions={[<Button type="link" icon={<DownloadOutlined />}>Tải về</Button>]}>
              <List.Item.Meta
                avatar={<Avatar icon={<FilePdfOutlined />} style={{ backgroundColor: '#ff4d4f' }} />}
                title={item.title}
                description={`Ngày cập nhật: ${item.date}`}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={6} style={{ textAlign: 'center' }}>
          <Avatar size={128} icon={<UserOutlined />} src={`https://i.pravatar.cc/150?u=${user.id}`} />
          <h2 style={{ marginTop: 16, marginBottom: 4 }}>{user.name}</h2>
          <p style={{ color: '#888' }}>{user.id}</p>
          <Tag color="blue">{user.role}</Tag>
        </Col>
        <Col xs={24} md={18}>
          <Tabs defaultActiveKey="1" items={items} />
        </Col>
      </Row>
    </Card>
  );
};

export default UserProfile;