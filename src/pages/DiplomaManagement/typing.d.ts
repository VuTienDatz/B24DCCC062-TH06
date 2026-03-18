export declare namespace DiplomaManagement {
    export interface FieldConfig {
        id: string;
        name: string;
        type: 'String' | 'Number' | 'Date';
    }

    export interface DiplomaBook {
        id: string;
        year: number;
        currentNumber: number; // Reset to 1 each year, handled by auto-increment logic
    }

    export interface GraduationDecision {
        id: string;
        decisionNumber: string;
        issueDate: string;
        summary: string;
        bookId: string;
        searchCount: number;
    }

    export interface DiplomaInfo {
        id: string;
        entryNumber: number; // Số vào sổ
        diplomaId: string;   // Số hiệu văn bằng
        studentId: string;   // Mã sinh viên
        fullName: string;    // Họ tên
        dob: string;         // Ngày sinh
        decisionId: string;  // Thuộc quyết định nào
        dynamicFields: Record<string, any>; // Các trường cấu hình thêm
    }

    export interface SearchParams {
        diplomaId?: string;
        entryNumber?: number;
        studentId?: string;
        fullName?: string;
        dob?: string;
    }
}
