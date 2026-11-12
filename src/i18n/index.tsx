import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'my';

const messages = {
  en: {
    today: 'Today', history: 'History', smartNotepad: 'SMART NOTEPAD', dailySpending: "Today's spending", total: 'Total', records: 'records', quickAdd: 'Add an expense', editExpense: 'Edit expense', amount: 'Amount', title: 'Description', category: 'Category', optional: 'Optional', titlePlaceholder: 'e.g. Lunch with team', categoryPlaceholder: 'e.g. Food', save: 'Save expense', saveChanges: 'Save changes', cancel: 'Cancel', todayRecords: "Today's transactions", noRecords: 'No expenses yet', noRecordsHelp: 'Your transactions for today will appear here.', edit: 'Edit', delete: 'Delete', deleteTitle: 'Delete expense?', deleteMessage: 'will be permanently deleted.', keep: 'Keep', deleteConfirm: 'Delete', checkEntry: 'Check your entry', checkEntryMessage: 'Enter a description and an amount greater than 0.', recordsTitle: 'Records', day: 'Day', month: 'Month', year: 'Year', periodTotal: 'total', uncategorized: 'Uncategorized', saving: 'Saving…', language: 'မြန်မာ', themeLight: 'Light', themeDark: 'Dark',
  },
  my: {
    today: 'ဒီနေ့', history: 'မှတ်တမ်း', smartNotepad: 'စမတ်မှတ်စု', dailySpending: 'ဒီနေ့ သုံးစွဲမှု', total: 'စုစုပေါင်း', records: 'ခု မှတ်တမ်း', quickAdd: 'အသုံးစရိတ်ထည့်ရန်', editExpense: 'အသုံးစရိတ် ပြင်ရန်', amount: 'ပမာဏ', title: 'အကြောင်းအရာ', category: 'အမျိုးအစား', optional: 'ရွေးချယ်နိုင်သည်', titlePlaceholder: 'ဥပမာ - နေ့လယ်စာ', categoryPlaceholder: 'ဥပမာ - အစားအသောက်', save: 'မှတ်သိမ်းမည်', saveChanges: 'ပြင်ဆင်သိမ်းမည်', cancel: 'မလုပ်တော့ပါ', todayRecords: 'ဒီနေ့၏ မှတ်တမ်းများ', noRecords: 'အသုံးစရိတ်မရှိသေးပါ', noRecordsHelp: 'ဒီနေ့၏ အသုံးစရိတ်များကို ဤနေရာတွင် ပြပါမည်။', edit: 'ပြင်', delete: 'ဖျက်', deleteTitle: 'ဖျက်မလား?', deleteMessage: 'ကို ဖျက်မည်။', keep: 'မဖျက်ပါ', deleteConfirm: 'ဖျက်မည်', checkEntry: 'စစ်ဆေးရန်', checkEntryMessage: 'ပမာဏ (0 ထက်ကြီး) နှင့် အကြောင်းအရာ ထည့်ပေးပါ။', recordsTitle: 'မှတ်တမ်းများ', day: 'နေ့', month: 'လ', year: 'နှစ်', periodTotal: 'အတွင်း စုစုပေါင်း', uncategorized: 'အမျိုးအစားမသတ်မှတ်ရသေး', saving: 'သိမ်းနေသည်…', language: 'English', themeLight: 'အလင်း', themeDark: 'အမှောင်',
  },
} as const;

type TranslationKey = keyof typeof messages.en;
type I18nValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string };
const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  // Keep English as the app default even when Expo Fast Refresh preserves old state.
  useEffect(() => { setLanguage('en'); }, []);
  const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => messages[language][key] }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside LanguageProvider');
  return value;
}
