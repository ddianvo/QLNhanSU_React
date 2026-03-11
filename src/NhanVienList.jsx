import React, { useState } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input, Avatar, Select } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const NhanVienList = ({ danhSachNhanVien, onDelete, onEdit }) => {
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [contractTypeFilter, setContractTypeFilter] = useState(null);

  // Lấy danh sách duy nhất cho bộ lọc
  const departments = [...new Set(danhSachNhanVien.map(item => item.department))];
  const statuses = [...new Set(danhSachNhanVien.map(item => item.status))];
  const contractTypes = [...new Set(danhSachNhanVien.map(item => item.contractType).filter(Boolean))];

  // Logic lọc dữ liệu theo Tên hoặc ID
  const filteredData = danhSachNhanVien.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.id.toLowerCase().includes(searchText.toLowerCase());
    const matchDept = deptFilter ? item.department === deptFilter : true;
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const matchContractType = contractTypeFilter ? item.contractType === contractTypeFilter : true;
    return matchSearch && matchDept && matchStatus && matchContractType;
  });

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Avatar',
      key: 'avatar',
      width: 80,
      render: (_, record) => (
        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
          {record.name ? record.name.charAt(0).toUpperCase() : <UserOutlined />}
        </Avatar>
      )
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Tuổi',
      key: 'age',
      sorter: (a, b) => dayjs().diff(dayjs(a.birthday), 'year') - dayjs().diff(dayjs(b.birthday), 'year'),
      render: (_, record) => {
        if (!record.birthday) return 'N/A';
        const age = dayjs().diff(dayjs(record.birthday), 'year');
        return `${age}`;
      },
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <Tag color="geekblue" style={{ fontWeight: 500 }}>{dept}</Tag>,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'contractType',
      key: 'contractType',
      render: (text) => <Tag color="geekblue">{text || 'N/A'}</Tag>,
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      // YÊU CẦU CỦA BẠN: Số lương và chữ VND màu xanh lá cây
      render: (salary) => (
        <span className="text-money" style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)', fontWeight: 'bold' }}>
          {salary ? salary.toLocaleString('vi-VN') : 0} VND
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đang làm' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xóa nhân viên"
            description={`Bạn có chắc muốn xóa ${record.name}?`}
            onConfirm={() => onDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input 
          placeholder="Tìm kiếm theo Tên hoặc Mã NV..." 
          prefix={<SearchOutlined />} 
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Lọc Phòng ban"
          style={{ width: 180 }}
          allowClear
          onChange={setDeptFilter}
          suffixIcon={<FilterOutlined />}
          options={departments.map(d => ({ label: d, value: d }))}
        />
        <Select
          placeholder="Lọc Trạng thái"
          style={{ width: 180 }}
          allowClear
          onChange={setStatusFilter}
          suffixIcon={<FilterOutlined />}
          options={statuses.map(s => ({ label: s, value: s }))}
        />
        <Select
          placeholder="Lọc Loại hợp đồng"
          style={{ width: 180 }}
          allowClear
          onChange={setContractTypeFilter}
          suffixIcon={<FilterOutlined />}
          options={contractTypes.map(c => ({ label: c, value: c }))}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ pageSize: 8 }} 
        rowKey="key"
      />
    </>
  );
};

export default NhanVienList;