export const VALID_ACCESS_CODES: readonly string[] = [
  'CST-9482-K8X2',
  'CST-3105-M9P4',
  'CST-7621-R4L7',
  'CST-5839-W6H1',
  'CST-2490-B3N8',
  'CST-8164-T5J9',
  'CST-6312-X7Q3',
  'CST-4927-H2V6',
  'CST-1753-L8D5',
  'CST-9046-P1F8',
] as const;

export function isValidAccessCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return VALID_ACCESS_CODES.includes(normalized);
}

export function formatAccessCodeInput(value: string): string {
  // Strip non-alphanumeric except dashes
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (clean.startsWith('CST')) {
    const rest = clean.slice(3);
    if (rest.length <= 4) {
      return `CST-${rest}`;
    }
    return `CST-${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
  }
  
  // Format generic 3-4-4
  if (clean.length <= 3) return clean;
  if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
}
