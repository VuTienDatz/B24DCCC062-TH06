import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, Card, Typography, InputNumber, Tag, Row, Col, Divider, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { DiplomaManagement as Typing } from './typing';

const { Title, Text } = Typography;
const { Option } = Select;

const Diplomas: React.FC = () => {
    const { diplomas, fieldConfigs, decisions, addDiploma, editDiploma, deleteDiploma } = useModel('diploma');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDiploma, setEditingDiploma] = useState<Typing.DiplomaInfo | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    const showModal = (diploma?: Typing.DiplomaInfo) => {
        if (diploma) {
            setEditingDiploma(diploma);
            const formValues: any = {
                ...diploma,
                dob: moment(diploma.dob),
            };
            fieldConfigs.forEach(field => {
                const val = diploma.dynamicFields[field.id];
                formValues[`dynamic_${field.id}`] = field.type === 'Date' ? (val ? moment(val) : null) : val;
            });
            form.setFieldsValue(formValues);
        } else {
            setEditingDiploma(null);
            form.resetFields();
            form.setFieldsValue({ dob: moment('2002-01-01') });
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const dynamicFields: Record<string, any> = {};
            fieldConfigs.forEach(field => {
                const val = values[`dynamic_${field.id}`];
                dynamicFields[field.id] = field.type === 'Date' && val ? (moment.isMoment(val) ? val.format('YYYY-MM-DD') : val) : val;
            });

            const diploma: Typing.DiplomaInfo = {
                id: editingDiploma?.id || Date.now().toString(),
                ...values,
                dob: values.dob.format('YYYY-MM-DD'),
                dynamicFields,
                entryNumber: editingDiploma?.entryNumber || 0,
            };

            let result;
            if (editingDiploma) {
                result = editDiploma(diploma);
            } else {
                result = addDiploma(diploma);
            }

            if (result.success) {
                message.success(editingDiploma ? 'Cập nhật văn bằng thành công' : 'Thêm văn bằng mới thành công');
                setIsModalVisible(false);
                form.resetFields();
            } else {
                message.error(result.message);
            }
        });
    };

    const filteredDiplomas = useMemo(() => {
        if (!searchText) return diplomas;
        const lowerSearch = searchText.toLowerCase();
        return diplomas.filter(d => 
            d.fullName.toLowerCase().includes(lowerSearch) || 
            d.diplomaId.toLowerCase().includes(lowerSearch) || 
            d.studentId.toLowerCase().includes(lowerSearch)
        );
    }, [diplomas, searchText]);

    const columns = [
        {
            title: 'Số hiệu văn bằng',
            dataIndex: 'diplomaId',
            key: 'diplomaId',
            fixed: 'left' as 'left',
            render: (text: string) => <Tag color="blue" style={{fontWeight: 'bold'}}>{text}</Tag>,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string, record: Typing.DiplomaInfo) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{fontSize: '12px'}}>{record.studentId}</Text>
                </Space>
            )
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Số vào sổ',
            dataIndex: 'entryNumber',
            key: 'entryNumber',
            render: (num: number) => <Text type="success" strong>{num.toString().padStart(4, '0')}</Text>
        },
        {
            title: 'Quyết định',
            dataIndex: 'decisionId',
            render: (id: string) => {
                const d = decisions.find(dec => dec.id === id);
                return d ? <Tooltip title={d.summary}>{d.decisionNumber}</Tooltip> : 'N/A';
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right' as 'right',
            width: 150,
            render: (_: any, record: Typing.DiplomaInfo) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Xóa văn bằng này?" onConfirm={() => {
                        deleteDiploma(record.id);
                        message.info('Đã xóa văn bằng');
                    }}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const renderDynamicFields = () => {
        return fieldConfigs.map(field => {
            let component;
            switch (field.type) {
                case 'Number':
                    component = <InputNumber style={{ width: '100%' }} />;
                    break;
                case 'Date':
                    component = <DatePicker style={{ width: '100%' }} />;
                    break;
                default:
                    component = <Input />;
            }
            return (
                <Col span={12} key={field.id}>
                    <Form.Item name={`dynamic_${field.id}`} label={field.name}>
                        {component}
                    </Form.Item>
                </Col>
            );
        });
    };

    return (
        <Card bordered={false} bodyStyle={{ padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Thông tin văn bằng</Title>
                    <Text type="secondary">Quản lý kho dữ liệu văn bằng đã cấp</Text>
                </Col>
                <Col>
                    <Space size="middle">
                        <Input 
                            placeholder="Tìm nhanh theo tên, mã SV, số hiệu..." 
                            prefix={<SearchOutlined />} 
                            style={{ width: 300 }}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                            Khai báo văn bằng
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Table 
                columns={columns} 
                dataSource={filteredDiplomas} 
                rowKey="id" 
                scroll={{ x: 1100 }}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                bordered
            />

            <Modal
                title={editingDiploma ? <Space><EditOutlined /> Chỉnh sửa thông tin</Space> : <Space><PlusOutlined /> Khai báo mới</Space>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
                centered
                okText={editingDiploma ? "Cập nhật" : "Lưu vào sổ"}
            >
                <Form form={form} layout="vertical" initialValues={{ dob: moment('2002-01-01') }}>
                    <Divider orientation="left"><Text type="secondary">Thông tin định danh</Text></Divider>
                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Form.Item name="diplomaId" label="Số hiệu văn bằng" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input placeholder="VB-2024-xxxx" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {editingDiploma && (
                                <Form.Item name="entryNumber" label="Số vào sổ">
                                    <InputNumber disabled style={{ width: '100%' }} />
                                </Form.Item>
                            )}
                        </Col>
                        <Col span={12}>
                            <Form.Item name="studentId" label="Mã sinh viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input placeholder="B20DC..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="fullName" label="Họ tên sinh viên" rules={[{ required: true, message: 'Bắt buộc' }]}>
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Chọn ngày' }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left"><Text type="secondary">Cấp theo quyết định</Text></Divider>
                    <Form.Item name="decisionId" label="Quyết định tốt nghiệp" rules={[{ required: true, message: 'Chọn quyết định' }]}>
                        <Select 
                            placeholder="--- Chọn quyết định được cấp phép ---"
                            showSearch
                            optionFilterProp="children"
                        >
                            {decisions.map(d => (
                                <Option key={d.id} value={d.id}>
                                    <Space direction="vertical" size={0}>
                                        <Text strong>{d.decisionNumber}</Text>
                                        <Text type="secondary" style={{fontSize: '11px'}}>{d.summary}</Text>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    {fieldConfigs.length > 0 && (
                        <>
                            <Divider orientation="left">
                                <Space>
                                    <Text type="secondary">Phụ lục thông tin</Text>
                                    <Tooltip title="Các trường được cấu hình tại menu Cấu hình biểu mẫu">
                                        <InfoCircleOutlined style={{color: '#1890ff'}} />
                                    </Tooltip>
                                </Space>
                            </Divider>
                            <Row gutter={[16, 0]}>
                                {renderDynamicFields()}
                            </Row>
                        </>
                    )}
                </Form>
            </Modal>
        </Card>
    );
};

export default Diplomas;
