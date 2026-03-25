import { useState, useEffect } from 'react';
import { ClubManagement as Typing } from '@/pages/ClubManagement/typing';

const LS_KEY_CLUBS = 'club_management_clubs';
const LS_KEY_REGISTRATIONS = 'club_management_registrations';

export default () => {
    const [clubs, setClubs] = useState<Typing.Club[]>([]);
    const [registrations, setRegistrations] = useState<Typing.Registration[]>([]);

    useEffect(() => {
        const storedClubs = localStorage.getItem(LS_KEY_CLUBS);
        const storedRegistrations = localStorage.getItem(LS_KEY_REGISTRATIONS);
        
        if (storedClubs) {
            setClubs(JSON.parse(storedClubs));
        } else {
            const initialClubs: Typing.Club[] = [
                {
                    id: 'c1',
                    name: 'CLB Guitar',
                    foundedDate: '2020-01-01',
                    description: '<p>Câu lạc bộ dành cho những người yêu thích tiếng đàn guitar.</p>',
                    manager: 'Nguyễn Văn A',
                    isActive: true,
                },
                {
                    id: 'c2',
                    name: 'CLB Bóng đá',
                    foundedDate: '2021-05-15',
                    description: '<p>Sân chơi cho các tín đồ túc cầu giáo.</p>',
                    manager: 'Trần Văn B',
                    isActive: true,
                }
            ];
            setClubs(initialClubs);
            localStorage.setItem(LS_KEY_CLUBS, JSON.stringify(initialClubs));
        }

        if (storedRegistrations) {
            setRegistrations(JSON.parse(storedRegistrations));
        } else {
            const initialRegistrations: Typing.Registration[] = [
                {
                    id: 'r1',
                    fullName: 'Lê Văn C',
                    email: 'levanc@example.com',
                    phone: '0987654321',
                    gender: 'Male',
                    address: 'Hà Nội',
                    talent: 'Chơi guitar điện',
                    clubId: 'c1',
                    reason: 'Muốn học hỏi thêm',
                    status: 'Pending',
                    history: [],
                    timestamp: new Date().toISOString(),
                },
                {
                    id: 'r2',
                    fullName: 'Nguyễn Thị D',
                    email: 'nthid@example.com',
                    phone: '0123456789',
                    gender: 'Female',
                    address: 'Hải Phòng',
                    talent: 'Hát hay',
                    clubId: 'c1',
                    reason: 'Yêu âm nhạc',
                    status: 'Approved',
                    history: [
                        { id: 'h1', action: 'Approved', timestamp: '10/04/2024 10:00:00', actor: 'Admin', note: 'Hợp lệ' }
                    ],
                    timestamp: new Date().toISOString(),
                }
            ];
            setRegistrations(initialRegistrations);
            localStorage.setItem(LS_KEY_REGISTRATIONS, JSON.stringify(initialRegistrations));
        }
    }, []);

    const saveClubs = (newList: Typing.Club[]) => {
        setClubs(newList);
        localStorage.setItem(LS_KEY_CLUBS, JSON.stringify(newList));
    };

    const saveRegistrations = (newList: Typing.Registration[]) => {
        setRegistrations(newList);
        localStorage.setItem(LS_KEY_REGISTRATIONS, JSON.stringify(newList));
    };

    // Club Operations
    const addOrUpdateClub = (club: Typing.Club) => {
        let newList;
        if (clubs.find(c => c.id === club.id)) {
            newList = clubs.map(c => c.id === club.id ? club : c);
        } else {
            newList = [...clubs, { ...club, id: club.id || `club_${Date.now()}` }];
        }
        saveClubs(newList);
    };

    const deleteClub = (id: string) => {
        saveClubs(clubs.filter(c => c.id !== id));
    };

    // Registration Operations
    const addOrUpdateRegistration = (reg: Typing.Registration) => {
        let newList;
        if (registrations.find(r => r.id === reg.id)) {
            newList = registrations.map(r => r.id === reg.id ? reg : r);
        } else {
            newList = [...registrations, { ...reg, id: reg.id || `reg_${Date.now()}`, timestamp: new Date().toISOString() }];
        }
        saveRegistrations(newList);
    };

    const deleteRegistration = (id: string) => {
        saveRegistrations(registrations.filter(r => r.id !== id));
    };

    const updateRegistrationStatus = (ids: string[], status: Typing.RegistrationStatus, note?: string) => {
        const timestampStr = new Date().toLocaleString('vi-VN');
        const newList = registrations.map(r => {
            if (ids.includes(r.id)) {
                const historyItem: Typing.RegistrationHistory = {
                    id: `h_${Date.now()}_${Math.random()}`,
                    action: status,
                    timestamp: timestampStr,
                    note,
                    actor: 'Admin'
                };
                return {
                    ...r,
                    status,
                    rejectReason: status === 'Rejected' ? note : r.rejectReason,
                    history: [...(r.history || []), historyItem]
                };
            }
            return r;
        });
        saveRegistrations(newList);
    };

    const changeClubForMembers = (memberIds: string[], newClubId: string) => {
        const newList = registrations.map(r => {
            if (memberIds.includes(r.id)) {
                return { ...r, clubId: newClubId };
            }
            return r;
        });
        saveRegistrations(newList);
    };

    return {
        clubs,
        registrations,
        addOrUpdateClub,
        deleteClub,
        addOrUpdateRegistration,
        deleteRegistration,
        updateRegistrationStatus,
        changeClubForMembers,
    };
};
