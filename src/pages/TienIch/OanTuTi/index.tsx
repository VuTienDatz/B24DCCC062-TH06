import { Button, Card, List, Space, Statistic, Typography, Row, Col, Tag } from 'antd';
import React, { useMemo, useState } from 'react';

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

type GameRecord = {
    id: string;
    playerChoice: Choice;
    computerChoice: Choice;
    result: Result;
};

const choices: Choice[] = ['Búa', 'Kéo', 'Bao'];

const getChoiceEmoji = (choice: Choice): string => {
    switch (choice) {
        case 'Búa': return '✊';
        case 'Kéo': return '✌️';
        case 'Bao': return '✋';
        default: return '';
    }
};

const OanTuTiPage: React.FC = () => {
    const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);

    // Lấy ván đấu vừa mới chơi xong
    const lastGame = gameHistory[0];

    const gameStats = useMemo(() => ({
        wins: gameHistory.filter((h) => h.result === 'Thắng').length,
        losses: gameHistory.filter((h) => h.result === 'Thua').length,
        draws: gameHistory.filter((h) => h.result === 'Hòa').length,
    }), [gameHistory]);

    const determineWinner = (player: Choice, computer: Choice): Result => {
        if (player === computer) return 'Hòa';
        if (
            (player === 'Kéo' && computer === 'Bao') ||
            (player === 'Búa' && computer === 'Kéo') ||
            (player === 'Bao' && computer === 'Búa')
        ) return 'Thắng';
        return 'Thua';
    };

    const handlePlay = (playerChoice: Choice) => {
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        const result = determineWinner(playerChoice, computerChoice);
        const newRecord: GameRecord = {
            id: Date.now().toString(),
            playerChoice,
            computerChoice,
            result,
        };
        setGameHistory([newRecord, ...gameHistory]);
    };

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
            <Card 
                title={<Typography.Title level={3} style={{ textAlign: 'center', margin: 0 }}>🎮 Oẳn Tù Tì</Typography.Title>}
                style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Space direction='vertical' style={{ width: '100%' }} size={24}>
                    
                    {/* KHU VỰC HIỂN THỊ KẾT QUẢ TỨ THÌ (BATTLEFIELD) */}
                    <div style={{ 
                        background: '#fafafa', 
                        padding: '20px', 
                        borderRadius: 12, 
                        border: '1px dashed #d9d9d9',
                        textAlign: 'center',
                        minHeight: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {!lastGame ? (
                            <Typography.Text type="secondary" italic>Chọn một món để bắt đầu cuộc đấu!</Typography.Text>
                        ) : (
                            <Row gutter={16} align="middle" style={{ width: '100%' }}>
                                <Col span={9}>
                                    <div style={{ fontSize: 40 }}>{getChoiceEmoji(lastGame.playerChoice)}</div>
                                    <Typography.Text strong>Bạn</Typography.Text>
                                </Col>
                                <Col span={6}>
                                    <Typography.Title level={4} style={{ 
                                        margin: 0, 
                                        color: lastGame.result === 'Thắng' ? '#52c41a' : lastGame.result === 'Thua' ? '#ff4d4f' : '#1890ff' 
                                    }}>
                                        {lastGame.result}
                                    </Typography.Title>
                                    <Typography.Text type="secondary">vs</Typography.Text>
                                </Col>
                                <Col span={9}>
                                    <div style={{ fontSize: 40 }}>{getChoiceEmoji(lastGame.computerChoice)}</div>
                                    <Typography.Text strong>Máy</Typography.Text>
                                </Col>
                            </Row>
                        )}
                    </div>

                    {/* Lựa chọn của người chơi */}
                    <div style={{ textAlign: 'center' }}>
                        <Typography.Paragraph strong>Lựa chọn của bạn:</Typography.Paragraph>
                        <Row justify="center" gutter={16}>
                            {choices.map((choice) => (
                                <Col key={choice}>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        style={{ height: 'auto', padding: '12px 20px', borderRadius: 8 }}
                                        onClick={() => handlePlay(choice)}
                                    >
                                        <div style={{ fontSize: 20 }}>{getChoiceEmoji(choice)}</div>
                                        {choice}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Thống kê tổng quát */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic 
                                title='Thắng' 
                                value={gameStats.wins} 
                                valueStyle={{ color: '#52c41a', textAlign: 'center' }} 
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title='Hòa' 
                                value={gameStats.draws} 
                                valueStyle={{ color: '#1890ff', textAlign: 'center' }} 
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title='Thua' 
                                value={gameStats.losses} 
                                valueStyle={{ color: '#ff4d4f', textAlign: 'center' }} 
                            />
                        </Col>
                    </Row>

                    {/* Lịch sử rút gọn */}
                    <Card size='small' title='Lịch sử 5 ván gần nhất'>
                        <List
                            size="small"
                            dataSource={gameHistory.slice(0, 5)}
                            renderItem={(record) => (
                                <List.Item style={{ padding: '8px 4px' }}>
                                    <Typography.Text>
                                        Bạn {getChoiceEmoji(record.playerChoice)} - Máy {getChoiceEmoji(record.computerChoice)}
                                    </Typography.Text>
                                    <Tag color={record.result === 'Thắng' ? 'success' : record.result === 'Thua' ? 'error' : 'processing'}>
                                        {record.result}
                                    </Tag>
                                </List.Item>
                            )}
                            locale={{ emptyText: 'Chưa có dữ liệu' }}
                        />
                    </Card>

                    {gameHistory.length > 0 && (
                        <Button danger onClick={() => setGameHistory([])} block ghost style={{ border: 'none' }}>
                            Làm mới trò chơi
                        </Button>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default OanTuTiPage;