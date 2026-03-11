import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { CalendarOutlined, DollarCircleOutlined, TeamOutlined, ShopOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
    const { appointments, services, employees } = useModel('booking');

    const totalRevenue = appointments
        .filter(a => a.status === 'Completed')
        .reduce((sum, a) => {
            const service = services.find(s => s.id === a.serviceId);
            return sum + (service?.price || 0);
        }, 0);

    const completedAppointments = appointments.filter(a => a.status === 'Completed').length;

    // Revenue by service for chart
    const revenueByServiceData = services.map(s => {
        return appointments
            .filter(a => a.serviceId === s.id && a.status === 'Completed')
            .reduce((sum) => sum + s.price, 0);
    });
    const serviceLabels = services.map(s => s.name);

    // Appointments by employee for chart
    const appointmentsByEmployeeData = employees.map(e => {
        return appointments.filter(a => a.employeeId === e.id).length;
    });
    const employeeLabels = employees.map(e => e.name);

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng Doanh thu" value={totalRevenue} suffix="VNĐ" prefix={<DollarCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Lịch hẹn hoàn thành" value={completedAppointments} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Số lượng Nhân viên" value={employees.length} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Dịch vụ cung cấp" value={services.length} prefix={<ShopOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col span={12}>
                    <Card title="Doanh thu theo Dịch vụ">
                        <DonutChart 
                            xAxis={serviceLabels}
                            yAxis={[revenueByServiceData]}
                            yLabel={['Doanh thu']}
                            height={300}
                            showTotal
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Số lượng Lịch hẹn theo Nhân viên">
                        <ColumnChart 
                            xAxis={employeeLabels}
                            yAxis={[appointmentsByEmployeeData]}
                            yLabel={['Số lượng']}
                            height={300}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

