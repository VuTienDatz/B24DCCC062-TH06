export namespace ClubManagement {
    export interface Club {
        id: string;
        avatar?: string;
        name: string;
        foundedDate: string;
        description: string; // HTML
        manager: string;
        isActive: boolean;
    }

    export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

    export interface RegistrationHistory {
        id: string;
        action: RegistrationStatus;
        timestamp: string;
        note?: string;
        actor: string;
    }

    export interface Registration {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        gender: 'Male' | 'Female' | 'Other';
        address: string;
        talent: string;
        clubId: string;
        reason: string;
        timestamp: string;
        status: RegistrationStatus;
        rejectReason?: string;
        history: RegistrationHistory[];
        note?: string;
    }

    export interface SummaryStats {
        totalClubs: number;
        pendingRegistrations: number;
        approvedRegistrations: number;
        rejectedRegistrations: number;
    }
}
