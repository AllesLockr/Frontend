import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number | string | bigint): string {
  const date = new Date(Number(timestamp));

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function mapFieldType(
  type: string,
): "email" | "password" | "number" | "text" {
  switch (type) {
    case "EMAIL":
      return "email";
    case "PASSWORD":
      return "password";
    case "NUMBER":
      return "number";
    case "TEXT":
    default:
      return "text";
  }
}
