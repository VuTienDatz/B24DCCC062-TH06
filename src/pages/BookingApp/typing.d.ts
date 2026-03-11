export namespace BookingApp {
	export interface Employee {
		id: string;
		name: string;
		maxSlots: number;
		schedule: WorkSchedule[];
		averageRating?: number;
	}

	export interface WorkSchedule {
		dayOfWeek: number; // 0-6 (Sunday-Saturday)
		startTime: string; // HH:mm
		endTime: string; // HH:mm
	}

	export interface Service {
		id: string;
		name: string;
		price: number;
		duration: number; // in minutes
	}

	export interface Appointment {
		id: string;
		customerName: string;
		serviceId: string;
		employeeId: string;
		date: string; // YYYY-MM-DD
		time: string; // HH:mm
		status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
		createdAt: string;
	}

	export interface Review {
		id: string;
		appointmentId: string;
		employeeId: string;
		rating: number; // 1-5
		comment: string;
		response?: string;
		customerName: string;
		createdAt: string;
	}
}
