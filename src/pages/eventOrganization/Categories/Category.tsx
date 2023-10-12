/* eslint-disable no-console */
import React from 'react';
import { Col, Row } from 'antd';
import Header from '@/antdComponents/Header';
import CategoryModal from './CategoryModal';
import CardCategory from './CardCategory';
import CardGroupEvent from './CardGroup';
import { GroupModal } from '../components/group/GroupModal';
import { useCrudGruopEventList } from '../hooks/useCrudGruopEventList';
import { ICategory } from '../interface/category.interface';
import { useGetCategorys } from '../hooks/useGetCategorys';
import { useModalLogic } from '@/hooks/useModalLogic';
import { GroupEventMongo } from '../interface/group.interfaces';
import { ManageGroup } from '../components/group/ManageGroup';

const Category: React.FC<any> = ({ org: { _id: organizationId } }) => {
  const {
    groupEvent,
    handledDelete,
    handledUpdateGroup,
    isLoadingGroup,
    handledAddGroup,
    handledDelteEvent,
    handledDelteOrgUser,
  } = useCrudGruopEventList(organizationId);
  const {
    categories,
    handledAddCategory,
    handledDeleteCategory,
    handledUpdateCategory,
    isLoadingCategories,
  } = useGetCategorys(organizationId);
  const {
    closeModal: closeGroupModal,
    isOpenModal: isOpenGroupModal,
    openModal: openGroupModal,
    selectedItem: selectedGroup,
    handledSelectedItem: handledSelectGroup,
  } = useModalLogic<GroupEventMongo>();
  const {
    isOpenModal: isOpenCategoryModal,
    closeModal: closeCategoryModal,
    openModal: openCategoryModal,
    handledSelectedItem: handledSelectCategory,
    selectedItem: selectedCategory,
  } = useModalLogic<ICategory>();
  const {
    isOpenModal: isOpenManageGroupModal,
    closeModal: closeManageGroupModal,
    openModal: openManageGroupModal,
    handledSelectedItem: handledSelectManageGroup,
    selectedItem: selectedManageGroup,
  } = useModalLogic<GroupEventMongo>();
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
            setSelectGroup={handledSelectGroup}
            dataSource={groupEvent}
            handledOpenModalGroup={openGroupModal}
            toggleModalGroup={openGroupModal}
            organizationId={organizationId}
            handledOpenManageGroup={openManageGroupModal}
            handledSelectManageGroup={handledSelectManageGroup}
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
          handledDelteEvent={handledDelteEvent}
          handledDelteOrgUser={handledDelteOrgUser}
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
      {isOpenManageGroupModal && selectedManageGroup && (
        <ManageGroup
          handledAddGroup={handledAddGroup}
          handledUpdate={handledUpdateGroup}
          visible={isOpenManageGroupModal}
          onCancel={closeManageGroupModal}
          organizationId={organizationId}
          selectedGroup={selectedManageGroup}
          handledDelteEvent={handledDelteEvent}
          handledDelteOrgUser={handledDelteOrgUser}
        />
      )}
    </>
  );
};

export default Category;
