import { UseEventContext } from '../../context/eventContext';
import { Button, Divider, PageHeader, Row, Space, Typography } from 'antd';
import Moment from 'moment';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { UseUserEvent } from '../../context/eventUserContext';
import { UseCurrentUser } from '../../context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

const InfoEvent = ({ paddingOff }) => {
  let cEvent = UseEventContext();
  let { handleChangeTypeModal, helperDispatch } = useHelper();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();

  //PARA REDIRIGIR A LA LANDING
  const history = useHistory();

  //VALIDACION DE BOTONES
  const visibleButton = () => {
    if (
      (recordTypeForThisEvent(cEvent) !== 'PUBLIC_EVENT_WITH_REGISTRATION' || (cUser?.value && cEventUser?.value)) &&
      !window.sessionStorage.getItem('session')
    ) {
      return 'JOIN';
    }
    if (recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' && !cUser?.value) {
      return 'REGISTER';
    }
    if (recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' && cUser?.value && !cEventUser?.value) {
      return 'SIGNUP';
    }
  };

  const intl = useIntl();
  return (
    <PageHeader
      style={{
        paddingLeft: paddingOff ? '' : '30px',
        paddingRight: paddingOff ? '' : '30px',
        paddingTop: '10px',
        paddingBottom: '20px',
        margin: paddingOff ? '' : '20px',
        borderTop: `5px solid ${cEvent.value?.styles?.toolbarDefaultBg}`,
        borderRadius: '20px',
        backgroundColor: 'white',
      }}
      title={cEvent.value?.name}
      extra={
        visibleButton() == 'SIGNUP' ? (
          <Button onClick={() => handleChangeTypeModal('registerForTheEvent')} type='primary' size='large'>
            {intl.formatMessage({
              id: 'Button.signup',
              defaultMessage: 'Inscribirme al evento',
            })}
          </Button>
        ) : visibleButton() == 'REGISTER' ? (
          <Space wrap>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {
                helperDispatch({ type: 'showLogin', visible: true, organization: 'landing' });
              }}
              type='primary'
              size='large'>
              {intl.formatMessage({
                id: 'modal.title.login',
                defaultMessage: 'Iniciar sesión',
              })}
            </Button>
            <Button
              onClick={() => helperDispatch({ type: 'showRegister', visible: true, organization: 'landing' })}
              type='primary'
              size='large'>
              {intl.formatMessage({
                id: 'registration.button.create',
                defaultMessage: 'Registrarme',
              })}
            </Button>
          </Space>
        ) : (
          visibleButton() == 'JOIN' && (
            <Button
              onClick={() => {
                if (recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT') {
                  //SE GUARDA LA SESION DEL USUARIO POR EL EVENTO ACTUAL
                  window.sessionStorage.setItem('session', cEvent.value?._id);
                  history.replace(`/landing/${cEvent.value?._id}`);
                } else {
                  helperDispatch({ type: 'showLogin', visible: true, organization: 'landing' });
                }
              }}
              type='primary'
              size='large'>
              {recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT'
                ? intl.formatMessage({
                    id: 'button.join',
                    defaultMessage: 'Unirse al evento',
                  })
                : intl.formatMessage({
                    id: 'modal.title.login',
                    defaultMessage: 'Iniciar sesión',
                  })}
            </Button>
          )
        )
      }
      footer={
        <Space>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value?.datetime_from).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value?.datetime_from).format('LT')}</time>
            </Space>
          </Space>
          <Divider type='vertical'></Divider>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value?.datetime_to).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value?.datetime_to).format('LT')}</time>
            </Space>
          </Space>
        </Space>
      }></PageHeader>
  );
};

export default InfoEvent;
