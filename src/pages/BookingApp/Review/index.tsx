import React, { useState } from 'react';
import { Button, Modal, Rate, Comment, List, Avatar, message, Tag } from 'antd';
import { useModel } from 'umi';
import type { BookingApp as Typing } from '../typing';
import TinyEditor from '@/components/TinyEditor';

const ReviewPage: React.FC = () => {
    const { reviews, employees, replyReview } = useModel('booking');
    const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);
    const [responseContent, setResponseContent] = useState('');

    const handleReply = () => {
        if (!replyingTo) return;
        replyReview(replyingTo, responseContent);
        message.success('Đã gửi phản hồi!');
        setReplyingTo(undefined);
        setResponseContent('');
    };

    return (
        <div style={{ padding: '24px' }}>
            <List
                header={`${reviews.length} đánh giá`}
                itemLayout="horizontal"
                dataSource={reviews}
                renderItem={(item: Typing.Review) => {
                    const employee = employees.find(e => e.id === item.employeeId);
                    return (
                        <Comment
                            key={item.id}
                            author={item.customerName}
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${item.customerName}`} />}
                            content={
                                <div>
                                    <Rate disabled defaultValue={item.rating} />
                                    <p>{item.comment}</p>
                                    <Tag color="cyan">Nhân viên: {employee?.name || 'N/A'}</Tag>
                                    {item.response && (
                                        <div style={{ marginTop: '16px', borderLeft: '3px solid #1890ff', paddingLeft: '12px' }}>
                                            <Comment
                                                author={`Nhân viên ${employee?.name}`}
                                                avatar={<Avatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${employee?.name}`} />}
                                                content={<div dangerouslySetInnerHTML={{ __html: item.response }} />}
                                            />
                                        </div>
                                    )}
                                </div>
                            }
                            actions={[
                                !item.response && (
                                    <Button key="reply" size="small" type="link" onClick={() => setReplyingTo(item.id)}>
                                        Phản hồi
                                    </Button>
                                )
                            ]}
                            datetime={item.createdAt}
                        />
                    );
                }}
            />

            <Modal
                title="Phản hồi đánh giá"
                visible={!!replyingTo}
                onOk={handleReply}
                onCancel={() => setReplyingTo(undefined)}
                width={800}
                destroyOnClose
            >
                <TinyEditor 
                    value={responseContent} 
                    onChange={setResponseContent} 
                    height={300}
                />
            </Modal>
        </div>
    );
};

export default ReviewPage;
