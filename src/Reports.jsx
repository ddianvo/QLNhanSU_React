import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, DatePicker, Select, Space, Button, Table, Statistic } from 'antd';
import { Pie, Column } from '@ant-design/plots';
import { FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;
const { Option } = Select;

const Reports = ({ data = [], themeMode }) => {
  const [selectedDept, setSelectedDept] = useState('all');

  // 1. BỘ LỌC THÔNG MINH
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const isDeptMatch = selectedDept === 'all' || item.department === selectedDept;
      // Bỏ lọc theo ngày để tránh gây nhầm lẫn, báo cáo sẽ luôn hiển thị toàn bộ dữ liệu (hoặc theo phòng ban đã chọn)
      return isDeptMatch;
    });
  }, [data, selectedDept]);

  // Lấy danh sách phòng ban duy nhất để lọc
  const uniqueDepartments = useMemo(() => ['all', ...new Set(data.map(item => item.department))], [data]);

  // 2. DỮ LIỆU CHO BIỂU ĐỒ
  // Báo cáo nhân sự: Phân bổ theo loại hợp đồng
  const contractTypeData = useMemo(() => {
    const stats = filteredData.reduce((acc, emp) => {
      // Giả định nhân viên có trường contractType
      const type = emp.contractType || 'Chưa xác định';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([type, value]) => ({ type, value }));
  }, [filteredData]);

  // Báo cáo lương: Tổng quỹ lương theo phòng ban
  const { columnData, avgSalary } = useMemo(() => {
    const stats = filteredData.reduce((acc, emp) => {
      // Cập nhật: Tính cả phụ cấp vào báo cáo quỹ lương
      acc[emp.department] = (acc[emp.department] || 0) + emp.salary + (emp.allowance || 0);
      return acc;
    }, {});
    const data = Object.entries(stats).map(([department, salary]) => ({ department, salary }));
    const totalSalary = data.reduce((sum, item) => sum + item.salary, 0);
    const average = data.length > 0 ? totalSalary / data.length : 0;
    return { columnData: data, avgSalary: average };
  }, [filteredData]);

  // 3. Báo cáo độ tuổi (Mới)
  const ageData = useMemo(() => {
    const stats = { 'Dưới 25': 0, '25 - 35': 0, '35 - 45': 0, 'Trên 45': 0 };
    filteredData.forEach(emp => {
      if (emp.birthday) {
        const age = dayjs().diff(dayjs(emp.birthday), 'year');
        if (age < 25) stats['Dưới 25']++;
        else if (age <= 35) stats['25 - 35']++;
        else if (age <= 45) stats['35 - 45']++;
        else stats['Trên 45']++;
      }
    });
    return Object.entries(stats).map(([type, value]) => ({ type, value }));
  }, [filteredData]);

  // 4. Báo cáo thâm niên (Mới)
  const seniorityData = useMemo(() => {
    const stats = { 'Dưới 1 năm': 0, '1 - 3 năm': 0, '3 - 5 năm': 0, 'Trên 5 năm': 0 };
    filteredData.forEach(emp => {
      if (emp.joinDate) {
        const years = dayjs().diff(dayjs(emp.joinDate), 'year');
        if (years < 1) stats['Dưới 1 năm']++;
        else if (years <= 3) stats['1 - 3 năm']++;
        else if (years <= 5) stats['3 - 5 năm']++;
        else stats['Trên 5 năm']++;
      }
    });
    return Object.entries(stats).map(([type, value]) => ({ type, value }));
  }, [filteredData]);

  // 5. Thống kê tổng quan
  const summaryMetrics = useMemo(() => {
    const totalStaff = filteredData.length;
    // Cập nhật: Tổng quỹ lương bao gồm Salary + Allowance
    const totalFund = filteredData.reduce((acc, cur) => acc + cur.salary + (cur.allowance || 0), 0);
    const avgAge = filteredData.length > 0 ? Math.round(filteredData.reduce((acc, emp) => acc + (emp.birthday ? dayjs().diff(dayjs(emp.birthday), 'year') : 0), 0) / filteredData.length) : 0;
    return { totalStaff, totalFund, avgAge };
  }, [filteredData]);

  // Cấu hình chung cho biểu đồ
  const chartConfig = {
    autoFit: true,
    height: 300,
    legend: { position: 'right' },
    theme: themeMode,
  };

  // 3. TÍNH NĂNG XUẤT DỮ LIỆU
  const handleExport = async (format, dataSource, columns, title) => {
    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('BaoCao');
      
      // Thiết lập cột cho file Excel
      worksheet.columns = columns.map(col => ({ header: col.title, key: col.dataIndex, width: 25 }));
      // Thêm dữ liệu
      worksheet.addRows(dataSource);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${title.replace(/ /g, '_')}.xlsx`);
    }
  };

  // Cấu hình bảng dữ liệu
  const tableColumns = [
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { title: 'Số lượng', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { 
      title: 'Tổng quỹ lương', 
      dataIndex: 'salary', 
      key: 'salary', 
      render: (val) => <span className="text-money" style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)', fontWeight: 'bold' }}>{val.toLocaleString()} VNĐ</span>, 
      sorter: (a, b) => a.salary - b.salary 
    },
    { title: 'Tuổi TB', dataIndex: 'avgAge', key: 'avgAge', sorter: (a, b) => a.avgAge - b.avgAge },
    { title: 'Thâm niên TB (năm)', dataIndex: 'avgTenure', key: 'avgTenure', sorter: (a, b) => a.avgTenure - b.avgTenure },
  ];

  const tableData = useMemo(() => {
    const stats = filteredData.reduce((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { count: 0, salary: 0, totalAge: 0, totalTenure: 0 };
      }
      acc[emp.department].count += 1;
      acc[emp.department].salary += emp.salary + (emp.allowance || 0); // Cập nhật tổng lương + phụ cấp
      acc[emp.department].totalAge += emp.birthday ? dayjs().diff(dayjs(emp.birthday), 'year') : 0;
      acc[emp.department].totalTenure += emp.joinDate ? dayjs().diff(dayjs(emp.joinDate), 'year') : 0;
      return acc;
    }, {});
    return Object.entries(stats).map(([dept, values]) => ({ 
      key: dept, 
      department: dept, 
      ...values,
      avgAge: values.count ? Math.round(values.totalAge / values.count) : 0,
      avgTenure: values.count ? (values.totalTenure / values.count).toFixed(1) : 0
    }));
  }, [filteredData]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Thanh Lọc */}
      <Card>
        <Space wrap size="middle">
          <Text strong>Bộ lọc:</Text>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn phòng ban"
            value={selectedDept}
            onChange={(value) => setSelectedDept(value)}
          >
            {uniqueDepartments.map(dept => (
              <Option key={dept} value={dept}>{dept === 'all' ? 'Tất cả phòng ban' : dept}</Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Hàng Thống Kê Tổng Quan (Mới) */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Tổng nhân sự" value={summaryMetrics.totalStaff} suffix="người" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic 
              title="Tổng quỹ lương tháng" 
              value={summaryMetrics.totalFund} 
              precision={0} 
              valueClassName="text-money"
              valueStyle={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)' }}
              suffix="VNĐ" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic title="Độ tuổi trung bình" value={summaryMetrics.avgAge} suffix="tuổi" />
          </Card>
        </Col>
      </Row>

      {/* Hàng Biểu Đồ 1 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card title="Báo cáo nhân sự: Phân bổ theo hợp đồng">
            <Pie
              {...chartConfig}
              data={contractTypeData}
              angleField='value'
              colorField='type'
              radius={0.8}
              label={{
                type: 'inner',
                offset: '-30%',
                content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                style: { fontSize: 14, textAlign: 'center', fill: '#fff' },
              }}
              tooltip={{
                formatter: (datum) => ({ name: datum.type, value: `${datum.value} người` }),
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Báo cáo lương: Quỹ lương theo phòng ban">
            <Column
              {...chartConfig}
              data={columnData}
              xField='department'
              yField='salary'
              tooltip={{ formatter: (datum) => ({ name: 'Tổng lương', value: `${datum.salary.toLocaleString()} VNĐ` }) }}
              annotations={[
                {
                  type: 'line',
                  start: ['min', avgSalary],
                  end: ['max', avgSalary],
                  text: { content: `TB: ${Math.round(avgSalary).toLocaleString()} VNĐ`, style: { textAlign: 'end', fill: 'red' } },
                  style: { stroke: 'red', lineDash: [4, 4] },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Hàng Biểu Đồ 2 (Mới) */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ độ tuổi nhân sự">
            <Pie
              {...chartConfig}
              data={ageData}
              angleField='value'
              colorField='type'
              radius={0.8}
              label={{
                type: 'inner',
                offset: '-30%',
                content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                style: { fontSize: 14, textAlign: 'center', fill: '#fff' },
              }}
              tooltip={{
                formatter: (datum) => ({ name: `Nhóm tuổi ${datum.type}`, value: `${datum.value} người` }),
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thâm niên công tác">
            <Column
              {...chartConfig}
              data={seniorityData}
              xField='type'
              yField='value'
              color="#13c2c2"
              tooltip={{ formatter: (datum) => ({ name: 'Số lượng', value: `${datum.value} người` }) }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng dữ liệu và nút xuất file */}
      <Card
        title="Bảng tổng hợp dữ liệu"
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel', tableData, tableColumns, 'BaoCaoNhanSu')}>
              Xuất Excel
            </Button>
          </Space>
        }
      >
        <Table dataSource={tableData} columns={tableColumns} pagination={false} />
      </Card>
    </Space>
  );
};

export default Reports;