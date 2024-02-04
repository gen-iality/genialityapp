import { useState } from 'react';

export const useSearchList = <T>(list: T[], fieldCondition: keyof T) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = list.filter((item) => {
    let fieldValue = (item[fieldCondition] as unknown) as string; // Convert to string for comparison
    fieldValue = fieldValue.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    let categorias = item['category_ids'] as unknown; // Convert to string for comparison

    categorias = (categorias && categorias.join) ? categorias.join(""):'';
    categorias = categorias.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    let innerSearchTerm = searchTerm.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    //return fieldValue.trim().toLowerCase().includes(searchTerm.trim().toLowerCase());
    return (fieldValue.includes(innerSearchTerm)
       ||  categorias.includes(innerSearchTerm) );
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredList,
  };
};
