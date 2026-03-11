export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/booking-app',
		name: 'Quản lý Đặt lịch',
		icon: 'ScheduleOutlined',
		routes: [
			{
				path: '/booking-app/dashboard',
				name: 'Thống kê & Báo cáo',
				component: './BookingApp/Dashboard',
				icon: 'BarChartOutlined',
			},
			{
				path: '/booking-app/employee',
				name: 'Quản lý Nhân viên',
				component: './BookingApp/Employee',
				icon: 'TeamOutlined',
			},
			{
				path: '/booking-app/service',
				name: 'Quản lý Dịch vụ',
				component: './BookingApp/Service',
				icon: 'ToolOutlined',
			},
			{
				path: '/booking-app/appointment',
				name: 'Quản lý Lịch hẹn',
				component: './BookingApp/Appointment',
				icon: 'CalendarOutlined',
			},
			{
				path: '/booking-app/review',
				name: 'Đánh giá & Phản hồi',
				component: './BookingApp/Review',
				icon: 'StarOutlined',
			},
		],
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
