import React, { useState } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, InputNumber, Button, Space, Alert, Progress, Statistic, message } from 'antd';
import { WalletOutlined, ShoppingOutlined, HomeOutlined, CarOutlined, WarningOutlined } from '@ant-design/icons';

import Chart from 'react-apexcharts';

const { Title, Text, Paragraph } = Typography;

const Budget: React.FC = () => {
    const { 
        schedules, activeScheduleId, budgetLimit, 
        handleSetBudgetLimit, getActiveScheduleBudget
    } = useModel('travel');

    const [limitInput, setLimitInput] = useState<number>(budgetLimit);

    const activeSchedule = schedules.find(s => s.id === activeScheduleId);
    const budget = getActiveScheduleBudget();

    const isExceeded = budget.total > budgetLimit;
    const progressPercent = budgetLimit > 0 ? (budget.total / budgetLimit) * 100 : 0;

    const chartOptions = {
        labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
        colors: ['#52c41a', '#1890ff', '#faad14'],
        legend: {
            position: 'bottom' as 'bottom'
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number, opts: any) {
                return opts.w.globals.seriesTotals[opts.seriesIndex].toLocaleString() + ' đ';
            }
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val.toLocaleString() + ' đ'
                }
            }
        }
    };

    const chartSeries = [budget.food, budget.stay, budget.travel];

    const handleSaveLimit = () => {
        handleSetBudgetLimit(limitInput);
        message.success('Cập nhật ngân sách thành công');
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2}>
                    <WalletOutlined style={{ marginRight: 12, color: '#1890ff' }} /> 
                    Quản Lý Ngân Sách Đi Phượt
                </Title>
                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                    Giám sát và phân bổ rủi ro tài chính cho lịch trình: <Text strong>{activeSchedule?.name || 'Chưa chọn'}</Text>
                </Paragraph>
            </div>

            {!activeSchedule ? (
                <Alert
                    message="Lưu ý"
                    description="Bạn chưa chọn lịch trình nào để xem ngân sách. Vui lòng chuyển sang tab Lập Lịch Trình để chọn."
                    type="warning"
                    showIcon
                />
            ) : (
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        {/* Biểu đồ */}
                        <Card 
                            title={<Space><WalletOutlined /> <Text strong>Phân bổ chi phí</Text></Space>} 
                            bordered={false} 
                            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: 450 }}
                        >
                            {budget.total > 0 ? (
                                <div style={{ display: 'flex', justifyContent: 'center', height: 350 }}>
                                    <Chart 
                                        options={chartOptions} 
                                        series={chartSeries} 
                                        type="donut" 
                                        width="100%" 
                                        height={350} 
                                    />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <Paragraph type="secondary">Lịch trình này chưa có điểm đến, chưa phát sinh chi phí.</Paragraph>
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        {/* Cảnh báo và Ngân sách tổng */}
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <Title level={5}>Cài đặt giới hạn ngân sách</Title>
                                <Space>
                                    <InputNumber 
                                        style={{ width: 180 }} 
                                        size="large"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                        value={limitInput}
                                        onChange={(v) => setLimitInput(v || 0)}
                                    />
                                    <Button type="primary" size="large" onClick={handleSaveLimit}>
                                        Áp dụng
                                    </Button>
                                </Space>
                            </Card>

                            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <Statistic 
                                    title="Dự toán tổng chi phí chuyến đi" 
                                    value={budget.total} 
                                    suffix="VND" 
                                    valueStyle={{ color: isExceeded ? '#cf1322' : '#3f8600', fontWeight: 'bold' }} 
                                />
                                
                                <div style={{ marginTop: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <Text>Tiến độ dùng ngân sách</Text>
                                        <Text strong>{progressPercent.toFixed(1)}%</Text>
                                    </div>
                                    <Progress 
                                        percent={progressPercent} 
                                        showInfo={false} 
                                        status={isExceeded ? 'exception' : 'active'} 
                                        strokeColor={isExceeded ? '#ff4d4f' : '#52c41a'}
                                        strokeWidth={14}
                                    />
                                </div>

                                {isExceeded && (
                                    <Alert
                                        message="Vượt ngân sách!"
                                        description={`Bạn đã tiêu vượt ${Math.abs(budgetLimit - budget.total).toLocaleString()} VND so với giới hạn định ra!`}
                                        type="error"
                                        showIcon
                                        icon={<WarningOutlined />}
                                        style={{ marginTop: 24 }}
                                    />
                                )}
                            </Card>

                            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 24px' }}>
                                <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                    <Space><ShoppingOutlined style={{ color: '#52c41a' }} /> Tỉ trọng Ăn uống:</Space>
                                    <Text strong>{budget.food.toLocaleString()} đ</Text>
                                </Row>
                                <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                    <Space><HomeOutlined style={{ color: '#1890ff' }} /> Tỉ trọng Nghỉ ngơi:</Space>
                                    <Text strong>{budget.stay.toLocaleString()} đ</Text>
                                </Row>
                                <Row justify="space-between" align="middle">
                                    <Space><CarOutlined style={{ color: '#faad14' }} /> Tỉ trọng Vé/Xe:</Space>
                                    <Text strong>{budget.travel.toLocaleString()} đ</Text>
                                </Row>
                            </Card>
                        </Space>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Budget;
