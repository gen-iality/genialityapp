import { CheckCircleFilled } from '@ant-design/icons';
import { Badge, Card, Col, Divider, Row, Space, Typography, Checkbox, Avatar, Tooltip, Button, Switch, Popover } from 'antd';
import { useContextNewEvent } from '../../../../context/newEventContext';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ShieldAccountIcon from '@2fd/ant-design-icons/lib/ShieldAccount';
import AccountTieIcon from '@2fd/ant-design-icons/lib/AccountTie';
import IncognitoIcon from '@2fd/ant-design-icons/lib/Incognito';
import MessageIcon from '@2fd/ant-design-icons/lib/Message';
import MessageLockIcon from '@2fd/ant-design-icons/lib/MessageLock';
import DatabaseIcon from '@2fd/ant-design-icons/lib/Database';
import DatabaseOffIcon from '@2fd/ant-design-icons/lib/DatabaseOff';
import CardAccountDetailsStarIcon from '@2fd/ant-design-icons/lib/CardAccountDetailsStar';
import AccountKeyIcon from '@2fd/ant-design-icons/lib/AccountKey';
import CashMultipleIcon from '@2fd/ant-design-icons/lib/CashMultiple';
import CashCheckIcon from '@2fd/ant-design-icons/lib/CashCheck';
import InformationOutlineIcon from '@2fd/ant-design-icons/lib/InformationOutline';

