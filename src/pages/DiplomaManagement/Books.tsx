import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, InputNumber, Space, Popconfirm, Card, Typography, Statistic, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import type { DiplomaManagement as Typing } from './typing';

const { Title, Text } = Typography;

const Books: React.FC = () => {
    const { books, addOrUpdateBook, deleteBook, diplomas } = useModel('diploma');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState<Typing.DiplomaBook | null>(null);
    const [form] = Form.useForm();

    const showModal = (book?: Typing.DiplomaBook) => {
        if (book) {
            setEditingBook(book);
            form.setFieldsValue(book);
        } else {
            setEditingBook(null);
            form.resetFields();
            form.setFieldsValue({ year: new Date().getFullYear(), currentNumber: 1 });
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // Check for duplicate year when adding new
            if (!editingBook && books.find(b => b.year === values.year)) {
                message.error(`Sổ văn bằng cho năm ${values.year} đã tồn tại!`);
                return;
            }

            const book: Typing.DiplomaBook = {
                id: editingBook?.id || Date.now().toString(),
                ...values,
                currentNumber: values.currentNumber // Use form value
            };
            addOrUpdateBook(book);
            setIsModalVisible(false);
            message.success(editingBook ? 'Cập nhật sổ văn bằng thành công' : 'Đã mở sổ văn bằng mới');
        });
    };

    const columns = [
        {
            title: 'Năm quản lý',
            dataIndex: 'year',
            key: 'year',
            render: (year: number) => <Text strong style={{fontSize: '16px'}}>Năm {year}</Text>
        },
        {
            title: 'Số vào sổ hiện tại',
            dataIndex: 'currentNumber',
            key: 'currentNumber',
            render: (num: number) => <Text type="success" strong>{num.toString().padStart(4, '0')}</Text>
        },
        {
            title: 'Văn bằng đã cấp',
            key: 'count',
            render: (_: any, record: Typing.DiplomaBook) => {
                const count = diplomas.filter(d => {
                    // Logic: find diploma's decision's book
                    return true; // Simplified: would need lookup
                }).length;
                return `Dữ liệu năm ${record.year}`;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Typing.DiplomaBook) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>Hiệu chỉnh</Button>
                    <Popconfirm title="Xóa sổ này sẽ ảnh hưởng dữ liệu liên quan. Bạn chắc chắn?" onConfirm={() => deleteBook(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button type="link" danger icon={<DeleteOutlined />}>Gỡ bỏ</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
                <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                        <Statistic title="Tổng số sổ văn bằng" value={books.length} prefix={<BookOutlined />} valueStyle={{ color: '#3f51b5' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                        <Statistic title="Sổ mới nhất" value={books.length > 0 ? Math.max(...books.map(b => b.year)) : 'N/A'} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} bodyStyle={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Danh sách Sổ văn bằng</Title>
                        <Text type="secondary">Quản lý định danh các sổ văn bằng theo niên giám</Text>
                    </div>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Mở sổ mới
                    </Button>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={[...books].sort((a,b) => b.year - a.year)} 
                    rowKey="id" 
                    bordered
                    pagination={false}
                />
            </Card>

            <Modal
                title={editingBook ? <Space><EditOutlined /> Cập nhật sổ văn bằng</Space> : <Space><PlusOutlined /> Khai báo mở sổ năm mới</Space>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                centered
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="year" label="Năm áp dụng" rules={[{ required: true, message: 'Nhập năm' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="2024" min={2000} max={2100} />
                    </Form.Item>
                    <Form.Item 
                        name="currentNumber" 
                        label="Số hiệu bắt đầu / Hiện tại" 
                        extra="Số vào sổ cho sinh viên tiếp theo sẽ bắt đầu từ giá trị này."
                        rules={[{ required: true, message: 'Nhập số bắt đầu' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default Books;
