export interface SearchHistory {
  id: number;
  keyword: string;
  filters?: {
    category?: string;
    sort?: string;
    priceRange?: string;
  };
  searchedAt: number;
}

export const KEY = "search-history";
export const MAX = 4;

export const loadHistory = (): SearchHistory[] => {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
};

export const saveHistory = (history: SearchHistory[]) => {
  localStorage.setItem(KEY, JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem(KEY);
};

export const clearOneHistory = (id: number) => {
  const loadedHistory = loadHistory();

  const filteredHistory = loadedHistory.filter((item) => item.id !== id);

  saveHistory(filteredHistory);
};
