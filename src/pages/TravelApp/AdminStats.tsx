import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Statistic } from 'antd';
import { AreaChartOutlined, LineChartOutlined, DollarCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import moment from 'moment';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const AdminStats: React.FC = () => {
    const { schedules, destinations } = useModel('travel');

    // Memos for Stats
    const totalSchedules = schedules.length;

    // Lịch trình theo tháng (6 tháng gần nhất)
    const schedulesByMonthData = useMemo(() => {
        const last6Months = Array.from({length: 6}, (_, i) => moment().subtract(5 - i, 'months').format('MM/YYYY'));
        const counts = Array(6).fill(0);
        
        schedules.forEach(s => {
            const m = moment(s.createdAt).format('MM/YYYY');
            const idx = last6Months.indexOf(m);
            if(idx !== -1) counts[idx]++;
        });

        return { labels: last6Months, series: counts };
    }, [schedules]);

    // Tổng số tiền nộp/phân bổ theo danh mục
    const categoryStats = useMemo(() => {
        let food = 0; let stay = 0; let travel = 0;

        schedules.forEach(s => {
            s.items.forEach(item => {
                const dest = destinations.find(d => d.id === item.destinationId);
                if (dest) {
                    food += dest.costFood;
                    stay += dest.costStay;
                    travel += dest.costTravel;
                }
            });
        });

        return { food, stay, travel, total: food + stay + travel };
    }, [schedules, destinations]);

    // Địa điểm phổ biến (most added items in schedules)
    const topDestinations = useMemo(() => {
        const counts: Record<string, number> = {};
        schedules.forEach(s => {
            s.items.forEach(item => {
                counts[item.destinationId] = (counts[item.destinationId] || 0) + 1;
            });
        });

        const sorted = Object.entries(counts)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => {
                const d = destinations.find(x => x.id === id);
                return { name: d?.name || 'Không xác định', count };
            });

        return sorted;
    }, [schedules, destinations]);

    return (
        <div style={{ padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2}>
                    <LineChartOutlined style={{ marginRight: 12, color: '#1890ff' }} /> 
                    Thống Kê Kinh Doanh Lữ Hành
                </Title>
                <Text type="secondary">Báo cáo tổng quan hoạt động đặt tour và lựa chọn người dùng.</Text>
            </div>

            <Row gutter={[24, 24]}>
                {/* HEADLINE STATS */}
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title="Tổng User Lịch Trình" 
                            value={totalSchedules} 
                            prefix={<AreaChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title="Dòng Tiền Ước Tính" 
                            value={categoryStats.total} 
                            suffix="VND"
                            prefix={<DollarCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title="Dòng Tiền Lưu Trú" 
                            value={categoryStats.stay} 
                            suffix="VND"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title="Quán Quân Điểm Đến" 
                            value={topDestinations[0]?.name || 'N/A'}
                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ fontSize: 20, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                        />
                    </Card>
                </Col>

                {/* CHARTS */}
                <Col xs={24} lg={12}>
                    <Card 
                        title="Tăng trưởng Lịch trình tạo mới" 
                        bordered={false} 
                        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <Chart 
                            options={{
                                chart: { type: 'area', toolbar: { show: false } },
                                stroke: { curve: 'smooth' },
                                xaxis: { categories: schedulesByMonthData.labels },
                                colors: ['#1890ff'],
                                dataLabels: { enabled: true }
                            }}
                            series={[{ name: 'Lịch trình tạo', data: schedulesByMonthData.series }]}
                            type="area"
                            height={300}
                        />
                    </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                    <Card 
                        title="Top Điểm Đến Phổ Biến Nhất" 
                        bordered={false} 
                        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <Chart 
                            options={{
                                chart: { type: 'bar', toolbar: { show: false } },
                                plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                                xaxis: { categories: topDestinations.map(d => d.name) },
                                colors: ['#52c41a'],
                                dataLabels: { enabled: true }
                            }}
                            series={[{ name: 'Lượt thêm', data: topDestinations.map(d => d.count) }]}
                            type="bar"
                            height={300}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card 
                        title="Phân Tích Dòng Tiền Theo Hạng Mục Dịch Vụ" 
                        bordered={false} 
                        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <Row align="middle" justify="center">
                            <Col xs={24} md={12}>
                                {categoryStats.total > 0 ? (
                                    <Chart 
                                        options={{
                                            labels: ['Phí Ăn Uống', 'Lưu Trú', 'Phí Di Chuyển'],
                                            colors: ['#36cfc9', '#ff7875', '#ffc53d'],
                                            dataLabels: { formatter: (val, opt) => opt.w.globals.seriesTotals[opt.seriesIndex].toLocaleString() + ' đ' }
                                        }}
                                        series={[categoryStats.food, categoryStats.stay, categoryStats.travel]}
                                        type="pie"
                                        height={320}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '50px 0' }}>Chưa có dữ liệu giao dịch</div>
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminStats;
