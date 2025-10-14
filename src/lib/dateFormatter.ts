export function deDate(d: string | Date) {
  const date = new Date(d);
  return date.toLocaleDateString("de-DE");
}