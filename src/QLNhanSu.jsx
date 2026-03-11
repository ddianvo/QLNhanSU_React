import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Typography, message, Avatar, Space } from 'antd';
import { TeamOutlined, DollarOutlined, SolutionOutlined, LogoutOutlined, UserOutlined, DashboardOutlined, CalendarOutlined, BarChartOutlined } from '@ant-design/icons';
import './index.css'; // Import file CSS

import AddEmployeeModal from './AddEmployeeModal';
import BangLuong from './BangLuong';
import ChamCong from './ChamCong';
import Login from './Login';
import NhanVienList from './NhanVienList'; // Import component mới
import Dashboard from './Dashboard';
import LeaveManagement from './LeaveManagement';
import Reports from './Reports';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const QLNhanSu = () => {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('danhSachNhanVien');
    return savedData ? JSON.parse(savedData) : [
      { key: '1', name: 'Nguyễn Văn A', department: 'IT', role: 'Developer', salary: 15000000, status: 'Đang làm', attendance: 20 },
      { key: '2', name: 'Trần Thị B', department: 'HR', role: 'Manager', salary: 20000000, status: 'Đang làm', attendance: 22 },
    ];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('0');

  // Auto-save data to localStorage
  useEffect(() => {
    localStorage.setItem('danhSachNhanVien', JSON.stringify(data));
  }, [data]);

  // Handlers
  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    message.info('Đã đăng xuất!');
  };

  const handleUpdateAttendance = (employeeKey) => {
    setData(data.map(item => 
      item.key === employeeKey ? { ...item, attendance: (item.attendance || 0) + 1 } : item
    ));
    message.success('Đã ghi nhận chấm công!');
  };

  const handleDeleteEmployee = (employeeKey) => {
    setData(data.filter(item => item.key !== employeeKey));
    message.success('Đã xóa nhân viên thành công!');
  };

  // Login screen
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Main content renderer
  const renderContent = () => {
    switch (activeTab) {
      case '0': // Bảng điều khiển
        return (
          <>
            <div className="content-header">
              <Title level={4}>Tổng quan</Title>
            </div>
            <Dashboard data={data} />
          </>
        );
      case '1': // Nhân sự
        return (
          <>
            <div className="content-header">
              <Title level={4}>Quản lý nhân viên</Title>
              <Button type="primary" onClick={() => setIsModalOpen(true)}>+ Thêm Nhân Viên</Button>
            </div>
            <NhanVienList 
              danhSachNhanVien={data} 
              onDelete={handleDeleteEmployee}
              onEdit={(record) => message.info(`Chức năng sửa cho ${record.name} sẽ được phát triển.`)} // Placeholder for edit
            />
          </>
        );
      case '2': // Chấm công
        return (
          <>
            <div className="content-header">
              <Title level={4}>Chấm công</Title>
            </div>
            <ChamCong danhSachNhanVien={data} onUpdateAttendance={handleUpdateAttendance} />
          </>
        );
      case '3': // Bảng lương
        return (
          <>
            <div className="content-header">
              <Title level={4}>Bảng lương chi tiết</Title>
              <Button type="primary" icon={<DollarOutlined />}>
                Xuất Phiếu Lương (PDF)
              </Button>
            </div>
            <BangLuong danhSachNhanVien={data} />
          </>
        );
      case '4': // Quản lý nghỉ phép
        return (
          <>
            <div className="content-header">
              <Title level={4}>Quản lý Nghỉ phép</Title>
            </div>
            <LeaveManagement />
          </>
        );
      case '5': // Báo cáo
        return (
          <>
            <div className="content-header">
              <Title level={4}>Báo cáo & Thống kê</Title>
            </div>
            <Reports />
          </>
        );
      default:
        return null;
    }
  };

  // Main layout
  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="logo">
          <Title level={4} style={{ margin: 0, color: 'white' }}>HRM</Title>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']}
          onClick={({ key }) => setActiveTab(key)}
          items={[
            { key: '0', icon: <DashboardOutlined />, label: 'Bảng điều khiển' },
            { key: '1', icon: <TeamOutlined />, label: 'Nhân sự' },
            { key: '2', icon: <SolutionOutlined />, label: 'Chấm công' },
            { key: '3', icon: <DollarOutlined />, label: 'Bảng lương' },
            { key: '4', icon: <CalendarOutlined />, label: 'Quản lý Nghỉ phép' },
            { key: '5', icon: <BarChartOutlined />, label: 'Báo cáo' },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
        />
        <Space size="large">
          <Space><Avatar icon={<UserOutlined />} /><Text strong style={{ color: 'white' }}>Admin</Text></Space>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} type="text" danger>Đăng xuất</Button>
        </Space>
      </Header>

      <Content className="admin-content">
        {renderContent()}
      </Content>

      <AddEmployeeModal 
        open={isModalOpen} 
        onCreate={(emp) => { 
          setData([...data, { ...emp, key: Date.now().toString(), attendance: 0 }]); 
          setIsModalOpen(false); 
        }} 
        onCancel={() => setIsModalOpen(false)} 
      />
    </Layout>
  );
};

export default QLNhanSu;