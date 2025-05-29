import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
