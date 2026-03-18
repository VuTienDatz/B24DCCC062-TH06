import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, Card, Typography, Tag, Tooltip, Row, Col, Statistic, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileDoneOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { DiplomaManagement as Typing } from './typing';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Decisions: React.FC = () => {
    const { decisions, books, addOrUpdateDecision, deleteDecision } = useModel('diploma');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDecision, setEditingDecision] = useState<Typing.GraduationDecision | null>(null);
    const [form] = Form.useForm();

    const showModal = (decision?: Typing.GraduationDecision) => {
        if (decision) {
            setEditingDecision(decision);
            form.setFieldsValue({
                ...decision,
                issueDate: moment(decision.issueDate),
            });
        } else {
            setEditingDecision(null);
            form.resetFields();
            form.setFieldsValue({
                issueDate: moment(),
            });
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const decision: Typing.GraduationDecision = {
                id: editingDecision?.id || Date.now().toString(),
                ...values,
                issueDate: values.issueDate.format('YYYY-MM-DD'),
                searchCount: editingDecision?.searchCount || 0,
            };
            addOrUpdateDecision(decision);
            setIsModalVisible(false);
            message.success(editingDecision ? 'Cập nhật quyết định thành công' : 'Đã ban hành quyết định mới');
        });
    };

    const columns = [
        {
            title: 'Số Quyết định',
            dataIndex: 'decisionNumber',
            key: 'decisionNumber',
            render: (text: string) => <Tag color="blue" style={{fontWeight: 'bold'}}>{text}</Tag>,
        },
        {
            title: 'Ngày ban hành',
            dataIndex: 'issueDate',
            key: 'issueDate',
            render: (date: string) => moment(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Trích yếu nội dung',
            dataIndex: 'summary',
            key: 'summary',
            width: '35%',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <Text type="secondary">{text}</Text>
                </Tooltip>
            )
        },
        {
            title: 'Sổ văn bằng',
            dataIndex: 'bookId',
            key: 'bookId',
            render: (bookId: string) => {
                const book = books.find(b => b.id === bookId);
                return book ? <Tag color="orange">Sổ năm {book.year}</Tag> : 'N/A';
            },
        },
        {
            title: 'Lượt tra cứu',
            dataIndex: 'searchCount',
            key: 'searchCount',
            render: (count: number) => (
                <Space>
                    <EyeOutlined style={{color: '#1890ff'}} />
                    <Text strong>{count || 0}</Text>
                </Space>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Typing.GraduationDecision) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa quyết định?" onConfirm={() => deleteDecision(record.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
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
                        <Statistic title="Quyết định đã ban hành" value={decisions.length} prefix={<FileDoneOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                        <Statistic title="Tổng lượt tra cứu hệ thống" value={decisions.reduce((acc, d) => acc + (d.searchCount || 0), 0)} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} bodyStyle={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Quản lý Quyết định tốt nghiệp</Title>
                        <Text type="secondary">Phê duyệt và khai báo các đợt xét tốt nghiệp chính thức</Text>
                    </div>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Ban hành QĐ mới
                    </Button>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={[...decisions].reverse()} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            </Card>

            <Modal
                title={editingDecision ? <Space><EditOutlined /> Chỉnh sửa quyết định</Space> : <Space><PlusOutlined /> Ban hành quyết định mới</Space>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
                centered
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="decisionNumber" label="Số Quyết định" rules={[{ required: true, message: 'Ví dụ: QĐ-01/HT1' }]}>
                                <Input placeholder="QĐ-xxx/..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="issueDate" label="Ngày ban hành" rules={[{ required: true, message: 'Chọn ngày' }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="bookId" label="Thuộc sổ văn bằng (Năm)" rules={[{ required: true, message: 'Chọn sổ lưu trữ' }]}>
                                <Select placeholder="Chọn sổ lưu trữ dữ liệu năm...">
                                    {books.map(book => (
                                        <Option key={book.id} value={book.id}>Sổ văn bằng niên giám {book.year}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="summary" label="Nội dung trích yếu" rules={[{ required: true, message: 'Nhập tóm tắt nội dung' }]}>
                                <Input.TextArea placeholder="Nhập trích yếu quyết định..." rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Space>
    );
};

export default Decisions;
