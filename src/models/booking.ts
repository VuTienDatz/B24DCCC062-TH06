import { useState, useEffect } from 'react';
import type { BookingApp as Typing } from '@/pages/BookingApp/typing';

const LS_KEY = 'booking_app_data';

export default () => {
    const [employees, setEmployees] = useState<Typing.Employee[]>([]);
    const [services, setServices] = useState<Typing.Service[]>([]);
    const [appointments, setAppointments] = useState<Typing.Appointment[]>([]);
    const [reviews, setReviews] = useState<Typing.Review[]>([]);

    // Initialize from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setEmployees(parsed.employees || []);
            setServices(parsed.services || []);
            setAppointments(parsed.appointments || []);
            setReviews(parsed.reviews || []);
        } else {
            // Mock Data
            const initialServices: Typing.Service[] = [
                { id: '1', name: 'Cắt tóc nam (Combo 7 bước)', price: 100000, duration: 30 },
                { id: '2', name: 'Gội đầu dưỡng sinh', price: 150000, duration: 45 },
                { id: '3', name: 'Nhuộm tóc thời trang', price: 500000, duration: 90 },
                { id: '4', name: 'Massage mặt & Đắp mặt nạ', price: 200000, duration: 40 },
                { id: '5', name: 'Uốn tóc kiểu Hàn Quốc', price: 600000, duration: 120 },
            ];

            const initialEmployees: Typing.Employee[] = [
                { 
                    id: '1', 
                    name: 'Nguyễn Văn A', 
                    maxSlots: 10, 
                    averageRating: 4.8,
                    schedule: [
                        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
                        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00' },
                        { dayOfWeek: 5, startTime: '08:00', endTime: '18:00' }
                    ] 
                },
                { 
                    id: '2', 
                    name: 'Trần Thị B', 
                    maxSlots: 8, 
                    averageRating: 4.5,
                    schedule: [
                        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
                    ] 
                },
                { 
                    id: '3', 
                    name: 'Lê Văn C (Master)', 
                    maxSlots: 5, 
                    averageRating: 5.0,
                    schedule: [
                        { dayOfWeek: 1, startTime: '13:00', endTime: '21:00' },
                        { dayOfWeek: 2, startTime: '13:00', endTime: '21:00' },
                        { dayOfWeek: 0, startTime: '09:00', endTime: '18:00' }
                    ] 
                },
            ];

            const initialAppointments: Typing.Appointment[] = [
                {
                    id: 'a1',
                    customerName: 'Anh Tuấn',
                    serviceId: '1',
                    employeeId: '1',
                    date: '2026-03-12',
                    time: '09:00',
                    status: 'Confirmed',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'a2',
                    customerName: 'Chị Lan',
                    serviceId: '2',
                    employeeId: '2',
                    date: '2026-03-12',
                    time: '14:30',
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'a3',
                    customerName: 'Minh Hoàng',
                    serviceId: '3',
                    employeeId: '3',
                    date: '2026-03-11',
                    time: '13:00',
                    status: 'Completed',
                    createdAt: new Date().toISOString()
                }
            ];

            const initialReviews: Typing.Review[] = [
                {
                    id: 'r1',
                    appointmentId: 'a3',
                    employeeId: '3',
                    rating: 5,
                    comment: 'Dịch vụ rất tốt, anh C làm rất kỹ và đẹp. Sẽ quay lại!',
                    customerName: 'Minh Hoàng',
                    createdAt: '2026-03-11T15:00:00.000Z',
                    response: '<p>Cảm ơn bạn Hoàng đã tin tưởng! Hẹn gặp lại bạn lần sau.</p>'
                }
            ];

            setServices(initialServices);
            setEmployees(initialEmployees);
            setAppointments(initialAppointments);
            setReviews(initialReviews);
            saveToLS({ 
                employees: initialEmployees, 
                services: initialServices, 
                appointments: initialAppointments, 
                reviews: initialReviews 
            });
        }
    }, []);

    const saveToLS = (data: any) => {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    };

    const updateState = (newState: any) => {
        const fullState = { employees, services, appointments, reviews, ...newState };
        saveToLS(fullState);
    };

    const addEmployee = (emp: Typing.Employee) => {
        const newList = [...employees, emp];
        setEmployees(newList);
        updateState({ employees: newList });
    };

    const editEmployee = (emp: Typing.Employee) => {
        const newList = employees.map(e => e.id === emp.id ? emp : e);
        setEmployees(newList);
        updateState({ employees: newList });
    };

    const deleteEmployee = (id: string) => {
        const newList = employees.filter(e => e.id !== id);
        setEmployees(newList);
        updateState({ employees: newList });
    };

    const addService = (srv: Typing.Service) => {
        const newList = [...services, srv];
        setServices(newList);
        updateState({ services: newList });
    };

    const editService = (srv: Typing.Service) => {
        const newList = services.map(s => s.id === srv.id ? srv : s);
        setServices(newList);
        updateState({ services: newList });
    };

    const deleteService = (id: string) => {
        const newList = services.filter(s => s.id !== id);
        setServices(newList);
        updateState({ services: newList });
    };

    const bookAppointment = (app: Typing.Appointment) => {
        const newList = [...appointments, app];
        setAppointments(newList);
        updateState({ appointments: newList });
    };

    const updateAppointmentStatus = (id: string, status: Typing.Appointment['status']) => {
        const newList = appointments.map(a => a.id === id ? { ...a, status } : a);
        setAppointments(newList);
        updateState({ appointments: newList });
    };

    const addReview = (review: Typing.Review) => {
        const newList = [...reviews, review];
        setReviews(newList);
        // Update employee average rating
        const empReviews = newList.filter(r => r.employeeId === review.employeeId);
        const avg = empReviews.reduce((acc, r) => acc + r.rating, 0) / empReviews.length;
        const newEmps = employees.map(e => e.id === review.employeeId ? { ...e, averageRating: avg } : e);
        setEmployees(newEmps);
        updateState({ reviews: newList, employees: newEmps });
    };

    const replyReview = (reviewId: string, response: string) => {
        const newList = reviews.map(r => r.id === reviewId ? { ...r, response } : r);
        setReviews(newList);
        updateState({ reviews: newList });
    };

    return {
        employees,
        services,
        appointments,
        reviews,
        addEmployee,
        editEmployee,
        deleteEmployee,
        addService,
        editService,
        deleteService,
        bookAppointment,
        updateAppointmentStatus,
        addReview,
        replyReview
    };
};
