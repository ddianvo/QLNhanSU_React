import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Space, Card, Input, Select, Modal, Form, message, Tooltip, Avatar, Row, Col, Statistic, Tabs, DatePicker, InputNumber } from 'antd';
import { 
  LaptopOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  UserOutlined, 
  SwapOutlined,
  DesktopOutlined,
  PrinterOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  FileProtectOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import './OrgChart.css';

const { Option } = Select;

const AssetManager = ({ employeeData = [], assets = [], setAssets, assetRequests = [], setAssetRequests }) => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal thêm mới
  const [currentAsset, setCurrentAsset] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // --- Thống kê ---
  // include both assets and assetRequests in the dependency array to
  // satisfy React's lint rules and avoid stale values
  const stats = useMemo(() => {
    const totalValue = assets.reduce((sum, item) => sum + item.value, 0);
    const inUse = assets.filter(a => a.status === 'Đang sử dụng').length;
    const inStock = assets.filter(a => a.status === 'Kho').length;
    const broken = assets.filter(a => a.status === 'Bảo hành' || a.status === 'Hỏng').length;
    const pending = assetRequests.filter(r => r.status === 'Chờ duyệt').length;
    return { totalValue, inUse, inStock, broken, pending };
  }, [assets, assetRequests]);

  // --- Xử lý dữ liệu ---
  const filteredAssets = assets.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || item.id.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAssign = (asset) => {
    setCurrentAsset(asset);
    form.setFieldsValue({ user: asset.user });
    setIsModalOpen(true);
  };

  const handleSaveAssignment = (values) => {
    const newStatus = values.user ? 'Đang sử dụng' : 'Kho';
    setAssets(prev => prev.map(item => 
      item.id === currentAsset.id ? { ...item, user: values.user, status: newStatus } : item
    ));
    message.success(values.user ? 'Đã cấp phát tài sản thành công' : 'Đã thu hồi tài sản về kho');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài sản',
      content: 'Bạn có chắc chắn muốn xóa tài sản này khỏi hệ thống?',
      onOk: () => {
        setAssets(prev => prev.filter(item => item.id !== id));
        message.success('Đã xóa tài sản');
      }
    });
  };

  // --- Xử lý Thêm mới Tài sản ---
  const handleAddAsset = (values) => {
    const newAsset = {
      id: `TS${nanoid(6)}`, // short unique id with prefix
      name: values.name,
      type: values.type,
      value: values.value,
      status: 'Kho', // Mặc định là Kho
      user: null,
      purchaseDate: values.purchaseDate ? values.purchaseDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
    };
    setAssets(prev => [...prev, newAsset]);
    message.success('Đã thêm tài sản mới thành công!');
    setIsAddModalOpen(false);
    addForm.resetFields();
  };

  // --- Xử lý Duyệt / Từ chối Yêu cầu ---
  const handleApproveRequest = (request) => {
    // 1. Cập nhật trạng thái yêu cầu
    const updatedRequests = assetRequests.map(req => 
      req.key === request.key ? { ...req, status: 'Đã duyệt' } : req
    );
    setAssetRequests(updatedRequests);

    // 2. Cập nhật trạng thái tài sản (Gán cho nhân viên)
    const updatedAssets = assets.map(asset => 
      asset.id === request.assetId 
        ? { ...asset, user: request.userId, status: 'Đang sử dụng' } 
        : asset
    );
    setAssets(updatedAssets);

    message.success(`Đã duyệt yêu cầu cấp phát ${request.assetName} cho ${request.userName}`);
  };

  const handleRejectRequest = (request) => {
    const updatedRequests = assetRequests.map(req => 
      req.key === request.key ? { ...req, status: 'Từ chối' } : req
    );
    setAssetRequests(updatedRequests);
    message.warning('Đã từ chối yêu cầu.');
  };

  // --- Render Columns ---
  const columns = [
    {
      title: 'Mã TS',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Tag color="blue">{text}</Tag>,
      width: 100,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {record.type === 'Laptop' && <LaptopOutlined />}
          {record.type === 'Màn hình' && <DesktopOutlined />}
          {record.type === 'Mạng' && <WifiOutlined />}
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (val) => `${val.toLocaleString()} đ`,
      sorter: (a, b) => a.value - b.value,
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        if (status === 'Đang sử dụng') { color = 'success'; icon = <CheckCircleOutlined />; }
        if (status === 'Kho') { color = 'warning'; icon = <SyncOutlined />; }
        if (status === 'Bảo hành') { color = 'error'; icon = <CloseCircleOutlined />; }
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
      width: 150,
    },
    {
      title: 'Người sử dụng',
      dataIndex: 'user',
      key: 'user',
      render: (userId) => {
        if (!userId) return <span style={{ color: '#ccc' }}>-- Chưa cấp phát --</span>;
        const emp = employeeData.find(e => e.id === userId);
        return emp ? (
          <Space>
            <Avatar size="small" src={`https://i.pravatar.cc/150?u=${userId}`}>{emp.name[0]}</Avatar>
            <span>{emp.name}</span>
          </Space>
        ) : userId;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Cấp phát / Thu hồi">
            <Button type="text" icon={<SwapOutlined />} onClick={() => handleAssign(record)} style={{ color: '#1890ff' }} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
          </Tooltip>
        </Space>
      ),
      width: 100,
    },
  ];

  const requestColumns = [
    { title: 'Nhân viên', dataIndex: 'userName', key: 'userName', render: text => <b>{text}</b> },
    { title: 'Tài sản yêu cầu', dataIndex: 'assetName', key: 'assetName', render: (text, record) => <Space><Tag color="blue">{record.assetId}</Tag>{text}</Space> },
    { title: 'Ngày yêu cầu', dataIndex: 'requestDate', key: 'requestDate' },
    { title: 'Ngày trả dự kiến', dataIndex: 'returnDate', key: 'returnDate' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        let color = status === 'Chờ duyệt' ? 'processing' : status === 'Đã duyệt' ? 'success' : 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        record.status === 'Chờ duyệt' ? (
          <Space>
            <Button type="primary" size="small" onClick={() => handleApproveRequest(record)}>Duyệt</Button>
            <Button danger size="small" onClick={() => handleRejectRequest(record)}>Từ chối</Button>
          </Space>
        ) : <span style={{ color: '#ccc' }}>Đã xử lý</span>
      )
    }
  ];

  return (
    <div className="asset-manager-container">
      {/* Thống kê nhanh */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng giá trị tài sản" value={stats.totalValue} suffix="đ" valueStyle={{ color: '#1890ff', fontSize: 20 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Đang sử dụng" value={stats.inUse} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tồn kho" value={stats.inStock} valueStyle={{ color: '#faad14' }} prefix={<SyncOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Bảo hành / Hỏng" value={stats.broken} valueStyle={{ color: '#ff4d4f' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          {
            key: '1',
            label: <span><LaptopOutlined /> Danh sách Tài sản</span>,
            children: (
              <Card bordered={false} className="asset-toolbar-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Space>
                    <Input 
                      placeholder="Tìm kiếm tài sản..." 
                      prefix={<SearchOutlined />} 
                      style={{ width: 250 }} 
                      onChange={e => setSearchText(e.target.value)}
                    />
                    <Select defaultValue="all" style={{ width: 150 }} onChange={setFilterStatus}>
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="Đang sử dụng">Đang sử dụng</Option>
                      <Option value="Kho">Trong kho</Option>
                      <Option value="Bảo hành">Bảo hành</Option>
                    </Select>
                  </Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>Thêm tài sản mới</Button>
                </div>
                
                <Table 
                  columns={columns} 
                  dataSource={filteredAssets} 
                  rowKey="id" 
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            )
          },
          {
            key: '2',
            label: (
              <span>
                <FileProtectOutlined /> Yêu cầu mượn 
                {stats.pending > 0 && <Tag color="red" style={{ marginLeft: 8 }}>{stats.pending}</Tag>}
              </span>
            ),
            children: (
              <Card bordered={false}>
                <Table 
                  columns={requestColumns} 
                  dataSource={assetRequests} 
                  rowKey="key"
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* Modal Cấp phát */}
      <Modal
        title={`Cấp phát tài sản: ${currentAsset?.name}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveAssignment} layout="vertical">
          <Form.Item name="user" label="Nhân viên tiếp nhận">
            <Select 
              showSearch 
              placeholder="Chọn nhân viên hoặc để trống để thu hồi về kho"
              allowClear
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={employeeData.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.id})` }))}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm mới Tài sản */}
      <Modal
        title="Thêm Tài sản / Thiết bị Mới"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => addForm.submit()}
        okText="Thêm mới"
        cancelText="Hủy"
      >
        <Form form={addForm} onFinish={handleAddAsset} layout="vertical">
          <Form.Item name="name" label="Tên thiết bị" rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}>
            <Input placeholder="Ví dụ: MacBook Pro M3" prefix={<LaptopOutlined />} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại thiết bị" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                <Select placeholder="Chọn loại">
                  <Option value="Laptop">Laptop</Option>
                  <Option value="PC">PC / Máy bàn</Option>
                  <Option value="Màn hình">Màn hình</Option>
                  <Option value="Thiết bị VP">Thiết bị VP</Option>
                  <Option value="Nội thất">Nội thất</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="value" label="Giá trị (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="purchaseDate" label="Ngày mua / Nhập kho" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetManager;