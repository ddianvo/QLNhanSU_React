import React from 'react';
import { Table, Button, Tag, Calendar, Badge, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const ChamCong = ({ danhSachNhanVien, onUpdateAttendance }) => {
  const today = new Date().toLocaleDateString('vi-VN');
  const isSingleUser = danhSachNhanVien.length === 1;

  // Nếu là view của User (chỉ có 1 nhân viên), hiển thị dạng Lịch
  if (isSingleUser) {
    const user = danhSachNhanVien[0];
    const dateCellRender = (value) => {
      // Giả lập dữ liệu chấm công trên lịch
      const day = value.day();
      if (day !== 0 && day !== 6) { // Ngày thường
        // Logic giả: Nếu ngày < hôm nay thì coi như đã chấm công
        if (value.isBefore(new Date(), 'day')) {
           return <Badge status="success" text="8:00 - 17:00" />;
        }
      }
      return null;
    };

    return (
      <Card title={`Lịch sử chấm công: ${user.name}`} bordered={false}>
        <Calendar dateCellRender={dateCellRender} />
      </Card>
    );
  }

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { 
      title: 'Số ngày đã chấm công', 
      dataIndex: 'attendance', 
      key: 'attendance', 
      render: (days) => <Tag>{days || 0} ngày</Tag> 
    },
    {
      title: 'Trạng thái hôm nay',
      key: 'statusToday',
      render: (_, record) => (
        record.lastCheckIn === today 
          ? <Tag color="success">Đã chấm công</Tag> 
          : <Tag color="warning">Chưa chấm công</Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type={record.lastCheckIn === today ? "default" : "primary"}
          disabled={record.lastCheckIn === today}
          icon={<CheckCircleOutlined />} 
          onClick={() => onUpdateAttendance(record.key)}
        >
          {record.lastCheckIn === today ? "Hoàn thành" : "Chấm công"}
        </Button>
      ),
    },
  ];

  return (
    <Table 
      dataSource={danhSachNhanVien} 
      columns={columns} 
      pagination={{ pageSize: 10 }} 
    />
  );
};

export default ChamCong;