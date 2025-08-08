import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { ErrorHandler } from "../helper/handleError";

type FilterFunction<T> = (item: T, keyword: string) => boolean;

export function useDebouncedFilter<T>(
  data: T[],
  keyword: string,
  filterFn: FilterFunction<T>,
  delay = 500,
  setLoading?: (value: boolean) => void
): T[] {
  const debouncedKeyword = useDebounce(keyword, delay);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    try {
      setLoading?.(true);
      if (debouncedKeyword) {
        const result = data.filter((item) => filterFn(item, debouncedKeyword));
        setFilteredData(result);
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading?.(false);
    }
  }, [debouncedKeyword, data, filterFn]);

  return filteredData;
}
