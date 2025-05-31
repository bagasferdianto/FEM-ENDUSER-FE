import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DateFormatOptions = {
  locale?: string; // default: "id-ID"
  includeTime?: boolean;
  timeZone?: string; // default: "Asia/Jakarta"
};

export function formatDate(
  dateString: string,
  options: DateFormatOptions = {}
): string {
  const {
    locale = "id-ID",
    includeTime = false,
    timeZone = "Asia/Jakarta",
  } = options;

  const date = new Date(dateString);

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function formatDateToLocalISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
