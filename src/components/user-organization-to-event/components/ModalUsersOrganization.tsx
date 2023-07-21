import { Button, Card, Modal, ModalProps, Result, Row, Space, Typography } from 'antd';
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
          <>
            <Row justify='space-between'>
              <Typography.Title level={5}>Lista de usuarios de la organización</Typography.Title>
            </Row>
            <UserOrganizationToEventList
              className='desplazar'
              loading={isLoading}
              dataSource={membersData}
              style={{ marginTop: '10px', minHeight: '100%', maxHeight: '60vh', overflowY: 'scroll' }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalUsersOrganization;
