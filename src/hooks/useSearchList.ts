import  { useState } from 'react'

export const useSearchList = <T>(list:T[], fieldCondition:keyof T) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredList = list.filter(item => {
      const fieldValue = item[fieldCondition] as unknown as string; // Convert to string for comparison
      return fieldValue.toLowerCase().includes(searchTerm.trim().toLowerCase());
    });
    
    return {
      searchTerm,
      setSearchTerm,
      filteredList,
    };
}
