import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DiplomaManagement as Typing } from './typing';

const { Title } = Typography;
const { Option } = Select;

const Configuration: React.FC = () => {
    const { fieldConfigs, addOrUpdateField, deleteField } = useModel('diploma');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<Typing.FieldConfig | null>(null);
    const [form] = Form.useForm();

    const showModal = (field?: Typing.FieldConfig) => {
        if (field) {
            setEditingField(field);
            form.setFieldsValue(field);
        } else {
            setEditingField(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const field: Typing.FieldConfig = {
                id: editingField?.id || Date.now().toString(),
                ...values,
            };
            addOrUpdateField(field);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: 'Tên trường thông tin',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Kiểu dữ liệu',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Typing.FieldConfig) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => deleteField(record.id)}>
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4}>Cấu hình biểu mẫu phụ lục văn bằng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm trường thông tin
                </Button>
            </div>
            <Table columns={columns} dataSource={fieldConfigs} rowKey="id" />

            <Modal
                title={editingField ? 'Sửa trường thông tin' : 'Thêm trường thông tin mới'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên trường thông tin" rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}>
                        <Input placeholder="Ví dụ: Nơi sinh, GPA, Dân tộc..." />
                    </Form.Item>
                    <Form.Item name="type" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}>
                        <Select placeholder="Chọn kiểu dữ liệu">
                            <Option value="String">String</Option>
                            <Option value="Number">Number</Option>
                            <Option value="Date">Date</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Configuration;
