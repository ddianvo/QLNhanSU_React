import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const AddEmployeeModal = ({ open, onCreate, onCancel, editingEmployee }) => {
  const [form] = Form.useForm();

  // Khi mở modal, nếu có editingEmployee thì điền dữ liệu vào form, ngược lại reset form
  useEffect(() => {
    if (open) {
      if (editingEmployee) {
        // Chuyển đổi chuỗi ngày tháng thành đối tượng dayjs để DatePicker hiểu
        const fieldsValue = {
          ...editingEmployee,
          birthday: editingEmployee.birthday ? dayjs(editingEmployee.birthday, 'YYYY-MM-DD') : null,
          joinDate: editingEmployee.joinDate ? dayjs(editingEmployee.joinDate, 'YYYY-MM-DD') : null,
          contractDate: editingEmployee.contractDate ? dayjs(editingEmployee.contractDate, 'YYYY-MM-DD') : null,
        };
        form.setFieldsValue(fieldsValue);
      } else {
        form.resetFields();
      }
    }
  }, [open, editingEmployee, form]);

  return (
    <Modal
      open={open}
      title={editingEmployee ? "Chỉnh Sửa Thông Tin Nhân Viên" : "Thêm Nhân Viên Mới"}
      okText={editingEmployee ? "Lưu thay đổi" : "Thêm mới"}
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // Chuyển đổi đối tượng dayjs thành chuỗi trước khi gửi đi
            const finalValues = {
              ...values,
              birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
              joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : null,
              contractDate: values.contractDate ? values.contractDate.format('YYYY-MM-DD') : null,
              status: editingEmployee ? editingEmployee.status : 'Đang làm'
            };
            onCreate(finalValues);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="birthday" label="Ngày sinh">
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="department" label="Phòng ban" rules={[{ required: true, message: 'Vui lòng nhập phòng ban!' }]}>
              <Input placeholder="Ví dụ: IT, HR, Marketing..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Chức vụ" rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}>
              <Input placeholder="Ví dụ: Developer, Manager..." />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="joinDate" label="Ngày vào làm">
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contractDate" label="Ngày hết hạn hợp đồng">
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="contractType" label="Loại hợp đồng">
              <Select placeholder="Chọn loại hợp đồng">
                <Option value="Chính thức">Chính thức</Option>
                <Option value="Thử việc">Thử việc</Option>
                <Option value="Thời vụ">Thời vụ</Option>
                <Option value="Thực tập">Thực tập</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="salary" label="Lương cơ bản (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}>
              <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="allowance" label="Phụ cấp (VNĐ)">
              <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} defaultValue={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tax" label="Khấu trừ thuế (cố định/tháng)">
              <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} defaultValue={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;