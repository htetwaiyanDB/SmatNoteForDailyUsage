import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useI18n } from '@/i18n';
import { radius, space, useTheme } from '@/theme/tokens';

export function ThemeSwitcher() {
  const { theme, setTheme, colors } = useTheme();
  const { t } = useI18n();
  return <View style={[styles.wrap, { backgroundColor: colors.surfaceSubtle, borderColor: colors.line }]}>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: theme === 'light' }} onPress={() => setTheme('light')} style={[styles.choice, theme === 'light' && { backgroundColor: colors.surface }]}><Text style={[styles.text, { color: theme === 'light' ? colors.ink : colors.muted }]}>{t('themeLight')}</Text></Pressable>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: theme === 'dark' }} onPress={() => setTheme('dark')} style={[styles.choice, theme === 'dark' && { backgroundColor: colors.surface }]}><Text style={[styles.text, { color: theme === 'dark' ? colors.ink : colors.muted }]}>{t('themeDark')}</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({ wrap: { height: 44, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', padding: 3 }, choice: { minWidth: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xs }, text: { fontSize: 12, fontWeight: '700' } });
