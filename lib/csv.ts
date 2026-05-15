export function toCsv(
  headers: string[],
  rows: Record<string, string>[],
): string {
  const escape = (field: string): string => {
    if (field.includes('"') || field.includes(',') || field.includes('\n')) {
      return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
  };

  const lines: string[] = [headers.map(escape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] ?? '')).join(','));
  }
  return lines.join('\n') + '\n';
}
