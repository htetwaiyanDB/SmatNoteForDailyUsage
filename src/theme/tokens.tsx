import { createContext, useContext, useMemo, useState } from 'react';
export type ThemeName = 'light' | 'dark';
export type ColorTokens = { canvas: string; surface: string; surfaceSubtle: string; ink: string; muted: string; faint: string; line: string; primary: string; primaryPressed: string; primarySoft: string; accent: string; accentSoft: string; summary: string; onSummary: string; onSummaryMuted: string; button: string; buttonPressed: string; onButton: string; onPrimary: string; danger: string; dangerSoft: string; focus: string; inputRing: string; };
export const themes: Record<ThemeName, ColorTokens> = {
  light: { canvas: '#FBFBF8', surface: '#FFFFFF', surfaceSubtle: '#F7F8F3', ink: '#202B16', muted: '#64704F', faint: '#8A9475', line: '#E6E8DD', primary: '#415B25', primaryPressed: '#30441B', primarySoft: '#EEF5DA', accent: '#6F8B3E', accentSoft: '#F1F7E2', summary: '#364D20', onSummary: '#FFFFFF', onSummaryMuted: '#DFEACA', button: '#F5FFDA', buttonPressed: '#E4F3BC', onButton: '#31431B', onPrimary: '#FFFFFF', danger: '#B42318', dangerSoft: '#FDE8D8', focus: '#6F8B3E', inputRing: '#B5C986' },
  dark: { canvas: '#10141A', surface: '#171D25', surfaceSubtle: '#202833', ink: '#F4F7FB', muted: '#A9B5C4', faint: '#7B8797', line: '#2C3745', primary: '#7DA7FF', primaryPressed: '#A5C2FF', primarySoft: '#253A5C', accent: '#8EAEFF', accentSoft: '#243757', summary: '#1C314F', onSummary: '#F7FAFF', onSummaryMuted: '#BBCDE6', button: '#7DA7FF', buttonPressed: '#A5C2FF', onButton: '#10213A', onPrimary: '#10213A', danger: '#FFB4AB', dangerSoft: '#54231F', focus: '#8EAEFF', inputRing: '#87A9E5' },
};
type ThemeContextValue = { theme: ThemeName; setTheme: (theme: ThemeName) => void; colors: ColorTokens };
const ThemeContext = createContext<ThemeContextValue | null>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) { const [theme, setTheme] = useState<ThemeName>('light'); const value = useMemo(() => ({ theme, setTheme, colors: themes[theme] }), [theme]); return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>; }
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error('useTheme must be used inside ThemeProvider'); return value; }
export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40 } as const;
export const radius = { sm: 6, md: 8, lg: 10, pill: 999 } as const;
