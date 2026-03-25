import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, DatePicker, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { ClubManagement as Typing } from './typing';
import moment from 'moment';
import TinyEditor from '@/components/TinyEditor';
import UploadFileComponent from '@/components/Upload/UploadFile';

const Clubs: React.FC = () => {
    const { clubs, addOrUpdateClub, deleteClub } = useModel('clubManagement');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingClub, setEditingClub] = useState<Typing.Club | null>(null);
    const [form] = Form.useForm();

    const showModal = (club?: Typing.Club) => {
        setEditingClub(club || null);
        if (club) {
            form.setFieldsValue({
                ...club,
                foundedDate: moment(club.foundedDate),
            });
        } else {
            form.resetFields();
        }
        setIsEditModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // Convert UploadFile value back to string URL if needed
            let avatarUrl = values.avatar;
            if (values.avatar && typeof values.avatar === 'object' && values.avatar.fileList) {
                // If it's a new upload or object, we might need to handle it.
                // For simplicity in this mock, we'll try to find a URL.
                avatarUrl = values.avatar.fileList[0]?.url || values.avatar.fileList[0]?.thumbUrl || ''; 
            }

            const clubData: Typing.Club = {
                ...values,
                avatar: avatarUrl,
                id: editingClub?.id || '',
                foundedDate: values.foundedDate.format('YYYY-MM-DD'),
            };
            addOrUpdateClub(clubData);
            message.success(editingClub ? 'Cập nhật thành công' : 'Thêm mới thành công');
            setIsEditModalVisible(false);
        });
    };

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => text ? <img src={text} alt="avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} /> : 'Chưa có',
        },
        {
            title: 'Tên câu lạc bộ',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Typing.Club, b: Typing.Club) => a.name.localeCompare(b.name),
        },
        {
            title: 'Ngày thành lập',
            dataIndex: 'foundedDate',
            key: 'foundedDate',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
            sorter: (a: Typing.Club, b: Typing.Club) => moment(a.foundedDate).unix() - moment(b.foundedDate).unix(),
        },
        {
            title: 'Chủ nhiệm CLB',
            dataIndex: 'manager',
            key: 'manager',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (val: boolean) => <Switch checked={val} disabled />,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Typing.Club) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<EyeOutlined />} onClick={() => history.push(`/club-management/members?clubId=${record.id}`)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => {
                        Modal.confirm({
                            title: 'Xác nhận xóa',
                            content: `Bạn có chắc chắn muốn xóa CLB ${record.name}?`,
                            onOk: () => {
                                deleteClub(record.id);
                                message.success('Xóa thành công');
                            }
                        });
                    }} />
                </Space>
            ),
        },
    ];

    return (
        <Card 
            title="Danh sách Câu lạc bộ" 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm mới CLB</Button>}
        >
            <Table 
                dataSource={clubs} 
                columns={columns} 
                rowKey="id" 
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm mới CLB'}
                visible={isEditModalVisible}
                onOk={handleOk}
                onCancel={() => setIsEditModalVisible(false)}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="manager" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="avatar" label="Ảnh đại diện">
                        <UploadFileComponent isAvatar />
                    </Form.Item>
                    <Form.Item name="isActive" label="Hoạt động" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <TinyEditor height={300} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Clubs;
