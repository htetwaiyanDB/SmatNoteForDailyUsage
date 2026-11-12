import type { SQLiteDatabase } from 'expo-sqlite';
import type { Expense, ExpenseDraft, PeriodType } from '@/models/expense';
type TotalRow = { total: number };
const whereFor = (type: PeriodType) => type === 'day' ? 'date = ?' : type === 'month' ? 'substr(date, 1, 7) = ?' : 'substr(date, 1, 4) = ?';
export async function createExpense(db: SQLiteDatabase, draft: ExpenseDraft) { await db.runAsync('INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)', draft.title.trim(), draft.amount, draft.category?.trim() || null, draft.date); }
export async function updateExpense(db: SQLiteDatabase, expense: Pick<Expense, 'id'> & ExpenseDraft) { await db.runAsync('UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?', expense.title.trim(), expense.amount, expense.category?.trim() || null, expense.date, expense.id); }
export async function deleteExpense(db: SQLiteDatabase, id: number) { await db.runAsync('DELETE FROM expenses WHERE id = ?', id); }
export async function getExpensesForPeriod(db: SQLiteDatabase, type: PeriodType, value: string) { return db.getAllAsync<Expense>(`SELECT * FROM expenses WHERE ${whereFor(type)} ORDER BY date DESC, id DESC`, value); }
export async function getPeriodTotal(db: SQLiteDatabase, type: PeriodType, value: string) { const row = await db.getFirstAsync<TotalRow>(`SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE ${whereFor(type)}`, value); return row?.total ?? 0; }
