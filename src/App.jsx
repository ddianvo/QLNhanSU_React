import React, { useState, useEffect, useMemo } from 'react';
import { Button, Layout, Menu, Typography, message, Avatar, Space, ConfigProvider, theme, Switch, Card, Steps, List, Tag, Row, Col, Statistic, Modal } from 'antd';
import { 
  TeamOutlined, DollarOutlined, SolutionOutlined, LogoutOutlined, 
  UserOutlined, DashboardOutlined, CalendarOutlined, BarChartOutlined,
  MoonOutlined, SunOutlined, ApiOutlined, SafetyCertificateOutlined, LaptopOutlined
} from '@ant-design/icons';
import viVN from 'antd/es/locale/vi_VN';
import './App.css'; 
import { nanoid } from 'nanoid';

// Import các thành phần con từ thư mục bài tập của bạn
import AddEmployeeModal from './AddEmployeeModal';
import BangLuong from './BangLuong';
import ChamCong from './ChamCong';
import AuthPage from './AuthPage'; // Thay thế Login bằng AuthPage
import NhanVienList from './NhanVienList';
import Dashboard from './Dashboard';
import LeaveManagement from './LeaveManagement';
import Reports from './Reports';
import CustomCursor from './CustomCursor';
import AssetManager from './OrgChart';
import UserAssets from './UserAssets'; // Component mới cho trang mượn tài sản
import UserProfile from './UserProfile'; // Component mới cho trang cá nhân
import UserDashboard from './UserDashboard'; // Component Dashboard mới cho user
import ProductionMonitor from './ProductionMonitor'; // Trang theo dõi sản xuất
import MiniProductionMonitor from './MiniProductionMonitor'; // Widget theo dõi sản xuất

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { defaultAlgorithm, darkAlgorithm } = theme;

