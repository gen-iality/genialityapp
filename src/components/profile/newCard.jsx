import React, { useState } from 'react';
import { Card, message, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalCreateOrg from './modalCreateOrg';

// Componente modal para la creacion de una organizacion <ModalCreateOrg/>

const NewCard = (props) => {
  const entity = props.entityType ? props.entityType : 'event';

  const newOrganization = () => {
    message.warning('Aqui saldra el modal de creacion de la organizacion');
  };

  const newEvent = () => {
    message.success('Aqui se abrira la nueva forma de crear un evento');
  };

  return (
    <Card
      onClick={entity === 'event' ? newEvent : newOrganization}
      style={{ borderRadius: '10px', border: '2px dashed #cccccc', cursor: 'pointer', height: '100%', display: "flex",
      alignItems: "center",
      justifyContent: "center", }}>
      <Space size={5} direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
        <PlusOutlined style={{ fontSize: '80px', paddingTop: '10%', paddingBottom: '10%', color: '#cccccc' }} />
        <Typography.Text style={{ fontSize: '15px', width: '120px', color: '#cccccc', fontWeight: 'bold' }}>
          {entity === 'event' ? 'Nuevo evento' : 'Nueva Organizacion'}
        </Typography.Text>
      </Space>
    </Card>
  );
};

export default NewCard;
