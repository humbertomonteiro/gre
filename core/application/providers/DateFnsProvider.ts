// infra/providers/DateFnsProvider.ts
import { DateProvider } from "../../application/providers/DateProvider";
import { startOfMonth, endOfMonth, isBefore } from "date-fns";

export class DateFnsProvider implements DateProvider {
  now(): Date {
    return new Date();
  }
  startOfMonth(date: Date): Date {
    return startOfMonth(date);
  }
  endOfMonth(date: Date): Date {
    return endOfMonth(date);
  }
  isBefore(a: Date, b: Date): boolean {
    return isBefore(a, b);
  }
}
