import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeStamp(createdAt: string): string {
  // give me output like one week ago
  const date = new Date(createdAt);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  const day = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${day} at ${time}`;
}

export function formatLargeNumber(num: number): string {
  console.log(num);

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  } else {
    return num.toString();
  }
}
