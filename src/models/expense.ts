export interface Expense { id: number; title: string; amount: number; category: string | null; date: string; created_at: string; }
export interface ExpenseDraft { title: string; amount: number; category?: string | null; date: string; }
export type PeriodType = 'day' | 'month' | 'year';