// Dữ liệu mẫu được cập nhật theo mô hình doanh nghiệp Bán dẫn & Máy quang khắc
// Bao gồm các bộ phận: Ban Giám Đốc, Pháp chế, Nhân sự, Kế toán, IT, Kinh doanh, Kỹ thuật
const initialData = [
  // 1. Ban Giám Đốc (Bộ phận Quản lý) - 4 người
  { id: 'NV001', name: 'Nguyễn Vũ Trọng', department: 'Ban Giám Đốc', role: 'Tổng Giám Đốc (CEO)', salary: 290000000, status: 'Đang làm', attendance: 26, key: '1', birthday: '1980-01-01', joinDate: '2015-01-01', contractDate: '2025-01-01', contractType: 'Chính thức', allowance: 50000000, tax: 45000000, lastCheckIn: null },
  { id: 'NV002', name: 'Trần Minh Tuấn', department: 'Ban Giám Đốc', role: 'Giám đốc Công nghệ (CTO)', salary: 260000000, status: 'Đang làm', attendance: 25, key: '2', birthday: '1982-05-05', joinDate: '2016-05-20', contractDate: '2026-05-20', contractType: 'Chính thức', allowance: 40000000, tax: 40000000, lastCheckIn: null },
  { id: 'NV017', name: 'Phạm Thị Bích', department: 'Ban Giám Đốc', role: 'Giám đốc Tài chính (CFO)', salary: 250000000, status: 'Đang làm', attendance: 26, key: '17', birthday: '1981-08-15', joinDate: '2017-03-10', contractDate: '2027-03-10', contractType: 'Chính thức', allowance: 38000000, tax: 38000000, lastCheckIn: null },
  { id: 'NV018', name: 'Lê Văn Hùng', department: 'Ban Giám Đốc', role: 'Giám đốc Vận hành (COO)', salary: 255000000, status: 'Đang làm', attendance: 25, key: '18', birthday: '1983-11-22', joinDate: '2018-09-01', contractDate: '2028-09-01', contractType: 'Chính thức', allowance: 39000000, tax: 39000000, lastCheckIn: null },

  // 2. Bộ phận Pháp chế (Đảm bảo tuân thủ pháp luật) - 3 người
  { id: 'NV003', name: 'Lê Thị Luật', department: 'Pháp chế', role: 'Trưởng phòng Pháp chế', salary: 130000000, status: 'Đang làm', attendance: 26, key: '3', birthday: '1985-03-15', joinDate: '2019-02-01', contractDate: '2024-02-01', contractType: 'Chính thức', allowance: 9000000, tax: 10000000, lastCheckIn: null },
  { id: 'NV004', name: 'Phạm Văn Quy', department: 'Pháp chế', role: 'Chuyên viên Pháp lý', salary: 90000000, status: 'Đang làm', attendance: 24, key: '4', birthday: '1995-08-10', joinDate: '2021-06-01', contractDate: '2023-06-01', contractType: 'Chính thức', allowance: 5000000, tax: 3500000, lastCheckIn: null },
  { id: 'NV019', name: 'Trần Thị An', department: 'Pháp chế', role: 'Chuyên viên Tuân thủ', salary: 88000000, status: 'Đang làm', attendance: 25, key: '19', birthday: '1996-02-20', joinDate: '2022-01-15', contractDate: '2024-01-15', contractType: 'Chính thức', allowance: 4800000, tax: 3200000, lastCheckIn: null },

  // 3. Bộ phận Kế toán (Thu thập thông tin, tính lương) - 4 người
  { id: 'NV005', name: 'Hoàng Thị Thu', department: 'Kế toán', role: 'Kế toán trưởng', salary: 125000000, status: 'Đang làm', attendance: 26, key: '5', birthday: '1988-11-20', joinDate: '2018-01-15', contractDate: '2023-01-15', contractType: 'Chính thức', allowance: 8500000, tax: 9000000, lastCheckIn: null },
  { id: 'NV006', name: 'Vũ Thu Thảo', department: 'Kế toán', role: 'Kế toán Tiền lương', salary: 85000000, status: 'Đang làm', attendance: 25, key: '6', birthday: '1996-04-12', joinDate: '2022-03-10', contractDate: '2024-03-10', contractType: 'Chính thức', allowance: 4500000, tax: 3000000, lastCheckIn: null },
  { id: 'NV020', name: 'Nguyễn Minh Tâm', department: 'Kế toán', role: 'Kế toán Tổng hợp', salary: 80000000, status: 'Đang làm', attendance: 26, key: '20', birthday: '1994-07-18', joinDate: '2021-08-20', contractDate: '2023-08-20', contractType: 'Chính thức', allowance: 4000000, tax: 2500000, lastCheckIn: null },
  { id: 'NV021', name: 'Lê Gia Bảo', department: 'Kế toán', role: 'Chuyên viên Phân tích Tài chính', salary: 100000000, status: 'Đang làm', attendance: 25, key: '21', birthday: '1992-09-05', joinDate: '2020-11-01', contractDate: '2024-11-01', contractType: 'Chính thức', allowance: 6000000, tax: 4500000, lastCheckIn: null },

  // 4. Bộ phận Nhân sự (Quản lý thông tin, bảo hiểm) - 4 người
  { id: 'NV007', name: 'Đặng Hùng Dũng', department: 'Nhân sự', role: 'Trưởng phòng Nhân sự', salary: 120000000, status: 'Đang làm', attendance: 26, key: '7', birthday: '1987-09-09', joinDate: '2017-07-07', contractDate: '2027-07-07', contractType: 'Chính thức', allowance: 8000000, tax: 8500000, lastCheckIn: null },
  { id: 'NV008', name: 'Nguyễn Thị Mai', department: 'Nhân sự', role: 'Chuyên viên Tuyển dụng Kỹ thuật', salary: 82000000, status: 'Đang làm', attendance: 24, key: '8', birthday: '1998-12-12', joinDate: '2023-01-01', contractDate: '2024-01-01', contractType: 'Chính thức', allowance: 4200000, tax: 2800000, lastCheckIn: null },
  { id: 'NV022', name: 'Võ Thị Lan', department: 'Nhân sự', role: 'Chuyên viên C&B', salary: 85000000, status: 'Đang làm', attendance: 25, key: '22', birthday: '1993-05-25', joinDate: '2020-06-15', contractDate: '2024-06-15', contractType: 'Chính thức', allowance: 4500000, tax: 3000000, lastCheckIn: null },
  { id: 'NV023', name: 'Hoàng Văn Nam', department: 'Nhân sự', role: 'Chuyên viên Đào tạo', salary: 80000000, status: 'Đang làm', attendance: 26, key: '23', birthday: '1995-03-30', joinDate: '2022-02-01', contractDate: '2024-02-01', contractType: 'Chính thức', allowance: 4000000, tax: 2500000, lastCheckIn: null },

  // 5. Bộ phận IT (Phát triển hệ thống quản lý nhân sự, tiền lương) - 5 người
  { id: 'NV009', name: 'Trịnh Văn Code', department: 'IT', role: 'IT Manager', salary: 135000000, status: 'Đang làm', attendance: 25, key: '9', birthday: '1990-02-28', joinDate: '2019-08-08', contractDate: '2024-08-08', contractType: 'Chính thức', allowance: 9500000, tax: 11000000, lastCheckIn: null },
  { id: 'NV010', name: 'Bùi Thị Dev', department: 'IT', role: 'HR System Developer', salary: 105000000, status: 'Đang làm', attendance: 26, key: '10', birthday: '1995-06-15', joinDate: '2021-05-05', contractDate: '2023-05-05', contractType: 'Chính thức', allowance: 6500000, tax: 5000000, lastCheckIn: null },
  { id: 'NV024', name: 'Phan Anh Quân', department: 'IT', role: 'DevOps Engineer', salary: 120000000, status: 'Đang làm', attendance: 24, key: '24', birthday: '1992-10-10', joinDate: '2020-01-20', contractDate: '2025-01-20', contractType: 'Chính thức', allowance: 8000000, tax: 8500000, lastCheckIn: null },
  { id: 'NV025', name: 'Đỗ Thị Ngọc', department: 'IT', role: 'QA/QC Engineer', salary: 95000000, status: 'Đang làm', attendance: 25, key: '25', birthday: '1996-08-19', joinDate: '2022-07-01', contractDate: '2024-07-01', contractType: 'Chính thức', allowance: 5500000, tax: 4000000, lastCheckIn: null },
  { id: 'NV026', name: 'Lưu Minh Hiếu', department: 'IT', role: 'System Administrator', salary: 100000000, status: 'Đang làm', attendance: 26, key: '26', birthday: '1991-04-04', joinDate: '2019-12-01', contractDate: '2024-12-01', contractType: 'Chính thức', allowance: 6000000, tax: 4500000, lastCheckIn: null },

  // 6. Bộ phận Kinh doanh (CPU, Máy quang khắc) - 10 người
  { id: 'NV011', name: 'Lý Công Sale', department: 'Kinh doanh', role: 'GĐ Kinh doanh (CSO)', salary: 220000000, status: 'Đang làm', attendance: 26, key: '11', birthday: '1985-10-10', joinDate: '2016-11-11', contractDate: '2026-11-11', contractType: 'Chính thức', allowance: 30000000, tax: 35000000, lastCheckIn: null },
  { id: 'NV012', name: 'Mai Anh Chip', department: 'Kinh doanh', role: 'Sales Manager (CPU)', salary: 150000000, status: 'Đang làm', attendance: 24, key: '12', birthday: '1992-01-20', joinDate: '2020-04-01', contractDate: '2024-04-01', contractType: 'Chính thức', allowance: 15000000, tax: 15000000, lastCheckIn: null },
  { id: 'NV013', name: 'Dương Minh Bán', department: 'Kinh doanh', role: 'Sales Admin Bán dẫn', salary: 75000000, status: 'Đang làm', attendance: 25, key: '13', birthday: '1997-07-03', joinDate: '2022-10-01', contractDate: '2024-10-01', contractType: 'Chính thức', allowance: 3500000, tax: 2000000, lastCheckIn: null },
  { id: 'NV027', name: 'Trần Quốc Cường', department: 'Kinh doanh', role: 'Sales Manager (CPU)', salary: 145000000, status: 'Đang làm', attendance: 26, key: '27', birthday: '1989-06-12', joinDate: '2018-05-15', contractDate: '2028-05-15', contractType: 'Chính thức', allowance: 14000000, tax: 14000000, lastCheckIn: null },
  { id: 'NV028', name: 'Nguyễn Thị Thảo', department: 'Kinh doanh', role: 'Key Account Manager', salary: 130000000, status: 'Đang làm', attendance: 25, key: '28', birthday: '1991-03-18', joinDate: '2019-09-10', contractDate: '2025-09-10', contractType: 'Chính thức', allowance: 10000000, tax: 10000000, lastCheckIn: null },
  { id: 'NV029', name: 'Lê Văn Đạt', department: 'Kinh doanh', role: 'Sales Executive (Bán dẫn)', salary: 90000000, status: 'Đang làm', attendance: 24, key: '29', birthday: '1996-11-08', joinDate: '2021-02-20', contractDate: '2024-02-20', contractType: 'Chính thức', allowance: 5000000, tax: 3500000, lastCheckIn: null },
  { id: 'NV030', name: 'Phạm Thu Trang', department: 'Kinh doanh', role: 'Sales Executive (CPU)', salary: 88000000, status: 'Đang làm', attendance: 26, key: '30', birthday: '1997-01-25', joinDate: '2022-08-01', contractDate: '2024-08-01', contractType: 'Chính thức', allowance: 4800000, tax: 3200000, lastCheckIn: null },
  { id: 'NV031', name: 'Vũ Minh Quang', department: 'Kinh doanh', role: 'Chuyên viên Phát triển Thị trường', salary: 100000000, status: 'Đang làm', attendance: 25, key: '31', birthday: '1993-07-14', joinDate: '2020-10-05', contractDate: '2025-10-05', contractType: 'Chính thức', allowance: 6000000, tax: 4500000, lastCheckIn: null },
  { id: 'NV032', name: 'Đặng Thị Kim Anh', department: 'Kinh doanh', role: 'Sales Support', salary: 70000000, status: 'Đang làm', attendance: 26, key: '32', birthday: '1998-04-19', joinDate: '2023-03-15', contractDate: '2025-03-15', contractType: 'Chính thức', allowance: 3000000, tax: 1500000, lastCheckIn: null },
  { id: 'NV033', name: 'Hồ Đức Trung', department: 'Kinh doanh', role: 'Sales Intern', salary: 55000000, status: 'Đang làm', attendance: 22, key: '33', birthday: '2001-09-01', joinDate: '2023-06-01', contractDate: '2023-12-01', contractType: 'Thực tập', allowance: 1000000, tax: 0, lastCheckIn: null },

  // 7. Bộ phận Kỹ thuật & Vận hành (Máy quang khắc, Bán dẫn) - 20 người
  { id: 'NV014', name: 'Phan Thanh Tech', department: 'Kỹ thuật', role: 'Trưởng phòng Kỹ thuật', salary: 170000000, status: 'Đang làm', attendance: 26, key: '14', birthday: '1988-09-28', joinDate: '2018-01-05', contractDate: '2024-01-05', contractType: 'Chính thức', allowance: 15000000, tax: 18000000, lastCheckIn: null },
  { id: 'NV015', name: 'Đặng Ngọc Process', department: 'Kỹ thuật', role: 'Kỹ sư Quy trình Bán dẫn (Senior)', salary: 135000000, status: 'Đang làm', attendance: 25, key: '15', birthday: '1990-01-19', joinDate: '2019-03-12', contractDate: '2023-03-12', contractType: 'Chính thức', allowance: 9500000, tax: 11000000, lastCheckIn: null },
  { id: 'NV016', name: 'Hồ Bảo Trì', department: 'Kỹ thuật', role: 'Kỹ sư Dịch vụ Hiện trường (FSE)', salary: 110000000, status: 'Đang làm', attendance: 24, key: '16', birthday: '1993-06-23', joinDate: '2021-04-22', contractDate: '2024-04-22', contractType: 'Chính thức', allowance: 7000000, tax: 6000000, lastCheckIn: null },
  { id: 'NV034', name: 'Nguyễn Hoàng Long', department: 'Kỹ thuật', role: 'Kỹ sư Thiết kế Vi mạch (IC Design)', salary: 150000000, status: 'Đang làm', attendance: 25, key: '34', birthday: '1991-12-01', joinDate: '2020-02-10', contractDate: '2026-02-10', contractType: 'Chính thức', allowance: 11000000, tax: 15000000, lastCheckIn: null },
  { id: 'NV035', name: 'Vũ Anh Dũng', department: 'Kỹ thuật', role: 'Kỹ sư Kiểm thử (Test Engineer)', salary: 115000000, status: 'Đang làm', attendance: 26, key: '35', birthday: '1992-08-11', joinDate: '2021-07-15', contractDate: '2025-07-15', contractType: 'Chính thức', allowance: 7500000, tax: 7000000, lastCheckIn: null },
  { id: 'NV036', name: 'Lê Thị Hà', department: 'Kỹ thuật', role: 'Kỹ sư Quang học (Optics Engineer)', salary: 125000000, status: 'Đang làm', attendance: 25, key: '36', birthday: '1993-02-14', joinDate: '2020-09-01', contractDate: '2026-09-01', contractType: 'Chính thức', allowance: 8500000, tax: 9000000, lastCheckIn: null },
  { id: 'NV037', name: 'Trần Minh Đức', department: 'Kỹ thuật', role: 'Kỹ sư Vật liệu (Materials Engineer)', salary: 122000000, status: 'Đang làm', attendance: 26, key: '37', birthday: '1990-10-29', joinDate: '2019-11-20', contractDate: '2025-11-20', contractType: 'Chính thức', allowance: 8200000, tax: 8800000, lastCheckIn: null },
  { id: 'NV038', name: 'Phạm Ngọc Anh', department: 'Kỹ thuật', role: 'Kỹ sư Ứng dụng (Application Engineer)', salary: 118000000, status: 'Đang làm', attendance: 24, key: '38', birthday: '1994-05-07', joinDate: '2021-01-18', contractDate: '2025-01-18', contractType: 'Chính thức', allowance: 7800000, tax: 7500000, lastCheckIn: null },
  { id: 'NV039', name: 'Đỗ Tuấn Kiệt', department: 'Kỹ thuật', role: 'Kỹ sư Lập trình Nhúng (Embedded)', salary: 130000000, status: 'Đang làm', attendance: 25, key: '39', birthday: '1992-04-22', joinDate: '2020-03-03', contractDate: '2026-03-03', contractType: 'Chính thức', allowance: 9000000, tax: 10000000, lastCheckIn: null },
  { id: 'NV040', name: 'Hoàng Thị Yến', department: 'Kỹ thuật', role: 'Kỹ sư R&D', salary: 140000000, status: 'Đang làm', attendance: 26, key: '40', birthday: '1991-07-07', joinDate: '2019-08-15', contractDate: '2025-08-15', contractType: 'Chính thức', allowance: 10000000, tax: 12000000, lastCheckIn: null },
  { id: 'NV041', name: 'Ngô Văn Thắng', department: 'Kỹ thuật', role: 'Kỹ sư Quy trình Bán dẫn (Junior)', salary: 95000000, status: 'Đang làm', attendance: 23, key: '41', birthday: '1997-09-13', joinDate: '2022-05-10', contractDate: '2024-05-10', contractType: 'Chính thức', allowance: 5500000, tax: 4000000, lastCheckIn: null },
  { id: 'NV042', name: 'Lưu Thị Bích', department: 'Kỹ thuật', role: 'Kỹ thuật viên Vận hành', salary: 75000000, status: 'Đang làm', attendance: 26, key: '42', birthday: '1998-11-25', joinDate: '2022-10-01', contractDate: '2024-10-01', contractType: 'Chính thức', allowance: 3500000, tax: 2000000, lastCheckIn: null },
  { id: 'NV043', name: 'Mai Văn Toàn', department: 'Kỹ thuật', role: 'Kỹ thuật viên Bảo trì', salary: 80000000, status: 'Đang làm', attendance: 25, key: '43', birthday: '1996-01-02', joinDate: '2021-12-12', contractDate: '2023-12-12', contractType: 'Chính thức', allowance: 4000000, tax: 2500000, lastCheckIn: null },
  { id: 'NV044', name: 'Dương Thị Hoa', department: 'Kỹ thuật', role: 'Kỹ thuật viên Phòng sạch', salary: 78000000, status: 'Đang làm', attendance: 26, key: '44', birthday: '1999-03-08', joinDate: '2023-01-20', contractDate: '2025-01-20', contractType: 'Chính thức', allowance: 3800000, tax: 2200000, lastCheckIn: null },
  { id: 'NV045', name: 'Phan Văn Đức', department: 'Kỹ thuật', role: 'Kỹ sư Tự động hóa', salary: 128000000, status: 'Đang làm', attendance: 24, key: '45', birthday: '1993-08-18', joinDate: '2020-05-25', contractDate: '2026-05-25', contractType: 'Chính thức', allowance: 8800000, tax: 9500000, lastCheckIn: null },
  { id: 'NV046', name: 'Trịnh Thu Hằng', department: 'Kỹ thuật', role: 'Kỹ sư Chất lượng (QE)', salary: 112000000, status: 'Đang làm', attendance: 25, key: '46', birthday: '1994-10-03', joinDate: '2021-09-09', contractDate: '2025-09-09', contractType: 'Chính thức', allowance: 7200000, tax: 6500000, lastCheckIn: null },
  { id: 'NV047', name: 'Bùi Hoàng Hải', department: 'Kỹ thuật', role: 'Kỹ sư Dịch vụ Hiện trường (Junior)', salary: 85000000, status: 'Đang làm', attendance: 23, key: '47', birthday: '1998-06-21', joinDate: '2022-11-11', contractDate: '2024-11-11', contractType: 'Chính thức', allowance: 4500000, tax: 3000000, lastCheckIn: null },
  { id: 'NV048', name: 'Võ Minh Khang', department: 'Kỹ thuật', role: 'Thực tập sinh Kỹ thuật', salary: 58000000, status: 'Đang làm', attendance: 22, key: '48', birthday: '2002-02-02', joinDate: '2023-07-01', contractDate: '2024-01-01', contractType: 'Thực tập', allowance: 1000000, tax: 0, lastCheckIn: null },
  { id: 'NV049', name: 'Đặng Bảo Châu', department: 'Kỹ thuật', role: 'Kỹ sư Phân tích Lỗi (Failure Analysis)', salary: 120000000, status: 'Đang làm', attendance: 25, key: '49', birthday: '1992-12-30', joinDate: '2020-08-08', contractDate: '2026-08-08', contractType: 'Chính thức', allowance: 8000000, tax: 8500000, lastCheckIn: null },
  { id: 'NV050', name: 'Lê Quang Minh', department: 'Kỹ thuật', role: 'Kỹ sư Hệ thống (System Engineer)', salary: 132000000, status: 'Đang làm', attendance: 26, key: '50', birthday: '1990-05-16', joinDate: '2019-06-06', contractDate: '2025-06-06', contractType: 'Chính thức', allowance: 9200000, tax: 10500000, lastCheckIn: null },
];

