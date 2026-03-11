import React from 'react';
import { Card, Row, Col, Statistic, List, Badge, Timeline, Typography, Avatar } from 'antd';
import { 
  ClockCircleOutlined, CalendarOutlined, FileTextOutlined, NotificationOutlined, TeamOutlined, 
  CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const UserDashboard = ({ user, data, allLeaveRequests }) => {
  if (!user) return null;

  // Lọc các đơn nghỉ phép của người dùng hiện tại
  const userLeaveRequests = allLeaveRequests.filter(req => req.name === user.name);

  // --- TÍNH TOÁN DỮ LIỆU ĐỘNG ---
  // Phép năm: Giả định mỗi năm có 12 ngày phép
  const leaveBalance = 12;
  // Tính số ngày phép năm đã sử dụng (chỉ tính đơn "Đã duyệt")
  const leaveUsed = userLeaveRequests
    .filter(req => req.status === 'Đã duyệt' && req.type.includes('Nghỉ phép năm'))
    .reduce((sum, req) => sum + req.days, 0);
  // Đếm số đơn đang chờ duyệt
  const pendingRequestsCount = userLeaveRequests.filter(req => req.status === 'Chờ duyệt').length;

  const teamMembers = data.filter(emp => emp.department === user.department && emp.id !== user.id).slice(0, 4);

  const announcements = [
    // Cập nhật ngày tháng để luôn hiển thị gần với ngày hiện tại
    { title: 'Thông báo về sự kiện Team Building quý tới', date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), type: 'urgent' },
    { title: 'Cập nhật chính sách bảo hiểm mới', date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'), type: 'normal' },
    { title: 'Lịch khám sức khỏe định kỳ năm nay', date: dayjs().subtract(2, 'month').format('YYYY-MM-DD'), type: 'normal' },
  ];

  // --- DÒNG THỜI GIAN ĐỘNG ---
  const timelineItems = [
    { color: 'green', children: `Đã chấm công hôm nay lúc 08:01`, dot: <CheckCircleOutlined /> },
    { color: 'blue', children: 'Đã nhận phiếu lương tháng 10/2023' },
  ];
  // Thêm hoạt động nghỉ phép mới nhất vào dòng thời gian
  if (userLeaveRequests.length > 0) {
    // Sắp xếp để lấy đơn mới nhất
    const latestRequest = [...userLeaveRequests].sort((a, b) => dayjs(b.dates.split(' ')[0]).valueOf() - dayjs(a.dates.split(' ')[0]).valueOf())[0];
    let timelineNode = {};
    if (latestRequest.status === 'Chờ duyệt') {
      timelineNode = { color: 'orange', children: `Bạn đã nộp đơn xin nghỉ: ${latestRequest.type}`, dot: <SyncOutlined spin /> };
    } else if (latestRequest.status === 'Đã duyệt') {
      timelineNode = { color: 'green', children: `Đơn xin nghỉ (${latestRequest.type}) đã được duyệt` };
    } else {
       timelineNode = { color: 'red', children: `Đơn xin nghỉ (${latestRequest.type}) đã bị từ chối`, dot: <ExclamationCircleOutlined /> };
    }
    timelineItems.push(timelineNode);
  }
  timelineItems.push({ color: 'gray', children: 'Cập nhật hồ sơ cá nhân ngày 15/09/2023' });

  return (
    <div className="user-dashboard" style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Welcome Section */}
        <Col span={24}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)', color: 'white' }}>
            <Row align="middle">
              <Col flex="auto">
                <Title level={2} style={{ color: 'white', margin: 0 }}>Xin chào, {user.name}!</Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Chúc bạn một ngày làm việc hiệu quả. Hôm nay là {new Date().toLocaleDateString('vi-VN')}</Text>
              </Col>
              <Col>
                <Statistic title="KPI Tháng này" value={92} suffix="/ 100" valueStyle={{ color: '#fff' }} titleStyle={{ color: 'rgba(255,255,255,0.7)' }} />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Stats Cards */}
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
            <Statistic title="Phép năm còn lại" value={leaveBalance - leaveUsed} suffix={`/ ${leaveBalance}`} prefix={<CalendarOutlined />} valueStyle={{ color: '#3f8600' }} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Đã dùng: {leaveUsed} ngày</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
            <Statistic title="Ngày công thực tế" value={user.attendance || 0} suffix="/ 26" prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Cập nhật: Vừa xong</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable>
            <Statistic title="Đơn chờ duyệt" value={pendingRequestsCount} prefix={<FileTextOutlined />} valueStyle={{ color: pendingRequestsCount > 0 ? '#faad14' : '#888' }} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>{pendingRequestsCount > 0 ? 'Cần quản lý duyệt' : 'Không có đơn nào'}</div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card title={`Đồng nghiệp phòng ${user.department}`} bordered={false}>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
              dataSource={teamMembers}
              renderItem={item => (
                <List.Item>
                  <Card size="small" bordered={true}>
                    <List.Item.Meta
                      avatar={<Avatar src={`https://i.pravatar.cc/150?u=${item.id}`}>{item.name[0]}</Avatar>}
                      title={<Text strong style={{ fontSize: 12 }}>{item.name}</Text>}
                      description={<Text type="secondary" style={{ fontSize: 10 }}>{item.role}</Text>}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card title={<><NotificationOutlined /> Thông báo nội bộ</>} bordered={false} style={{ marginBottom: 24 }}>
            <List
              itemLayout="horizontal"
              dataSource={announcements}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge status={item.type === 'urgent' ? 'error' : 'processing'} />}
                    title={<a href="#">{item.title}</a>}
                    description={item.date}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Dòng thời gian hoạt động" bordered={false}>
            <Timeline items={timelineItems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;