export interface SearchHistory {
  keyword: string;
  filters?: {
    category?: string;
    sort?: string;
    priceRange?: string;
  };
  searchedAt: number;
}

export const KEY = "search-history";
export const MAX = 8;

export const loadHistory = (): SearchHistory[] => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

export const saveHistory = (history: SearchHistory[]) => {
  localStorage.setItem(KEY, JSON.stringify(history));
};
