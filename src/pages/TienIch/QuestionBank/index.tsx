import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    List,
    message,
    Select,
    Space,
    Tabs,
    Typography,
    Popconfirm,
    Modal,
    Row,
    Col,
    Tag,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';

type Difficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

interface KnowledgeBlock {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
}

interface Question {
    id: string;
    code: string;
    subjectId: string;
    content: string;
    difficulty: Difficulty;
    knowledgeId: string;
}

interface Requirement {
    difficulty: Difficulty;
    knowledgeId: string;
    count: number;
}

interface ExamStructure {
    id: string;
    name: string;
    subjectId: string;
    requirements: Requirement[];
}

interface Exam {
    id: string;
    structureId: string;
    questions: Question[];
    createdAt: string;
}

const LS = {
    blocks: 'kb-knowledge',
    subjects: 'kb-subjects',
    questions: 'kb-questions',
    structures: 'kb-structures',
    exams: 'kb-exams',
};

const load = <T,>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        return JSON.parse(raw) as T[];
    } catch {
        return [];
    }
};

const save = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(data));
};

const QuestionBankPage: React.FC = () => {
    // --- STATES DỮ LIỆU ---
    const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [structures, setStructures] = useState<ExamStructure[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);

    // --- FORMS ---
    const [blockForm] = Form.useForm();
    const [subjectForm] = Form.useForm();
    const [questionForm] = Form.useForm();
    const [structureForm] = Form.useForm();

    // --- STATES BỘ LỌC ---
    const [filterSubject, setFilterSubject] = useState<string | undefined>();
    const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | undefined>();
    const [filterKnowledge, setFilterKnowledge] = useState<string | undefined>();

    // --- STATES MODALS ---
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<KnowledgeBlock | null>(null);

    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
    const [editingStructure, setEditingStructure] = useState<ExamStructure | null>(null);

    const [isExamViewModalOpen, setIsExamViewModalOpen] = useState(false);
    const [viewingExam, setViewingExam] = useState<Exam | null>(null);

    useEffect(() => {
        setBlocks(load<KnowledgeBlock>(LS.blocks));
        setSubjects(load<Subject>(LS.subjects));
        setQuestions(load<Question>(LS.questions));
        setStructures(load<ExamStructure>(LS.structures));
        setExams(load<Exam>(LS.exams));
    }, []);

    const upd = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, key: string, next: T[]) => {
        setter(next);
        save(key, next);
    };

    // --- 1. KHỐI KIẾN THỨC ---
    const openBlockModal = (block?: KnowledgeBlock) => {
        if (block) {
            setEditingBlock(block);
            blockForm.setFieldsValue(block);
        } else {
            setEditingBlock(null);
            blockForm.resetFields();
        }
        setIsBlockModalOpen(true);
    };

    const handleSaveBlock = (values: { name: string }) => {
        if (editingBlock) {
            upd(setBlocks, LS.blocks, blocks.map(b => b.id === editingBlock.id ? { ...b, name: values.name.trim() } : b));
            message.success('Đã cập nhật khối kiến thức');
        } else {
            upd(setBlocks, LS.blocks, [...blocks, { id: Date.now().toString(), name: values.name.trim() }]);
            message.success('Đã thêm khối kiến thức');
        }
        setIsBlockModalOpen(false);
    };
    const handleDeleteBlock = (id: string) => upd(setBlocks, LS.blocks, blocks.filter(b => b.id !== id));

    // --- 2. MÔN HỌC ---
    const openSubjectModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            subjectForm.setFieldsValue(subject);
        } else {
            setEditingSubject(null);
            subjectForm.resetFields();
        }
        setIsSubjectModalOpen(true);
    };

    const handleSaveSubject = (values: { code: string; name: string; credits: number }) => {
        if (editingSubject) {
            upd(setSubjects, LS.subjects, subjects.map(s => s.id === editingSubject.id ? { ...s, code: values.code.trim(), name: values.name.trim(), credits: values.credits } : s));
            message.success('Đã cập nhật môn học');
        } else {
            upd(setSubjects, LS.subjects, [...subjects, { id: Date.now().toString(), code: values.code.trim(), name: values.name.trim(), credits: values.credits }]);
            message.success('Đã thêm môn học');
        }
        setIsSubjectModalOpen(false);
    };
    const handleDeleteSubject = (id: string) => upd(setSubjects, LS.subjects, subjects.filter(s => s.id !== id));

    // --- 3. CÂU HỎI ---
    const openQuestionModal = (question?: Question) => {
        if (question) {
            setEditingQuestion(question);
            questionForm.setFieldsValue(question);
        } else {
            setEditingQuestion(null);
            questionForm.resetFields();
        }
        setIsQuestionModalOpen(true);
    };

    const handleSaveQuestion = (values: { code: string; subjectId: string; content: string; difficulty: Difficulty; knowledgeId: string; }) => {
        if (editingQuestion) {
            upd(setQuestions, LS.questions, questions.map(q => q.id === editingQuestion.id ? { ...q, ...values, code: values.code.trim(), content: values.content.trim() } : q));
            message.success('Đã cập nhật câu hỏi');
        } else {
            upd(setQuestions, LS.questions, [...questions, { id: Date.now().toString(), ...values, code: values.code.trim(), content: values.content.trim() }]);
            message.success('Đã thêm câu hỏi');
        }
        setIsQuestionModalOpen(false);
    };
    const handleDeleteQuestion = (id: string) => upd(setQuestions, LS.questions, questions.filter(q => q.id !== id));

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchSubject = filterSubject ? q.subjectId === filterSubject : true;
            const matchDifficulty = filterDifficulty ? q.difficulty === filterDifficulty : true;
            const matchKnowledge = filterKnowledge ? q.knowledgeId === filterKnowledge : true;
            return matchSubject && matchDifficulty && matchKnowledge;
        });
    }, [questions, filterSubject, filterDifficulty, filterKnowledge]);

    // --- 4. CẤU TRÚC ĐỀ THI ---
    const openStructureModal = (structure?: ExamStructure) => {
        if (structure) {
            setEditingStructure(structure);
            structureForm.setFieldsValue(structure);
        } else {
            setEditingStructure(null);
            structureForm.resetFields();
        }
        setIsStructureModalOpen(true);
    };

    const handleSaveStructure = (v: { name: string; subjectId: string; requirements: Requirement[]; }) => {
        if (!v.requirements || v.requirements.length === 0) {
            message.error('Vui lòng thêm ít nhất một yêu cầu cho cấu trúc đề thi!');
            return;
        }
        if (editingStructure) {
            upd(setStructures, LS.structures, structures.map(s => s.id === editingStructure.id ? { ...s, ...v } : s));
            message.success('Cập nhật cấu trúc thành công');
        } else {
            upd(setStructures, LS.structures, [...structures, { id: Date.now().toString(), ...v }]);
            message.success('Lưu cấu trúc mới thành công');
        }
        setIsStructureModalOpen(false);
    };
    const handleDeleteStructure = (id: string) => {
        upd(setStructures, LS.structures, structures.filter(s => s.id !== id));
        message.success('Đã xóa cấu trúc đề thi');
    };

    // --- 5. TẠO & XEM ĐỀ THI ---
    const createExam = (structure: ExamStructure) => {
        const reqs = structure.requirements || [];
        if (reqs.length === 0) {
            message.warning('Cấu trúc này rỗng. Vui lòng sửa lại!');
            return;
        }

        const selected: Question[] = [];
        for (const req of reqs) {
            const count = Number(req.count);
            const pool = questions.filter(
                q => q.subjectId === structure.subjectId && q.difficulty === req.difficulty && q.knowledgeId === req.knowledgeId
            );
            
            if (pool.length < count) {
                message.error(`Lỗi: Thiếu câu hỏi (${pool.length}/${count}) mức ${req.difficulty} / khối ${blocks.find(b => b.id === req.knowledgeId)?.name || '?'}`);
                return;
            }

            const poolCopy = [...pool];
            for (let i = 0; i < count; i++) {
                const idx = Math.floor(Math.random() * poolCopy.length);
                selected.push(poolCopy.splice(idx, 1)[0]);
            }
        }
        const exam: Exam = {
            id: Date.now().toString(),
            structureId: structure.id,
            questions: selected,
            createdAt: new Date().toISOString(),
        };
        upd(setExams, LS.exams, [exam, ...exams]);
        message.success(`Đã tạo đề thi từ cấu trúc: ${structure.name}`);
    };

    const handleDeleteExam = (id: string) => {
        upd(setExams, LS.exams, exams.filter(e => e.id !== id));
        message.success('Đã xóa đề thi');
    };

    const openExamViewModal = (exam: Exam) => {
        setViewingExam(exam);
        setIsExamViewModalOpen(true);
    };

    return (
        <Card title="Ngân hàng câu hỏi">
            <Tabs defaultActiveKey="knowledge">
                {/* --- KHỐI KIẾN THỨC --- */}
                <Tabs.TabPane tab="Khối kiến thức" key="knowledge">
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openBlockModal()}>Thêm khối</Button>}>
                        <List dataSource={blocks} renderItem={b => (
                            <List.Item actions={[
                                <Button size="small" onClick={() => openBlockModal(b)}>Sửa</Button>,
                                <Popconfirm title="Xóa khối này?" onConfirm={() => handleDeleteBlock(b.id)}><Button size="small" danger>Xóa</Button></Popconfirm>
                            ]}>{b.name}</List.Item>
                        )} />
                    </Card>
                </Tabs.TabPane>

                {/* --- MÔN HỌC --- */}
                <Tabs.TabPane tab="Môn học" key="subjects">
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openSubjectModal()}>Thêm môn học</Button>}>
                        <List dataSource={subjects} renderItem={s => (
                            <List.Item actions={[
                                <Button size="small" onClick={() => openSubjectModal(s)}>Sửa</Button>,
                                <Popconfirm title="Xóa môn này?" onConfirm={() => handleDeleteSubject(s.id)}><Button size="small" danger>Xóa</Button></Popconfirm>
                            ]}>
                                <Typography.Text strong>{s.code}</Typography.Text> - {s.name} ({s.credits} tín chỉ)
                            </List.Item>
                        )} />
                    </Card>
                </Tabs.TabPane>

                {/* --- CÂU HỎI --- */}
                <Tabs.TabPane tab="Câu hỏi" key="questions">
                    <Card size="small" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openQuestionModal()}>Thêm câu hỏi</Button>}>
                        <Space style={{ marginBottom: 16 }} wrap>
                            <Select placeholder="Môn học" allowClear style={{ width: 150 }} onChange={v => setFilterSubject(v)} value={filterSubject}>
                                {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                            </Select>
                            <Select placeholder="Mức độ" allowClear style={{ width: 120 }} onChange={v => setFilterDifficulty(v)} value={filterDifficulty}>
                                {(['Dễ', 'Trung bình', 'Khó', 'Rất khó'] as Difficulty[]).map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                            </Select>
                            <Select placeholder="Khối kiến thức" allowClear style={{ width: 150 }} onChange={v => setFilterKnowledge(v)} value={filterKnowledge}>
                                {blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                            </Select>
                            <Typography.Text type="secondary">(Tìm thấy {filteredQuestions.length} câu)</Typography.Text>
                        </Space>
                        <List dataSource={filteredQuestions} renderItem={q => (
                            <List.Item actions={[
                                <Button size="small" onClick={() => openQuestionModal(q)}>Sửa</Button>,
                                <Popconfirm title="Xóa câu này?" onConfirm={() => handleDeleteQuestion(q.id)}><Button size="small" danger>Xóa</Button></Popconfirm>
                            ]}>
                                <List.Item.Meta 
                                    title={`[${q.code}] ${q.content}`}
                                    description={`Môn: ${subjects.find(s => s.id === q.subjectId)?.name || ''} | Mức độ: ${q.difficulty} | Khối: ${blocks.find(b => b.id === q.knowledgeId)?.name || ''}`}
                                />
                            </List.Item>
                        )} />
                    </Card>
                </Tabs.TabPane>

                {/* --- ĐỀ THI (LAYOUT TỐI ƯU MỚI) --- */}
                <Tabs.TabPane tab="Đề thi" key="exams">
                    <Row gutter={16}>
                        {/* CỘT TRÁI: DANH SÁCH CẤU TRÚC */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Cấu trúc Đề thi" extra={
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => openStructureModal()}>
                                    Tạo cấu trúc
                                </Button>
                            }>
                                <List
                                    dataSource={structures}
                                    renderItem={s => (
                                        <List.Item
                                            actions={[
                                                <Button type="primary" size="small" ghost onClick={() => createExam(s)}>Tạo đề</Button>,
                                                <Button size="small" onClick={() => openStructureModal(s)}>Sửa</Button>,
                                                <Popconfirm title="Xóa cấu trúc này?" onConfirm={() => handleDeleteStructure(s.id)}>
                                                    <Button size="small" danger>Xóa</Button>
                                                </Popconfirm>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={s.name}
                                                description={
                                                    <>
                                                        Môn: {subjects.find(sub => sub.id === s.subjectId)?.name || '?'} <br/>
                                                        Tổng: {(s.requirements || []).reduce((t, r) => t + Number(r.count), 0)} câu hỏi
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                        {/* CỘT PHẢI: DANH SÁCH ĐỀ THI */}
                        <Col xs={24} lg={12}>
                            <Card size="small" title="Đề thi đã tạo">
                                <List
                                    dataSource={exams}
                                    renderItem={e => {
                                        const structureName = structures.find(s => s.id === e.structureId)?.name || 'Không xác định';
                                        return (
                                            <List.Item
                                                actions={[
                                                    <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => openExamViewModal(e)}>Xem đề</Button>,
                                                    <Popconfirm title="Xóa đề thi này?" onConfirm={() => handleDeleteExam(e.id)}>
                                                        <Button size="small" danger>Xóa</Button>
                                                    </Popconfirm>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    title={`Đề thi: ${structureName}`}
                                                    description={`Ngày tạo: ${new Date(e.createdAt).toLocaleString()}`}
                                                />
                                            </List.Item>
                                        );
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Tabs.TabPane>
            </Tabs>

            {/* CÁC MODALS DÙNG CHUNG */}
            <Modal title={editingBlock ? "Sửa khối kiến thức" : "Thêm khối"} open={isBlockModalOpen} visible={isBlockModalOpen} onCancel={() => setIsBlockModalOpen(false)} footer={null}>
                <Form form={blockForm} layout="vertical" onFinish={handleSaveBlock}>
                    <Form.Item name="name" label="Tên khối" rules={[{ required: true }]}><Input /></Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setIsBlockModalOpen(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu</Button>
                    </Space>
                </Form>
            </Modal>

            <Modal title={editingSubject ? "Sửa môn học" : "Thêm môn"} open={isSubjectModalOpen} visible={isSubjectModalOpen} onCancel={() => setIsSubjectModalOpen(false)} footer={null}>
                <Form form={subjectForm} layout="vertical" onFinish={handleSaveSubject} initialValues={{ credits: 3 }}>
                    <Form.Item name="code" label="Mã môn" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="credits" label="Tín chỉ" rules={[{ required: true }]}><Input type="number" min={1}/></Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setIsSubjectModalOpen(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu</Button>
                    </Space>
                </Form>
            </Modal>

            <Modal title={editingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi"} open={isQuestionModalOpen} visible={isQuestionModalOpen} onCancel={() => setIsQuestionModalOpen(false)} footer={null} width={600}>
                <Form form={questionForm} layout="vertical" onFinish={handleSaveQuestion}>
                    <Space align="start" style={{ display: 'flex' }}>
                        <Form.Item name="code" label="Mã câu" rules={[{ required: true }]} style={{ width: 120 }}><Input /></Form.Item>
                        <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Select>{subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
                        </Form.Item>
                    </Space>
                    <Space align="start" style={{ display: 'flex' }}>
                        <Form.Item name="knowledgeId" label="Khối kiến thức" rules={[{ required: true }]} style={{ flex: 1 }}>
                            <Select>{blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}</Select>
                        </Form.Item>
                        <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true }]} style={{ width: 150 }}>
                            <Select>{(['Dễ', 'Trung bình', 'Khó', 'Rất khó'] as Difficulty[]).map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}</Select>
                        </Form.Item>
                    </Space>
                    <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setIsQuestionModalOpen(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu</Button>
                    </Space>
                </Form>
            </Modal>

            {/* MODAL CẤU TRÚC ĐỀ THI */}
            <Modal title={editingStructure ? "Sửa cấu trúc" : "Tạo cấu trúc mới"} open={isStructureModalOpen} visible={isStructureModalOpen} onCancel={() => setIsStructureModalOpen(false)} footer={null} width={650}>
                <Form form={structureForm} layout="vertical" onFinish={handleSaveStructure}>
                    <Space align="start" style={{ display: 'flex' }}>
                        <Form.Item name="name" label="Tên cấu trúc" rules={[{ required: true }]} style={{ flex: 1 }}><Input placeholder="VD: Đề thi Giữa kỳ..."/></Form.Item>
                        <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]} style={{ width: 200 }}>
                            <Select>{subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
                        </Form.Item>
                    </Space>
                    <div style={{ padding: '12px', background: '#fafafa', borderRadius: '8px', marginBottom: '16px' }}>
                        <Typography.Text strong>Cấu hình câu hỏi:</Typography.Text>
                        <Form.List name="requirements">
                            {(fields, { add, remove }) => (
                                <div style={{ marginTop: 12 }}>
                                    {fields.map(field => (
                                        <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                            <Form.Item {...field} name={[field.name, 'difficulty']} rules={[{ required: true, message: 'Chọn' }]}>
                                                <Select style={{ width: 120 }} placeholder="Mức độ">
                                                    {(['Dễ', 'Trung bình', 'Khó', 'Rất khó'] as Difficulty[]).map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...field} name={[field.name, 'knowledgeId']} rules={[{ required: true, message: 'Chọn' }]}>
                                                <Select style={{ width: 150 }} placeholder="Khối kiến thức">
                                                    {blocks.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...field} name={[field.name, 'count']} rules={[{ required: true, message: 'Nhập' }]}>
                                                <Input type="number" min={1} placeholder="Số câu" style={{ width: 80 }} />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'red', cursor: 'pointer' }} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm cấu hình</Button>
                                </div>
                            )}
                        </Form.List>
                    </div>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setIsStructureModalOpen(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu lại</Button>
                    </Space>
                </Form>
            </Modal>

            {/* MODAL XEM CHI TIẾT ĐỀ THI */}
            <Modal 
                title={`Chi tiết đề thi: ${viewingExam ? (structures.find(s => s.id === viewingExam.structureId)?.name || '') : ''}`} 
                open={isExamViewModalOpen} 
                visible={isExamViewModalOpen} 
                onCancel={() => setIsExamViewModalOpen(false)} 
                footer={[<Button key="close" type="primary" onClick={() => setIsExamViewModalOpen(false)}>Đóng</Button>]}
                width={700}
            >
                {viewingExam && (
                    <List
                        dataSource={viewingExam.questions}
                        renderItem={(q, index) => (
                            <List.Item style={{ display: 'block', padding: '12px 0' }}>
                                <Typography.Text strong>Câu {index + 1} ({q.code}): </Typography.Text> 
                                {q.content}
                                <div style={{ marginTop: 8 }}>
                                    <Tag color="blue">{q.difficulty}</Tag>
                                    <Tag color="cyan">{blocks.find(b => b.id === q.knowledgeId)?.name}</Tag>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>
        </Card>
    );
};

export default QuestionBankPage;