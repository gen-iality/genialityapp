import { useCallback, useEffect, useState } from 'react';

export const useSearchList = <T>(list: T[], fieldCondition: keyof T | (keyof T)[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState<T[]>([]);

  const getFilteredList = useCallback(() => {
    if (Array.isArray(fieldCondition)) {
      const filteredList = list.filter((item) => {
        return fieldCondition.some((field) => {
          const fieldValue = (item[field] as unknown) as string;
          return fieldValue.toLowerCase().includes(searchTerm.trim().toLowerCase());
        });
      });
      setFilteredList(filteredList);
    } else {
      const filteredList = list.filter((item) => {
        const fieldValue = (item[fieldCondition] as unknown) as string; // Convert to string for comparison
        return fieldValue.toLowerCase().includes(searchTerm.trim().toLowerCase());
      });
      setFilteredList(filteredList);
    }
  }, [searchTerm, list.length]);
  useEffect(() => {
    getFilteredList();
  }, [getFilteredList]);

  return {
    searchTerm,
    setSearchTerm,
    filteredList,
  };
};
