import React, { useState } from 'react';
import { Button, Tag, message, Space, Modal, Form, Rate, Input } from 'antd';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { BookingApp as Typing } from '../typing';
import AppointmentForm from './Form';

const AppointmentPage: React.FC = () => {
    const { appointments, services, employees, updateAppointmentStatus, addReview, reviews } = useModel('booking');
    const [showEdit, setShowEdit] = useState(false);
    const [reviewingId, setReviewingId] = useState<string | undefined>(undefined);
    const [reviewForm] = Form.useForm();

    const getStatusColor = (status: Typing.Appointment['status']) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'Confirmed': return 'blue';
            case 'Completed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: Typing.Appointment['status']) => {
      switch (status) {
          case 'Pending': return 'Chờ duyệt';
          case 'Confirmed': return 'Đã xác nhận';
          case 'Completed': return 'Hoàn thành';
          case 'Cancelled': return 'Đã hủy';
          default: return status;
      }
  };

    const handleReviewSubmit = (values: any) => {
        const appointment = appointments.find(a => a.id === reviewingId);
        if (!appointment) return;
        const review: Typing.Review = {
            id: Math.random().toString(36).substr(2, 9),
            appointmentId: appointment.id,
            employeeId: appointment.employeeId,
            rating: values.rating,
            comment: values.comment,
            customerName: appointment.customerName,
            createdAt: new Date().toISOString(),
        };
        addReview(review);
        message.success('Cảm ơn bạn đã đánh giá!');
        setReviewingId(undefined);
        reviewForm.resetFields();
    };

    const columns: IColumn<Typing.Appointment>[] = [
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            width: 150,
            sortable: true,
            filterType: 'string',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            width: 150,
            render: (id) => services.find(s => s.id === id)?.name || 'N/A',
            filterType: 'select',
            filterData: services.map(s => ({ value: s.id, label: s.name })),
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeId',
            width: 150,
            render: (id) => employees.find(e => e.id === id)?.name || 'N/A',
            filterType: 'select',
            filterData: employees.map(e => ({ value: e.id, label: e.name })),
        },
        {
            title: 'Ngày & Giờ',
            width: 180,
            render: (_, record) => `${record.date} ${record.time}`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 130,
            render: (status: Typing.Appointment['status']) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            width: 250,
            align: 'center',
            render: (_, record) => (
                <Space>
                    {record.status === 'Pending' && (
                        <Button size="small" type="link" onClick={() => updateAppointmentStatus(record.id, 'Confirmed')}>
                            Xác nhận
                        </Button>
                    )}
                    {record.status === 'Confirmed' && (
                        <Button size="small" type="link" onClick={() => updateAppointmentStatus(record.id, 'Completed')}>
                            Hoàn thành
                        </Button>
                    )}
                    {record.status === 'Completed' && !reviews.find(r => r.appointmentId === record.id) && (
                        <Button size="small" type="link" onClick={() => setReviewingId(record.id)}>
                            Đánh giá
                        </Button>
                    )}
                    {(record.status === 'Pending' || record.status === 'Confirmed') && (
                        <Button size="small" type="link" danger onClick={() => updateAppointmentStatus(record.id, 'Cancelled')}>
                            Hủy
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <TableStaticData
                columns={columns as any}
                data={appointments}
                hasCreate
                setShowEdit={setShowEdit}
                showEdit={showEdit}
                Form={AppointmentForm}
                formProps={{
                    onSuccess: () => {
                        setShowEdit(false);
                    }
                }}
                title="Quản lý Lịch hẹn"
            />

            <Modal
                title="Đánh giá dịch vụ"
                visible={!!reviewingId}
                onCancel={() => setReviewingId(undefined)}
                onOk={() => reviewForm.submit()}
                destroyOnClose
            >
                <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
                    <Form.Item name="rating" label="Số sao" rules={[{ required: true }]}>
                        <Rate />
                    </Form.Item>
                    <Form.Item name="comment" label="Nhận xét" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AppointmentPage;
