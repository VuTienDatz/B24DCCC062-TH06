import React, { useState } from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Typography, Select, Button, Modal, Form, Input, DatePicker, List, Space, Popconfirm, Tag, message, Alert } from 'antd';
import { CalendarOutlined, PlusOutlined, DeleteOutlined, CalculatorOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { TravelApp as Typing } from './typing';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Planner: React.FC = () => {
    const { 
        schedules, activeScheduleId, destinations, 
        setAsActiveSchedule, createSchedule, 
        addDestinationToSchedule, removeDestinationFromSchedule,
        getActiveScheduleBudget
    } = useModel('travel');

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isAddDestModalVisible, setIsAddDestModalVisible] = useState(false);
    const [selectedDayToAdd, setSelectedDayToAdd] = useState<number>(1);
    const [form] = Form.useForm();
    const [destForm] = Form.useForm();

    const activeSchedule = schedules.find(s => s.id === activeScheduleId);

    const handleCreateSchedule = () => {
        form.validateFields().then(values => {
            const startDate = values.startDate.toISOString();
            createSchedule(values.name, values.daysCount, startDate);
            setIsCreateModalVisible(false);
            form.resetFields();
            message.success('Tạo lịch trình mới thành công');
        });
    };

    const handleAddDestination = () => {
        destForm.validateFields().then(values => {
            if (activeScheduleId) {
                addDestinationToSchedule(activeScheduleId, values.destinationId, selectedDayToAdd);
                setIsAddDestModalVisible(false);
                destForm.resetFields();
                message.success('Thêm điểm đến vào lịch trình thành công');
            }
        });
    };

    const calculateDaySummary = (items: Typing.ScheduleItem[]) => {
        let hours = 0;
        let cost = 0;
        items.forEach(item => {
            const d = destinations.find(x => x.id === item.destinationId);
            if (d) {
                hours += d.visitTimeHours + 2; // Giả sử 2h di chuyển mỗi điểm
                cost += d.costFood + d.costStay + d.costTravel;
            }
        });
        return { hours, cost };
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                <Title level={2} style={{ margin: 0 }}>Lập Lịch Trình</Title>
                <Space style={{ marginTop: 10 }}>
                    <Select 
                        size="large"
                        style={{ width: 250 }} 
                        placeholder="Chọn lịch trình đang sửa"
                        value={activeScheduleId}
                        onChange={setAsActiveSchedule}
                    >
                        {schedules.map(s => (
                            <Option key={s.id} value={s.id}>{s.name}</Option>
                        ))}
                    </Select>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                        Tạo lịch trình mới
                    </Button>
                </Space>
            </div>

            {activeSchedule ? (
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={18}>
                        <Card 
                            title={<Space><CalendarOutlined /> <Text strong style={{ fontSize: 18 }}>Chi tiết các ngày trong lịch trình: {activeSchedule.name}</Text></Space>} 
                            bordered={false} 
                            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                {Array.from({ length: activeSchedule.daysCount }).map((_, idx) => {
                                    const dayNumber = idx + 1;
                                    const dayDate = moment(activeSchedule.startDate).add(idx, 'days').format('DD/MM/YYYY');
                                    const dayItems = activeSchedule.items.filter(i => i.day === dayNumber).sort((a,b) => a.order - b.order);
                                    const summary = calculateDaySummary(dayItems);

                                    return (
                                        <Card 
                                            key={dayNumber} 
                                            type="inner" 
                                            title={<Text strong>Ngày {dayNumber} ({dayDate})</Text>}
                                            extra={
                                                <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => {
                                                    setSelectedDayToAdd(dayNumber);
                                                    setIsAddDestModalVisible(true);
                                                }}>
                                                    Thêm điểm đến
                                                </Button>
                                            }
                                        >
                                            <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                                                <Space size="large">
                                                    <Text type="secondary"><CalculatorOutlined /> Ước tính thời gian: <Text strong>{summary.hours} giờ</Text></Text>
                                                    <Text type="secondary"><CalculatorOutlined /> Ước tính chi phí: <Text strong type="danger">{summary.cost.toLocaleString()} VND</Text></Text>
                                                </Space>
                                            </div>

                                            {dayItems.length > 0 ? (
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={dayItems}
                                                    renderItem={item => {
                                                        const dest = destinations.find(d => d.id === item.destinationId);
                                                        if (!dest) return <></>;
                                                        return (
                                                            <List.Item
                                                                actions={[
                                                                    <Popconfirm title="Xóa điểm này?" onConfirm={() => removeDestinationFromSchedule(activeSchedule.id, item.id)}>
                                                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                                                    </Popconfirm>
                                                                ]}
                                                            >
                                                                <List.Item.Meta
                                                                    avatar={<img src={dest.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />}
                                                                    title={<Text strong>{dest.name}</Text>}
                                                                    description={<Space><Tag color="blue">{dest.type}</Tag> <Text type="secondary">Tham quan: {dest.visitTimeHours}h | Chi phí điểm: {(dest.costFood + dest.costStay + dest.costTravel).toLocaleString()}đ</Text></Space>}
                                                                />
                                                            </List.Item>
                                                        )
                                                    }}
                                                />
                                            ) : (
                                                <Paragraph type="secondary" style={{ textAlign: 'center', margin: '20px 0' }}>Ngày này chưa có điểm đến nào. Hãy thêm vào!</Paragraph>
                                            )}
                                        </Card>
                                    );
                                })}
                            </Space>
                        </Card>
                    </Col>
                    
                    <Col xs={24} lg={6}>
                        <Card title="Khái quát thông tin" bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Tên lịch trình:</Text>
                                    <Text strong style={{ fontSize: 16 }}>{activeSchedule.name}</Text>
                                </div>
                                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Thời gian hành trình:</Text>
                                    <Text strong>{activeSchedule.daysCount} ngày</Text>
                                    <br/>
                                    <Text type="secondary">Bắt đầu: {moment(activeSchedule.startDate).format('DD/MM/YYYY')}</Text>
                                </div>
                                <div style={{ background: '#fff1f0', padding: 16, borderRadius: 8, border: '1px solid #ffa39e' }}>
                                    <Text type="danger" style={{ display: 'block', marginBottom: 8 }}>Tổng dự toán ngân sách:</Text>
                                    <Title level={3} type="danger" style={{ margin: 0 }}>
                                        {getActiveScheduleBudget().total.toLocaleString()} đ
                                    </Title>
                                    <Button type="link" style={{ padding: 0, marginTop: 10 }} href="/travel-app/budget">
                                        Xem chi tiết ngân sách &rarr;
                                    </Button>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Card style={{ textAlign: 'center', padding: '50px 0', borderRadius: 12 }}>
                    <InfoCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <Title level={4}>Bạn chưa có lịch trình nào đang chọn</Title>
                    <Paragraph type="secondary">Vui lòng chọn từ menu hoặc tạo mới lịch trình để bắt đầu lên kế hoạch.</Paragraph>
                </Card>
            )}

            {/* Tạo Lịch Trình Modal */}
            <Modal
                title={<Space><PlusOutlined /> Lấy tên cho cuộc hành trình mới</Space>}
                visible={isCreateModalVisible}
                onOk={handleCreateSchedule}
                onCancel={() => setIsCreateModalVisible(false)}
                okText="Bắt đầu lên kế hoạch"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên lịch trình" rules={[{ required: true }]}>
                        <Input placeholder="Vd: Xuyên Việt 5 ngày 4 đêm..." />
                    </Form.Item>
                    <Form.Item name="startDate" label="Ngày bắt đầu hành trình" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="daysCount" label="Số ngày của hành trình" rules={[{ required: true }]}>
                        <Select>
                            {[1, 2, 3, 4, 5, 6, 7, 10, 14, 30].map(d => <Option key={d} value={d}>{d} ngày</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Thêm Điểm Đến Modal */}
            <Modal
                title={`Thêm điểm đến vào Ngày ${selectedDayToAdd}`}
                visible={isAddDestModalVisible}
                onOk={handleAddDestination}
                onCancel={() => setIsAddDestModalVisible(false)}
            >
                <Form form={destForm} layout="vertical">
                    <Form.Item name="destinationId" label="Tìm điểm đến muốn đi" rules={[{ required: true }]}>
                        <Select 
                            showSearch 
                            placeholder="Nhập và chọn điểm đến"
                            optionFilterProp="children"
                        >
                            {destinations.map(d => (
                                <Option key={d.id} value={d.id}>{d.name} ({d.type})</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Alert message="Bạn có thể tìm duyệt thêm các điểm đến ở phần Khám phá Tọa độ" type="info" showIcon />
                </Form>
            </Modal>
        </div>
    );
};




export default Planner;
