import { useState } from 'react';
import { Card, message, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalCreateOrg from './modalCreateOrg';
import ModalListOrg from './modalListOrg';
import functionCreateNewOrganization from './functionCreateNewOrganization';

// Componente modal para la creacion de una organizacion <ModalCreateOrg/>

const NewCard = (props) => {
  const entity = props.entityType ? props.entityType : 'event';
  const [modalCreateOrgIsVisible, setModalCreateOrgIsVisible] = useState(false);
  const [modalListOrgIsVisible, setModalListOrgIsVisible] = useState(false);

  const newOrganization = () => {
    setModalCreateOrgIsVisible(true);
  };
  const newEvent = () => {
    if (props?.org?.length > 0) {
      setModalListOrgIsVisible(true);
    } else {
      const newValues = {
        name: props.cUser.value.names || props.cUser.value.displayName,
        logo: null,
        newEventWithoutOrganization: true,
        closeModal: setModalListOrgIsVisible,
      };
      functionCreateNewOrganization(newValues);
    }
  };

  return (
    <>
      {modalCreateOrgIsVisible && (
        <ModalCreateOrg
          modalCreateOrgIsVisible={modalCreateOrgIsVisible}
          setModalCreateOrgIsVisible={setModalCreateOrgIsVisible}
          fetchItem={props.fetchItem}
        />
      )}

      {modalListOrgIsVisible && (
        <ModalListOrg
          modalListOrgIsVisible={modalListOrgIsVisible}
          setModalListOrgIsVisible={setModalListOrgIsVisible}
          org={props.org}
          cUserId={props.cUser.value._id}
        />
      )}

      <Card
        onClick={entity === 'event' ? newEvent : newOrganization}
        style={{
          borderRadius: '10px',
          border: '2px dashed #cccccc',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Space size={5} direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
          <PlusOutlined style={{ fontSize: '80px', paddingTop: '10%', paddingBottom: '10%', color: '#cccccc' }} />
          <Typography.Text style={{ fontSize: '15px', width: '120px', color: '#cccccc', fontWeight: 'bold' }}>
            {entity === 'event' ? 'Nuevo evento' : 'Nueva Organizacion'}
          </Typography.Text>
        </Space>
      </Card>
    </>
  );
};

export default NewCard;
