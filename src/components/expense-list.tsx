import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '@/i18n';
import type { Expense } from '@/models/expense';
import { radius, space, type ColorTokens, useTheme } from '@/theme/tokens';
import { money } from '@/utils/format';

type Props = { expenses: Expense[]; onEdit: (expense: Expense) => void; onDelete: (id: number) => void };
export function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  if (!expenses.length) return <View style={styles.empty}><View style={styles.emptyMark} /><Text style={styles.emptyTitle}>{t('noRecords')}</Text><Text style={styles.emptyText}>{t('noRecordsHelp')}</Text></View>;
  return <FlatList scrollEnabled={false} data={expenses} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.row}>
    <View style={styles.info}><Text style={styles.title} numberOfLines={1}>{item.title}</Text><View style={styles.metaRow}><Text style={styles.category}>{item.category || t('uncategorized')}</Text><Text style={styles.date}>{item.date}</Text></View></View>
    <View style={styles.right}><Text style={styles.amount}>{money(item.amount)}</Text><View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel={`${t('edit')} ${item.title}`} onPress={() => onEdit(item)} style={({ pressed }) => [styles.edit, pressed && styles.pressed]}><Text style={styles.editText}>{t('edit')}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`${t('delete')} ${item.title}`} onPress={() => Alert.alert(t('deleteTitle'), `“${item.title}” ${t('deleteMessage')}`, [{ text: t('keep'), style: 'cancel' }, { text: t('deleteConfirm'), style: 'destructive', onPress: () => onDelete(item.id) }])} style={({ pressed }) => [styles.delete, pressed && styles.pressed]}><Text style={styles.deleteText}>{t('delete')}</Text></Pressable></View></View>
  </View>} />;
}
const makeStyles = (colors: ColorTokens) => StyleSheet.create({
  list: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }, row: { minHeight: 84, padding: space.md, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line },
  info: { flex: 1, minWidth: 0, paddingRight: space.sm }, title: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '600' }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.xs }, category: { color: colors.muted, fontSize: 12, fontWeight: '600' }, date: { color: colors.faint, fontSize: 12 },
  right: { alignItems: 'flex-end', justifyContent: 'space-between' }, amount: { color: colors.ink, fontWeight: '700', fontSize: 16, fontVariant: ['tabular-nums'] }, actions: { flexDirection: 'row', gap: space.xs }, edit: { minWidth: 44, minHeight: 32, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderRadius: radius.sm }, editText: { color: colors.primary, fontWeight: '700', fontSize: 13 }, delete: { minWidth: 44, minHeight: 32, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderRadius: radius.sm }, deleteText: { color: colors.danger, fontWeight: '700', fontSize: 13 }, pressed: { opacity: 0.65 },
  empty: { minHeight: 156, alignItems: 'center', justifyContent: 'center', padding: space.xl, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line }, emptyMark: { width: 24, height: 2, borderRadius: radius.pill, backgroundColor: colors.line, marginBottom: space.md }, emptyTitle: { color: colors.ink, fontWeight: '700', fontSize: 16 }, emptyText: { color: colors.muted, textAlign: 'center', marginTop: space.xs, maxWidth: 240, lineHeight: 20 },
});