const AccessTypeEvent = () => {
  /**
   * accessType === 0 -> Publico con registro obligatorio
   * accessType === 1 -> Publico sin registro obligatorio
   * accessType === 2 -> Privado por invitacion
   * accessType === 3 -> Pago
   */
  
  const { dispatch, state } = useContextNewEvent();

  return (
    <Row justify='start' gutter={[16, 16]} wrap>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Card
          hoverable
          bodyStyle={{paddingTop: 0}}
          headStyle={{ border: 'none' }}
          title={
            <Avatar
              style={{
                color: state.type === 0 ? '#2593FC' : '#FFFFFF',
                backgroundColor: state.type === 0 ? '#2593FC' + '4D' : '#C4C4C4',
              }}
              size={'large'}
              shape='square'
              icon={<AccountTieIcon />}
            />
          }
          extra={
            <Space style={{ fontSize: '22px', color: state.type === 0 ? '#2593FC' + '99' : '#C4C4C4' }}>
              <Popover content={
                <Space direction='vertical'>
                  <Typography.Text><AccountKeyIcon /> Tiene autenticación de usuario</Typography.Text>
                  <Typography.Text><DatabaseIcon /> Puede recolectar información de sus asistentes</Typography.Text>
                  <Typography.Text><MessageIcon /> Tiene chat público</Typography.Text>
                  <Typography.Text><MessageLockIcon /> Tiene chat privado</Typography.Text>
                </Space>
              }>
                <InformationOutlineIcon />
              </Popover>
            </Space>
          }
          style={{
            height: '100%',
            width: '100%',
            minHeight: '200px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            borderColor: state.type === 0 ? '#2593FC' : '#F0F0F0',
          }}
        >
          <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Evento público con registro
            </Typography.Text>

            <Space direction='vertical'>
              <Typography.Text strong style={{ fontWeight: '500' }}>
                Registrar sin autenticar usuario
              </Typography.Text>
              <Switch
                checkedChildren={'Si'}
                unCheckedChildren={'No'}
                onChange={() => dispatch({ type: 'TYPE_AUTHENTICATION' })}
              />
            </Space>

            <Row align='bottom' gutter={[16, 16]}>
              <Button
                style={{
                  color: state.type === 0 ? '#2593FC' : '#FFFFFF',
                  backgroundColor: state.type === 0 ? '#2593FC' + '4D' : '#C4C4C4',
                  position: 'absolute', bottom: '15px', right: '24px'
                }}
                size='large'
                type={'text'}
                onClick={() => {
                  dispatch({ type: 'TYPE_EVENT', payload: { type: 0 } }); 
                  this.changetypeEvent(0);
                }}
              >
                {state.type === 0 ? 'Activado' : 'Seleccionar'}
              </Button>
            </Row>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Card
          hoverable
          bodyStyle={{paddingTop: 0}}
          headStyle={{ border: 'none' }}
          title={
            <Avatar
              style={{
                color: state.type === 1 ? '#2593FC' : '#FFFFFF',
                backgroundColor: state.type === 1 ? '#2593FC' + '4D' : '#C4C4C4',
              }}
              size={'large'}
              shape='square'
              icon={<AccountGroupIcon />}
            />
          }
          extra={
            <Space style={{ fontSize: '22px', color: state.type === 1 ? '#2593FC' + '99' : '#C4C4C4' }}>
              <Popover content={
                <Space direction='vertical'>
                  <Typography.Text><IncognitoIcon /> Los asistentes son anonimos</Typography.Text>
                  <Typography.Text><DatabaseOffIcon /> No puede recolectar información de sus asistentes</Typography.Text>
                  <Typography.Text><MessageIcon /> Tiene chat público</Typography.Text>
                </Space>
              }>
                <InformationOutlineIcon />
              </Popover>
            </Space>
          }
          style={{
            height: '100%',
            width: '100%',
            minHeight: '200px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            borderColor: state.type === 1 ? '#2593FC' : '#F0F0F0',
          }}
        >
          <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Evento público sin registro
            </Typography.Text>

            <Row align='bottom' gutter={[16, 16]}>
              <Button
                style={{
                  color: state.type === 1 ? '#2593FC' : '#FFFFFF',
                  backgroundColor: state.type === 1 ? '#2593FC' + '4D' : '#C4C4C4',
                  position: 'absolute', bottom: '15px', right: '24px'
                }}
                size='large'
                type={'text'}
                onClick={() => {
                  dispatch({ type: 'TYPE_EVENT', payload: { type: 1 } }); 
                  this.changetypeEvent(1);
                }}
              >
                {state.type === 1 ? 'Activado' : 'Seleccionar'}
              </Button>
            </Row>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Card
          hoverable
          bodyStyle={{paddingTop: 0}}
          headStyle={{ border: 'none' }}
          title={
            <Avatar
              style={{
                color: state.type === 2 ? '#2593FC' : '#FFFFFF',
                backgroundColor: state.type === 2 ? '#2593FC' + '4D' : '#C4C4C4',
              }}
              size={'large'}
              shape='square'
              icon={<ShieldAccountIcon />}
            />
          }
          extra={
            <Space style={{ fontSize: '22px', color: state.type === 2 ? '#2593FC' + '99' : '#C4C4C4' }}>
              <Popover content={
                <Space direction='vertical'>
                  <Typography.Text><CardAccountDetailsStarIcon /> Requiere invitación</Typography.Text>
                  <Typography.Text><MessageIcon /> Tiene chat público</Typography.Text>
                  <Typography.Text><MessageLockIcon /> Tiene chat privado</Typography.Text>
                </Space>
              }>
                <InformationOutlineIcon />
              </Popover>
            </Space>
          }
          style={{
            height: '100%',
            width: '100%',
            minHeight: '200px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            borderColor: state.type === 2 ? '#2593FC' : '#F0F0F0',
          }}
        >
          <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Evento privado por invitación
            </Typography.Text>

            <Row align='bottom' gutter={[16, 16]}>
              <Button
                style={{
                  color: state.type === 2 ? '#2593FC' : '#FFFFFF',
                  backgroundColor: state.type === 2 ? '#2593FC' + '4D' : '#C4C4C4',
                  position: 'absolute', bottom: '15px', right: '24px'
                }}
                size='large'
                type={'text'}
                onClick={() => {
                  dispatch({ type: 'TYPE_EVENT', payload: { type: 2 } }); 
                  this.changetypeEvent(2);
                }}
              >
                {state.type === 2 ? 'Activado' : 'Seleccionar'}
              </Button>
            </Row>
          </Space>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Card
          hoverable
          bodyStyle={{paddingTop: 0}}
          headStyle={{ border: 'none' }}
          title={
            <Avatar
              style={{
                color: state.type === 3 ? '#2593FC' : '#FFFFFF',
                backgroundColor: state.type === 3 ? '#2593FC' + '4D' : '#C4C4C4',
              }}
              size={'large'}
              shape='square'
              icon={<CashCheckIcon />}
            />
          }
          extra={
            <Space style={{ fontSize: '22px', color: state.type === 3 ? '#2593FC' + '99' : '#C4C4C4' }}>
              <Popover content={
                <Space direction='vertical'>
                  <Typography.Text><CashMultipleIcon /> Requiere pago</Typography.Text>
                  <Typography.Text><AccountKeyIcon /> Tiene autenticación de usuario</Typography.Text>
                  <Typography.Text><DatabaseIcon /> Puede recolectar información de sus asistentes</Typography.Text>
                  <Typography.Text><MessageIcon /> Tiene chat público</Typography.Text>
                  <Typography.Text><MessageLockIcon /> Tiene chat privado</Typography.Text>
                </Space>
              }>
                <InformationOutlineIcon />
              </Popover>
            </Space>
          }
          style={{
            height: '100%',
            width: '100%',
            minHeight: '200px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            borderColor: state.type === 3 ? '#2593FC' : '#F0F0F0',
          }}
        >
          <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Evento pago
            </Typography.Text>

            <Row align='bottom' gutter={[16, 16]}>
              <Button
                style={{
                  color: state.type === 3 ? '#2593FC' : '#FFFFFF',
                  backgroundColor: state.type === 3 ? '#2593FC' + '4D' : '#C4C4C4',
                  position: 'absolute', bottom: '15px', right: '24px'
                }}
                size='large'
                type={'text'}
                onClick={() => {
                  dispatch({ type: 'TYPE_EVENT', payload: { type: 3 } }); 
                  this.changetypeEvent(3);
                }}
              >
                {state.type === 3 ? 'Activado' : 'Seleccionar'}
              </Button>
            </Row>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default AccessTypeEvent;
