import { useState, useEffect } from 'react';
import { Steps, Button, Alert, Typography } from 'antd';
import RegisterFast from './Content/RegisterFast';
import RegistrationResult from './Content/RegistrationResult';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import { ScheduleOutlined } from '@ant-design/icons';
import FormComponent from '../events/registrationForm/form';
import { UsersApi } from '../../helpers/request';
import { LoadingOutlined } from '@ant-design/icons';
import createNewUser from './ModalsFunctions/createNewUser';
import { useIntl } from 'react-intl';
import { UseEventContext } from '../../context/eventContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { DispatchMessageService } from '../../context/MessageService';
import FormEnrollAttendeeToEvent from '@/components/forms/FormEnrollAttendeeToEvent';
import { fieldNameEmailFirst } from '@/helpers/utils';
import { app } from '../../helpers/firebase';
import { AttendeeApi } from '@/helpers/request';
import { UseUserEvent } from '@/context/eventUserContext';
const { Step } = Steps;
const { Title } = Typography;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }: any) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  let { helperDispatch } = useHelper();
  const [loading, setLoading] = useState(false);
  const { fields_conditions, type_event, _id, user_properties } = cEvent?.value || {};
  let fields = fieldNameEmailFirst(user_properties);
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
            console.log('response', user);
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
                console.log('response', data);
                cEventUser.setUpdateUser(true);
                helperDispatch({ type: 'showLogin', visible: false });
                setLoading(false);
              });
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
        conditionalFields={fields_conditions}
        loaderWhenSavingUpdatingOrDelete={loading}
        submitButtonProps={{
          styles: {
            marginTop: '20px',
          },
          text: 'Ingresar',
        }}
      />
    </div>
  );
};

export default RegisterUserAndEventUser;
