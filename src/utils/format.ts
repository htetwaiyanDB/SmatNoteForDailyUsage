export const localDate = (date = new Date()) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
export const money = (amount: number) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(amount)} Ks`;