// Dữ liệu tài sản, được đưa lên App.jsx để chia sẻ
const initialAssets = [
  { id: 'TS001', name: 'MacBook Pro M2 14"', type: 'Laptop', value: 45000000, status: 'Đang sử dụng', user: 'NV001', purchaseDate: '2023-01-15' },
  { id: 'TS002', name: 'Dell UltraSharp U2723QE', type: 'Màn hình', value: 14000000, status: 'Đang sử dụng', user: 'NV001', purchaseDate: '2023-01-15' },
  { id: 'TS003', name: 'Ghế Công thái học Herman Miller', type: 'Nội thất', value: 25000000, status: 'Kho', user: null, purchaseDate: '2023-06-20' },
  { id: 'TS004', name: 'ThinkPad XPS 15', type: 'Laptop', value: 38000000, status: 'Đang sử dụng', user: 'NV002', purchaseDate: '2022-11-10' },
  { id: 'TS005', name: 'Máy in HP LaserJet Pro', type: 'Thiết bị VP', value: 5000000, status: 'Đang sử dụng', user: 'NV005', purchaseDate: '2021-05-05' },
  { id: 'TS006', name: 'Mac Mini M1', type: 'PC', value: 18000000, status: 'Bảo hành', user: null, purchaseDate: '2022-02-20' },
  { id: 'TS007', name: 'Bàn nâng hạ SmartDesk', type: 'Nội thất', value: 8500000, status: 'Đang sử dụng', user: 'NV002', purchaseDate: '2023-03-01' },
  { id: 'TS008', name: 'iPad Pro 12.9"', type: 'Tablet', value: 28000000, status: 'Kho', user: null, purchaseDate: '2023-08-15' },
  { id: 'TS009', name: 'Server Dell PowerEdge', type: 'Server', value: 120000000, status: 'Đang sử dụng', user: 'NV009', purchaseDate: '2021-12-12' },
  { id: 'TS010', name: 'Router Cisco Enterprise', type: 'Mạng', value: 15000000, status: 'Đang sử dụng', user: 'NV026', purchaseDate: '2022-01-10' },
];

