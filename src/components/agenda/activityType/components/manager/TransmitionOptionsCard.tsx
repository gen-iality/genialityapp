import React, { useContext, useState, useMemo } from 'react';
import { Card, Button, Space, Typography, Popconfirm } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import AgendaContext from '@context/AgendaContext';
import {CurrentEventContext} from '@context/eventContext';
import useActivityType from '@context/activityType/hooks/useActivityType';
import { TypeDisplayment, MainUI } from '@context/activityType/constants/enum';

// Definición del componente con desestructuración de las props directamente en la firma de la función
const TransmitionOptionsCard = ({ type }) => {
  // Estado local para controlar la operación de eliminación
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks personalizados y contexto para obtener y manipular el estado global
  const { is, executer_stopStream, resetActivityType, setVideoId, videoId } = useActivityType();
  const {
    dataLive,
    meeting_id,
    setDataLive,
    setMeetingId,
    removeAllRequest,
    removeViewers,
    saveConfig,
    setRoomStatus,
    activityEdit,
  } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);

  // Memos para calcular valores que dependen de los contextos y que no deben recalcularse en cada render
  const refActivityBase = useMemo(() => `request/${cEvent.value?._id}/activities/${activityEdit}`, [cEvent, activityEdit]);
  const isVisible = useMemo(() => [TypeDisplayment.TRANSMISSION, TypeDisplayment.EVIUS_MEET].includes(type), [type]);

  // Función para manejar la confirmación de eliminación
  const handleDelete = async () => {
    setIsDeleting(true); // Inicia el indicador de carga
    await performDeleteOperations(); // Realiza operaciones de eliminación
    setIsDeleting(false); // Finaliza el indicador de carga
  };

  // Función que encapsula las operaciones de eliminación
  const performDeleteOperations = async () => {
    await resetActivityTypeAccordingToType(); // Resetea el tipo de actividad basado en el contexto actual
    // Operaciones comunes de limpieza
    setDataLive(null);
    setMeetingId(null);
    setVideoId(null);
    setRoomStatus('created_meeting_room'); // Actualiza el estado de la sala
    await saveConfig({ habilitar_ingreso: 'created_meeting_room', data: null, type: 'delete' }); // Guarda la configuración actualizada
  };

  // Función para resetear el tipo de actividad basado en el tipo actual
  const resetActivityTypeAccordingToType = async () => {
    switch (type) {
      case TypeDisplayment.VIDEO:
        await resetActivityType(MainUI.VIDEO);
        break;
      case TypeDisplayment.MEETING:
        await resetActivityType(MainUI.MEETING);
        break;
      default:
        await resetActivityType(MainUI.LIVE);
    }
  };

  // Función para obtener el mensaje de confirmación de eliminación basado en el tipo
  const getDeletingMessage = () => {
    switch (type) {
      case TypeDisplayment.TRANSMISSION:
      case TypeDisplayment.EVIUS_MEET:
      case TypeDisplayment.VIMEO:
      case TypeDisplayment.YOUTUBE:
        return 'eliminar transmisión';
      case TypeDisplayment.MEETING:
        return 'eliminar sala de reunión';
      default:
        return 'eliminar video';
    }
  };

  // Renderizado del componente, utilizando Ant Design components
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={<Typography.Text style={{ fontSize: '20px' }} strong>Opciones de {type}</Typography.Text>}
        avatar={<WarningOutlined style={{ color: '#FE5455', fontSize: '25px' }} />}
        description={
          <Space>
            {isVisible && dataLive?.active && (
              <Button type="primary" danger loading={is.stoppingStreaming} onClick={executer_stopStream}>
                Detener
              </Button>
            )}
            <Popconfirm
              title={`¿Está seguro que desea ${getDeletingMessage()}?`}
              onConfirm={handleDelete}
              okText="Sí"
              cancelText="No"
            >
              <Button danger loading={isDeleting}>Eliminar</Button>
            </Popconfirm>
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptionsCard;
