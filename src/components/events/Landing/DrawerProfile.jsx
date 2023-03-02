import { Button, Drawer, Row, Space, Tooltip, Col, Spin, List, notification, Typography, Modal } from 'antd';
import { useCurrentUser } from '@context/userContext';
import { formatDataToString } from '@helpers/utils';

import { useHelper } from '@context/helperContext/hooks/useHelper';
import { setViewPerfil } from '../../../redux/viewPerfil/actions';
import { connect } from 'react-redux';
import { addNotification, haveRequest, isMyContacts, SendFriendship } from '@helpers/netWorkingFunctions';
import { useEventContext } from '@context/eventContext';
import { useUserEvent } from '@context/eventUserContext';
import { setUserAgenda } from '../../../redux/networking/actions';
import withContext from '@context/withContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';
import { UsersApi } from '@helpers/request';
import { DispatchMessageService } from '@context/MessageService';
import FormComponent from '../registrationForm/form';

const DrawerProfile = (props) => {
  const cUser = useCurrentUser();
  const cEvent = useEventContext();
  const cEventUser = useUserEvent();
  const { propertiesProfile, requestSend } = useHelper();
  const [userSelected, setUserSelected] = useState();
  const [isMycontact, setIsMyContact] = useState();
  const [isMe, setIsMe] = useState(false);
  const [send, setSend] = useState(false);
  const [userPropertiesProfile, setUserPropertiesProfile] = useState();
  const [openModal, setOpenModal] = useState(false);

  const intl = useIntl();

  useEffect(() => {
    if (props.profileuser) {
      console.log(props.profileuser._id, cEventUser.value, props.profileuser);
      if (props.profileuser._id !== cEventUser.value?.account_id) {
        const isContact = isMyContacts(props.profileuser, props.cHelper.contacts);
        setIsMe(cUser.value._id == props.profileuser._id);
        setIsMyContact(isContact);
        setUserSelected(props.profileuser);
        setUserPropertiesProfile(propertiesProfile?.propertiesUserPerfil);
      } else {
        //Si es mi usuario, no estaba mostrando el perfil de los demás usuarios
        if (cEventUser.value == null) return;
        const isContact = isMyContacts(cEventUser.value, props.cHelper.contacts);
        setIsMe(cUser.value._id == cEventUser.value.user._id);
        setIsMyContact(isContact);
        setUserSelected(cEventUser.value);
        setUserPropertiesProfile(propertiesProfile?.propertiesUserPerfil);
      }
    }
  }, [props.profileuser, cEventUser.value, userSelected]);
  const haveRequestUser = (user) => {
    return haveRequest(user, requestSend, 1);
  };

  function closeOrOpenModal() {
    setOpenModal((prevState) => {
      return !prevState;
    });
  }

  async function updateEventUser(values) {
    const eventUserBody = {
      properties: { ...values },
    };

    const resp = await UsersApi.editEventUser(eventUserBody, cEvent.value?._id, cEventUser.value._id);

    if (resp._id) {
      DispatchMessageService({
        type: 'success',
        msj: `Usuario editado correctamente`,
        action: 'show',
      });
      cEventUser.setUpdateUser(true);
      setOpenModal(false);
    } else {
      DispatchMessageService({
        type: 'error',
        msj: `No fue posible editar el Usuario`,
        action: 'show',
      });
    }
  }

  return (
    <>
      {openModal && (
        <Modal zIndex={1} closable visible onCancel={() => closeOrOpenModal()}>
          <div
            style={{
              padding: '0px',
              marginTop: '30px',
            }}
          >
            <FormComponent callback={updateEventUser} />
          </div>
        </Modal>
      )}
      <Drawer
        title={
          <Space>
            <BadgeAccountOutlineIcon
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                height: '40px',
                width: '40px',
                borderRadius: '8px',
                color: cEvent.value.styles.textMenu,
                backgroundColor: cEvent.value.styles.toolbarDefaultBg,
              }}
            />
            {isMe ? (
              <FormattedMessage id="header.my_data_event" defaultMessage="Mi perfil en el curso" />
            ) : (
              <FormattedMessage id="header.my_data_event2" defaultMessage="Perfil del participante en el curso" />
            )}
          </Space>
        }
        zIndex={0}
        visible={props.viewPerfil}
        closable
        onClose={() => props.setViewPerfil({ view: false, perfil: null })}
        width="52vh"
        bodyStyle={{ paddingRight: '0px', paddingLeft: '0px' }}
      >
        <Row justify="center" style={{ paddingLeft: '15px', paddingRight: '10px' }}>
          <Col span={24}>
            <Typography.Paragraph>
              {isMe
                ? 'Esta es tu información suministrada para el curso'
                : ' Esta es la información suministrada para el curso'}
              <Typography.Text strong> {cEvent.value.name} </Typography.Text>
            </Typography.Paragraph>
          </Col>

          {isMe && (
            <Col span={24}>
              <Button
                onClick={() => {
                  setOpenModal(true);
                }}
                type="text"
                size="middle"
                style={{ backgroundColor: '#F4F4F4', color: '#FAAD14' }}
              >
                {props.cEvent.value.visibility === 'PUBLIC' && (
                  <>{intl.formatMessage({ id: 'modal.title.update', defaultMessage: 'Actualizar mis datos' })}</>
                )}
              </Button>
            </Col>
          )}
        </Row>
        <Row justify="center" style={{ paddingLeft: '15px', paddingRight: '5px' }}>
          <Col
            className="asistente-list" //agrega el estilo a la barra de scroll
            span={24}
            style={{ marginTop: '20px', height: '50vh', maxHeight: '50vh', overflowY: 'auto' }}
          >
            {(!userSelected || !userPropertiesProfile) && (
              <Spin style={{ padding: '50px' }} size="large" tip="Cargando..."></Spin>
            )}

            {
              //userSelected._id == cUser.value._id ? (

              <List
                bordered
                style={{ borderRadius: '8px' }}
                dataSource={userPropertiesProfile && userPropertiesProfile}
                renderItem={(item) =>
                  ((item?.visibleByContacts && isMycontact && !item?.sensibility) || !item.sensibility) &&
                  userSelected.properties[item?.name] &&
                  item?.name !== 'picture' &&
                  item?.name !== 'imagendeperfil' &&
                  item?.type !== 'password' &&
                  item?.type !== 'avatar' && (
                    <List.Item>
                      <List.Item.Meta
                        title={item?.label}
                        description={formatDataToString(userSelected.properties[item?.name], item)}
                      />
                    </List.Item>
                  )
                }
              />
            }
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
  viewPerfil: state.viewPerfilReducer.view,
  profileuser: state.viewPerfilReducer.perfil,
});

const mapDispatchToProps = {
  setViewPerfil,
  setUserAgenda,
};

export default connect(mapStateToProps, mapDispatchToProps)(withContext(DrawerProfile));
