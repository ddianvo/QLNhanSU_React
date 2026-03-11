import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Table, Space, Typography } from 'antd';
import { 
  ExperimentOutlined, AppstoreOutlined, BarChartOutlined, 
  SlidersOutlined, AlertOutlined, CheckCircleOutlined, SyncOutlined, 
  HddOutlined, HeatMapOutlined, ThunderboltOutlined, GatewayOutlined, TruckOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Text } = Typography;

// Wrapper to replace TinyLine which is removed in v2
const TinyLine = ({ data, color, ...config }) => {
  const chartData = data.map((value, index) => ({ index, value }));
  return (
    <Line
      data={chartData}
      xField="index"
      yField="value"
      padding={0}
      axis={false}
      tooltip={false}
      color={color}
      shapeField="smooth"
      {...config}
    />
  );
};

// Initial state for all metrics
const initialState = {
    wafers: {
        '200mm': { quantity: 150, purity: '9N' },
        '300mm': { quantity: 80, purity: '11N' }
    },
    photoresist: { level: 98.5, expiry: '2026-12-31' },
    photomasks: { wear: 2.3, cleanliness: 99.9 },
    chemicals: { developer: 250.2, etchants: 180.8 },
    lamp: { hours: 1250, efficiency: 99.5 },
    optics: { contamination: 0.001 },
    gases: { helium: 950.5, argon: 1200.1 },
    kpis: {
        waferBatch: 45,
        yieldRate: 99.9,
        cleanroomParticles: 2,
    },
    // Add history for charts
    history: {
        wafer200: Array(20).fill(150),
        wafer300: Array(20).fill(80),
        photoresist: Array(20).fill(98.5),
        lampEfficiency: Array(20).fill(99.5),
        yieldRate: Array(20).fill(99.9),
        cleanroomParticles: Array(20).fill(2),
    }
};

