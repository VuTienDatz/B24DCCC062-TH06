import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Card, Typography, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { TravelApp as Typing } from './typing';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminDestinations: React.FC = () => {
    const { destinations, addDestination, updateDestination, deleteDestination } = useModel('travel');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDest, setEditingDest] = useState<Typing.Destination | null>(null);
    const [form] = Form.useForm();

    const showModal = (dest?: Typing.Destination) => {
        if (dest) {
            setEditingDest(dest);
            form.setFieldsValue(dest);
        } else {
            setEditingDest(null);
            form.resetFields();
            form.setFieldsValue({
                rating: 5,
                costFood: 0,
                costStay: 0,
                costTravel: 0,
                visitTimeHours: 2
            });
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const dest: Typing.Destination = {
                id: editingDest?.id || Date.now().toString(),
                ...values,
                createdAt: editingDest?.createdAt || moment().toISOString()
            };

            if (editingDest) {
                updateDestination(dest);
                message.success('Cập nhật điểm đến thành công');
            } else {
                addDestination(dest);
                message.success('Đã thêm điểm đến mới');
            }
            setIsModalVisible(false);
        });
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img: string) => <img src={img} alt="dest" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
        },
        {
            title: 'Tên Điểm Đến',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Loại / Mức giá',
            key: 'tags',
            render: (_: any, record: Typing.Destination) => (
                <Space direction="vertical" size={2}>
                    <Tag color={record.type === 'Biển' ? 'blue' : record.type === 'Núi' ? 'green' : 'orange'}>
                        {record.type}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.priceLevel}</Text>
                </Space>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Text strong style={{ color: '#faad14' }}>{rating} ⭐</Text>
        },
        {
            title: 'Tổng chi phí',
            key: 'cost',
            render: (_: any, record: Typing.Destination) => (
                <Text type="danger" strong>
                    {((record.costFood + record.costStay + record.costTravel) / 1000).toLocaleString()}k
                </Text>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: Typing.Destination) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showModal(record)} />
                    <Popconfirm title="Xóa điểm này khỏi hệ thống?" onConfirm={() => deleteDestination(record.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
            <Card bordered={false} bodyStyle={{ padding: 24 }} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            <EnvironmentOutlined style={{ marginRight: 12, color: '#1890ff' }} /> 
                            Quản Trị Cơ Sở Dữ Liệu Điểm Đến
                        </Title>
                        <Text type="secondary">Cập nhật và duy trì kho dữ liệu các địa điểm du lịch.</Text>
                    </div>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginTop: 16 }}>
                        Thêm Tọa Độ Mới
                    </Button>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={destinations} 
                    rowKey="id" 
                    scroll={{ x: 1000 }}
                    pagination={{ pageSize: 10 }}
                    bordered
                />

                <Modal
                    title={<Space><EditOutlined /> {editingDest ? 'Chỉnh sửa toạ độ' : 'Thêm toạ độ mới'}</Space>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={() => setIsModalVisible(false)}
                    width={800}
                    centered
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="name" label="Tên Địa điểm" rules={[{ required: true, message: 'Bắt buộc nhập' }]}>
                                    <Input placeholder="Vd: Vịnh Hạ Long..." />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Biển">Biển</Option>
                                        <Option value="Núi">Núi</Option>
                                        <Option value="Thành phố">Thành phố</Option>
                                        <Option value="Khác">Khác</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="priceLevel" label="Phân khúc giá" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Thấp">Thấp</Option>
                                        <Option value="Trung bình">Trung bình</Option>
                                        <Option value="Cao">Cao</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={18}>
                                <Form.Item name="image" label="Đường dẫn ảnh mô tả (URL)" rules={[{ required: true }]}>
                                    <Input placeholder="https://..." />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="rating" label="Đánh giá (1-5 sao)" rules={[{ required: true }]}>
                                    <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="description" label="Nội dung giới thiệu" rules={[{ required: true }]}>
                                    <TextArea rows={3} placeholder="Mô tả điểm thú vị, đặc sắc..." />
                                </Form.Item>
                            </Col>
                            
                            <Col span={24}>
                            <Title level={5} type="secondary" style={{ marginTop: 10 }}>Chỉ số ngân sách ước tính mỗi điểm:</Title>
                            </Col>
                            
                            <Col span={6}>
                                <Form.Item name="visitTimeHours" label="T.gian Tham quan (h)" rules={[{ required: true }]}>
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="costFood" label="Ăn uống (VND)" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value?.replace(/\$\s?|(,*)/g, '') as unknown as number} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="costStay" label="Lưu trú (VND)" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value?.replace(/\$\s?|(,*)/g, '') as unknown as number} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="costTravel" label="Di chuyển (VND)" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value?.replace(/\$\s?|(,*)/g, '') as unknown as number} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default AdminDestinations;
