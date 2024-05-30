import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
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
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  } else {
    return num.toString();
  }
}

export const getJoindeDate = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const joinedDate = `${month} ${year}`;
  return joinedDate;
};

interface FormUrlQuery {
  params: string;
  key: string;
  value: string | null;
}
interface RemoveKeysFormQuery {
  params: string;
  key: string[];
}
export const formUrlQuery = ({ params, key, value }: FormUrlQuery) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFormQuery = ({ params, key }: RemoveKeysFormQuery) => {
  const currentUrl = qs.parse(params);

  key.forEach((k) => {
    delete currentUrl[k];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}
export const assignBadges = (params: BadgeParams) => {
  const badgeCount: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const { criteria } = params as BadgeParams;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCount[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCount;
};
