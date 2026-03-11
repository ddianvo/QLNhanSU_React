import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Card, message, Space, Modal, Form, DatePicker, Input } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const UserAssets = ({ user, userAssets, availableAssets, assetRequests, setAssetRequests }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [form] = Form.useForm();

    // Lọc ra các yêu cầu của người dùng hiện tại
    const myAssetRequests = useMemo(() => {
        return assetRequests.filter(req => req.userId === user.id);
    }, [assetRequests, user.id]);

    // Lấy danh sách ID các tài sản đang có yêu cầu chờ duyệt
    const pendingAssetIds = useMemo(() => {
        return new Set(assetRequests.filter(req => req.status === 'Chờ duyệt').map(req => req.assetId));
    }, [assetRequests]);

    const showRequestModal = (asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
        form.resetFields();
    };

    const handleCreateRequest = (values) => {
        const newRequest = {
            key: nanoid(),
            assetId: selectedAsset.id,
            assetName: selectedAsset.name,
            userId: user.id,
            userName: user.name,
            requestDate: dayjs().format('YYYY-MM-DD'),
            returnDate: values.returnDate.format('YYYY-MM-DD'),
            reason: values.reason,
            status: 'Chờ duyệt',
        };
        setAssetRequests(prev => [newRequest, ...prev]);
        message.success(`Yêu cầu mượn "${selectedAsset.name}" đã được gửi thành công.`);
        handleCancel();
    };

    const myAssetsColumns = [
        { title: 'Mã TS', dataIndex: 'id', key: 'id', render: (text) => <Tag color="blue">{text}</Tag> },
        { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
        { title: 'Loại', dataIndex: 'type', key: 'type' },
        { title: 'Ngày bàn giao', dataIndex: 'purchaseDate', key: 'purchaseDate' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag> },
    ];

    const availableAssetsColumns = [
        { title: 'Mã TS', dataIndex: 'id', key: 'id', render: (text) => <Tag color="cyan">{text}</Tag> },
        { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
        { title: 'Loại', dataIndex: 'type', key: 'type' },
        { 
            title: 'Hành động', 
            key: 'action', 
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => showRequestModal(record)}
                    disabled={pendingAssetIds.has(record.id)}
                >
                    {pendingAssetIds.has(record.id) ? 'Đang có yêu cầu' : 'Yêu cầu mượn'}
                </Button>
            )
        },
    ];

    const requestColumns = [
        { title: 'Tên thiết bị', dataIndex: 'assetName', key: 'assetName', render: (text) => <strong>{text}</strong> },
        { title: 'Ngày Yêu Cầu', dataIndex: 'requestDate', key: 'requestDate' },
        { title: 'Ngày Dự Trả', dataIndex: 'returnDate', key: 'returnDate' },
        { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                let color, icon;
                if (status === 'Đã duyệt') { color = 'success'; icon = <CheckCircleOutlined />; }
                else if (status === 'Từ chối') { color = 'error'; icon = <QuestionCircleOutlined />; }
                else { color = 'processing'; icon = <SyncOutlined spin />; }
                return <Tag icon={icon} color={color}>{status}</Tag>;
            }
        },
    ];

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title={<><CheckCircleOutlined /> Tài sản đang được cấp phát</>}>
                    <Table columns={myAssetsColumns} dataSource={userAssets} rowKey="id" pagination={false} />
                </Card>
                <Card title={<><ClockCircleOutlined /> Lịch sử & Trạng thái Yêu cầu Mượn Tài sản</>}>
                    <Table columns={requestColumns} dataSource={myAssetRequests} rowKey="key" pagination={{ pageSize: 3 }} />
                </Card>
                <Card title="Danh sách tài sản có thể mượn">
                    <Table columns={availableAssetsColumns} dataSource={availableAssets} rowKey="id" pagination={{ pageSize: 5 }} />
                </Card>
            </Space>

            <Modal
                title={`Yêu cầu mượn: ${selectedAsset?.name}`}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText="Gửi yêu cầu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleCreateRequest}>
                    <p>Tài sản sẽ được yêu cầu cho: <strong>{user?.name}</strong></p>
                    <Form.Item 
                        name="returnDate" 
                        label="Ngày dự kiến trả" 
                        rules={[{ required: true, message: 'Vui lòng chọn ngày dự kiến trả!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                    </Form.Item>
                    <Form.Item 
                        name="reason" 
                        label="Lý do mượn" 
                        rules={[{ required: true, message: 'Vui lòng nêu rõ lý do mượn thiết bị!' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Ví dụ: Đi công tác, hỗ trợ dự án X,..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserAssets;