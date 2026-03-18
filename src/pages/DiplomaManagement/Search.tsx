import React, { useState } from 'react';
import { useModel } from 'umi';
import { Form, Input, Button, Table, Card, Space, Typography, DatePicker, message, Descriptions, Modal, Empty, Tag, Result } from 'antd';
import { SearchOutlined, EyeOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { DiplomaManagement as Typing } from './typing';

const { Title, Text, Paragraph } = Typography;

const Search: React.FC = () => {
    const { diplomas, fieldConfigs, decisions, incrementSearchCount } = useModel('diploma');
    const [searchResults, setSearchResults] = useState<Typing.DiplomaInfo[]>([]);
    const [selectedDiploma, setSelectedDiploma] = useState<Typing.DiplomaInfo | null>(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);
    const [form] = Form.useForm();

    const onSearch = (values: any) => {
        setHasTyped(true);
        // Count filled parameters properly including Date
        const searchKeys = ['diplomaId', 'entryNumber', 'studentId', 'fullName', 'dob'];
        const filledParams = searchKeys.filter(key => {
            const val = values[key];
            if (key === 'dob') return !!val;
            return val !== undefined && val !== '';
        }).length;

        if (filledParams < 2) {
            message.warning('Vui lòng nhập ít nhất 2 tham số để thực hiện tra cứu bảo mật!');
            setSearchResults([]);
            return;
        }

        const dobValue = values.dob ? values.dob.format('YYYY-MM-DD') : null;

        const results = diplomas.filter(d => {
            const matchDiplomaId = !values.diplomaId || d.diplomaId.toLowerCase() === values.diplomaId.toLowerCase();
            const matchEntryNumber = !values.entryNumber || d.entryNumber.toString() === values.entryNumber;
            const matchStudentId = !values.studentId || d.studentId.toLowerCase() === values.studentId.toLowerCase();
            const matchFullName = !values.fullName || d.fullName.toLowerCase().includes(values.fullName.toLowerCase());
            const matchDob = !dobValue || d.dob === dobValue;

            return matchDiplomaId && matchEntryNumber && matchStudentId && matchFullName && matchDob;
        });

        setSearchResults(results);
        if (results.length === 0) {
            message.info('Không tìm thấy bản ghi nào trùng khớp!');
        } else {
            message.success(`Tìm thấy ${results.length} kết quả phù hợp!`);
        }
    };

    const showDetail = (diploma: Typing.DiplomaInfo) => {
        setSelectedDiploma(diploma);
        setIsDetailVisible(true);
        incrementSearchCount(diploma.decisionId);
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: 'Số hiệu văn bằng',
            dataIndex: 'diplomaId',
            key: 'diplomaId',
            render: (text: string) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Mã SV',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_: any, record: Typing.DiplomaInfo) => (
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Card 
                bordered={false} 
                style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <SearchOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <Title level={3}>Tra cứu thông tin văn bằng tốt nghiệp</Title>
                    <Paragraph type="secondary">
                        Vui lòng nhập các thông tin dưới đây để thực hiện tra cứu. 
                        <strong> Cần nhập tối thiểu 2 trường thông tin</strong> để đảm bảo tính bảo mật.
                    </Paragraph>
                </div>

                <Form form={form} layout="vertical" onFinish={onSearch} initialValues={{ dob: null }}>
                    <Space size="middle" direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <Form.Item name="diplomaId" label="Số hiệu văn bằng">
                                <Input prefix={<FileTextOutlined style={{color: '#bfbfbf'}} />} placeholder="Ví dụ: VB001..." />
                            </Form.Item>
                            <Form.Item name="entryNumber" label="Số vào sổ">
                                <Input prefix={<HistoryOutlined style={{color: '#bfbfbf'}} />} placeholder="Ví dụ: 1..." />
                            </Form.Item>
                            <Form.Item name="studentId" label="Mã sinh viên">
                                <Input placeholder="Ví dụ: B20DC..." />
                            </Form.Item>
                            <Form.Item name="fullName" label="Họ tên">
                                <Input placeholder="Ví dụ: Nguyễn Văn..." />
                            </Form.Item>
                            <Form.Item name="dob" label="Ngày sinh">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                            </Form.Item>
                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}>
                                <Button type="primary" block size="large" htmlType="submit" icon={<SearchOutlined />}>
                                    Thực hiện tra cứu
                                </Button>
                            </div>
                        </div>
                    </Space>
                </Form>
            </Card>

            <div style={{ marginTop: 24 }}>
                {searchResults.length > 0 ? (
                    <Card bordered={false} bodyStyle={{ padding: 0 }}>
                        <Table 
                            columns={columns} 
                            dataSource={searchResults} 
                            rowKey="id" 
                            pagination={false}
                        />
                    </Card>
                ) : hasTyped && (
                    <Card bordered={false}>
                        <Empty description="Không có kết quả nào được hiển thị" />
                    </Card>
                )}
            </div>

            <Modal
                title={<Space><EyeOutlined /> Chi tiết văn bằng tốt nghiệp</Space>}
                visible={isDetailVisible}
                onCancel={() => setIsDetailVisible(false)}
                footer={[
                    <Button key="close" type="primary" size="large" onClick={() => setIsDetailVisible(false)}>
                        Hoàn tất xem thông tin
                    </Button>
                ]}
                width={800}
                centered
            >
                {selectedDiploma && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Descriptions 
                            title="1. Thông tin sinh viên & Văn bằng" 
                            bordered 
                            column={2}
                            size="small"
                        >
                            <Descriptions.Item label="Họ tên sinh viên" span={2}>
                                <Text strong style={{ fontSize: 16 }}>{selectedDiploma.fullName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">{moment(selectedDiploma.dob).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Mã sinh viên">{selectedDiploma.studentId}</Descriptions.Item>
                            <Descriptions.Item label="Số hiệu văn bằng">
                                <Tag color="blue" style={{fontWeight: 'bold'}}>{selectedDiploma.diplomaId}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số vào sổ">
                                <Text type="success" strong>{selectedDiploma.entryNumber.toString().padStart(4, '0')}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        {fieldConfigs.length > 0 && (
                            <Descriptions 
                                title="2. Thông tin bổ sung (Phụ lục)" 
                                bordered 
                                column={2}
                                size="small"
                            >
                                {fieldConfigs.map(field => (
                                    <Descriptions.Item key={field.id} label={field.name}>
                                        {(() => {
                                            const val = selectedDiploma.dynamicFields[field.id];
                                            if (!val) return '---';
                                            if (field.type === 'Date') return moment(val).format('DD/MM/YYYY');
                                            return val;
                                        })()}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        )}

                        <Descriptions 
                            title="3. Thông tin Quyết định công nhận" 
                            bordered 
                            column={1}
                            size="small"
                        >
                            {(() => {
                                const decision = decisions.find(d => d.id === selectedDiploma.decisionId);
                                if (!decision) return <Descriptions.Item label="Lỗi">Không tìm thấy thông tin quyết định</Descriptions.Item>;
                                return (
                                    <>
                                        <Descriptions.Item label="Số Quyết định">{decision.decisionNumber}</Descriptions.Item>
                                        <Descriptions.Item label="Ngày ban hành">{moment(decision.issueDate).format('DD/MM/YYYY')}</Descriptions.Item>
                                        <Descriptions.Item label="Nội dung trích yếu">{decision.summary}</Descriptions.Item>
                                    </>
                                );
                            })()}
                        </Descriptions>
                        
                        <Result
                            status="success"
                            title="Chứng nhận tính pháp lý"
                            subTitle="Thông tin trên đã được xác thực từ cơ sở dữ liệu gốc của nhà trường."
                            style={{ padding: '16px 0' }}
                        />
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default Search;
