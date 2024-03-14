import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeURIWithPlus(text: string) {
  return encodeURIComponent(text).replace(/%20/g, '+');
}
