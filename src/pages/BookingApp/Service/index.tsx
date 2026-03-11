import React, { useState } from 'react';
import { Button, Popconfirm, message } from 'antd';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { BookingApp as Typing } from '../typing';
import ServiceForm from './Form';

const ServicePage: React.FC = () => {
    const { services, deleteService } = useModel('booking');
    const [showEdit, setShowEdit] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Typing.Service | undefined>(undefined);

    const columns: IColumn<Typing.Service>[] = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            width: 200,
            sortable: true,
            filterType: 'string',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            width: 120,
            render: (price) => `${price.toLocaleString()} VNĐ`,
            sortable: true,
        },
        {
            title: 'Thời lượng (Phút)',
            dataIndex: 'duration',
            width: 120,
            align: 'center',
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
                        title="Bạn có chắc chắn muốn xóa dịch vụ này?"
                        onConfirm={() => {
                            deleteService(record.id);
                            message.success('Đã xóa dịch vụ');
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
                data={services}
                hasCreate
                setShowEdit={(val) => {
                    setShowEdit(val);
                    if (!val) setEditingRecord(undefined);
                }}
                showEdit={showEdit}
                Form={ServiceForm}
                formProps={{
                    record: editingRecord,
                    onSuccess: () => {
                        setShowEdit(false);
                        setEditingRecord(undefined);
                    }
                }}
                title="Danh sách Dịch vụ"
            />
        </div>
    );
};

export default ServicePage;
