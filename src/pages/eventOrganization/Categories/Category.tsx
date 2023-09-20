/* eslint-disable no-console */
import React from 'react';
import { Col, Row } from 'antd';
import Header from '@/antdComponents/Header';
import CategoryModal from './CategoryModal';
import CardCategory from './CardCategory';
import CardGroupEvent from './CardGroup';
import { GroupModal } from '../components/group/GroupModal';
import { useGetGruopEventList } from '../hooks/useGetGruopEventList';
import { ICategory } from '../interface/category.interface';
import { useGetCategorys } from '../hooks/useGetCategorys';
import { useModalLogic } from '@/hooks/useModalLogic';
import { GroupEventMongo } from '../interface/group.interfaces';

const Category: React.FC<any> = ({ org: { _id: organizationId } }) => {
  const { groupEvent, handledDelete, handledUpdateGroup, isLoadingGroup, handledAddGroup } = useGetGruopEventList(
    organizationId
  );
  const {
    categories,
    handledAddCategory,
    handledDeleteCategory,
    handledUpdateCategory,
    isLoadingCategories,
  } = useGetCategorys(organizationId);
  const { closeGroupModal, isOpenGroupModal, openGroupModal, selectedGroup, handledSelectGroup } = useModalLogic<
    GroupEventMongo
  >('Group');
  const {
    isOpenCategoryModal,
    closeCategoryModal,
    openCategoryModal,
    handledSelectCategory,
    selectedCategory,
  } = useModalLogic<ICategory, 'Category'>('Category');

  return (
    <>
      <Header title={'Categorías y grupos'} />
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <CardCategory
            handledDeleteCategory={handledDeleteCategory}
            isLoadingCategories={isLoadingCategories}
            dataSource={categories}
            handledSelectCategory={handledSelectCategory}
            openCategoryModal={openCategoryModal}
            organizationId={organizationId}
          />
        </Col>
        <Col span={12}>
          <CardGroupEvent
            isLoadingGroup={isLoadingGroup}
            handledDelete={handledDelete}
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
          handledAddGroup={handledAddGroup}
          handledUpdate={handledUpdateGroup}
          visible={isOpenGroupModal}
          onCancel={closeGroupModal}
          organizationId={organizationId}
          selectedGroup={selectedGroup}
        />
      )}

      {isOpenCategoryModal && (
        <CategoryModal
          handledUpdateCategory={handledUpdateCategory}
          handledAddCategory={handledAddCategory}
          onCancel={closeCategoryModal}
          visible={isOpenCategoryModal}
          organizationId={organizationId}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default Category;
