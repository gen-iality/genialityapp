import { Modal, notification, Button } from 'antd';
import { useEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import withContext from '../../authentication/ModalAuthAnonymous';
import { recordTypeForThisEvent } from '@components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { useEffect, useState } from 'react';
import { UsersApi } from '@helpers/request';
import { async } from 'ramda-adjunct';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { UseUserEvent } from '@context/eventUserContext';
const ModalUpdate = (props: any) => {
  let cEvent = useEventContext();
  let cEventUser = UseUserEvent();

  const [isVisible, setIsVisible] = useState(false);
  let { handleChangeTypeModal } = useHelper();
  const handleOpen = () => {
    setIsVisible(false);
    handleChangeTypeModal('update');
  };

  const btn = <Button onClick={handleOpen}>Actualizar</Button>;
  const validateAttende = async () => {
    if (!cEvent.value && !cEventUser.value) return;
    if (cEventUser.value?.rol.type !== 'attendee') return;
    try {
      await UsersApi.validateAttendeeData(cEvent.value._id, cEventUser.value._id);
    } catch (error) {
      // notification.info({
      //   message: 'Informacion Importante',
      //   description: 'Tienes informacion que actualizar para este evento, por favor actualice la informacion',
      //   btn,
      // });

      setIsVisible(true);
    }
  };

  useEffect(() => {
    validateAttende();
  }, [cEvent.value, cEventUser.value]);

  return (
    <Modal
      okText='Actualizar'
      title='Informacion Importante'
      visible={isVisible}
      onOk={handleOpen}
      cancelText='Cancelar'
      onCancel={() => setIsVisible(false)}>
      Tienes informacion que actualizar para este evento, por favor actualice la informacion
    </Modal>
  );
};
export default ModalUpdate;
