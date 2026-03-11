import React, { useState } from 'react';
import { Button, Popconfirm, Tag, message } from 'antd';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { BookingApp as Typing } from '../typing';
import EmployeeForm from './Form';

const EmployeePage: React.FC = () => {
    const { employees, deleteEmployee } = useModel('booking');
    const [showEdit, setShowEdit] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Typing.Employee | undefined>(undefined);

    const columns: IColumn<Typing.Employee>[] = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'name',
            width: 150,
            sortable: true,
            filterType: 'string',
        },
        {
            title: 'Số khách tối đa/ngày',
            dataIndex: 'maxSlots',
            width: 100,
            align: 'center',
        },
        {
            title: 'Lịch làm việc',
            dataIndex: 'schedule',
            width: 250,
            render: (schedule: Typing.WorkSchedule[]) => (
                <div>
                    {schedule.map((s, idx) => {
                        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                        return (
                            <Tag color="blue" key={idx}>
                                {days[s.dayOfWeek]}: {s.startTime} - {s.endTime}
                            </Tag>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Đánh giá TB',
            dataIndex: 'averageRating',
            width: 100,
            render: (rating) => rating ? `${rating.toFixed(1)} ⭐` : 'Chưa có',
        },
        {
            title: 'Thao tác',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div>
                    <Button 
                        type="link" 
                        onClick={() => {
                            setEditingRecord(record);
                            setShowEdit(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhân viên này?"
                        onConfirm={() => {
                            deleteEmployee(record.id);
                            message.success('Đã xóa nhân viên');
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <TableStaticData
                columns={columns as any}
                data={employees}
                hasCreate
                setShowEdit={(val) => {
                    setShowEdit(val);
                    if (!val) setEditingRecord(undefined);
                }}
                showEdit={showEdit}
                Form={EmployeeForm}
                formProps={{
                    record: editingRecord,
                    onSuccess: () => {
                        setShowEdit(false);
                        setEditingRecord(undefined);
                    }
                }}
                title="Danh sách Nhân viên"
            />
        </div>
    );
};

export default EmployeePage;
