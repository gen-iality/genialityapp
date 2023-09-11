import React from 'react';
import { Modal, Input } from 'antd';
interface CategoryModalProps {
    isVisible: boolean;
    onOk: () => void;
    onCancel: () => void;
    title: string;
    categoryValue: string;
    handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  const CategoryModal: React.FC<CategoryModalProps> = ({
  isVisible,
  onOk,
  onCancel,
  title,
  categoryValue,
  handleCategoryChange,
}) => {
  return (
    <Modal
      title={title}
      visible={isVisible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Input
        placeholder='Nombre de la categoría'
        value={categoryValue}
        onChange={handleCategoryChange}
        maxLength={20}
      />
    </Modal>
  );
};

export default CategoryModal;
