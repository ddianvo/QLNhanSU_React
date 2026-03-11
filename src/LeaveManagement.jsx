import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Space, message, Card, Modal, Form, Select, DatePicker, Input } from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LeaveManagement = ({ danhSachNhanVien = [], requests, setRequests }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isUserView = danhSachNhanVien.length === 1;
  const currentUser = isUserView ? danhSachNhanVien[0] : null;

  const displayedRequests = useMemo(() => {
      return isUserView && currentUser ? requests.filter(req => req.name === currentUser.name) : requests;
  }, [requests, isUserView, currentUser]);

  const handleApprove = (key) => {
    const newRequests = requests.map(item => 
      item.key === key ? { ...item, status: 'Đã duyệt' } : item
    );
    setRequests(newRequests);
    message.success('Đã duyệt đơn nghỉ phép');
  };

  const handleReject = (key) => {
    const newRequests = requests.map(item => 
      item.key === key ? { ...item, status: 'Từ chối' } : item
    );
    setRequests(newRequests);
    message.warning('Đã từ chối đơn nghỉ phép');
  };

  const handleCreateRequest = (values) => {
    const employee = currentUser; // Chỉ user mới được tạo đơn
    if (!employee) {
      message.error("Không tìm thấy thông tin nhân viên!");
      return;
    }

    const [startDate, endDate] = values.dates;
    const days = endDate.diff(startDate, 'days') + 1;

    const newRequest = {
      key: nanoid(),
      name: employee.name,
      type: values.type,
      dates: `${startDate.format('YYYY-MM-DD')} đến ${endDate.format('YYYY-MM-DD')}`,
      days,
      reason: values.reason || 'Không có lý do',
      status: 'Chờ duyệt',
    };

    setRequests(prev => [newRequest, ...prev]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Đã tạo đơn xin nghỉ phép thành công!');
  };

  const columns = [
    { title: 'Nhân viên', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },
    { title: 'Loại nghỉ', dataIndex: 'type', key: 'type' },
    { title: 'Thời gian', dataIndex: 'dates', key: 'dates' },
    { title: 'Số ngày', dataIndex: 'days', key: 'days', render: (d) => <Tag color="blue">{d} ngày</Tag> },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã duyệt') color = 'success';
        if (status === 'Từ chối') color = 'error';
        if (status === 'Chờ duyệt') color = 'processing';
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  // Chỉ Admin mới có quyền duyệt/từ chối (hiển thị cột Hành động)
  if (!isUserView) {
    columns.push({
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        record.status === 'Chờ duyệt' ? (
          <Space>
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckOutlined />} 
              onClick={() => handleApprove(record.key)}
              style={{ backgroundColor: '#52c41a' }}
            >
              Duyệt
            </Button>
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<CloseOutlined />} 
              onClick={() => handleReject(record.key)}
            >
              Từ chối
            </Button>
          </Space>
        ) : <span style={{ color: '#aaa' }}>Đã xử lý</span>
      ),
    });
  }

  return (
    <>
      <Card 
        title="Danh sách đơn xin nghỉ phép" 
        bordered={false}
        extra={
          // Chỉ User mới được tạo đơn nghỉ phép
          isUserView && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Tạo đơn nghỉ phép
            </Button>
          )
        }
      >
        <Table 
          dataSource={displayedRequests} 
          columns={columns} 
          pagination={{ pageSize: 6 }} 
        />
      </Card>

      <Modal
        title="Tạo đơn xin nghỉ phép mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo đơn"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
          <p>Tạo đơn xin nghỉ phép cho: <strong>{currentUser?.name}</strong></p>
          <Form.Item name="type" label="Loại nghỉ phép" rules={[{ required: true, message: 'Vui lòng chọn loại nghỉ phép!' }]}>
            <Select placeholder="Chọn loại nghỉ phép">
              <Option value="Nghỉ phép năm (Có lương)">Nghỉ phép năm (Có lương)</Option>
              <Option value="Nghỉ ốm (Có lương)">Nghỉ ốm (Có lương)</Option>
              <Option value="Nghỉ việc riêng (Không lương)">Nghỉ việc riêng (Không lương)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dates" label="Thời gian nghỉ" rules={[{ required: true, message: 'Vui lòng chọn ngày nghỉ!' }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do">
            <Input.TextArea rows={3} placeholder="Nêu rõ lý do nghỉ..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LeaveManagement;