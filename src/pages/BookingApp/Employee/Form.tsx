import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space, Select, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import type { BookingApp as Typing } from '../typing';

interface Props {
    record?: Typing.Employee;
    onCancel: () => void;
    onSuccess: () => void;
}

const EmployeeForm: React.FC<Props> = ({ record, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const { addEmployee, editEmployee } = useModel('booking');

    useEffect(() => {
        if (record) {
            const formatted = {
                ...record,
                schedule: record.schedule.map(s => ({
                    ...s,
                    timeRange: [moment(s.startTime, 'HH:mm'), moment(s.endTime, 'HH:mm')]
                }))
            };
            form.setFieldsValue(formatted);
        } else {
            form.resetFields();
        }
    }, [record, form]);

    const onFinish = (values: any) => {
        const schedule = (values.schedule || []).map((s: any) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.timeRange[0].format('HH:mm'),
            endTime: s.timeRange[1].format('HH:mm'),
        }));

        const employee: Typing.Employee = {
            id: record?.id || Math.random().toString(36).substr(2, 9),
            name: values.name,
            maxSlots: values.maxSlots,
            schedule,
            averageRating: record?.averageRating,
        };

        if (record) {
            editEmployee(employee);
        } else {
            addEmployee(employee);
        }
        onSuccess();
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: '24px' }}>
            <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="maxSlots" label="Số khách tối đa/ngày" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.List name="schedule">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'dayOfWeek']}
                                    rules={[{ required: true, message: 'Chọn thứ' }]}
                                    style={{ width: 120 }}
                                >
                                    <Select placeholder="Thứ">
                                        <Select.Option value={1}>Thứ 2</Select.Option>
                                        <Select.Option value={2}>Thứ 3</Select.Option>
                                        <Select.Option value={3}>Thứ 4</Select.Option>
                                        <Select.Option value={4}>Thứ 5</Select.Option>
                                        <Select.Option value={5}>Thứ 6</Select.Option>
                                        <Select.Option value={6}>Thứ 7</Select.Option>
                                        <Select.Option value={0}>Chủ nhật</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'timeRange']}
                                    rules={[{ required: true, message: 'Chọn giờ' }]}
                                >
                                    <TimePicker.RangePicker format="HH:mm" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Thêm lịch làm việc
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

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

export default EmployeeForm;
