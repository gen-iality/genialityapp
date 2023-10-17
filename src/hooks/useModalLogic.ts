import { useState } from 'react';

export const useModalLogic = <T>() => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T>();

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedItem(undefined);
  };
  return {
    openModal,
    closeModal,
    isOpenModal,
    selectedItem,
    handledSelectedItem: setSelectedItem,
  };
};
