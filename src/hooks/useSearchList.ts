import { useState } from 'react';

export const useSearchList = <T>(list: T[], fieldCondition: keyof T | (keyof T)[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  let filteredList = [];
  if (Array.isArray(fieldCondition)) {
    filteredList = list.filter((item) => {
      return fieldCondition.some((field) => {
        const fieldValue = (item[field] as unknown) as string;
        return fieldValue.toLowerCase().includes(searchTerm.trim().toLowerCase());
      });
    });
  } else {
    filteredList = list.filter((item) => {
      const fieldValue = (item[fieldCondition] as unknown) as string; // Convert to string for comparison
      return fieldValue.toLowerCase().includes(searchTerm.trim().toLowerCase());
    });
  }

  return {
    searchTerm,
    setSearchTerm,
    filteredList
  };
};
