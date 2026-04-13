export interface DateProvider {
  now(): Date;
  startOfMonth(date: Date): Date;
  endOfMonth(date: Date): Date;
  isBefore(a: Date, b: Date): boolean;
}
