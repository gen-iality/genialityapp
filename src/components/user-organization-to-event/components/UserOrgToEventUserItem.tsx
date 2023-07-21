import { useState } from 'react';
import { Button, List, Space, Tag } from 'antd';
import { UserOrganizationToEvent } from '../interface/table-user-oranization-to-event';
import { ModalAddEventUserFromOrganization } from './ModalAddEventUserFromOrganization';

interface Props {
  userOrg: UserOrganizationToEvent;
  getNewUsersOrgList: () => void;
}
export const UserOrgToEventUserItem = ({ userOrg, getNewUsersOrgList }: Props) => {
  const [modalAddEventUser, setModalAddEventUser] = useState(false);

  const onCloseModal = () => {
    setModalAddEventUser(false);
  };

  const onOpenModal = () => {
    setModalAddEventUser(true);
  };

  return (
    <>
      <List.Item
        key={userOrg.id}
        actions={[
          <Space align='center' key={'123ef1e56f45e6'}>
            {userOrg.isAlreadyEventUser ? (
              <>
                <Tag color={'success'} style={{ padding: '4px 8px', fontSize: '14px' }}>
                  Inscrito
                </Tag>
              </>
            ) : (
              <Button onClick={onOpenModal} type='primary'>
                Inscribir
              </Button>
            )}
          </Space>,
        ]}>
        <List.Item.Meta title={userOrg.name} description={userOrg.email} />
      </List.Item>
      {modalAddEventUser && (
        <ModalAddEventUserFromOrganization
          getNewUsersOrgList={getNewUsersOrgList}
          destroyOnClose
          visible={modalAddEventUser}
          onCancel={onCloseModal}
          selectedUserOrg={userOrg}
        />
      )}
    </>
  );
};
