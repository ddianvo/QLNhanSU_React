import React, { useState } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Tabs, List, Badge, Button, 
  Alert, Space, Typography, Tooltip
} from 'antd';
import { 
  ApiOutlined, 
  BankOutlined, 
  CloudSyncOutlined, 
  HistoryOutlined, 
  SyncOutlined, 
  GlobalOutlined,
  DatabaseOutlined,
  LockOutlined,
  WifiOutlined,
  ClusterOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const SystemIntegration = () => {
  const [loading, setLoading] = useState(false);

  // Mock Data: ERP Sync Logs
  const erpLogs = [
    { key: '1', time: '2023-10-25 08:00:00', type: 'Nhân sự', action: 'Đồng bộ danh sách NV', status: 'Success', details: 'Đã cập nhật 50 hồ sơ' },
    { key: '2', time: '2023-10-25 08:05:00', type: 'Chấm công', action: 'Pull dữ liệu máy chấm công', status: 'Success', details: 'Nhận 120 records' },
    { key: '3', time: '2023-10-24 17:30:00', type: 'Kế toán', action: 'Push bảng lương tháng 10', status: 'Pending', details: 'Đang chờ duyệt từ ERP' },
    { key: '4', time: '2023-10-24 08:00:00', type: 'Nhân sự', action: 'Đồng bộ danh sách NV', status: 'Success', details: 'Không có thay đổi' },
    { key: '5', time: '2023-10-23 09:15:00', type: 'Hệ thống', action: 'Backup dữ liệu', status: 'Error', details: 'Connection timeout' },
    { key: '6', time: '2023-10-23 08:00:00', type: 'Nhân sự', action: 'Đồng bộ danh sách NV', status: 'Success', details: 'Đã cập nhật 2 hồ sơ' },
    { key: '7', time: '2023-10-22 18:00:00', type: 'Kho', action: 'Đồng bộ tồn kho tài sản', status: 'Success', details: 'Đã cập nhật 15 items' },
  ];

  // Mock Data: Bank Transactions
  const bankTransactions = [
    { key: '1', batchId: 'PAY-OCT-001', date: '2023-10-05', amount: 2500000000, count: 45, status: 'Completed', bank: 'Vietcombank' },
    { key: '2', batchId: 'PAY-SEP-002', date: '2023-09-05', amount: 2450000000, count: 44, status: 'Completed', bank: 'Vietcombank' },
    { key: '3', batchId: 'BONUS-Q3', date: '2023-10-10', amount: 500000000, count: 10, status: 'Processing', bank: 'Techcombank' },
    { key: '4', batchId: 'ADVANCE-OCT', date: '2023-10-15', amount: 150000000, count: 5, status: 'Completed', bank: 'Vietcombank' },
  ];

  // Mock Data: IoT Devices
  const devices = [
    { id: 'DEV-01', name: 'Máy chấm công Sảnh A', ip: '192.168.1.201', location: 'Tầng 1', status: 'Online', lastPing: 'Just now' },
    { id: 'DEV-02', name: 'Máy chấm công Sảnh B', ip: '192.168.1.202', location: 'Tầng 1', status: 'Online', lastPing: '1 min ago' },
    { id: 'DEV-03', name: 'FaceID Canteen', ip: '192.168.1.205', location: 'Tầng 2', status: 'Offline', lastPing: '2 hours ago' },
    { id: 'DEV-04', name: 'Cổng an ninh Garage', ip: '192.168.1.210', location: 'Hầm B1', status: 'Online', lastPing: 'Just now' },
    { id: 'DEV-05', name: 'Cảm biến nhiệt độ Server', ip: '192.168.1.215', location: 'Phòng Server', status: 'Online', lastPing: '30 sec ago' },
    { id: 'DEV-06', name: 'Camera AI Giám sát', ip: '192.168.1.220', location: 'Sảnh chính', status: 'Online', lastPing: 'Just now' },
    { id: 'DEV-07', name: 'Máy in thẻ từ', ip: '192.168.1.225', location: 'Phòng HR', status: 'Maintenance', lastPing: '5 hours ago' },
  ];

  // Mock Data: API Keys
  const apiKeys = [
    { key: '1', name: 'Mobile App API', prefix: 'sk_live_...', created: '2023-01-01', lastUsed: '2023-10-25', status: 'Active' },
    { key: '2', name: 'ERP Connector', prefix: 'sk_test_...', created: '2023-05-15', lastUsed: '2023-10-24', status: 'Active' },
    { key: '3', name: 'Legacy System', prefix: 'sk_old_...', created: '2022-01-01', lastUsed: '2023-08-01', status: 'Revoked' },
    { key: '4', name: 'Recruitment Portal', prefix: 'sk_live_...', created: '2023-09-01', lastUsed: '2023-10-25', status: 'Active' },
  ];

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const columnsLog = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { title: 'Phân hệ', dataIndex: 'type', key: 'type', render: text => <Tag color="blue">{text}</Tag> },
    { title: 'Hành động', dataIndex: 'action', key: 'action' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => (
      <Badge status={status === 'Success' ? 'success' : status === 'Pending' ? 'processing' : 'error'} text={status} />
    )},
    { title: 'Chi tiết', dataIndex: 'details', key: 'details' },
  ];

  const columnsBank = [
    { title: 'Mã Lô', dataIndex: 'batchId', key: 'batchId', render: text => <b>{text}</b> },
    { title: 'Ngày thực hiện', dataIndex: 'date', key: 'date' },
    { title: 'Ngân hàng', dataIndex: 'bank', key: 'bank', render: text => <Tag color="green">{text}</Tag> },
    { title: 'Tổng tiền', dataIndex: 'amount', key: 'amount', render: val => <span style={{color: '#3f8600', fontWeight: 'bold'}}>{val.toLocaleString()} VNĐ</span> },
    { title: 'Số lệnh', dataIndex: 'count', key: 'count' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => (
      <Tag color={status === 'Completed' ? 'success' : 'processing'}>{status}</Tag>
    )},
  ];

  return (
    <div className="system-integration-container" style={{ padding: 24 }}>
      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="Trạng thái ERP (SAP)" value="Connected" valueStyle={{ color: '#3f8600' }} prefix={<CloudSyncOutlined />} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Last sync: 10 mins ago</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="Cổng thanh toán" value="Active" valueStyle={{ color: '#1890ff' }} prefix={<BankOutlined />} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Vietcombank Direct</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="Thiết bị IoT Online" value={devices.filter(d => d.status === 'Online').length} suffix={`/ ${devices.length}`} prefix={<WifiOutlined />} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>{devices.filter(d => d.status !== 'Online').length} device(s) attention needed</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false}>
            <Statistic title="API Requests (24h)" value={15420} prefix={<ApiOutlined />} />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>99.9% Success rate</div>
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Space><ClusterOutlined /> Trung tâm điều khiển tích hợp</Space>} 
        extra={<Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={handleSync}>Đồng bộ thủ công</Button>}
      >
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'Nhật ký đồng bộ (ERP)',
            children: <Table dataSource={erpLogs} columns={columnsLog} pagination={{ pageSize: 5 }} />
          },
          {
            key: '2',
            label: 'Kết nối Ngân hàng',
            children: (
              <>
                <Alert message="Kết nối bảo mật TLS 1.3 đang hoạt động. Chứng chỉ hết hạn sau 120 ngày." type="success" showIcon style={{ marginBottom: 16 }} />
                <Table dataSource={bankTransactions} columns={columnsBank} pagination={false} />
              </>
            )
          },
          {
            key: '3',
            label: 'Quản lý thiết bị (IoT)',
            children: (
              <List 
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} 
                dataSource={devices} 
                renderItem={item => (
                  <List.Item>
                    <Card 
                      title={item.name} 
                      size="small" 
                      extra={
                        <Tooltip title={item.status}>
                          <Badge status={item.status === 'Online' ? 'success' : item.status === 'Offline' ? 'error' : 'warning'} />
                        </Tooltip>
                      }
                      actions={[
                        <Button type="link" size="small">Log</Button>,
                        <Button type="link" size="small" danger={item.status === 'Offline'}>Restart</Button>
                      ]}
                    >
                      <p><GlobalOutlined /> IP: {item.ip}</p>
                      <p><DatabaseOutlined /> Loc: {item.location}</p>
                      <p><HistoryOutlined /> Ping: {item.lastPing}</p>
                    </Card>
                  </List.Item>
                )} 
              />
            )
          },
          {
            key: '4',
            label: 'API & Webhooks',
            children: (
              <List 
                itemLayout="horizontal" 
                dataSource={apiKeys} 
                renderItem={item => (
                  <List.Item actions={[<Button type="link">Regenerate</Button>, <Button type="link" danger>Revoke</Button>]}>
                    <List.Item.Meta 
                      avatar={<LockOutlined style={{ fontSize: 24, color: '#1890ff' }} />} 
                      title={item.name} 
                      description={
                        <Space wrap>
                          <Tag>{item.prefix}</Tag>
                          <span>Created: {item.created}</span>
                          <span>Last used: {item.lastUsed}</span>
                          <Tag color={item.status === 'Active' ? 'green' : 'red'}>{item.status}</Tag>
                        </Space>
                      } 
                    />
                  </List.Item>
                )} 
              />
            )
          }
        ]} />
      </Card>
    </div>
  );
};

export default SystemIntegration;