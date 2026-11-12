import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useI18n } from '@/i18n';
import type { Expense, ExpenseDraft } from '@/models/expense';
import { radius, space, type ColorTokens, useTheme } from '@/theme/tokens';

type Props = { initial?: Expense; date: string; label: string; onSave: (draft: ExpenseDraft) => Promise<void>; onCancel?: () => void };

export function ExpenseForm({ initial, date, label, onSave, onCancel }: Props) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [saving, setSaving] = useState(false);
  useEffect(() => { setAmount(initial ? String(initial.amount) : ''); setTitle(initial?.title ?? ''); setCategory(initial?.category ?? ''); }, [initial]);
  const save = async () => {
    const value = Number(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) { Alert.alert(t('checkEntry'), t('checkEntryMessage')); return; }
    setSaving(true);
    try { await onSave({ title, amount: value, category, date: initial?.date ?? date }); if (!initial) { setAmount(''); setTitle(''); setCategory(''); } } finally { setSaving(false); }
  };
  return <View style={styles.card}>
    <View style={styles.cardHeader}><Text style={styles.heading}>{initial ? t('editExpense') : t('quickAdd')}</Text><Text style={styles.required}>*</Text></View>
    <View style={styles.field}><Text style={styles.label}>{t('amount')}</Text><TextInput accessibilityLabel={t('amount')} style={styles.amount} value={amount} onChangeText={setAmount} placeholder="0.00" placeholderTextColor={colors.faint} keyboardType="decimal-pad" /></View>
    <View style={styles.field}><Text style={styles.label}>{t('title')}</Text><TextInput accessibilityLabel={t('title')} style={styles.input} value={title} onChangeText={setTitle} placeholder={t('titlePlaceholder')} placeholderTextColor={colors.faint} /></View>
    <View style={styles.field}><View style={styles.labelRow}><Text style={styles.label}>{t('category')}</Text><Text style={styles.optional}>{t('optional')}</Text></View><TextInput accessibilityLabel={t('category')} style={styles.input} value={category} onChangeText={setCategory} placeholder={t('categoryPlaceholder')} placeholderTextColor={colors.faint} /></View>
    <View style={styles.actions}>{onCancel && <Pressable accessibilityRole="button" onPress={onCancel} style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}><Text style={styles.cancelText}>{t('cancel')}</Text></Pressable>}<Pressable accessibilityRole="button" onPress={save} disabled={saving} style={({ pressed }) => [styles.save, (pressed || saving) && styles.savePressed]}><Text style={styles.saveText}>{saving ? t('saving') : label}</Text></Pressable></View>
  </View>;
}

const makeStyles = (colors: ColorTokens) => StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: space.md, gap: space.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: space.xxs, paddingBottom: space.xs, borderBottomWidth: 1, borderBottomColor: colors.line }, heading: { color: colors.ink, fontSize: 16, fontWeight: '700' }, required: { color: colors.danger, fontSize: 16 },
  field: { gap: 6 }, labelRow: { flexDirection: 'row', justifyContent: 'space-between' }, label: { color: colors.muted, fontSize: 13, fontWeight: '600' }, optional: { color: colors.faint, fontSize: 12 },
  input: { height: 46, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: space.sm, color: colors.ink, fontSize: 16 },
  amount: { height: 54, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.inputRing, borderRadius: radius.sm, paddingHorizontal: space.md, color: colors.ink, fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.xs }, save: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.button, borderRadius: radius.sm, paddingHorizontal: space.md, borderWidth: 1, borderColor: colors.inputRing }, savePressed: { backgroundColor: colors.buttonPressed, opacity: 0.88 }, saveText: { color: colors.onButton, fontSize: 16, fontWeight: '700' },
  cancel: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.md, borderRadius: radius.sm }, cancelText: { color: colors.primary, fontSize: 15, fontWeight: '700' }, pressed: { opacity: 0.65 },
});
