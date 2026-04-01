import { useState, useEffect } from 'react';
import type { TravelApp as Typing } from '@/pages/TravelApp/typing';
import moment from 'moment';

const LS_KEY = 'travel_app_data';

export default () => {
    const [destinations, setDestinations] = useState<Typing.Destination[]>([]);
    const [schedules, setSchedules] = useState<Typing.Schedule[]>([]);
    const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
    const [budgetLimit, setBudgetLimit] = useState<number>(10000000); // 10 million default

    // Initialize from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setDestinations(parsed.destinations || []);
            setSchedules(parsed.schedules || []);
            setActiveScheduleId(parsed.activeScheduleId || null);
            if (parsed.budgetLimit) setBudgetLimit(parsed.budgetLimit);
        } else {
            // Mock Data
            const initialDestinations: Typing.Destination[] = [
                {
                    id: '1',
                    name: 'Vịnh Hạ Long',
                    type: 'Biển',
                    priceLevel: 'Cao',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80',
                    description: 'Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi tuyệt đẹp.',
                    visitTimeHours: 6,
                    costFood: 500000,
                    costStay: 1200000,
                    costTravel: 300000,
                    createdAt: moment().subtract(2, 'days').toISOString()
                },
                {
                    id: '2',
                    name: 'Sapa',
                    type: 'Núi',
                    priceLevel: 'Trung bình',
                    rating: 4.5,
                    image: 'https://images.unsplash.com/photo-1629853316668-3f59fa0f75e2?auto=format&fit=crop&q=80',
                    description: 'Thị trấn mờ sương với cảnh ruộng bậc thang thơ mộng.',
                    visitTimeHours: 48,
                    costFood: 400000,
                    costStay: 800000,
                    costTravel: 500000,
                    createdAt: moment().subtract(5, 'days').toISOString()
                },
                {
                    id: '3',
                    name: 'Hội An',
                    type: 'Thành phố',
                    priceLevel: 'Trung bình',
                    rating: 4.8,
                    image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80',
                    description: 'Phố cổ cổ kính với những đêm hoa đăng lung linh.',
                    visitTimeHours: 24,
                    costFood: 300000,
                    costStay: 600000,
                    costTravel: 200000,
                    createdAt: moment().subtract(1, 'month').toISOString()
                },
            ];

            const initialSchedules: Typing.Schedule[] = [
                {
                    id: 's1',
                    name: 'Kỳ nghỉ 3 ngày Sapa',
                    startDate: moment().add(7, 'days').toISOString(),
                    daysCount: 3,
                    items: [
                        { id: 'i1', destinationId: '2', day: 1, order: 0 }
                    ],
                    createdAt: moment().toISOString()
                }
            ];

            setDestinations(initialDestinations);
            setSchedules(initialSchedules);
            setActiveScheduleId('s1');
            saveToLS({ destinations: initialDestinations, schedules: initialSchedules, activeScheduleId: 's1', budgetLimit: 10000000 });
        }
    }, []);

    const saveToLS = (data: any) => {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    };

    const updateState = (newState: any) => {
        const fullState = { destinations, schedules, activeScheduleId, budgetLimit, ...newState };
        saveToLS(fullState);
    };

    // Budget Operations
    const handleSetBudgetLimit = (limit: number) => {
        setBudgetLimit(limit);
        updateState({ budgetLimit: limit });
    };

    // Destination Operations
    const addDestination = (dest: Typing.Destination) => {
        const newList = [dest, ...destinations];
        setDestinations(newList);
        updateState({ destinations: newList });
        return { success: true };
    };

    const updateDestination = (dest: Typing.Destination) => {
        const newList = destinations.map(d => d.id === dest.id ? dest : d);
        setDestinations(newList);
        updateState({ destinations: newList });
        return { success: true };
    };

    const deleteDestination = (id: string) => {
        const newList = destinations.filter(d => d.id !== id);
        setDestinations(newList);
        // Clean up any items in schedules that use this destination
        const newSchedules = schedules.map(s => ({
            ...s,
            items: s.items.filter(i => i.destinationId !== id)
        }));
        setSchedules(newSchedules);
        updateState({ destinations: newList, schedules: newSchedules });
    };

    // Schedule Operations
    const createSchedule = (name: string, daysCount: number, startDate: string) => {
        const newSchedule: Typing.Schedule = {
            id: Date.now().toString(),
            name,
            daysCount,
            startDate,
            items: [],
            createdAt: moment().toISOString()
        };
        const newList = [newSchedule, ...schedules];
        setSchedules(newList);
        setActiveScheduleId(newSchedule.id);
        updateState({ schedules: newList, activeScheduleId: newSchedule.id });
    };

    const setAsActiveSchedule = (id: string) => {
        setActiveScheduleId(id);
        updateState({ activeScheduleId: id });
    };

    const addDestinationToSchedule = (scheduleId: string, destinationId: string, day: number) => {
        const schedule = schedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        const dayItems = schedule.items.filter(i => i.day === day);
        const newItem: Typing.ScheduleItem = {
            id: Date.now().toString(),
            destinationId,
            day,
            order: dayItems.length
        };

        const updatedSchedule = { ...schedule, items: [...schedule.items, newItem] };
        const newList = schedules.map(s => s.id === scheduleId ? updatedSchedule : s);
        setSchedules(newList);
        updateState({ schedules: newList });
    };

    const removeDestinationFromSchedule = (scheduleId: string, itemId: string) => {
        const schedule = schedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        const updatedSchedule = { 
            ...schedule, 
            items: schedule.items.filter(i => i.id !== itemId).map((item, index) => {
                // simple reorder
                return item; 
            }) 
        };
        const newList = schedules.map(s => s.id === scheduleId ? updatedSchedule : s);
        setSchedules(newList);
        updateState({ schedules: newList });
    };

    // Calculate budget for active schedule
    const getActiveScheduleBudget = () => {
        let budget = { food: 0, stay: 0, travel: 0, total: 0 };
        const active = schedules.find(s => s.id === activeScheduleId);
        if (!active) return budget;

        active.items.forEach(item => {
            const dest = destinations.find(d => d.id === item.destinationId);
            if (dest) {
                budget.food += dest.costFood;
                budget.stay += dest.costStay;
                budget.travel += dest.costTravel;
                budget.total += (dest.costFood + dest.costStay + dest.costTravel);
            }
        });

        return budget;
    };

    return {
        destinations,
        schedules,
        activeScheduleId,
        budgetLimit,
        handleSetBudgetLimit,
        addDestination,
        updateDestination,
        deleteDestination,
        createSchedule,
        setAsActiveSchedule,
        addDestinationToSchedule,
        removeDestinationFromSchedule,
        getActiveScheduleBudget
    };
};
