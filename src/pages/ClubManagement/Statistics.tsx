import { Card, Row, Col, Statistic, Button, Select, Space, message } from 'antd';
import { useModel } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { FileExcelOutlined } from '@ant-design/icons';

const Statistics: React.FC = () => {
    const { registrations, clubs } = useModel('clubManagement');

    const totalClubs = clubs.length;
    const pendingCount = registrations.filter(r => r.status === 'Pending').length;
    const approvedCount = registrations.filter(r => r.status === 'Approved').length;
    const rejectedCount = registrations.filter(r => r.status === 'Rejected').length;

    // Prepare chart data
    const xAxis = clubs.map(c => c.name);
    const pendingPerClub = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Pending').length);
    const approvedPerClub = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Approved').length);
    const rejectedPerClub = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Rejected').length);

    const chartData = {
        title: 'Số đơn đăng ký theo từng CLB',
        xAxis,
        yAxis: [pendingPerClub, approvedPerClub, rejectedPerClub],
        yLabel: ['Pending', 'Approved', 'Rejected'],
        colors: ['#1890ff', '#52c41a', '#f5222d'],
        otherOptions: {
            colors: ['#1890ff', '#52c41a', '#f5222d']
        },
        formatY: (val: number) => `${val} đơn`,
    };

    const handleExport = (clubId: string) => {
        const club = clubs.find(c => c.id === clubId);
        if (!club) return;

        const members = registrations.filter(r => r.clubId === clubId && r.status === 'Approved');
        const data = members.map(m => ({
            'Họ tên': m.fullName,
            'Email': m.email,
            'SĐT': m.phone,
            'Giới tính': m.gender,
            'Địa chỉ': m.address,
            'Sở trường': m.talent,
            'Ngày đăng ký': moment(m.timestamp).format('DD/MM/YYYY'),
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách thành viên");
        XLSX.writeFile(wb, `Danh_sach_thanh_vien_${club.name}.xlsx`);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={16}>
                <Col span={6}>
                    <Card><Statistic title="Số câu lạc bộ" value={totalClubs} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Pending" value={pendingCount} valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Approved" value={approvedCount} valueStyle={{ color: '#52c41a' }} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="Đơn Rejected" value={rejectedCount} valueStyle={{ color: '#f5222d' }} /></Card>
                </Col>
            </Row>

            <Card title="Thống kê đơn đăng ký">
                <ColumnChart {...chartData} />
            </Card>

            <Card title="Xuất báo cáo theo CLB">
                <Space>
                    <span>Chọn CLB muốn xuất danh sách thành viên:</span>
                    <Select placeholder="Chọn CLB" style={{ width: 250 }} onChange={(val) => (window as any).selectedClubToExport = val}>
                        {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                    </Select>
                    <Button 
                        type="primary" 
                        icon={<FileExcelOutlined />} 
                        onClick={() => {
                            const clubId = (window as any).selectedClubToExport;
                            if (clubId) handleExport(clubId);
                            else message.warning('Vui lòng chọn CLB');
                        }}
                    >
                        Xuất file XLSX
                    </Button>
                </Space>
            </Card>
        </Space>
    );
};

export default Statistics;
