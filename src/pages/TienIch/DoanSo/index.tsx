import { Alert, Button, Card, InputNumber, List, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

// Kết quả của một lần đoán
type GuessResult = 'low' | 'high' | 'correct';

// Một bản ghi trong lịch sử đoán
type GuessItem = {
	value: number;
	result: GuessResult;
};

// Cấu hình game
const MAX_TURNS = 10; // Số lượt đoán tối đa
const MIN_VALUE = 1; // Giá trị nhỏ nhất
const MAX_VALUE = 100; // Giá trị lớn nhất

// Hàm sinh số nguyên ngẫu nhiên trong đoạn [min, max]
function randomIntInclusive(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Component chính của trò chơi đoán số
const GuessNumberPage: React.FC = () => {
	const [secret, setSecret] = useState<number>(() => randomIntInclusive(MIN_VALUE, MAX_VALUE));
	const [turn, setTurn] = useState<number>(0);
	const [guess, setGuess] = useState<number | null>(null);
	const [history, setHistory] = useState<GuessItem[]>([]);
	const [statusText, setStatusText] = useState<string>('Hãy nhập số từ 1 đến 100 và bấm "Đoán".');
	const [statusType, setStatusType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

	const turnsLeft = MAX_TURNS - turn;
	const isWin = history[history.length - 1]?.result === 'correct';
	const isLose = !isWin && turnsLeft === 0;
	const isGameOver = isWin || isLose;

	const title = useMemo(() => {
		return `Trò chơi đoán số (${MIN_VALUE}–${MAX_VALUE})`;
	}, []);

	// Hàm bắt đầu lại trò chơi: sinh số mới và reset toàn bộ state
	const reset = () => {
		setSecret(randomIntInclusive(MIN_VALUE, MAX_VALUE));
		setTurn(0);
		setGuess(null);
		setHistory([]);
		setStatusText('Bắt đầu lượt chơi mới! Hãy nhập số từ 1 đến 100.');
		setStatusType('info');
	};

	// Hàm xử lý khi người chơi bấm nút "Đoán"
	const submitGuess = () => {
		// Nếu game đã kết thúc thì không cho đoán tiếp
		if (isGameOver) return;

		// Kiểm tra người chơi đã nhập số hợp lệ chưa
		if (guess == null || Number.isNaN(guess)) {
			setStatusText('Vui lòng nhập một số hợp lệ.');
			setStatusType('warning');
			return;
		}
		// Kiểm tra số nhập có nằm trong đoạn yêu cầu hay không
		if (guess < MIN_VALUE || guess > MAX_VALUE) {
			setStatusText(`Số phải nằm trong khoảng ${MIN_VALUE} đến ${MAX_VALUE}.`);
			setStatusType('warning');
			return;
		}

		// Tăng lượt chơi lên 1
		const nextTurn = turn + 1;
		let result: GuessResult;
		let nextStatusText = '';
		let nextStatusType: 'info' | 'success' | 'warning' | 'error' = 'info';

		// So sánh số đoán với số bí mật để đưa ra gợi ý
		if (guess < secret) {
			result = 'low';
			nextStatusText = 'Bạn đoán quá thấp!';
			nextStatusType = 'warning';
		} else if (guess > secret) {
			result = 'high';
			nextStatusText = 'Bạn đoán quá cao!';
			nextStatusType = 'warning';
		} else {
			result = 'correct';
			nextStatusText = 'Chúc mừng! Bạn đã đoán đúng!';
			nextStatusType = 'success';
		}

		// Cập nhật lịch sử đoán và trạng thái giao diện
		const nextHistory = [...history, { value: guess, result }];
		setHistory(nextHistory);
		setTurn(nextTurn);
		setStatusText(nextStatusText);
		setStatusType(nextStatusType);

		const nextTurnsLeft = MAX_TURNS - nextTurn;
		const isNowWin = result === 'correct';
		const isNowLose = !isNowWin && nextTurnsLeft === 0;

		// Nếu đã dùng hết lượt mà vẫn chưa đoán đúng -> thua và hiện số đúng
		if (isNowLose) {
			setStatusText(`Bạn đã hết lượt! Số đúng là ${secret}.`);
			setStatusType('error');
		}
	};

	return (
		<Card title={title}>
			<Space direction='vertical' style={{ width: '100%' }} size={16}>
				{/* Hiển thị thông tin số lượt được dùng và lượt còn lại */}
				<Typography.Paragraph style={{ marginBottom: 0 }}>
					Bạn có <b>{MAX_TURNS}</b> lượt đoán. Lượt còn lại: <b>{turnsLeft}</b>.
				</Typography.Paragraph>

				{/* Hộp thông báo trạng thái sau mỗi lần đoán */}
				<Alert showIcon type={statusType} message={statusText} />

				{/* Khu vực nhập số cần đoán và các nút thao tác */}
				<Space wrap>
					<InputNumber
						min={MIN_VALUE}
						max={MAX_VALUE}
						value={guess ?? undefined}
						onChange={(v) => setGuess(typeof v === 'number' ? v : null)}
						disabled={isGameOver}
						placeholder='Nhập số...'
						style={{ width: 160 }}
					/>
					<Button type='primary' onClick={submitGuess} disabled={isGameOver}>
						Đoán
					</Button>
					<Button onClick={reset}>Chơi lại</Button>
				</Space>

				{/* Bảng lịch sử các lần dự đoán */}
				{history.length > 0 && (
					<Card size='small' title='Lịch sử dự đoán'>
						<List
							size='small'
							dataSource={history}
							renderItem={(item, idx) => {
								const label =
									item.result === 'low'
										? 'Quá thấp'
										: item.result === 'high'
											? 'Quá cao'
											: 'Đúng';
								return (
									<List.Item>
										<Space>
											<Typography.Text strong>#{idx + 1}</Typography.Text>
											<Typography.Text>Số: {item.value}</Typography.Text>
											<Typography.Text type={item.result === 'correct' ? 'success' : 'secondary'}>
												({label})
											</Typography.Text>
										</Space>
									</List.Item>
								);
							}}
						/>
					</Card>
				)}

				{isLose && (
					<Typography.Paragraph style={{ marginBottom: 0 }}>
						<b>Gợi ý:</b> bấm <b>Chơi lại</b> để hệ thống sinh số mới.
					</Typography.Paragraph>
				)}
			</Space>
		</Card>
	);
};

export default GuessNumberPage;


