import React, { useState, useRef, useMemo } from 'react';
import { Card, Col, Row, Statistic, List, Avatar, Typography, Tag, Timeline, Progress } from 'antd';
import { 
  TeamOutlined, 
  DollarCircleOutlined, 
  CheckSquareOutlined, 
  WarningOutlined, 
  GiftOutlined, 
  ClockCircleOutlined,
  BellOutlined,
  RiseOutlined,
  UserAddOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/plots';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import CountUp from 'react-countup';

const { Text: AntText } = Typography;

const Dashboard = ({ data, themeMode }) => {
  // --- 1. LOGIC TÍNH TOÁN (Giữ nguyên từ code của bạn) ---
  const totalEmployees = data.length;
  const totalExpectedSalary = data.reduce((sum, item) => sum + item.salary + (item.allowance || 0), 0);
  const companySalaryBudget = totalExpectedSalary * 1.2;
  const totalActualSalary = data.reduce((sum, item) => {
    const dailyWage = item.salary / 26;
    return sum + (dailyWage * (item.attendance || 0)) + (item.allowance || 0);
  }, 0);

  const salaryDisbursementRate = totalExpectedSalary > 0 
    ? Math.round((totalActualSalary / totalExpectedSalary) * 100) 
    : 0;

  const totalAttendance = data.reduce((sum, item) => sum + (item.attendance || 0), 0);
  const averageAttendance = totalEmployees > 0 ? (totalAttendance / (totalEmployees * 26)) * 100 : 0;
  const lowAttendanceList = data.filter(emp => (emp.attendance || 0) < 15);
  const currentMonth = dayjs().month() + 1;
  const birthdayList = data.filter(emp => {
    if (!emp.birthday) return false;
    return dayjs(emp.birthday).month() + 1 === currentMonth;
  });

  const expiringContracts = data.filter(emp => {
    if (!emp.contractDate) return false;
    const diffDays = dayjs(emp.contractDate).diff(dayjs(), 'day');
    return diffDays > 0 && diffDays <= 30;
  });

  // Mock data cho module mới
  const recruitmentCount = 15; // Số hồ sơ mới
  const avgKPI = 88.5; // Điểm KPI trung bình

  // --- 2. DỮ LIỆU BIỂU ĐỒ ---
  const hrStructureData = Object.entries(
    data.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, value]) => ({ type, value }));

  const salaryByDeptData = Object.entries(
    data.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + emp.salary + (emp.allowance || 0);
      return acc;
    }, {})
  ).map(([department, salary]) => ({ department, salary }));

  const chartConfig = { autoFit: true, height: 250, legend: { position: 'right' }, theme: themeMode };
  const cardStyle = { borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', height: '100%' };

  // Framer Motion variants for staggered animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card bordered={false} style={cardStyle}>
                <Statistic title="Tổng nhân sự" valueRender={() => <CountUp end={totalEmployees} duration={1.5} />} prefix={<TeamOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card bordered={false} style={cardStyle}>
                <Statistic title="Ngân sách lương" valueRender={() => <CountUp end={companySalaryBudget} duration={1.5} separator="," />} precision={0} prefix={<DollarCircleOutlined />} valueStyle={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.3)', fontSize: '1.2rem' }} />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card bordered={false} style={cardStyle}>
                <Statistic title="Hiệu suất chấm công" valueRender={() => <CountUp end={averageAttendance} duration={1.5} decimals={1} />} prefix={<CheckSquareOutlined />} suffix="%" valueStyle={{ color: averageAttendance < 50 ? '#ff4d4f' : '#52c41a' }} />
              </Card>
            </motion.div>
          </Col>
          {/* Module 3: KPI */}
          <Col xs={24} sm={12} md={6}>
            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card bordered={false} style={cardStyle}>
                <Statistic 
                  title="KPI Trung bình" 
                  valueRender={() => <CountUp end={avgKPI} duration={1.5} decimals={1} />} 
                  prefix={<RiseOutlined />} 
                  suffix="/100" 
                  valueStyle={{ color: '#722ed1' }} 
                />
              </Card>
            </motion.div>
          </Col>

          {/* Dự báo chi phí lương */}
          <Col span={24}>
            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card title="Dự báo chi phí lương" bordered={false} style={cardStyle}>
                <Row gutter={24} align="middle">
                  <Col span={18}>
                    <Progress 
                      percent={salaryDisbursementRate} 
                      strokeColor={{ from: '#108ee9', to: '#87d068' }}
                      status="active"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <AntText type="secondary">Thực tế: <span style={{ color: '#39ff14', fontWeight: 'bold' }}>{Math.round(totalActualSalary).toLocaleString()} VNĐ</span></AntText>
                      <AntText strong>Dự kiến: <span style={{ color: '#1890ff' }}>{totalExpectedSalary.toLocaleString()} VNĐ</span></AntText>
                    </div>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="Còn lại phải chi" 
                      valueRender={() => <CountUp end={totalExpectedSalary - totalActualSalary} duration={1.5} separator="," />}
                      suffix="VNĐ" 
                      valueStyle={{ fontSize: 14, color: '#faad14' }} 
                    />
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} lg={12}>
            <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card title="Cơ cấu nhân sự" style={cardStyle}><Pie {...chartConfig} data={hrStructureData} angleField='value' colorField='type' radius={0.8} label={{ type: 'inner', offset: '-30%', content: ({ percent }) => `${(percent * 100).toFixed(0)}%`, style: { fontSize: 14, fill: '#fff' } }} /></Card>
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
              <Card title="Quỹ lương phòng ban" style={cardStyle}><Column {...chartConfig} data={salaryByDeptData} xField='department' yField='salary' /></Card>
            </motion.div>
          </Col>
        </Row>
      </Col>

      <Col xs={24} lg={8}>
        <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible" style={{height: '100%'}}>
          <Card title={<><BellOutlined /> Trợ lý ảo & Tự động hóa</>} style={cardStyle} bodyStyle={{ padding: '12px 24px' }}>
            <Timeline items={[
              { color: 'red', dot: <WarningOutlined />, children: (
                <>
                  <AntText strong>Cần nhắc nhở chấm công ({lowAttendanceList.length})</AntText><br />
                  {lowAttendanceList.length > 0 ? lowAttendanceList.map(emp => <Tag color="error" key={emp.key} style={{marginTop:4}}>{emp.name} ({emp.attendance})</Tag>) : <AntText type="success">Không có ai.</AntText>}
                </>
              )},
              { color: 'green', dot: <GiftOutlined />, children: (
                <>
                  <AntText strong>Sinh nhật tháng {currentMonth}</AntText>
                  <List size="small" dataSource={birthdayList} renderItem={item => <List.Item style={{border:'none', padding:'4px 0'}}><Avatar size="small" style={{marginRight:8}}>{item.name[0]}</Avatar>{item.name} ({item.birthday})</List.Item>} />
                </>
              )},
              { color: 'blue', dot: <ClockCircleOutlined />, children: (
                <>
                  <AntText strong>Hợp đồng sắp hết hạn</AntText>
                  <List size="small" dataSource={expiringContracts} renderItem={item => <List.Item style={{border:'none', padding:'4px 0'}}><AntText type="warning">{item.name}</AntText> ({item.contractDate})</List.Item>} />
                </>
              )},
              // Module 7: Tự động hóa
              { color: 'purple', dot: <ApiOutlined />, children: (
                <>
                  <AntText strong>Tự động hóa quy trình</AntText>
                  <div style={{fontSize: '12px', color: '#888'}}>Đã tự động tính lương tháng 10. Đã gửi 15 email nhắc nhở chấm công.</div>
                </>
              )}
            ]} />
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default Dashboard;