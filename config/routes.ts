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
	{
		path: '/diploma-management',
		name: 'Quản lý Văn bằng',
		icon: 'SolutionOutlined',
		routes: [
			{
				path: '/diploma-management/books',
				name: 'Quản lý Sổ văn bằng',
				component: './DiplomaManagement/Books',
				icon: 'BookOutlined',
			},
			{
				path: '/diploma-management/decisions',
				name: 'Quyết định tốt nghiệp',
				component: './DiplomaManagement/Decisions',
				icon: 'FileDoneOutlined',
			},
			{
				path: '/diploma-management/configuration',
				name: 'Cấu hình biểu mẫu',
				component: './DiplomaManagement/Configuration',
				icon: 'SettingOutlined',
			},
			{
				path: '/diploma-management/diplomas',
				name: 'Thông tin văn bằng',
				component: './DiplomaManagement/Diplomas',
				icon: 'AuditOutlined',
			},
			{
				path: '/diploma-management/search',
				name: 'Tra cứu văn bằng',
				component: './DiplomaManagement/Search',
				icon: 'SearchOutlined',
			},
		],
	},
	{
		path: '/club-management',
		name: 'Quản lý Câu lạc bộ',
		icon: 'ContactsOutlined',
		routes: [
			{
				path: '/club-management/clubs',
				name: 'Danh sách CLB',
				component: './ClubManagement/Clubs',
				icon: 'UnorderedListOutlined',
			},
			{
				path: '/club-management/registrations',
				name: 'Đơn đăng ký',
				component: './ClubManagement/Registrations',
				icon: 'FormOutlined',
			},
			{
				path: '/club-management/members',
				name: 'Thành viên CLB',
				component: './ClubManagement/Members',
				icon: 'UserOutlined',
			},
			{
				path: '/club-management/statistics',
				name: 'Báo cáo thống kê',
				component: './ClubManagement/Statistics',
				icon: 'BarChartOutlined',
			},
		],
	},

	// TRAVEL APP
	{
		path: '/travel-app',
		name: 'Kế hoạch Du lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/travel-app/explore',
				name: 'Khám phá Tọa độ',
				component: './TravelApp/Explore',
				icon: 'EnvironmentOutlined',
			},
			{
				path: '/travel-app/planner',
				name: 'Lập lịch trình',
				component: './TravelApp/Planner',
				icon: 'CalendarOutlined',
			},
			{
				path: '/travel-app/budget',
				name: 'Quản lý ngân sách',
				component: './TravelApp/Budget',
				icon: 'WalletOutlined',
			},
			{
				path: '/travel-app/admin-destinations',
				name: 'Quản lý điểm đến (Admin)',
				component: './TravelApp/AdminDestinations',
				icon: 'SettingOutlined',
			},
			{
				path: '/travel-app/admin-stats',
				name: 'Thống kê (Admin)',
				component: './TravelApp/AdminStats',
				icon: 'BarChartOutlined',
			},
		],
	},
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
