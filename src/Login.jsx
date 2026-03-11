import React from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
  const onFinish = (values) => {
    // Simple validation for demo purposes
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('Đăng nhập thành công!');
      onLogin(true);
    } else {
      message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-void)', position: 'relative' }}>
      <div className="login-grid-bg"></div>
      
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '20%', width: '300px', height: '300px',
        background: 'var(--color-acid)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '20%', right: '20%', width: '250px', height: '250px',
        background: 'var(--color-purple)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%'
      }}></div>

      <Card className="login-card" bordered={false} style={{ width: 400, padding: '30px 20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            padding: '4px 12px', borderRadius: '20px', 
            background: 'rgba(0,0,0,0.03)', border: '1px solid var(--color-border)',
            marginBottom: '20px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-acid)' }}></span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>HRM System v3.0</span>
          </div>
          
          <Title level={2} style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text)' }}>
            Welcome <span style={{color: 'var(--color-acid)'}}>Back</span>
          </Title>
          <Text style={{ color: 'var(--color-text-muted)' }}>
            Đăng nhập để tiếp tục quản lý
          </Text>
        </div>

        <Form
          name="normal_login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'var(--color-text-muted)' }} />} 
              placeholder="Tên đăng nhập (admin)" 
              style={{ borderRadius: '8px', background: 'var(--color-void)', border: '1px solid var(--color-border)' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'var(--color-text-muted)' }} />} 
              placeholder="Mật khẩu (admin)" 
              style={{ borderRadius: '8px', background: 'var(--color-void)', border: '1px solid var(--color-border)' }}
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox style={{ color: 'var(--color-text-muted)' }}>Ghi nhớ</Checkbox>
              <a style={{ color: 'var(--color-acid)', fontWeight: 500 }} href="#">Quên mật khẩu?</a>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block style={{ 
              height: '45px', fontWeight: 'bold', 
              background: 'var(--color-acid)', borderColor: 'var(--color-acid)', 
              color: 'var(--color-deep)', 
              borderRadius: '8px'
            }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <div style={{ position: 'absolute', bottom: '20px', color: 'var(--color-text-muted)', fontSize: '12px', opacity: 0.7 }}>
        © 2024 HRM System. All rights reserved.
      </div>
    </div>
  );
};

export default Login;