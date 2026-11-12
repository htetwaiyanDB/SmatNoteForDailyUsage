import { Tabs } from 'expo-router';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/tokens';

export default function AppTabs() {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line } }}>
      <Tabs.Screen name="today" options={{ title: t('today') }} />
      <Tabs.Screen name="history" options={{ title: t('history') }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
