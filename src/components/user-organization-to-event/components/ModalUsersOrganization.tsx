import { Modal, ModalProps, Result } from 'antd';
import UserOrganizationToEventList from './UserOrganizationToEvent';
import { useGetUsersOrgToEvent } from '../hooks/useGetUsersOrgToEvent';

interface Props extends ModalProps {
  onCancel: () => void;
  organizationId: string;
  usersEvent: any[];
  eventId: string;
}

const ModalUsersOrganization = ({ onCancel, organizationId = '', usersEvent, eventId, ...modalProps }: Props) => {
  const { error, membersData, isLoading } = useGetUsersOrgToEvent(organizationId);

  return (
    <Modal footer={false} onCancel={onCancel} {...modalProps}>
      <div style={{ padding: '10px' }}>
        {error.haveError ? (
          <Result icon={<></>} title={'Ocurrio un error obteniendo los datos'} subTitle={error.messageError} />
        ) : (
          //   <UserOrganizationToEventTable loading={isLoading} dataSource={membersData} columns={columns} />
          <UserOrganizationToEventList loading={isLoading} dataSource={membersData} />
        )}
      </div>
    </Modal>
  );
};

export default ModalUsersOrganization;
