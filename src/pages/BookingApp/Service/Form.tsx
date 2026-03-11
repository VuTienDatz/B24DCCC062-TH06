import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { useModel } from 'umi';
import type { BookingApp as Typing } from '../typing';

interface Props {
    record?: Typing.Service;
    onCancel: () => void;
    onSuccess: () => void;
}

const ServiceForm: React.FC<Props> = ({ record, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const { addService, editService } = useModel('booking');

    useEffect(() => {
        if (record) {
            form.setFieldsValue(record);
        } else {
            form.resetFields();
        }
    }, [record, form]);

    const onFinish = (values: any) => {
        const service: Typing.Service = {
            id: record?.id || Math.random().toString(36).substr(2, 9),
            ...values,
        };

        if (record) {
            editService(service);
        } else {
            addService(service);
        }
        onSuccess();
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: '24px' }}>
            <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>
                <InputNumber 
                    min={0} 
                    style={{ width: '100%' }} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                    parser={value => value!.replace(/\$\s?|(,*)/g, '') as any} 
                />
            </Form.Item>
            <Form.Item name="duration" label="Thời lượng (Phút)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {record ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    <Button onClick={onCancel}>Hủy</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ServiceForm;
