import { useState, useEffect } from 'react';
import { Steps, Button, Alert } from 'antd';
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
const { Step } = Steps;

const RegisterUserAndEventUser = ({ screens, stylePaddingMobile, stylePaddingDesktop }: any) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
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
            const body = {
              event_id: cEvent.value._id,
              uid: user.user?.uid,
              anonymous: true,
              properties: {
                ...values,
              },
            };
            await app.auth().currentUser?.reload();
            await AttendeeApi.create(cEvent.value._id, body);
            cEvent.setUpdateUser(true);
            helperDispatch({ type: 'showLogin', visible: false });
          });
      })
      .catch((err) => {
        console.log(err);
        DispatchMessageService({
          type: 'error',
          msj: 'Ha ocurrido un error',
          action: 'show',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log('current', cEvent);
  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
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
