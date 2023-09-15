import { useEffect, useState } from 'react';
import { CategoriesApi } from '@/helpers/request';
import { ICategory } from '../interface/category.interface';

export const useGetCategorys = (organizationId: string) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reFetch, setReFetch] = useState(false);

  const getCategory = async () => {
    try {
      const response: any[] = await CategoriesApi.getAll();
      if (response && Array.isArray(response)) {
        const categoriasArray: ICategory[] = response.map((categoria) => ({
          key: categoria.value,
          name: categoria.label,
          eventosPorCategoria: [],
        }));
        setCategories(categoriasArray);
      } else {
        console.error('Error al obtener categorías:', response);
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateListCategories = () => {
    setReFetch((current) => !current);
  };

  useEffect(() => {
    getCategory();
  }, [organizationId, reFetch]);

  return { categories, isLoading, updateListCategories };
};
