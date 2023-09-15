/* eslint-disable no-console */
import React from 'react';
import { Col, Row } from 'antd';
import Header from '@/antdComponents/Header';
import { CategoriesApi } from '@/helpers/request';
import CategoryModal from './CategoryModal';
import { handleDeleteCategory } from '../tableColums/utils/deleteCategories';
import CardCategory from './CardCategory';
import CardGroupEvent from './CardGroup';
import { GroupModal } from '../components/group/GroupModal';
import { useGetGruopEventList } from '../hooks/useGetGruopEventList';
import { ICategory } from '../interface/category.interface';
import { useGetCategorys } from '../hooks/useGetCategorys';
import { useModalLogic } from '@/hooks/useModalLogic';

const Category: React.FC<any> = ({ org: { _id: organizationId } }) => {
  const { groupEvent, updateListGroup, handledDelete } = useGetGruopEventList(organizationId);
  const { categories, updateListCategories } = useGetCategorys(organizationId);
  const { closeGroupModal, isOpenGroupModal, openGroupModal, selectedGroup, handledSelectGroup } = useModalLogic(
    'Group'
  );
  const {
    isOpenCategoryModal,
    closeCategoryModal,
    openCategoryModal,
    handledSelectCategory,
    selectedCategory,
  } = useModalLogic<ICategory, 'Category'>('Category');

  const updateCategoriaData = async () => {
    try {
      const response: any[] = await CategoriesApi.getAll();
      // Verificar si la API respondió correctamente
      if (response && Array.isArray(response)) {
        const categoriasArray: ICategory[] = response.map((categoria) => ({
          key: categoria.value,
          name: categoria.label,
          eventosPorCategoria: categoria.item,
        }));
      } else {
        console.error('Error updating category data:', response);
      }
    } catch (error) {
      console.error('Error updating category data:', error);
    }
  };

  return (
    <>
      <Header title={'Categorías y grupos'} />
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <CardCategory
            updateListCategories={updateListCategories}
            dataSource={categories}
            handledSelectCategory={handledSelectCategory}
            openCategoryModal={openCategoryModal}
            organizationId={organizationId}
          />
        </Col>
        <Col span={12}>
          <CardGroupEvent
            handledDelete={handledDelete}
            updateListGroup={updateListGroup}
            selectGroup={handledSelectGroup}
            dataSource={groupEvent}
            handledOpenModalGroup={openGroupModal}
            toggleModalGroup={openGroupModal}
            organizationId={organizationId}
          />
        </Col>
      </Row>
      {isOpenGroupModal && (
        <GroupModal
          updateListGroup={updateListGroup}
          visible={isOpenGroupModal}
          onCancel={closeGroupModal}
          organizationId={organizationId}
          selectedGroup={selectedGroup}
        />
      )}

      {isOpenCategoryModal && (
        <CategoryModal
          onCancel={closeCategoryModal}
          updateListCategories={updateListCategories}
          visible={isOpenCategoryModal}
          organizationId={organizationId}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default Category;
