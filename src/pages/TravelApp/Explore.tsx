import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Input, Select, Rate, Tag, Space, Empty, Button, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Explore: React.FC = () => {
    const { destinations, activeScheduleId, schedules, addDestinationToSchedule } = useModel('travel');
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState<string>('all');

    const filteredDestinations = useMemo(() => {
        return destinations.filter(dest => {
            const matchName = dest.name.toLowerCase().includes(searchText.toLowerCase());
            const matchType = typeFilter === 'all' || dest.type === typeFilter;
            const matchPrice = priceFilter === 'all' || dest.priceLevel === priceFilter;
            return matchName && matchType && matchPrice;
        });
    }, [destinations, searchText, typeFilter, priceFilter]);

    const handleAddToSchedule = (destId: string) => {
        if (!activeScheduleId) {
            message.warning('Vui lòng tạo hoặc chọn lịch trình ở trang Lập Lịch Trình trước!');
            return;
        }
        
        const schedule = schedules.find(s => s.id === activeScheduleId);
        if (schedule) {
            // Add to day 1 initially
            addDestinationToSchedule(activeScheduleId, destId, 1);
            message.success(`Đã thêm vào lịch trình: ${schedule.name}`);
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
                <Title level={2}>Khám Phá Điểm Đến Tuyệt Vời</Title>
                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                    Tìm kiếm và chọn các địa điểm yêu thích để lên kế hoạch cho chuyến đi của bạn.
                </Paragraph>
            </div>

            <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={10}>
                        <Input 
                            size="large"
                            placeholder="Tìm kiếm điểm đến (Vd: Sapa, Đà Lạt...)" 
                            prefix={<SearchOutlined />} 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={7}>
                        <Select 
                            size="large"
                            style={{ width: '100%' }} 
                            value={typeFilter} 
                            onChange={setTypeFilter}
                        >
                            <Option value="all">Tất cả loại hình</Option>
                            <Option value="Biển">Biển</Option>
                            <Option value="Núi">Núi</Option>
                            <Option value="Thành phố">Thành phố</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={12} md={7}>
                        <Select 
                            size="large"
                            style={{ width: '100%' }} 
                            value={priceFilter} 
                            onChange={setPriceFilter}
                        >
                            <Option value="all">Tất cả mức giá</Option>
                            <Option value="Thấp">Giá thấp</Option>
                            <Option value="Trung bình">Giá trung bình</Option>
                            <Option value="Cao">Giá cao</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {filteredDestinations.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {filteredDestinations.map(dest => (
                        <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
                            <Card
                                hoverable
                                cover={<img alt={dest.name} src={dest.image} style={{ height: 200, objectFit: 'cover' }} />}
                                style={{ borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                                bodyStyle={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <Title level={5} style={{ margin: 0 }}>{dest.name}</Title>
                                    <Tag color={dest.type === 'Biển' ? 'blue' : dest.type === 'Núi' ? 'green' : 'orange'}>
                                        {dest.type}
                                    </Tag>
                                </div>
                                <Rate disabled defaultValue={dest.rating} allowHalf style={{ fontSize: 14, marginBottom: 16 }} />
                                
                                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ flex: 1, marginBottom: 16 }}>
                                    {dest.description}
                                </Paragraph>
                                
                                <Space direction="vertical" size={4} style={{ marginBottom: 16, width: '100%' }}>
                                    <Space>
                                        <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                                        <Text type="secondary">Tham quan: {dest.visitTimeHours} giờ</Text>
                                    </Space>
                                    <Space>
                                        <DollarCircleOutlined style={{ color: '#8c8c8c' }} />
                                        <Text type="secondary">Mức giá: <Text strong>{dest.priceLevel}</Text></Text>
                                    </Space>
                                    <Space>
                                        <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                                        <Text type="secondary">
                                            Tổng chi phí ước tính: <Text strong style={{ color: '#ff4d4f' }}>
                                                {((dest.costFood + dest.costStay + dest.costTravel) / 1000).toLocaleString()}k
                                            </Text>
                                        </Text>
                                    </Space>
                                </Space>

                                <Button 
                                    type="primary" 
                                    block 
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddToSchedule(dest.id)}
                                >
                                    Thêm vào lịch trình
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Không tìm thấy điểm đến nào phù hợp" style={{ marginTop: 50 }} />
            )}
        </div>
    );
};

export default Explore;
