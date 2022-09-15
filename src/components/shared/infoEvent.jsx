import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { UseEventContext } from '../../context/eventContext';
import { UseUserEvent } from '../../context/eventUserContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { UseCurrentUser } from '../../context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import EventAccessAction from './eventAccessAction/EventAccessAction';

const InfoEvent = ({ paddingOff, preview }) => {
  const intl = useIntl();
  let isPreview = preview ? true : false;
  let cEvent = UseEventContext();
  let cEventValues = cEvent.value;
  let { handleChangeTypeModal, helperDispatch } = useHelper();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  const cUserValues = cUser.value;

  const bgColor = cEventValues?.styles?.toolbarDefaultBg;
  const textColor = cEventValues?.styles?.textMenu;

  //PARA REDIRIGIR A LA LANDING
  const history = useHistory();

  //VALIDACION DE BOTONES
  const visibleButton = () => {
    if (
      (recordTypeForThisEvent(cEvent) !== 'PUBLIC_EVENT_WITH_REGISTRATION' ||
        (cUserValues?._id && cEventUser?.value?._id)) &&
      !window.sessionStorage.getItem('session')
    ) {
      return 'JOIN';
    }
    if (recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION' && !cUserValues?._id) {
      return 'SIGNUP';
    }
    if (recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' && cUserValues?._id && !cEventUser?.value?._id) {
      return 'REGISTER';
    }
  };

  const buttonAction = () => {
    if (!isPreview && !cUserValues?._id && recordTypeForThisEvent(cEvent) !== 'UN_REGISTERED_PUBLIC_EVENT') {
      if (!isPreview && recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS') {
        helperDispatch({ type: 'showRegister', visible: true });
        return;
      }

      !isPreview && helperDispatch({ type: 'showLogin', visible: true, organization: 'landing' });
      return;
    }

    if (!isPreview && cEventValues?.where_it_run === 'ExternalEvent') {
      window.open(cEventValues?.url_external, '_blank');
      return;
    }

    if (!isPreview && cEventValues?.where_it_run === 'InternalEvent') {
      //SE GUARDA LA SESION DEL USUARIO POR EL EVENTO ACTUAL
      window.sessionStorage.setItem('session', cEventValues?._id);
      history.replace(`/landing/${cEventValues?._id}`);
    }
  };

  const labelButtonJoin = () => {
    if (cUserValues?._id && cEventValues?.type_event === 'physicalEvent') return '';

    if (cUserValues?._id) {
      return intl.formatMessage({
        id: 'button.join',
        defaultMessage: 'Unirse al evento',
      });
    }

    if (recordTypeForThisEvent(cEvent) === 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS') {
      return intl.formatMessage({
        id: 'Button.signup',
        defaultMessage: 'Inscribirme al evento',
      });
    }

    if (recordTypeForThisEvent(cEvent) !== 'UN_REGISTERED_PUBLIC_EVENT') {
      return intl.formatMessage({
        id: 'modal.title.login',
        defaultMessage: 'Iniciar sesión',
      });
    }

    return intl.formatMessage({
      id: 'button.join',
      defaultMessage: 'Unirse al evento',
    });
  };

  return (
    <PageHeader
      style={{
        paddingLeft: paddingOff ? '' : '30px',
        paddingRight: paddingOff ? '' : '30px',
        paddingTop: '10px',
        paddingBottom: '20px',
        margin: paddingOff ? '' : '20px',
        borderRadius: '20px',
        backgroundColor: bgColor,
      }}
      title={
        <Typography.Title level={4} style={{ color: textColor }}>
          {cEventValues?.name}
        </Typography.Title>
      }
      extra={<EventAccessAction />}
      // extra={
      //   visibleButton() == 'SIGNUP' ? (
      //     <Space wrap>
      //       <Button
      //         style={{ marginRight: 10, color: bgColor, backgroundColor: textColor }}
      //         onClick={() => {
      //           !isPreview && helperDispatch({ type: 'showLogin', visible: true, organization: 'landing' });
      //         }}
      //         type='primary'
      //         size='large'>
      //         {intl.formatMessage({
      //           id: 'modal.title.login',
      //           defaultMessage: 'Iniciar sesión',
      //         })}
      //       </Button>
      //       <Button
      //         style={{ color: bgColor, backgroundColor: textColor }}
      //         onClick={() =>
      //           !isPreview && helperDispatch({ type: 'showRegister', visible: true, organization: 'landing' })
      //         }
      //         type='primary'
      //         size='large'>
      //         {intl.formatMessage({
      //           id: 'Button.signup',
      //           defaultMessage: 'Inscribirme al evento',
      //         })}
      //       </Button>
      //     </Space>
      //   ) : visibleButton() == 'REGISTER' ? (
      //     <Button
      //       style={{ color: bgColor, backgroundColor: textColor }}
      //       onClick={() => !isPreview && handleChangeTypeModal('registerForTheEvent')}
      //       type='primary'
      //       size='large'>
      //       {intl.formatMessage({
      //         id: 'Button.signup',
      //         defaultMessage: 'Inscribirme al evento',
      //       })}
      //     </Button>
      //   ) : (
      //     visibleButton() == 'JOIN' && (
      //       <Button
      //         style={{ color: bgColor, backgroundColor: textColor }}
      //         onClick={buttonAction}
      //         type='primary'
      //         size='large'>
      //         {labelButtonJoin()}
      //       </Button>
      //     )
      //   )
      // }
      footer={
        <Space wrap size={'large'} style={{ color: textColor }}>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEventValues?.datetime_from).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEventValues?.datetime_from).format('LT')}</time>
            </Space>
          </Space>

          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEventValues?.datetime_to).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEventValues?.datetime_to).format('LT')}</time>
            </Space>
          </Space>
          {cEventValues?.type_event !== 'onlineEvent' && (
            <Space>
              <EnvironmentOutlined />
              <Space wrap split='/'>
                <Typography.Text style={{ color: textColor }}>{cEventValues?.address}</Typography.Text>
                <Typography.Text style={{ color: textColor }} italic>
                  {cEventValues?.venue}
                </Typography.Text>
              </Space>
            </Space>
          )}
        </Space>
      }></PageHeader>
  );
};

export default InfoEvent;
