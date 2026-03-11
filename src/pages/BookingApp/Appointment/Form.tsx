import React from 'react';
import { Form, Input, Button, Space, Select, TimePicker, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import type { BookingApp as Typing } from '../typing';
import MyDatePicker from '@/components/MyDatePicker';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
}

const AppointmentForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const { appointments, services, employees, bookAppointment } = useModel('booking');

    const onFinish = (values: any) => {
        const { customerName, serviceId, employeeId, date, time } = values;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const formattedTime = moment(time).format('HH:mm');

        // Check for overlaps
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return;

        // 1. Check if employee works on that day of week
        const dayOfWeek = moment(date).day();
        const schedule = employee.schedule.find(s => s.dayOfWeek === dayOfWeek);
        if (!schedule) {
            message.error('Nhân viên không làm việc vào ngày này!');
            return;
        }

        // 2. Check if time is within schedule
        const selectedTime = moment(formattedTime, 'HH:mm');
        const startTime = moment(schedule.startTime, 'HH:mm');
        const endTime = moment(schedule.endTime, 'HH:mm');
        if (selectedTime.isBefore(startTime) || selectedTime.isAfter(endTime)) {
            message.error('Thời gian chọn ngoài giờ làm việc của nhân viên!');
            return;
        }

        // 3. Check for existing appointments at the same time
        const isConflict = appointments.some(a => 
            a.employeeId === employeeId && 
            a.date === formattedDate && 
            a.time === formattedTime &&
            a.status !== 'Cancelled'
        );
        if (isConflict) {
            message.error('Nhân viên đã có lịch hẹn vào giờ này!');
            return;
        }

        // 4. Check for max slots per day
        const dailyAppointments = appointments.filter(a => 
            a.employeeId === employeeId && 
            a.date === formattedDate &&
            a.status !== 'Cancelled'
        ).length;
        if (dailyAppointments >= employee.maxSlots) {
            message.error('Nhân viên đã đủ số khách tối đa cho ngày này!');
            return;
        }

        const appointment: Typing.Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            customerName,
            serviceId,
            employeeId,
            date: formattedDate,
            time: formattedTime,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        bookAppointment(appointment);
        message.success('Đặt lịch thành công!');
        onSuccess();
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: '24px' }}>
            <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
                <Select>
                    {services.map(s => <Select.Option key={s.id} value={s.id}>{s.name} ({s.price.toLocaleString()} VNĐ)</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
                <Select placeholder="Chọn nhân viên">
                    {employees.map(e => {
                        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                        const scheduleStr = e.schedule
                            .map(s => `${days[s.dayOfWeek]}: ${s.startTime}-${s.endTime}`)
                            .join(' | ');
                        return (
                            <Select.Option key={e.id} value={e.id}>
                                {e.name} ({scheduleStr})
                            </Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>
            <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
                <MyDatePicker saveFormat="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="time" label="Giờ" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">Đặt lịch</Button>
                    <Button onClick={onCancel}>Hủy</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default AppointmentForm;