// Dữ liệu yêu cầu mượn tài sản
const initialAssetRequests = [
    { key: 'AR001', assetId: 'TS008', assetName: 'iPad Pro 12.9"', userId: 'NV015', userName: 'Đặng Ngọc Process', requestDate: '2023-10-20', returnDate: '2023-10-27', reason: 'Đi công tác tại chi nhánh Đà Nẵng.', status: 'Đã duyệt' },
    { key: 'AR002', assetId: 'TS003', assetName: 'Ghế Công thái học Herman Miller', userId: 'NV002', userName: 'Trần Minh Tuấn', requestDate: '2023-10-22', returnDate: '2023-11-22', reason: 'Sử dụng cho dự án mới tại văn phòng.', status: 'Từ chối' },
];

const initialUsers = [
  { username: 'admin', password: 'admin', role: 'admin', employeeId: null, key: 'user0' },
  // Pre-register a user for demonstration
  { username: 'nv015', password: 'password', role: 'user', employeeId: 'NV015', key: 'user1' },
];

const initialLeaveRequests = [
  { key: '1', name: 'Nguyễn Vũ Trọng', type: 'Nghỉ phép năm', dates: '2023-10-10 đến 2023-10-12', days: 3, reason: 'Đi du lịch cùng gia đình', status: 'Chờ duyệt' },
  { key: '2', name: 'Trần Minh Tuấn', type: 'Nghỉ ốm', dates: '2023-10-11', days: 1, reason: 'Sốt cao', status: 'Đã duyệt' },
  { key: '3', name: 'Đặng Ngọc Process', type: 'Nghỉ việc riêng', dates: '2023-10-15', days: 1, reason: 'Việc gia đình', status: 'Từ chối' },
  { key: '4', name: 'Phạm Thị Bích', type: 'Nghỉ phép năm', dates: '2023-11-01 đến 2023-11-05', days: 5, reason: 'Về quê thăm bố mẹ', status: 'Chờ duyệt' },
  { key: '5', name: 'Đặng Ngọc Process', type: 'Nghỉ phép năm', dates: '2023-09-01 đến 2023-09-02', days: 2, reason: 'Việc cá nhân', status: 'Đã duyệt' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('currentUser'));
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  // Bắt đầu với Dashboard
  const [activeTab, setActiveTab] = useState(currentUser?.role === 'user' ? 'user_dashboard' : '0'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // State để lưu nhân viên đang sửa
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [assets, setAssets] = useState(initialAssets);
  const [assetRequests, setAssetRequests] = useState(initialAssetRequests);
  
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('danhSachNhanVien_v6_final'); // Đổi key để bắt buộc nạp lại 50 nhân viên mới
    // Nếu có dữ liệu đã lưu, dùng nó. Nếu không, tạo key ngẫu nhiên cho dữ liệu tĩnh.
    const initial = saved 
      ? JSON.parse(saved) 
      : initialData;
    
    // Bổ sung dữ liệu giả lập cho Báo cáo (nếu chưa có)
    return initial.map(emp => ({
      ...emp,
      bonus: emp.bonus !== undefined ? emp.bonus : Math.floor(Math.random() * (emp.salary * 0.2)), // Thưởng ngẫu nhiên 0-20%
      insurance: emp.insurance !== undefined ? emp.insurance : Math.floor(emp.salary * 0.105), // BHXH 10.5%
      isLinked: initialUsers.some(u => u.employeeId === emp.id), // Kiểm tra xem đã được liên kết tài khoản chưa
    }));
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users_v1');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('users_v1', JSON.stringify(users));

    // Defer the data update to avoid triggering a synchronous state change
    // inside the effect body (avoids the "cascading renders" warning).
    setTimeout(() => {
      setData(prevData => prevData.map(emp => ({
        ...emp,
        isLinked: users.some(u => u.employeeId === emp.id)
      })));
    }, 0);
  }, [users]);

  useEffect(() => {
    localStorage.setItem('danhSachNhanVien_v6_final', JSON.stringify(data)); // Lưu dữ liệu mới vào key mới
  }, [data]);

  useEffect(() => {
    document.title = "HRM"; // Đổi tên tab trình duyệt thành HRM

    // Thay đổi favicon (icon trên tab trình duyệt) thành logo của bạn
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/images/logo.png';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.style.colorScheme = themeMode; // Kích hoạt light-dark() CSS
  }, [themeMode]);

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const userName = user.role === 'admin' ? 'Quản trị viên' : data.find(e => e.id === user.employeeId)?.name || 'Người dùng';
      message.success(`Chào mừng trở lại, ${userName}!`);
      setIsLoggedIn(true);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setActiveTab(user.role === 'user' ? 'user_dashboard' : '0'); // Chuyển đến trang phù hợp
    } else {
      message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleRegister = (username, password, employeeId) => {
    if (users.some(u => u.username === username)) {
      message.error('Tên đăng nhập đã tồn tại!');
      return;
    }
    const newUser = { username, password, employeeId, role: 'user', key: nanoid() };
    setUsers(prevUsers => [...prevUsers, newUser]);
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    message.success('Đã đăng xuất an toàn');
  };

  const handleDeleteEmployee = (employeeKey) => {
    setData(data.filter(item => item.key !== employeeKey));
    message.success('Đã xóa nhân viên thành công!');
  };

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      // --- LOGIC SỬA (UPDATE) ---
      setData(prevData => prevData.map(emp => 
        emp.key === editingEmployee.key ? { ...emp, ...employeeData } : emp
      ));
      message.success(`Đã cập nhật thông tin nhân viên ${employeeData.name}`);
    } else {
      // --- LOGIC THÊM MỚI (CREATE) ---
      // Tìm ID số lớn nhất hiện có
      const maxIdNum = data.reduce((max, employee) => {
        const idNum = parseInt(employee.id.substring(2), 10);
        return idNum > max ? idNum : max;
      }, 0);
      const newId = `NV${String(maxIdNum + 1).padStart(3, '0')}`;

      const newEmployee = {
        ...employeeData,
        key: nanoid(),
        id: newId,
        attendance: 0,
        lastCheckIn: null, // Thêm trường này để theo dõi chấm công
        allowance: employeeData.allowance || 0,
        tax: employeeData.tax || 0,
      };
      setData(prevData => [...prevData, newEmployee]);
      message.success('Thêm nhân viên mới thành công');
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const openEditModal = (record) => {
    setEditingEmployee(record);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
    // Timeout nhỏ để đảm bảo state modal đóng trước khi mở lại (reset form)
    setTimeout(() => setIsModalOpen(true), 0);
  };

  // Xử lý chuyển tab với hiệu ứng Loading giả lập
  const handleMenuClick = ({ key }) => {
    setActiveTab(key);
  };

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';

    // Sử dụng View Transitions API cho hiệu ứng chuyển đổi mượt mà.
    // API này sẽ tạo ra một hiệu ứng cross-fade khi nội dung thay đổi.
    // Nó được hỗ trợ trên các trình duyệt hiện đại (Chrome, Edge, Opera).
    // Trên các trình duyệt không hỗ trợ, nó sẽ chuyển đổi như bình thường không có hiệu ứng.
    if (!document.startViewTransition) {
      setThemeMode(newTheme);
      return;
    }

    document.startViewTransition(() => {
      setThemeMode(newTheme);
    });
  };

  // Hàm hiển thị modal chi tiết

  // Cấu trúc menu và tiêu đề
  const adminMenuItems = [
    { key: '0', icon: <DashboardOutlined />, label: 'Bảng điều khiển', title: 'Tổng quan hệ thống' },
    { key: '1', icon: <TeamOutlined />, label: 'Nhân sự', title: 'Quản lý nhân sự' },
    { key: '2', icon: <SolutionOutlined />, label: 'Chấm công', title: 'Bảng điểm danh' },
    { key: '3', icon: <DollarOutlined />, label: 'Lương bổng', title: 'Báo cáo tiền lương' },
    { key: '4', icon: <CalendarOutlined />, label: 'Nghỉ phép', title: 'Quản lý nghỉ phép' },
    { key: '5', icon: <BarChartOutlined />, label: 'Báo cáo', title: 'Báo cáo & Thống kê' },
    { key: '9', icon: <LaptopOutlined />, label: 'Tài sản', title: 'Quản lý Tài sản & Thiết bị' },
    { key: '10', icon: <DashboardOutlined />, label: 'Giám sát SX', title: 'Theo dõi Dây chuyền Sản xuất' }
  ];

  const userMenuItems = [
    { key: 'user_dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', title: 'Bảng tin cá nhân' },
    { key: 'user_profile', icon: <UserOutlined />, label: 'Hồ sơ của tôi', title: 'Thông tin cá nhân' },
    { key: 'user_assets', icon: <LaptopOutlined />, label: 'Tài sản', title: 'Quản lý Tài sản Cá nhân' },
    { key: 'user_payslip', icon: <DollarOutlined />, label: 'Phiếu lương', title: 'Phiếu lương cá nhân' },
    { key: 'user_attendance', icon: <SolutionOutlined />, label: 'Chấm công', title: 'Lịch sử chấm công' },
    { key: 'user_leave', icon: <CalendarOutlined />, label: 'Nghỉ phép', title: 'Quản lý nghỉ phép' },
    { key: '10', icon: <DashboardOutlined />, label: 'Giám sát SX', title: 'Theo dõi Dây chuyền Sản xuất' },
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenuItems : userMenuItems;
  const currentPageTitle = menuItems.find(item => item.key === activeTab)?.title || 'Dashboard';
  const currentUserData = useMemo(() => {
    if (currentUser?.role === 'user') {
      return data.find(emp => emp.id === currentUser.employeeId);
    }
    return null;
  }, [currentUser, data]);

  // Render nội dung chính dựa trên tab đang được chọn
  const renderContent = () => {
    switch (activeTab) {
      case '0':
        return <Dashboard data={data} themeMode={themeMode} />;
      case '1':
        return <NhanVienList 
                  danhSachNhanVien={data} 
                  onDelete={handleDeleteEmployee}
                  onEdit={openEditModal}
               />;
      case '2':
        return <ChamCong danhSachNhanVien={data} onUpdateAttendance={(k) => {
          const today = new Date().toLocaleDateString('vi-VN');
          setData(data.map(i => {
            if (i.key === k) {
              // Kiểm tra nếu đã chấm công hôm nay chưa
              if (i.lastCheckIn === today) {
                message.warning('Nhân viên này đã chấm công hôm nay rồi!');
                return i;
              }
              message.success('Ghi nhận chấm công thành công');
              return {...i, attendance: (i.attendance || 0) + 1, lastCheckIn: today};
            }
            return i;
          }));
        }} />;
      case '3':
        return <BangLuong danhSachNhanVien={data} />;
      case '4':
        return <LeaveManagement danhSachNhanVien={data} requests={leaveRequests} setRequests={setLeaveRequests} />;
      case '5':
        return <Reports data={data} themeMode={themeMode} />;
      case '9':
        return <AssetManager 
                 employeeData={data} 
                 assets={assets} 
                 setAssets={setAssets} 
                 assetRequests={assetRequests} 
                 setAssetRequests={setAssetRequests} 
               />;
      case '10':
        return <ProductionMonitor />;
      // --- USER-SPECIFIC VIEWS ---
      case 'user_dashboard':
        return <UserDashboard user={currentUserData} data={data} allLeaveRequests={leaveRequests} />;
      case 'user_profile':
        return <UserProfile user={currentUserData} />;
      case 'user_assets': {
          const userAssets = assets.filter(asset => asset.user === currentUserData?.id);
          const availableAssets = assets.filter(asset => asset.status === 'Kho');
          return <UserAssets 
                   user={currentUserData}
                   userAssets={userAssets} 
                   availableAssets={availableAssets}
                   assetRequests={assetRequests}
                   setAssetRequests={setAssetRequests}
                 />;
      }
      case 'user_payslip':
        return <BangLuong danhSachNhanVien={currentUserData ? [currentUserData] : []} />;
      case 'user_attendance':
        // ChamCong component chỉ hiển thị, không cho phép user tự chấm công ở đây
        return <ChamCong danhSachNhanVien={currentUserData ? [currentUserData] : []} onUpdateAttendance={() => message.info("Chức năng này không được phép.")} />;
      case 'user_leave':
        return <LeaveManagement danhSachNhanVien={currentUserData ? [currentUserData] : []} requests={leaveRequests} setRequests={setLeaveRequests} />;
      default: return <Dashboard data={data} themeMode={themeMode} />;
    }
  };

  const appTheme = {
    token: { colorPrimary: '#0066ff', borderRadius: 12 },
    algorithm: themeMode === 'light' ? defaultAlgorithm : darkAlgorithm,
    components: {
      Menu: {
        colorBgContainer: 'transparent',
      },
    },
  };

  return (
    <ConfigProvider theme={appTheme} locale={viVN}>
      <CustomCursor />
      
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
        <div className="aurora-blob"></div>
      </div>
      <div className="noise" aria-hidden="true"></div>
      {!isLoggedIn ? (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} employeeData={data} />
      ) : (
        <Layout className="luxury-layout">
          <Header className="luxury-header">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Logo được lấy từ thư mục public/images/logo.png */}
              {/* 
                Logo sẽ tự động đổi màu theo giao diện.
                - Giao diện sáng (light): Logo màu đen.
                - Giao diện tối (dark): Logo màu trắng.
                Lưu ý: Để hoạt động tốt nhất, file /public/images/logo.png của bạn nên là ảnh logo MÀU ĐEN trên nền TRONG SUỐT.
              */}
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                style={{ 
                  width: '32px', height: '32px', objectFit: 'contain', 
                  filter: themeMode === 'dark' ? 'invert(1)' : 'none',
                  mixBlendMode: themeMode === 'dark' ? 'screen' : 'multiply'
                }} 
              />
              HRM System
            </div>
            <Menu 
              mode="horizontal" 
              selectedKeys={[activeTab]} 
              onClick={handleMenuClick}
              className="luxury-menu"
              items={menuItems.map(({ key, icon, label }) => ({ key, icon, label }))}
            />
            <Space size="large" style={{ flexShrink: 0 }}>
              <MiniProductionMonitor />
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                onChange={handleThemeChange}
                checked={themeMode === 'dark'}
              />
              <div className="user-nav">
                <Avatar style={{ backgroundColor: '#0066ff' }} src={currentUserData ? `https://i.pravatar.cc/150?u=${currentUserData.id}` : null} icon={<UserOutlined />} />
                <Text strong className="user-name">{currentUser?.role === 'admin' ? 'Quản trị viên' : currentUserData?.name || 'Người dùng'}</Text>
              </div>
              <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} danger>Thoát</Button>
            </Space>
          </Header>

          <Content className="luxury-content">
            <div className="animate-slide-up" style={{ height: '100%' }}>
              <div className="content-top-bar">
                <Title level={2} className="page-title">
                  {currentPageTitle}
                </Title>
                {currentUser?.role === 'admin' && activeTab === '1' && (
                  <Button type="primary" size="large" className="btn-add" icon={<UserOutlined />} onClick={openAddModal}>
                    + Thêm thành viên
                  </Button>
                )}
              </div>
              
              {currentUser?.role === 'admin' && activeTab === '0' ? (
                renderContent()
              ) : (
                <div className="data-card">
                  {renderContent()}
                </div>
              )}
            </div>
          </Content>

          <AddEmployeeModal 
            open={isModalOpen} 
            onCreate={handleSaveEmployee} 
            onCancel={() => setIsModalOpen(false)}
            editingEmployee={editingEmployee}
          />

        </Layout>
      )}
    </ConfigProvider>
  );
}

export default App;