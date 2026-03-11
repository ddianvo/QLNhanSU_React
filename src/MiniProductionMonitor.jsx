import React, { useState, useEffect } from 'react';
import { Popover, Button, Tag, Typography, Space, Row } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Re-using the logic from the full monitor
const initialState = {
    photoresist: { level: 98.5 },
    lamp: { efficiency: 99.8 },
    kpis: {
        waferBatch: 45,
        yieldRate: 99.9,
        cleanroomParticles: 2,
    }
};

const MiniProductionMonitor = () => {
    const [data, setData] = useState(initialState);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newWaferBatch = prev.kpis.waferBatch - (Math.random() > 0.8 ? 1 : 0);
                return {
                    photoresist: { ...prev.photoresist, level: prev.photoresist.level > 90 ? prev.photoresist.level - 0.05 : 99.0 },
                    lamp: { ...prev.lamp, efficiency: 99.0 + (Math.random() * 1.0) },
                    kpis: {
                        waferBatch: newWaferBatch <= 0 ? 50 : newWaferBatch,
                        yieldRate: 99.8 + (Math.random() * 0.2),
                        cleanroomParticles: Math.max(0, Math.min(5, prev.kpis.cleanroomParticles + (Math.random() - 0.5)))
                    }
                };
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const getStatusTag = (value, threshold, type = 'higher_is_better') => {
        let status = 'success';
        if (type === 'higher_is_better') {
            if (value < threshold) { status = 'error'; }
            else if (value < threshold * 1.05) { status = 'warning'; }
        } else { // lower_is_better
            if (value > threshold) { status = 'error'; }
            else if (value > threshold * 0.9) { status = 'warning'; }
        }
        return <Tag color={status}>{value.toFixed(type === 'higher_is_better' ? 2 : 0)}</Tag>;
    };

    const popoverContent = (
        <div style={{ width: 280 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Row justify="space-between" align="middle"><Text>Wafer Batch (Kiện)</Text>{getStatusTag(data.kpis.waferBatch, 5, 'higher_is_better')}</Row>
                <Row justify="space-between" align="middle"><Text>Photoresist Level (%)</Text>{getStatusTag(data.photoresist.level, 15, 'higher_is_better')}</Row>
                <Row justify="space-between" align="middle"><Text>Source Efficiency (%)</Text>{getStatusTag(data.lamp.efficiency, 90, 'higher_is_better')}</Row>
                <Row justify="space-between" align="middle"><Text>Cleanroom Particles</Text>{getStatusTag(data.kpis.cleanroomParticles, 10, 'lower_is_better')}</Row>
                <Row justify="space-between" align="middle"><Text>Yield Rate (%)</Text>{getStatusTag(data.kpis.yieldRate, 99, 'higher_is_better')}</Row>
            </Space>
        </div>
    );

    // Check overall status to color the button
    const isCritical = data.kpis.waferBatch < 5 || data.photoresist.level < 15 || data.lamp.efficiency < 90 || data.kpis.cleanroomParticles > 10 || data.kpis.yieldRate < 99;

    return (
        <Popover content={popoverContent} title="Giám sát Sản xuất (Live)" trigger="hover" placement="bottomRight">
            <Button 
                type="text" 
                icon={<DashboardOutlined style={{ color: isCritical ? '#ff4d4f' : '#52c41a' }} />}
            >
                <span style={{ color: isCritical ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
                    {isCritical ? 'Cảnh báo' : 'Ổn định'}
                </span>
            </Button>
        </Popover>
    );
};

export default MiniProductionMonitor;