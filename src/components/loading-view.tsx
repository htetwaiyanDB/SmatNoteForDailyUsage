import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/tokens';
export function LoadingView() { const { colors } = useTheme(); return <View style={[styles.container, { backgroundColor: colors.canvas }]}><ActivityIndicator color={colors.primary} /></View>; }
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
