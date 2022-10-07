import { UseEventContext } from '@context/eventContext';
import { Button, Divider, PageHeader, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { UseUserEvent } from '@context/eventUserContext';
import { useCurrentUser } from '@context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { useIntl } from 'react-intl';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const InfoEvent = () => {
  const cEvent = UseEventContext();
  let { handleChangeTypeModal, eventIsActive } = useHelper();
  const cEventUser = UseUserEvent();
  const cUser = useCurrentUser();

  const intl = useIntl();
  return (
    <PageHeader
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '10px',
        paddingBottom: '0', //20px
        margin: '20px',
        // border: `2px solid ${cEvent.value.styles.textMenu}`,
        border: `1px solid #afafaf`,
        boxShadow: '0px 0px 8px 5px #eee',
        borderRadius: '20px',
        backgroundColor: cEvent.value.styles.toolbarDefaultBg,
      }}
      title={
        <Typography.Title level={2} style={{ color: cEvent.value.styles.textMenu }}>
          {cEvent.value.name}
        </Typography.Title>
      }
      extra={
        recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' &&
        cUser?.value &&
        !cEventUser?.value && (
          <Button
            onClick={() => handleChangeTypeModal('registerForTheEvent')}
            type='primary'
            size='large'
            disabled={!eventIsActive}>
            {intl.formatMessage({
              id: 'Button.signup',
              defaultMessage: 'Inscribirme al curso',
            })}
          </Button>
        )
      }
      // footer={
      //   <Space style={{ color: cEvent.value.styles.textMenu }}>
      //     <Space wrap>
      //       <Space>
      //         <CalendarOutlined />
      //         <time>{dayjs(cEvent.value.datetime_from).format('ll')}</time>
      //       </Space>
      //       <Space>
      //         <ClockCircleOutlined />
      //         <time>{dayjs(cEvent.value.datetime_from).format('LT')}</time>
      //       </Space>
      //     </Space>
      //     <Divider type='vertical'></Divider>
      //     <Space wrap>
      //       <Space>
      //         <CalendarOutlined />
      //         <time>{dayjs(cEvent.value.datetime_to).format('ll')}</time>
      //       </Space>
      //       <Space>
      //         <ClockCircleOutlined />
      //         <time>{dayjs(cEvent.value.datetime_to).format('LT')}</time>
      //       </Space>
      //     </Space>
      //   </Space>
      // }
      ></PageHeader>
  );
};

export default InfoEvent;
