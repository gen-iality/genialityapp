import { Modal, ModalProps } from 'antd';
import React from 'react';
import { UserOrganizationForm } from './UserOrganizationForm';

interface Props extends ModalProps {}
export const ModalAddAndEditUsers = ({ ...modalProps }: Props) => {
  return (
    <Modal closable footer={false} {...modalProps}>
      <div
        style={{
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '30px',
        }}>
        <UserOrganizationForm />
      </div>
    </Modal>
  );
};
