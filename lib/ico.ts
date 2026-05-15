export function validateIco(ico: string): boolean {
  if (!/^\d{8}$/.test(ico)) return false;

  const digits = ico.split('').map(Number);
  const weights = [8, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  const remainder = sum % 11;

  let check: number;
  if (remainder === 0) check = 1;
  else if (remainder === 1) check = 0;
  else check = 11 - remainder;

  return digits[7] === check;
}
