import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpenseForm } from '@/components/expense-form';
import { ExpenseList } from '@/components/expense-list';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { createExpense, deleteExpense, getExpensesForPeriod, getPeriodTotal, updateExpense } from '@/database/expense-repository';
import { useI18n } from '@/i18n';
import type { Expense, ExpenseDraft } from '@/models/expense';
import { radius, space, type ColorTokens, useTheme } from '@/theme/tokens';
import { localDate, money } from '@/utils/format';

export default function TodayScreen() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const db = useSQLiteContext();
  const today = localDate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState<Expense>();
  const refresh = useCallback(async () => { const [rows, sum] = await Promise.all([getExpensesForPeriod(db, 'day', today), getPeriodTotal(db, 'day', today)]); setExpenses(rows); setTotal(sum); }, [db, today]);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const add = async (draft: ExpenseDraft) => { await createExpense(db, draft); await refresh(); };
  const edit = async (draft: ExpenseDraft) => { if (!editing) return; await updateExpense(db, { ...editing, ...draft }); setEditing(undefined); await refresh(); };
  const remove = async (id: number) => { await deleteExpense(db, id); await refresh(); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.page}>
      <View style={styles.header}><View><Text style={styles.kicker}>{t('smartNotepad')}</Text><Text style={styles.title}>{t('dailySpending')}</Text><Text style={styles.date}>{today}</Text></View><View style={styles.headerActions}><ThemeSwitcher /><LanguageSwitcher /></View></View>
      <View style={styles.summary}><Text style={styles.summaryLabel}>{t('total')}</Text><Text style={styles.total}>{money(total)}</Text><View style={styles.summaryDivider} /><Text style={styles.summaryMeta}>{expenses.length} {t('records')}</Text></View>
      <ExpenseForm date={today} label={t('save')} onSave={add} />
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{t('todayRecords')}</Text><Text style={styles.sectionCount}>{expenses.length}</Text></View>
      <ExpenseList expenses={expenses} onEdit={setEditing} onDelete={remove} />
    </View>
    <Modal visible={Boolean(editing)} animationType="slide" transparent onRequestClose={() => setEditing(undefined)}><View style={styles.backdrop}><View style={styles.modal}>{editing && <ExpenseForm initial={editing} date={today} label={t('saveChanges')} onSave={edit} onCancel={() => setEditing(undefined)} />}</View></View></Modal>
  </ScrollView>;
}
const makeStyles = (colors: ColorTokens) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, content: { flexGrow: 1, padding: space.md, paddingBottom: space.xxl }, page: { width: '100%', maxWidth: 680, alignSelf: 'center', gap: space.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: space.sm, paddingBottom: space.xs, borderBottomWidth: 1, borderBottomColor: colors.line }, headerActions: { alignItems: 'flex-end', gap: space.xs }, kicker: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }, title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '700', marginTop: 2 }, date: { color: colors.muted, fontSize: 13, marginTop: 2 },
  summary: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, borderLeftWidth: 4, borderLeftColor: colors.accent, padding: space.md }, summaryLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' }, total: { color: colors.ink, fontSize: 32, lineHeight: 39, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] }, summaryDivider: { height: 1, backgroundColor: colors.line, marginVertical: space.sm }, summaryMeta: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xs, paddingBottom: space.xs, borderBottomWidth: 1, borderBottomColor: colors.line }, sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '700' }, sectionCount: { minWidth: 24, textAlign: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.primarySoft, color: colors.primary, fontWeight: '700', fontSize: 12 },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10, 20, 16, 0.52)' }, modal: { backgroundColor: colors.canvas, padding: space.md, paddingBottom: space.xl, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
