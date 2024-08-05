export function newDateOrUndefined(newDate?: null | string | Date | number) {
  return newDate ? new Date(newDate) : undefined;
}
