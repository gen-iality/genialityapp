import { useEffect, useState } from 'react';
import { CategoriesApi } from '@/helpers/request';
import { ICategory } from '../interface/category.interface';

export const useGetCategorys = (organizationId: string) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoadingCategories, setIsLoading] = useState(true);

  const getCategorys = async () => {
    try {
      const response: any[] = await CategoriesApi.getAll(organizationId);
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

  const handledDeleteCategory = async (categoryId: string) => {
    try {
      await CategoriesApi.delete(organizationId, categoryId);
      setCategories((currentCategories) => currentCategories.filter((category) => category.key !== categoryId));
    } catch (error) {
      throw new Error();
    }
  };

  const handledUpdateCategory = async (categoryId: string, newCategoryData: ICategory) => {
    try {
      await CategoriesApi.update(organizationId, categoryId, newCategoryData);
      setCategories((currentCategories) =>
        currentCategories.map((category) => {
          if (category.key === categoryId) {
            return { ...category, name: newCategoryData.name };
          }
          return category;
        })
      );
    } catch (error) {
      throw new Error();
    }
  };

  const handledAddCategory = async (newCategory: ICategory) => {
    try {
      await CategoriesApi.create(organizationId, newCategory);
      getCategorys();
    } catch (error) {
      throw new Error();
    }
  };

  useEffect(() => {
    getCategorys();
  }, [organizationId]);

  return { categories, isLoadingCategories, handledDeleteCategory, handledUpdateCategory, handledAddCategory };
};
