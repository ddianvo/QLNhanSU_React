import React from 'react';
import { Table, Tag, Tooltip } from 'antd';

const BangLuong = ({ danhSachNhanVien }) => {
  // Hàm tính thuế TNCN lũy tiến (Ước lượng cho mức lương cao)
  const calculateProgressiveTax = (income, insurance) => {
    // Giảm trừ gia cảnh bản thân: 11 triệu
    const taxableIncome = income - 11000000 - insurance;
    if (taxableIncome <= 0) return 0;

    // Bậc thuế đơn giản hóa cho demo (Mức lương ngành bán dẫn thường rơi vào bậc cao)
    if (taxableIncome > 80000000) return taxableIncome * 0.35 - 9850000; // Bậc 7 (35%)
    if (taxableIncome > 52000000) return taxableIncome * 0.30 - 5850000; // Bậc 6 (30%)
    if (taxableIncome > 32000000) return taxableIncome * 0.25 - 3250000; // Bậc 5 (25%)
    if (taxableIncome > 18000000) return taxableIncome * 0.20 - 1650000; // Bậc 4 (20%)
    if (taxableIncome > 10000000) return taxableIncome * 0.15 - 750000;  // Bậc 3 (15%)
    return taxableIncome * 0.10; // Mức thấp hơn
  };

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name' },
    { 
        title: 'Lương Cơ Bản', 
        dataIndex: 'salary', 
        key: 'salary', 
        render: (val) => <span style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)', fontWeight: 'bold' }}>{(val || 0).toLocaleString()} VNĐ</span>
    },
    {
      title: 'Số Ngày Công Thực Tế',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (days) => <Tag>{days || 0} ngày</Tag>,
    },
    {
      title: 'Phụ Cấp',
      dataIndex: 'allowance',
      key: 'allowance',
      render: (val) => <span style={{ color: '#ff00ff', textShadow: '0 0 5px rgba(255, 0, 255, 0.5)', fontWeight: 'bold' }}>{(val || 0).toLocaleString()} VNĐ</span>
    },
    {
      title: <Tooltip title="10.5% trên Lương Cơ Bản">Khấu trừ BH</Tooltip>,
      key: 'insurance',
      render: (_, record) => {
        const insurance = (record.salary || 0) * 0.105;
        return <span style={{ color: 'red' }}>-{insurance.toLocaleString()} VNĐ</span>;
      }
    },
    {
      title: <Tooltip title="Tính theo biểu lũy tiến từng phần">Thuế TNCN (Est)</Tooltip>,
      key: 'tax',
      render: (_, record) => {
        // Tính toán dựa trên thu nhập thực tế theo ngày công để đồng bộ với cột "Lương Thực Nhận"
        const baseSalary = record.salary || 0;
        const attendance = record.attendance || 0;
        const earnedSalary = (baseSalary / 26) * attendance;
        const insurance = baseSalary * 0.105;
        const calculatedTax = calculateProgressiveTax(earnedSalary + (record.allowance || 0), insurance);
        return <span style={{ color: 'red' }}>-{Math.round(calculatedTax).toLocaleString()} VNĐ</span>;
      }
    },
    {
      title: 'Lương Thực Nhận',
      key: 'total',
      render: (_, record) => {
        const baseSalary = record.salary || 0;
        const attendance = record.attendance || 0;
        const allowance = record.allowance || 0;

        // Lương theo ngày công
        const earnedSalary = (baseSalary / 26) * attendance;
        // Khấu trừ bảo hiểm (tính trên lương cơ bản)
        const insurance = baseSalary * 0.105;
        // Tính thuế tự động dựa trên thu nhập thực tế
        const calculatedTax = calculateProgressiveTax(earnedSalary + allowance, insurance);

        // Lương thực nhận = (Lương theo ngày công + Phụ cấp) - Bảo hiểm - Thuế
        const netSalary = earnedSalary + allowance - insurance - calculatedTax;

        return <b className="text-money" style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)' }}>{Math.round(netSalary > 0 ? netSalary : 0).toLocaleString()} VNĐ</b>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => <Tag>{status}</Tag>
    }
  ];

  return (
    <Table 
      dataSource={danhSachNhanVien}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default BangLuong;