/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
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
  const [categoriaNombre, setCategoriaNombre] = useState<string>('');
  const { groupEvent, updateListGroup, handledDelete } = useGetGruopEventList(organizationId);
  const { categories } = useGetCategorys(organizationId);
  const { closeGroupModal, isOpenGroupModal, openGroupModal, selectedGroup, handledSelectGroup } = useModalLogic(
    'Group'
  );

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

  const agregarCategoria = async () => {
    // Agregar la nueva categoría al dataSource
    const nuevaCategoria: ICategory = {
      name: categoriaNombre,
    };

    await CategoriesApi.create(nuevaCategoria);
    await updateCategoriaData();
  };

  return (
    <>
      <Header title={'Categorías y grupos'} />
      <Row gutter={[8, 0]}>
        <Col span={12}>{/* <CardCategory dataSource={categories} showEditModal={showEditModal} /> */}</Col>
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
      {
        /* <CategoryModal
          onOk={agregarCategoria}
          title='Agregar Categoría'
          categoryValue={categoriaNombre}
          namePlaceHolder='Nombre de la categoría'
        /> */
      }
      {/* 

      <CategoryModal
        isVisible={isModalVisible}
        onOk={agregarCategoria}
        onCancel={toggleModal}
        title='Agregar Categoría'
        categoryValue={categoriaNombre}
        handleCategoryChange={handleNombreChange}
        namePlaceHolder='Nombre de la categoría'
      />
      <CategoryModal
        isVisible={isEditModalVisible}
        onOk={() => {
          updateCategoria(selectedCategoryId, updatedCategoryName);
          toggleEditModal();
        }}
        onCancel={toggleEditModal}
        title='Editar Categoría'
        categoryValue={updatedCategoryName}
        handleCategoryChange={(e) => setUpdatedCategoryName(e.target.value)}
        namePlaceHolder='Nombre de la categoría'
      /> */}
    </>
  );
};

export default Category;
