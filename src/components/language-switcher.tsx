import { Pressable, StyleSheet, Text } from 'react-native';
import { useI18n } from '@/i18n';
import { radius, space, useTheme } from '@/theme/tokens';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`Switch language to ${language === 'en' ? 'Burmese' : 'English'}`} style={({ pressed }) => [styles.button, { borderColor: colors.line, backgroundColor: colors.surface }, pressed && { backgroundColor: colors.surfaceSubtle, opacity: 0.82 }]} onPress={() => setLanguage(language === 'en' ? 'my' : 'en')}><Text style={[styles.text, { color: colors.primary }]}>{language === 'en' ? 'မြန်မာ' : 'EN'}</Text></Pressable>;
}

const styles = StyleSheet.create({ button: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.sm }, text: { fontWeight: '700', fontSize: 13 } });
