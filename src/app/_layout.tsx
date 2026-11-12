import { Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import AppTabs from '@/components/app-tabs';
import { LoadingView } from '@/components/loading-view';
import { migrateDbIfNeeded } from '@/database/database';
import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme/tokens';
import { useTheme } from '@/theme/tokens';

export default function TabLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  return <Suspense fallback={<LoadingView />}>
    <SQLiteProvider databaseName="smart-notepad.db" onInit={migrateDbIfNeeded} useSuspense>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppTabs />
    </SQLiteProvider>
  </Suspense>;
}
