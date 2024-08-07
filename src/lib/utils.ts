import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeUsername(username: string): string {
  return encodeURIComponent(username);
}

export function decodeUsername(encodedUsername: string): string {
  return decodeURIComponent(encodedUsername);
}
