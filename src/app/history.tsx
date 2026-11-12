import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExpenseForm } from '@/components/expense-form';
import { ExpenseList } from '@/components/expense-list';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { deleteExpense, getExpensesForPeriod, getPeriodTotal, updateExpense } from '@/database/expense-repository';
import { useI18n } from '@/i18n';
import type { Expense, ExpenseDraft, PeriodType } from '@/models/expense';
import { radius, space, type ColorTokens, useTheme } from '@/theme/tokens';
import { localDate, money } from '@/utils/format';

const currentValue = (type: PeriodType) => type === 'day' ? localDate() : type === 'month' ? localDate().slice(0, 7) : localDate().slice(0, 4);
export default function HistoryScreen() {
  const { t } = useI18n(); const { colors } = useTheme(); const styles = makeStyles(colors); const db = useSQLiteContext(); const [period, setPeriod] = useState<PeriodType>('month'); const [value, setValue] = useState(currentValue('month')); const [expenses, setExpenses] = useState<Expense[]>([]); const [total, setTotal] = useState(0); const [editing, setEditing] = useState<Expense>();
  const refresh = useCallback(async () => { const [rows, sum] = await Promise.all([getExpensesForPeriod(db, period, value), getPeriodTotal(db, period, value)]); setExpenses(rows); setTotal(sum); }, [db, period, value]); useEffect(() => { void refresh(); }, [refresh]);
  const pick = (next: PeriodType) => { setPeriod(next); setValue(currentValue(next)); }; const edit = async (draft: ExpenseDraft) => { if (!editing) return; await updateExpense(db, { ...editing, ...draft }); setEditing(undefined); await refresh(); }; const remove = async (id: number) => { await deleteExpense(db, id); await refresh(); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.page}>
    <View style={styles.header}><View><Text style={styles.kicker}>{t('smartNotepad')}</Text><Text style={styles.title}>{t('recordsTitle')}</Text></View><View style={styles.headerActions}><ThemeSwitcher /><LanguageSwitcher /></View></View>
    <View style={styles.controlCard}><View style={styles.segment}>{(['day', 'month', 'year'] as PeriodType[]).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: period === item }} style={({ pressed }) => [styles.segmentItem, period === item && styles.segmentActive, pressed && styles.pressed]} onPress={() => pick(item)}><Text style={[styles.segmentText, period === item && styles.segmentTextActive]}>{item === 'day' ? t('day') : item === 'month' ? t('month') : t('year')}</Text></Pressable>)}</View><TextInput accessibilityLabel={`${t('history')} ${period}`} style={styles.input} value={value} onChangeText={setValue} placeholder={period === 'day' ? 'YYYY-MM-DD' : period === 'month' ? 'YYYY-MM' : 'YYYY'} placeholderTextColor={colors.faint} /></View>
    <View style={styles.summary}><Text style={styles.summaryLabel}>{value} {t('periodTotal')}</Text><Text style={styles.summaryTotal}>{money(total)}</Text><Text style={styles.summaryMeta}>{expenses.length} {t('records')}</Text></View>
    <ExpenseList expenses={expenses} onEdit={setEditing} onDelete={remove} />
  </View><Modal visible={Boolean(editing)} animationType="slide" transparent onRequestClose={() => setEditing(undefined)}><View style={styles.backdrop}><View style={styles.modal}>{editing && <ExpenseForm initial={editing} date={editing.date} label={t('saveChanges')} onSave={edit} onCancel={() => setEditing(undefined)} />}</View></View></Modal></ScrollView>;
}
const makeStyles = (colors: ColorTokens) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, content: { flexGrow: 1, padding: space.md, paddingBottom: space.xxl }, page: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: space.lg }, header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: space.sm, paddingBottom: space.xs, borderBottomWidth: 1, borderBottomColor: colors.line }, headerActions: { alignItems: 'flex-end', gap: space.xs }, kicker: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }, title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '700', marginTop: 2 },
  controlCard: { gap: space.md, backgroundColor: colors.surface, padding: space.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line }, segment: { flexDirection: 'row', backgroundColor: colors.surfaceSubtle, padding: 2, borderRadius: radius.sm }, segmentItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }, segmentActive: { backgroundColor: colors.surface }, segmentText: { color: colors.muted, fontSize: 14, fontWeight: '700' }, segmentTextActive: { color: colors.primary }, input: { height: 48, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: space.sm, color: colors.ink, fontSize: 16 },
  summary: { backgroundColor: colors.surface, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, borderLeftWidth: 4, borderLeftColor: colors.accent }, summaryLabel: { color: colors.muted, fontSize: 13 }, summaryTotal: { color: colors.ink, fontSize: 28, lineHeight: 35, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] }, summaryMeta: { color: colors.muted, fontSize: 13, fontWeight: '600', marginTop: space.xs },
  pressed: { opacity: 0.68 }, backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10, 20, 16, 0.52)' }, modal: { backgroundColor: colors.canvas, padding: space.md, paddingBottom: space.xl, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
