import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Tag, message, Card, Tooltip, Typography } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ClubManagement as Typing } from './typing';
import moment from 'moment';

const { Text } = Typography;

const Registrations: React.FC = () => {
    const { registrations, clubs, updateRegistrationStatus, deleteRegistration } = useModel('clubManagement');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [currentReg, setCurrentReg] = useState<Typing.Registration | null>(null);
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [actionType, setActionType] = useState<Typing.RegistrationStatus | null>(null);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [form] = Form.useForm();

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleBatchAction = (status: Typing.RegistrationStatus) => {
        if (selectedRowKeys.length === 0) return;
        setActionType(status);
        setIsActionModalVisible(true);
    };

    const handleActionOk = () => {
        form.validateFields().then(values => {
            const idsToUpdate = currentReg ? [currentReg.id] : selectedRowKeys.map(k => k.toString());
            updateRegistrationStatus(idsToUpdate, actionType!, values.note);
            message.success('Thao tác thành công');
            setIsActionModalVisible(false);
            setCurrentReg(null);
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
            title: 'Câu lạc bộ',
            dataIndex: 'clubId',
            key: 'clubId',
            render: (clubId: string) => clubs.find(c => c.id === clubId)?.name || 'N/A',
            filters: clubs.map(c => ({ text: c.name, value: c.id })),
            onFilter: (value: any, record: Typing.Registration) => record.clubId === value,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Typing.RegistrationStatus) => {
                let color = 'blue';
                if (status === 'Approved') color = 'green';
                if (status === 'Rejected') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            },
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value: any, record: Typing.Registration) => record.status === value,
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
            sorter: (a: Typing.Registration, b: Typing.Registration) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Typing.Registration) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => { setCurrentReg(record); setIsDetailModalVisible(true); }} />
                    </Tooltip>
                    <Tooltip title="Lịch sử">
                        <Button icon={<HistoryOutlined />} onClick={() => { setCurrentReg(record); setIsHistoryModalVisible(true); }} />
                    </Tooltip>
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Duyệt">
                                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { 
                                    setCurrentReg(record); 
                                    setActionType('Approved' as any); 
                                    setIsActionModalVisible(true); 
                                }} />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button danger icon={<CloseCircleOutlined />} onClick={() => { 
                                    setCurrentReg(record); 
                                    setActionType('Rejected' as any); 
                                    setIsActionModalVisible(true); 
                                }} />
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="Xóa">
                        <Button icon={<DeleteOutlined />} danger onClick={() => {
                            Modal.confirm({
                                title: 'Xác nhận xóa',
                                content: 'Bạn có chắc chắn muốn xóa đơn đăng ký này?',
                                onOk: () => deleteRegistration(record.id)
                            });
                        }} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card 
            title="Quản lý đơn đăng ký" 
            extra={
                <Space>
                    <Button 
                        type="primary" 
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => handleBatchAction('Approved')}
                    >
                        Duyệt {selectedRowKeys.length > 0 ? selectedRowKeys.length : ''} đơn đã chọn
                    </Button>
                    <Button 
                        danger 
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => handleBatchAction('Rejected')}
                    >
                        Từ chối {selectedRowKeys.length > 0 ? selectedRowKeys.length : ''} đơn đã chọn
                    </Button>
                </Space>
            }
        >
            <Table 
                rowSelection={rowSelection}
                dataSource={registrations} 
                columns={columns} 
                rowKey="id" 
            />

            {/* Action Modal (Approve/Reject) */}
            <Modal
                title={actionType === 'Approved' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                visible={isActionModalVisible}
                onOk={handleActionOk}
                onCancel={() => { setIsActionModalVisible(false); setCurrentReg(null); }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="note" 
                        label={actionType === 'Approved' ? 'Ghi chú (tùy chọn)' : 'Lý do từ chối (bắt buộc)'}
                        rules={[{ required: actionType === 'Rejected', message: 'Vui lòng nhập lý do từ chối' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title="Chi tiết đơn đăng ký"
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>]}
                width={700}
            >
                {currentReg && (
                    <div style={{ padding: '10px 0' }}>
                        <p><strong>Họ tên:</strong> {currentReg.fullName}</p>
                        <p><strong>Email:</strong> {currentReg.email}</p>
                        <p><strong>SĐT:</strong> {currentReg.phone}</p>
                        <p><strong>Giới tính:</strong> {currentReg.gender}</p>
                        <p><strong>Địa chỉ:</strong> {currentReg.address}</p>
                        <p><strong>Sở trường:</strong> {currentReg.talent}</p>
                        <p><strong>Câu lạc bộ:</strong> {clubs.find(c => c.id === currentReg.clubId)?.name}</p>
                        <p><strong>Lý do đăng ký:</strong> {currentReg.reason}</p>
                        {currentReg.status === 'Rejected' && <p><strong>Lý do từ chối:</strong> <Text type="danger">{currentReg.rejectReason}</Text></p>}
                    </div>
                )}
            </Modal>

            {/* History Modal */}
            <Modal
                title="Lịch sử thao tác"
                visible={isHistoryModalVisible}
                onCancel={() => setIsHistoryModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsHistoryModalVisible(false)}>Đóng</Button>]}
            >
                {currentReg?.history && currentReg.history.length > 0 ? (
                    <Table 
                        dataSource={currentReg.history} 
                        rowKey="id"
                        columns={[
                            { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp' },
                            { title: 'Tác vụ', dataIndex: 'action', key: 'action', render: (val) => <Tag>{val}</Tag> },
                            { title: 'Người thực hiện', dataIndex: 'actor', key: 'actor' },
                            { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
                        ]}
                        pagination={false}
                    />
                ) : <p>Chưa có lịch sử thao tác</p>}
            </Modal>
        </Card>
    );
};

export default Registrations;
