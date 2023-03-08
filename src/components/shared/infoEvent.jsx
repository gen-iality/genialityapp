import { useEventContext } from '@context/eventContext';
import { Button, Divider, PageHeader, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { CalendarOutlined, ClockCircleOutlined, GoldOutlined, HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import { useUserEvent } from '@context/eventUserContext';
import { useCurrentUser } from '@context/userContext';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { useIntl } from 'react-intl';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';

dayjs.extend(localizedFormat);

const InfoEvent = () => {
  const cEvent = useEventContext();
  const { handleChangeTypeModal, eventIsActive } = useHelper();
  const cEventUser = useUserEvent();
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
        border: `1px solid rgba(0,0,0,0.5)`,
        // boxShadow: '0px 0px 8px 5px #eee',
        borderRadius: '0.3em',
        backgroundColor: cEvent.value.styles.toolbarDefaultBg,
      }}      
      title={
        <Typography.Title
          level={2}
          style={{ color: cEvent.value.styles.textMenu, fontSize: '2.5rem', whiteSpace: 'normal' }}
        >
          {cEvent.value.name}
          {' '}
          <Link
            title="Ir a la organización"
            to={`/organization/${cEvent.value.organizer._id}`}
          >
            <Button icon={<GoldOutlined /> }>Ir a la organización</Button>
          </Link>
        </Typography.Title>
      }
      extra={
        recordTypeForThisEvent(cEvent) !== 'PRIVATE_EVENT' &&
        cUser?.value &&
        !cEventUser?.value && (
          <Button
            onClick={() => handleChangeTypeModal('registerForTheEvent')}
            type="primary"
            size="large"
            disabled={!eventIsActive}
          >
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
      //     <Divider type="vertical"></Divider>
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
