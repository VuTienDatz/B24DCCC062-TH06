import { Button, Card, List, Space, Statistic, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

type GameRecord = {
	id: string;
	playerChoice: Choice;
	computerChoice: Choice;
	result: Result;
};

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

const getChoiceEmoji = (choice: Choice): string => {
	switch (choice) {
		case 'Kéo':
			return '✋';
		case 'Búa':
			return '✊';
		case 'Bao':
			return '✌️';
	}
};

const determineWinner = (player: Choice, computer: Choice): Result => {
	if (player === computer) return 'Hòa';
	if (
		(player === 'Kéo' && computer === 'Bao') ||
		(player === 'Búa' && computer === 'Kéo') ||
		(player === 'Bao' && computer === 'Búa')
	) {
		return 'Thắng';
	}
	return 'Thua';
};

const OanTuTiPage: React.FC = () => {
	const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);

	const pageTitle = useMemo(() => 'Oẳn Tù Tì', []);

	const gameStats = useMemo(() => {
		return {
			wins: gameHistory.filter((h) => h.result === 'Thắng').length,
			losses: gameHistory.filter((h) => h.result === 'Thua').length,
			draws: gameHistory.filter((h) => h.result === 'Hòa').length,
		};
	}, [gameHistory]);

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

	const handleResetGame = () => {
		setGameHistory([]);
	};

	return (
		<Card title={pageTitle}>
			<Space direction='vertical' style={{ width: '100%' }} size={16}>
				<Typography.Paragraph>
					<b>Luật chơi:</b> Kéo thắng Bao, Búa thắng Kéo, Bao thắng Búa. Chọn lựa chọn của bạn và máy tính sẽ chọn
					ngẫu nhiên.
				</Typography.Paragraph>

				{/* Lựa chọn */}
				<Card size='small' title='Lựa chọn của bạn'>
					<Space>
						{choices.map((choice) => (
							<Button key={choice} type='primary' size='large' onClick={() => handlePlay(choice)}>
								{getChoiceEmoji(choice)} {choice}
							</Button>
						))}
					</Space>
				</Card>

				{/* Thống kê trò chơi */}
				<Card size='small' title='Thống kê trò chơi'>
					<Space size='large'>
						<Statistic title='Thắng' value={gameStats.wins} valueStyle={{ color: '#52c41a' }} />
						<Statistic title='Thua' value={gameStats.losses} valueStyle={{ color: '#ff4d4f' }} />
						<Statistic title='Hòa' value={gameStats.draws} valueStyle={{ color: '#1890ff' }} />
					</Space>
				</Card>

				{/* Lịch sử trò chơi */}
				<Card size='small' title='Lịch sử trò chơi'>
					{gameHistory.length === 0 ? (
						<Typography.Text type='secondary'>Chưa có ván đấu nào.</Typography.Text>
					) : (
						<List
							dataSource={gameHistory}
							renderItem={(record) => (
								<List.Item>
									<Space>
										<Typography.Text>
											Bạn: <b>{getChoiceEmoji(record.playerChoice)} {record.playerChoice}</b>
										</Typography.Text>
										<Typography.Text> vs </Typography.Text>
										<Typography.Text>
											Máy: <b>{getChoiceEmoji(record.computerChoice)} {record.computerChoice}</b>
										</Typography.Text>
										<Typography.Text>
											<b
												style={{
													color:
														record.result === 'Thắng'
															? '#52c41a'
															: record.result === 'Thua'
																? '#ff4d4f'
																: '#1890ff',
												}}
											>
												{record.result}
											</b>
										</Typography.Text>
									</Space>
								</List.Item>
							)}
						/>
					)}
				</Card>

				{/* Nút reset */}
				{gameHistory.length > 0 && (
					<Button danger onClick={handleResetGame} block>
						Reset trò chơi
					</Button>
				)}
			</Space>
		</Card>
	);
};

export default OanTuTiPage;


