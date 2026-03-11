import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { Option } = Select;

const AuthPage = ({ onLogin, onRegister, employeeData }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = (values) => {
    onLogin(values.username, values.password);
  };

  const handleRegister = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    onRegister(values.username, values.password, values.employeeId);
  };

  const unlinkedEmployees = employeeData.filter(e => !e.isLinked);

  const loginView = (
    <>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)' }}>
          Welcome <span style={{color: 'var(--color-acid)'}}>Back</span>
        </Title>
        <Text style={{ color: 'var(--color-text-muted)' }}>Đăng nhập để tiếp tục quản lý</Text>
      </div>
      <Form form={loginForm} name="login_form" onFinish={handleLogin} layout="vertical" size="large">
        <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập (vd: admin)" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu (vd: admin)" />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox style={{ color: 'var(--color-text-muted)' }}>Ghi nhớ</Checkbox>
            <a style={{ color: 'var(--color-acid)', fontWeight: 500 }} href="#">Quên mật khẩu?</a>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ height: '45px', fontWeight: 'bold' }}>Đăng nhập</Button>
        </Form.Item>
        <Text style={{ color: 'var(--color-text-muted)', textAlign: 'center', display: 'block' }}>
          Chưa có tài khoản? <Link onClick={() => setIsLoginView(false)}>Đăng ký ngay</Link>
        </Text>
      </Form>
    </>
  );

  const registerView = (
    <>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)' }}>
          Tạo <span style={{color: 'var(--color-acid)'}}>Tài Khoản</span>
        </Title>
        <Text style={{ color: 'var(--color-text-muted)' }}>Liên kết với hồ sơ nhân viên của bạn</Text>
      </div>
      <Form form={registerForm} name="register_form" onFinish={handleRegister} layout="vertical" size="large">
        <Form.Item name="employeeId" label="Chọn hồ sơ nhân viên của bạn" rules={[{ required: true, message: 'Vui lòng chọn hồ sơ của bạn!' }]}>
            <Select showSearch placeholder="Tìm tên hoặc mã NV của bạn" filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {unlinkedEmployees.map(emp => (
                <Option key={emp.id} value={emp.id} label={`${emp.name} (${emp.id})`}>{emp.name} ({emp.id})</Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }, { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự!' }]}>
          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập mong muốn" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item name="confirmPassword" dependencies={['password']} rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Mật khẩu xác nhận không khớp!')); } })]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ height: '45px', fontWeight: 'bold' }}>Đăng ký</Button>
        </Form.Item>
        <Text style={{ color: 'var(--color-text-muted)', textAlign: 'center', display: 'block' }}>
          Đã có tài khoản? <Link onClick={() => setIsLoginView(true)}>Đăng nhập</Link>
        </Text>
      </Form>
    </>
  );

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-void)', position: 'relative' }}>
      <div className="login-grid-bg"></div>
      <Card className="login-card" bordered={false} style={{ width: 420, padding: '30px 20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10 }}>
        {isLoginView ? loginView : registerView}
      </Card>
      <div style={{ position: 'absolute', bottom: '20px', color: 'var(--color-text-muted)', fontSize: '12px', opacity: 0.7 }}>
        © 2024 HRM System. All rights reserved.
      </div>
    </div>
  );
};

export default AuthPage;