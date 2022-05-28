import { UseEventContext } from '../../context/eventContext';
import { Button, Divider, PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { UseUserEvent } from '../../context/eventUserContext';
import { UseCurrentUser } from '../../context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { useIntl } from 'react-intl';

const InfoEvent = () => {
  let cEvent = UseEventContext();
  let { handleChangeTypeModal } = useHelper();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  const intl = useIntl();
  return (
    <PageHeader
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '10px',
        paddingBottom: '20px',
        margin: '20px',
        borderTop: `5px solid ${cEvent.value.styles.toolbarDefaultBg}`,
        borderRadius: '20px',
        backgroundColor: 'white',
      }}
      title={cEvent.value.name}
      extra={
        recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' &&
        cUser?.value &&
        !cEventUser?.value && (
          <Button onClick={() => handleChangeTypeModal('registerForTheEvent')} type='primary' size='large'>
            {intl.formatMessage({
              id: 'Button.signup',
              defaultMessage: 'Inscribirme al curso',
            })}
          </Button>
        )
      }
      footer={
        <Space>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value.datetime_from).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value.datetime_from).format('LT')}</time>
            </Space>
          </Space>
          <Divider type='vertical'></Divider>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value.datetime_to).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value.datetime_to).format('LT')}</time>
            </Space>
          </Space>
        </Space>
      }></PageHeader>
  );
};

export default InfoEvent;