const ProductionMonitor = () => {
    const [data, setData] = useState(initialState);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newWaferBatch = prev.kpis.waferBatch - (Math.random() > 0.8 ? 1 : 0);

                // --- Define new values ---
                const newWafer200 = prev.wafers['200mm'].quantity + 1;
                const newWafer300 = Math.max(0, prev.wafers['300mm'].quantity - (Math.random() > 0.5 ? 1 : 0));
                const newPhotoresist = prev.photoresist.level > 90 ? prev.photoresist.level - 0.05 : 99.0; // Tự động nạp đầy khi thấp
                const newLampEfficiency = 99.0 + (Math.random() * 1.0); // Luôn giữ hiệu suất cao > 99%
                const newYieldRate = 99.8 + (Math.random() * 0.2); // Tỷ lệ đạt gần như tuyệt đối
                const newCleanroomParticles = Math.max(0, Math.min(5, prev.kpis.cleanroomParticles + (Math.random() - 0.5))); // Bụi cực thấp (0-5)

                // --- Helper to update history arrays ---
                const updateHistory = (hist, newValue) => {
                    const newHist = [...hist, newValue];
                    if (newHist.length > 20) { // Keep a fixed window size
                        newHist.shift();
                    }
                    return newHist;
                };

                return {
                    wafers: {
                        '200mm': { ...prev.wafers['200mm'], quantity: newWafer200 },
                        '300mm': { ...prev.wafers['300mm'], quantity: newWafer300 }
                    },
                    photoresist: { ...prev.photoresist, level: newPhotoresist },
                    photomasks: { ...prev.photomasks, wear: prev.photomasks.wear + 0.01, cleanliness: 99.9 - (Math.random() * 0.2) },
                    chemicals: { developer: Math.max(0, prev.chemicals.developer - 0.5), etchants: Math.max(0, prev.chemicals.etchants - 0.3) },
                    lamp: { ...prev.lamp, hours: prev.lamp.hours + 1, efficiency: newLampEfficiency },
                    optics: { ...prev.optics, contamination: prev.optics.contamination + (Math.random() * 0.0001) },
                    gases: { helium: Math.max(0, prev.gases.helium - 0.2), argon: Math.max(0, prev.gases.argon - 0.4) },
                    kpis: {
                        waferBatch: newWaferBatch <= 0 ? 50 : newWaferBatch, // reset if empty
                        yieldRate: newYieldRate,
                        cleanroomParticles: newCleanroomParticles
                    },
                    history: {
                        wafer200: updateHistory(prev.history.wafer200, newWafer200),
                        wafer300: updateHistory(prev.history.wafer300, newWafer300),
                        photoresist: updateHistory(prev.history.photoresist, newPhotoresist),
                        lampEfficiency: updateHistory(prev.history.lampEfficiency, newLampEfficiency),
                        yieldRate: updateHistory(prev.history.yieldRate, newYieldRate),
                        cleanroomParticles: updateHistory(prev.history.cleanroomParticles, newCleanroomParticles),
                    }
                };
            });
        }, 2500); // Update every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatusTag = (value, threshold, type = 'higher_is_better') => {
        let status = 'success';
        let text = 'Ổn định';
        let icon = <CheckCircleOutlined />;

        if (type === 'higher_is_better') {
            if (value < threshold) { status = 'error'; text = 'Cảnh báo'; icon = <AlertOutlined />; }
            else if (value < threshold * 1.05) { status = 'warning'; text = 'Lưu ý'; icon = <SyncOutlined spin />; }
        } else { // lower_is_better
            if (value > threshold) { status = 'error'; text = 'Cảnh báo'; icon = <AlertOutlined />; }
            else if (value > threshold * 0.8) { status = 'warning'; text = 'Lưu ý'; icon = <SyncOutlined spin />; }
        }
        return <Tag icon={icon} color={status}>{text}</Tag>;
    };

    const kpiData = [
        { key: '1', name: 'Wafer Batch (Kiện)', value: data.kpis.waferBatch, unit: 'Kiện', status: getStatusTag(data.kpis.waferBatch, 5, 'higher_is_better') },
        { key: '2', name: 'Photoresist Level', value: `${data.photoresist.level.toFixed(1)}%`, unit: 'Bình chứa', status: getStatusTag(data.photoresist.level, 15, 'higher_is_better') },
        { key: '3', name: 'Source Power Efficiency', value: `${data.lamp.efficiency.toFixed(2)}%`, unit: 'Hiệu suất', status: getStatusTag(data.lamp.efficiency, 90, 'higher_is_better') },
        { key: '4', name: 'Cleanroom Particle', value: data.kpis.cleanroomParticles.toFixed(0), unit: 'Count/m³', status: getStatusTag(data.kpis.cleanroomParticles, 10, 'lower_is_better') },
        { key: '5', name: 'Yield Rate', value: `${data.kpis.yieldRate.toFixed(2)}%`, unit: 'Tỷ lệ đạt', status: getStatusTag(data.kpis.yieldRate, 94, 'higher_is_better') }, // Hạ threshold xuống 94 để 99.x% luôn xanh
    ];

    const kpiColumns = [
        { title: 'Thông số theo dõi (KPI)', dataIndex: 'name', key: 'name' },
        { title: 'Giá trị hiện tại', dataIndex: 'value', key: 'value', render: (text) => <Text strong>{text}</Text> },
        { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    ];

    const supplyData = [
        { id: 1, supplier: 'Shin-Etsu Chemical', material: 'Silicon Wafers 300mm', status: 'Đang giao hàng', eta: dayjs().add(3, 'day').format('YYYY-MM-DD') },
        { id: 2, supplier: 'JSR Corporation', material: 'Photoresist (EUV)', status: 'Đã lên lịch', eta: dayjs().add(10, 'day').format('YYYY-MM-DD') },
        { id: 3, supplier: 'Linde plc', material: 'Helium/Argon Gas', status: 'Đang giao hàng', eta: dayjs().add(1, 'day').format('YYYY-MM-DD') },
        { id: 4, supplier: 'Tokyo Electron', material: 'Developer Chemicals', status: 'Đã giao', eta: dayjs().subtract(2, 'day').format('YYYY-MM-DD') },
    ];

    const supplyColumns = [
        { title: 'Nhà cung cấp', dataIndex: 'supplier', key: 'supplier', render: text => <Text strong>{text}</Text> },
        { title: 'Vật liệu', dataIndex: 'material', key: 'material' },
        { title: 'Ngày dự kiến', dataIndex: 'eta', key: 'eta' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => {
            let color = status === 'Đang giao hàng' ? 'processing' : status === 'Đã lên lịch' ? 'warning' : 'success';
            return <Tag color={color}>{status}</Tag>;
        }},
    ];

    return (
        <div style={{ padding: '0' }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card title={<Space><AppstoreOutlined />Nhóm Vật liệu Nền & Hóa chất</Space>} bordered={false}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Row align="middle" gutter={8}>
                                        <Col span={18}><Statistic title="Wafer 200mm Tồn kho" value={data.wafers['200mm'].quantity} suffix="phiến" prefix={<HddOutlined />} /></Col>
                                        <Col span={6}><TinyLine height={40} autoFit data={data.history.wafer200} smooth color="#52c41a" /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Row align="middle" gutter={8}>
                                        <Col span={18}><Statistic title="Wafer 300mm Tồn kho" value={data.wafers['300mm'].quantity} suffix="phiến" prefix={<HddOutlined />} /></Col>
                                        <Col span={6}><TinyLine height={40} autoFit data={data.history.wafer300} smooth color="#faad14" /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Row align="middle" gutter={8}>
                                        <Col flex="auto">
                                            <Statistic title="Mức chất quang dẫn" value={data.photoresist.level} precision={1} suffix="%" prefix={<ExperimentOutlined />} />
                                            <Progress percent={data.photoresist.level} showInfo={false} status={data.photoresist.level < 15 ? 'exception' : 'normal'} />
                                        </Col>
                                        <Col span={6}><TinyLine height={40} autoFit data={data.history.photoresist} smooth color="#1890ff" /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Statistic title="Hóa chất (Developer)" value={data.chemicals.developer} precision={1} suffix="Lít" prefix={<ExperimentOutlined />} />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={<Space><SlidersOutlined />Nhóm Vật tư tiêu hao cho Máy Quang khắc</Space>} bordered={false}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Statistic title="Giờ chạy nguồn sáng" value={data.lamp.hours} suffix="giờ" prefix={<ThunderboltOutlined />} />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Row align="middle" gutter={8}>
                                        <Col flex="auto">
                                            <Statistic title="Hiệu suất nguồn sáng" value={data.lamp.efficiency} precision={2} suffix="%" />
                                            <Progress percent={data.lamp.efficiency} showInfo={false} status={data.lamp.efficiency < 90 ? 'exception' : 'success'} />
                                        </Col>
                                        <Col span={6}><TinyLine height={40} autoFit data={data.history.lampEfficiency} smooth color="#faad14" /></Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Statistic title="Độ nhiễm bẩn quang học" value={data.optics.contamination} precision={4} suffix="Δ" prefix={<HeatMapOutlined />} />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Card bordered={false}>
                                    <Statistic title="Khí Helium" value={data.gases.helium} precision={1} suffix="Lít" prefix={<GatewayOutlined />} />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={<Space><TruckOutlined />Nguồn cung vật liệu</Space>} bordered={false}>
                        <Table columns={supplyColumns} dataSource={supplyData} pagination={false} rowKey="id" />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={<Space><BarChartOutlined />Bảng theo dõi chỉ số (KPIs)</Space>} bordered={false}>
                        <Table columns={kpiColumns} dataSource={kpiData} pagination={false} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductionMonitor;