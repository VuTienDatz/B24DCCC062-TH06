export declare namespace TravelApp {
    export interface Destination {
        id: string;
        name: string;
        type: 'Biển' | 'Núi' | 'Thành phố' | 'Khác';
        priceLevel: 'Thấp' | 'Trung bình' | 'Cao';
        rating: number; // 1 to 5
        image: string;
        description: string;
        visitTimeHours: number; // thời gian tham quan (giờ)
        costFood: number; // mức chi cho ăn uống
        costStay: number; // mức chi cho lưu trú
        costTravel: number; // mức chi cho di chuyển
        createdAt: string; // ISO date string
    }

    export interface ScheduleItem {
        id: string;
        destinationId: string;
        day: number; // 1, 2, 3...
        order: number; // 0, 1, 2... in that day
    }

    export interface Schedule {
        id: string;
        name: string;
        startDate: string; // ISO date
        daysCount: number; // Number of days in trip
        items: ScheduleItem[];
        createdAt: string; // ISO date
    }

    export interface BudgetInfo {
        food: number;
        stay: number;
        travel: number;
        total: number;
    }
}
