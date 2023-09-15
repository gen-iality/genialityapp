import React, { useEffect, useState } from 'react';
import { Modal, Input, ModalProps, Button } from 'antd';
import { ICategory } from '../interface/category.interface';
import { CategoriesApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
interface CategoryModalProps extends ModalProps {
  onCancel: () => void;
  selectedCategory?: ICategory;
  organizationId: string;
  updateListCategories: () => void;
}
const CategoryModal: React.FC<CategoryModalProps> = ({
  onCancel,
  selectedCategory,
  organizationId,
  updateListCategories,
  ...modalProps
}) => {
  const [nameCategory, setNameCategory] = useState('');

  const handledCatgoryName = (value: string) => {
    setNameCategory(value);
  };

  const addCategory = async () => {
    try {
      const nuevoGrupo: ICategory = {
        name: nameCategory,
      };
      await CategoriesApi.create(organizationId, nuevoGrupo);
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se agrego la categoria correctamente' });
      onCancel();
      updateListCategories()
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'Ocurrio un error al agregar la categoria' });
    }
  };

  const editCategory = async () => {
    if (!selectedCategory) return;
    try {
      await CategoriesApi.update(organizationId, selectedCategory.key, { name: nameCategory });
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se edito la categoria correctamente' });
      updateListCategories()
      onCancel();
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'info', msj: 'No se pudo editar la categoria' });
      onCancel();
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setNameCategory(selectedCategory.name);
    }
  }, [selectedCategory]);

  return (
    <Modal
      {...modalProps}
      title={`${selectedCategory ? 'Editar' : 'Agregar'} Categoría`}
      onCancel={onCancel}
      footer={null}>
      <Input
        placeholder={'Ingrese el nombre de la categoria'}
        onChange={({ target: { value } }) => {
          handledCatgoryName(value);
        }}
        maxLength={20}
        value={nameCategory}
      />
      <Button onClick={selectedCategory ? editCategory : addCategory}>{selectedCategory ? 'Editar' : 'Agregar'}</Button>
    </Modal>
  );
};

export default CategoryModal;
