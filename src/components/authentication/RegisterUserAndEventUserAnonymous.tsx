import FormEnrollAttendeeToEvent from '@/components/forms/FormEnrollAttendeeToEvent';
import { UseUserEvent } from '@/context/eventUserContext';
import { UseCurrentUser } from '@/context/userContext';
import { AttendeeApi } from '@/helpers/request';
import { fieldNameEmailFirst } from '@/helpers/utils';
import { Steps, Typography } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { UseEventContext } from '../../context/eventContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '../../context/MessageService';
import { app } from '../../helpers/firebase';
import openNewWindow from './ModalsFunctions/openNewWindow';
const { Step } = Steps;
const { Title } = Typography;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }: any) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  let { helperDispatch } = useHelper();
  const [loading, setLoading] = useState(false);
  const { fields_conditions, type_event, _id, user_properties } = cEvent?.value || {};
  let fields = fieldNameEmailFirst(user_properties);
  // Esto es temporal por el envento de audi consultar con Marlon o Sebas :D
  const labelButton = cEvent?.value?._id === '6334782dc19fe2710a0b8753' ? 'Inscribirme y Donar' : 'Ingresar';
  let attendee: any = cUser.value || {};
  attendee['properties'] = cUser.value;
  const handleSubmit = async (values: any) => {
    setLoading(true);
    app
      .auth()
      .signInAnonymously()
      .then((user) => {
        app
          .auth()
          .currentUser?.updateProfile({
            displayName: values.names,
            /**almacenamos el email en el photoURL para poder setearlo en el context del usuario y asi llamar el eventUser anonimo */
            photoURL: values.email,
          })
          .then(async () => {
            if (user.user) {
              const body = {
                event_id: cEvent.value._id,
                uid: user.user?.uid,
                anonymous: true,
                properties: {
                  ...values,
                },
              };
              await app.auth().currentUser?.reload();
              AttendeeApi.create(cEvent.value._id, body).then((data) => {
                cEventUser.setUpdateUser(true);
                helperDispatch({ type: 'showLogin', visible: false });
                setLoading(false);
              });
              // Esto es temporal por el evento de audi, se va planear de una mejor manera
              openNewWindow('https://checkout.wompi.co/l/VPOS_N4aqRq', cEvent.value._id, true);
            }
          });
      })
      .catch((err) => {
        console.log(err);
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error',
          action: 'show',
        });
      });
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center' }}>
        {intl.formatMessage({
          id: 'modal.title.registerevent..',
          defaultMessage: 'Información para el evento',
        })}
      </Title>
      <FormEnrollAttendeeToEvent
        saveAttendee={handleSubmit}
        fields={fields}
        attendee={attendee}
        conditionalFields={fields_conditions}
        loaderWhenSavingUpdatingOrDelete={loading}
        submitButtonProps={{
          styles: {
            marginTop: '20px',
          },
          text: labelButton,
        }}
      />
    </div>
  );
};

export default RegisterUserAndEventUser;
