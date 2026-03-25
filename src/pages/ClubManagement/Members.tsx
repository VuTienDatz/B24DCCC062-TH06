import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Card } from 'antd';
import { useModel, useLocation } from 'umi';
import type { ClubManagement as Typing } from './typing';

const Members: React.FC = () => {
    const { registrations, clubs, changeClubForMembers } = useModel('clubManagement');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isChangeClubModalVisible, setIsChangeClubModalVisible] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterClubId = queryParams.get('clubId');

    const members = registrations.filter(r => 
        r.status === 'Approved' && (!filterClubId || r.clubId === filterClubId)
    );

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleChangeClub = () => {
        form.validateFields().then(values => {
            changeClubForMembers(selectedRowKeys.map(k => k.toString()), values.newClubId);
            message.success(`Đã đổi CLB cho ${selectedRowKeys.length} thành viên`);
            setIsChangeClubModalVisible(false);
            setSelectedRowKeys([]);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a: Typing.Registration, b: Typing.Registration) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Sở trường',
            dataIndex: 'talent',
            key: 'talent',
        },
        {
            title: 'Câu lạc bộ hiện tại',
            dataIndex: 'clubId',
            key: 'clubId',
            render: (clubId: string) => clubs.find(c => c.id === clubId)?.name || 'N/A',
            filters: clubs.map(c => ({ text: c.name, value: c.id })),
            onFilter: (value: any, record: Typing.Registration) => record.clubId === value,
        },
    ];

    return (
        <Card 
            title="Quản lý thành viên Câu lạc bộ" 
            extra={
                <Button 
                    type="primary" 
                    disabled={selectedRowKeys.length === 0}
                    onClick={() => setIsChangeClubModalVisible(true)}
                >
                    Đổi CLB {selectedRowKeys.length > 0 ? `cho ${selectedRowKeys.length} thành viên` : ''}
                </Button>
            }
        >
            <Table 
                rowSelection={rowSelection}
                dataSource={members} 
                columns={columns} 
                rowKey="id" 
            />

            <Modal
                title="Thay đổi câu lạc bộ"
                visible={isChangeClubModalVisible}
                onOk={handleChangeClub}
                onCancel={() => setIsChangeClubModalVisible(false)}
            >
                <div style={{ marginBottom: 16 }}>
                    Đang thay đổi CLB cho <strong>{selectedRowKeys.length}</strong> thành viên.
                </div>
                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="newClubId" 
                        label="Chọn câu lạc bộ mới"
                        rules={[{ required: true, message: 'Vui lòng chọn CLB mới' }]}
                    >
                        <Select placeholder="Chọn CLB">
                            {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Members;
