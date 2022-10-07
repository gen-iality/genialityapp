import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  IdcardOutlined,
  LoadingOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Modal, Tabs, Form, Input, Button, Divider, Typography, Space, Grid, Alert, Image } from 'antd';
import withContext from '../../context/withContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { app } from '../../helpers/firebase';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import RegisterUser from './RegisterUser';
import RegisterUserAnonymous from './RegisterUserAnonymous';
import { UseEventContext } from '../../context/eventContext';
import RegisterUserAndEventUserAnonymous from './RegisterUserAndEventUserAnonymous';
import { isHome, useEventWithCedula } from '../../helpers/helperEvent';
import { useCurrentUser } from '@context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import FormEnrollAttendeeToEvent from '@components/forms/FormEnrollAttendeeToEvent';
import AnonymousEvenUserForm from '@components/socialZone/hooks/anonymousEvenUserForm';
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

const ModalAuthAnonymous = (props: any) => {
  const screens = useBreakpoint();

  const [errorLogin, setErrorLogin] = useState(false);
  const [errorRegisterUSer, setErrorRegisterUSer] = useState(false);
  let { handleChangeTypeModal, typeModal, controllerLoginVisible, helperDispatch, currentAuthScreen } = useHelper();
  const cEvent = UseEventContext();
  const cUser = useCurrentUser();
  const [modalVisible, setmodalVisible] = useState(false);

  const isVisibleRegister = () => {
    let typeEvent = recordTypeForThisEvent(cEvent);
    switch (typeEvent) {
      case 'PRIVATE_EVENT':
        return false;
      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        return false;
      case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    async function isModalVisible() {
      let typeEvent = recordTypeForThisEvent(cEvent);
      switch (typeEvent) {
        case 'PRIVATE_EVENT':
          setmodalVisible(false);
          helperDispatch({ type: 'showLogin', visible: true });
          break;

        case 'PUBLIC_EVENT_WITH_REGISTRATION':
          setmodalVisible(false);
          helperDispatch({ type: 'showRegister', visible: true });
          break;
        case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
          setmodalVisible(true);
          helperDispatch({ type: 'showRegister', visible: true });
          break;

        case 'UN_REGISTERED_PUBLIC_EVENT':
          setmodalVisible(false);
          helperDispatch({ type: 'showLogin', visible: false });
          break;

        default:
          setmodalVisible(false);
          break;
      }
    }

    async function isUserAuth() {
      app.auth().onAuthStateChanged((user) => {
        if (user) {
          setmodalVisible(false);

          helperDispatch({ type: 'showLogin', visible: false });
        } else {
          isModalVisible();
        }
      });
    }

    isUserAuth();
  }, [cEvent, cUser]);

  useEffect(() => {
    setErrorRegisterUSer(false);
    setErrorLogin(false);
  }, [typeModal, currentAuthScreen]);

  return (
    modalVisible && (
      <Modal
        maskStyle={props.organization === 'organization' ? { backgroundColor: '#333333' } : {}}
        centered
        footer={null}
        zIndex={1000}
        visible={controllerLoginVisible?.visible && props.cEvent?.value?.visibility === 'ANONYMOUS'}
        closable={false}>
        {isVisibleRegister() && (
          <div
            style={{
              height: 'auto',
              overflowY: 'hidden',
            }}>
            <RegisterUserAndEventUserAnonymous
              screens={screens}
              stylePaddingMobile={stylePaddingMobile}
              stylePaddingDesktop={stylePaddingDesktop}
            />

            {/* {props.organization != 'register' && <FormComponent />}
                  {props.organization == 'register' && (
                    <FormComponent
                      conditionalsOther={[]}
                      initialOtherValue={{}}
                      eventUserOther={{}}
                      fields={fieldsUser}
                      organization={true}
                      options={[]}
                      callback={(values) => registerUser(values)}
                      loadingregister={loading}
                      errorRegisterUser={errorRegisterUSer}
                    />
                  )} */}
          </div>
        )}
      </Modal>
    )
  );
};

export default withContext(ModalAuthAnonymous);

const fieldsUser = [
  {
    name: 'avatar',
    mandatory: false,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Imagen de perfil',
    description: null,
    type: 'avatar',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
  {
    name: 'names',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Nombre',
    description: null,
    type: 'text',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:31',
    created_at: '2021-09-21 22:43:05',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e72',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 0,
    order_weight: 2,
  },
  {
    name: 'email',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Correo electrónico',
    description: null,
    type: 'email',
    options: [],
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:32',
    created_at: '2021-09-21 21:18:04',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e73',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 1,
    order_weight: 3,
    sensibility: true,
  },
  {
    name: 'password',
    mandatory: true,
    visibleByContacts: false,
    visibleByAdmin: false,
    label: 'Contraseña',
    description: null,
    type: 'password',
    justonebyattendee: false,
    updated_at: '2021-09-22 14:25:33',
    created_at: '2021-09-21 21:56:24',
    _id: {
      $oid: '6160b1a7f6cfdd38d4502e74',
    },
    author: null,
    categories: [],
    event_type: null,
    organiser: null,
    organizer: null,
    currency: {},
    tickets: [],
    index: 2,
    order_weight: 1,
  },
];
