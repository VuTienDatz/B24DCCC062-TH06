import { useState, useEffect } from 'react';
import type { DiplomaManagement as Typing } from '@/pages/DiplomaManagement/typing';

const LS_KEY = 'diploma_management_data';

export default () => {
    const [books, setBooks] = useState<Typing.DiplomaBook[]>([]);
    const [decisions, setDecisions] = useState<Typing.GraduationDecision[]>([]);
    const [fieldConfigs, setFieldConfigs] = useState<Typing.FieldConfig[]>([]);
    const [diplomas, setDiplomas] = useState<Typing.DiplomaInfo[]>([]);

    // Initialize from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setBooks(parsed.books || []);
            setDecisions(parsed.decisions || []);
            setFieldConfigs(parsed.fieldConfigs || []);
            setDiplomas(parsed.diplomas || []);
        } else {
            // Initial Mock Data
            const initialBooks: Typing.DiplomaBook[] = [
                { id: '1', year: 2023, currentNumber: 10 },
                { id: '2', year: 2024, currentNumber: 5 }
            ];
            const initialConfigs: Typing.FieldConfig[] = [
                { id: '1', name: 'Nơi sinh', type: 'String' },
                { id: '2', name: 'Dân tộc', type: 'String' },
                { id: '3', name: 'Điểm trung bình', type: 'Number' },
                { id: '4', name: 'Ngày nhập học', type: 'Date' }
            ];
            const initialDecisions: Typing.GraduationDecision[] = [
                { id: 'd1', decisionNumber: 'QĐ-01/2024', issueDate: '2024-03-01', summary: 'Quyết định tốt nghiệp Đợt 1 - 2024', bookId: '2', searchCount: 0 },
                { id: 'd2', decisionNumber: 'QĐ-10/2023', issueDate: '2023-11-15', summary: 'Quyết định tốt nghiệp Đợt 3 - 2023', bookId: '1', searchCount: 0 }
            ];
            const initialDiplomas: Typing.DiplomaInfo[] = [
                { 
                    id: 'dip1', 
                    entryNumber: 1, 
                    diplomaId: 'VB001', 
                    studentId: 'B24DCCC001', 
                    fullName: 'Nguyễn Văn A', 
                    dob: '2002-01-01', 
                    decisionId: 'd1',
                    dynamicFields: { '1': 'Hà Nội', '2': 'Kinh', '3': 8.5 }
                }
            ];

            setBooks(initialBooks);
            setFieldConfigs(initialConfigs);
            setDecisions(initialDecisions);
            setDiplomas(initialDiplomas);
            saveToLS({ 
                books: initialBooks, 
                fieldConfigs: initialConfigs, 
                decisions: initialDecisions, 
                diplomas: initialDiplomas 
            });
        }
    }, []);

    const saveToLS = (data: any) => {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    };

    const updateState = (newState: any) => {
        const fullState = { books, decisions, fieldConfigs, diplomas, ...newState };
        saveToLS(fullState);
    };

    // Diploma Books
    const addOrUpdateBook = (book: Typing.DiplomaBook) => {
        let newList;
        if (books.find(b => b.id === book.id)) {
            newList = books.map(b => b.id === book.id ? book : b);
        } else {
            newList = [...books, book];
        }
        setBooks(newList);
        updateState({ books: newList });
    };

    const deleteBook = (id: string) => {
        const newList = books.filter(b => b.id !== id);
        setBooks(newList);
        updateState({ books: newList });
    };

    // Graduation Decisions
    const addOrUpdateDecision = (decision: Typing.GraduationDecision) => {
        let newList;
        if (decisions.find(d => d.id === decision.id)) {
            newList = decisions.map(d => d.id === decision.id ? decision : d);
        } else {
            newList = [...decisions, { ...decision, searchCount: 0 }];
        }
        setDecisions(newList);
        updateState({ decisions: newList });
    };

    const deleteDecision = (id: string) => {
        const newList = decisions.filter(d => d.id !== id);
        setDecisions(newList);
        updateState({ decisions: newList });
    };

    const incrementSearchCount = (decisionId: string) => {
        const newList = decisions.map(d => d.id === decisionId ? { ...d, searchCount: (d.searchCount || 0) + 1 } : d);
        setDecisions(newList);
        updateState({ decisions: newList });
    };

    // Field Config
    const addOrUpdateField = (field: Typing.FieldConfig) => {
        let newList;
        if (fieldConfigs.find(f => f.id === field.id)) {
            newList = fieldConfigs.map(f => f.id === field.id ? field : f);
        } else {
            newList = [...fieldConfigs, field];
        }
        setFieldConfigs(newList);
        updateState({ fieldConfigs: newList });
    };

    const deleteField = (id: string) => {
        const newList = fieldConfigs.filter(f => f.id !== id);
        setFieldConfigs(newList);
        updateState({ fieldConfigs: newList });
    };

    // Diploma Info
    const addDiploma = (diploma: Typing.DiplomaInfo) => {
        // Validation: Unique Diploma ID
        if (diplomas.find(d => d.diplomaId === diploma.diplomaId)) {
            return { success: false, message: 'Số hiệu văn bằng đã tồn tại trên hệ thống!' };
        }

        // Find the decision to find the book
        const dec = decisions.find(d => d.id === diploma.decisionId);
        if (!dec) return { success: false, message: 'Không tìm thấy quyết định tốt nghiệp!' };
        
        const book = books.find(b => b.id === dec.bookId);
        if (!book) return { success: false, message: 'Không tìm thấy sổ văn bằng tương ứng!' };

        const newEntryNumber = book.currentNumber;
        const newDiploma = { ...diploma, entryNumber: newEntryNumber };
        
        const newDips = [newDiploma, ...diplomas]; // Add to top
        setDiplomas(newDips);

        // Increment book's current number
        const newBooks = books.map(b => b.id === book.id ? { ...b, currentNumber: b.currentNumber + 1 } : b);
        setBooks(newBooks);

        updateState({ diplomas: newDips, books: newBooks });
        return { success: true };
    };

    const editDiploma = (diploma: Typing.DiplomaInfo) => {
        // Validation: Unique Diploma ID (excluding self)
        if (diplomas.find(d => d.diplomaId === diploma.diplomaId && d.id !== diploma.id)) {
            return { success: false, message: 'Số hiệu văn bằng đã tồn tại trên hệ thống!' };
        }

        const newList = diplomas.map(d => d.id === diploma.id ? diploma : d);
        setDiplomas(newList);
        updateState({ diplomas: newList });
        return { success: true };
    };

    const deleteDiploma = (id: string) => {
        const newList = diplomas.filter(d => d.id !== id);
        setDiplomas(newList);
        updateState({ diplomas: newList });
    };

    return {
        books,
        decisions,
        fieldConfigs,
        diplomas,
        addOrUpdateBook,
        deleteBook,
        addOrUpdateDecision,
        deleteDecision,
        incrementSearchCount,
        addOrUpdateField,
        deleteField,
        addDiploma,
        editDiploma,
        deleteDiploma
    };
};
