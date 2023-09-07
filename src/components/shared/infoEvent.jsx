import { isHome } from '@/helpers/helperEvent';
import { CalendarFilled, ClockCircleFilled, EnvironmentFilled } from '@ant-design/icons';
import { Button, PageHeader, Space, Typography, Grid } from 'antd';
import { UseEventContext } from '../../context/eventContext';
import EventAccessActionContainer from './eventAccessAction/EventAccessActionContainer';
import { useIntl } from 'react-intl';
import { useGetMultiDate } from '@/hooks/useGetMultiDate';
import moment from 'moment';

const { useBreakpoint } = Grid;

const InfoEvent = ({ paddingOff, preview }) => {
  let isPreview = preview ? true : false;
  let cEvent = UseEventContext();
  let cEventValues = cEvent.value;
  const screens = useBreakpoint();
  // console.log('Soy una landing');

  const bgColor = cEventValues?.styles?.toolbarDefaultBg;
  const textColor = cEventValues?.styles?.textMenu;
  //Validacion temporal para el evento audi
  const idEvent = cEventValues?._id;
  const intl = useIntl();
  const { getDateStart, getDateEnd, getStartTime, getEndTime } = useGetMultiDate(idEvent);
  console.log(cEventValues);
  const getDateEvent = () => {
    if (!cEventValues) return <></>;
    const MIN_DATES = 1;
    const EVENT_WITH_ONE_DATE = 1;
    const FIRST_DATE = 0;
    if (cEventValues.dates?.length >= MIN_DATES) {
      const LAST_DATE = cEventValues.dates?.length - 1;
      if (cEventValues.dates?.length === EVENT_WITH_ONE_DATE) {
        return (
          <time dateTime={cEventValues.dates[FIRST_DATE].start}>
            {moment(cEventValues.dates[FIRST_DATE].start).format('DD MMM YYYY')}
          </time>
        );
      } else {
        return (
          <>
            <time dateTime={cEventValues.dates[FIRST_DATE].start}>
              {moment(cEventValues.dates[FIRST_DATE].start).format('DD MMM YYYY')}
            </time>
            {'-'}
            <time dateTime={cEventValues.dates[LAST_DATE].end}>
              {moment(cEventValues.dates[LAST_DATE].end).format('DD MMM YYYY')}
            </time>
          </>
        );
      }
    }
    if (moment(cEventValues.datetime_from).format('DD MMM YYYY') === moment(cEventValues.datetime_to).format('DD MMM YYYY')) {
      return (
        <>
          <time dateTime={cEventValues.datetime_from}>{moment(cEventValues.datetime_from).format('DD MMM YYYY')}</time>
        </>
      );
    }
    return (
      <>
        <time dateTime={cEventValues.datetime_from}>{moment(cEventValues.datetime_from).format('DD MMM YYYY')}</time>
        {'-'}
        <time dateTime={cEventValues.datetime_to}>{moment(cEventValues.datetime_to).format('DD MMM YYYY')}</time>
      </>
    );
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
        <Typography.Title level={screens.xs ? 4 : 2} style={{ color: textColor, whiteSpace: 'normal' }}>
          {cEventValues?.name}
        </Typography.Title>
      }
      extra={
        isHome() && (
          <>
            {!isPreview ? (
              <EventAccessActionContainer />
            ) : (
              <Button style={{ color: textColor, backgroundColor: bgColor }} type='primary' size='large'>
                {intl.formatMessage({ id: 'signup_event', defaultMessage: 'Inscribirme al evento' })}
              </Button>
            )}
          </>
        )
      }
      footer={
        <>
          {!cEvent.value.show_event_date && (
            <Space direction='vertical' size={4} style={{ color: textColor, fontSize: '16px' }}>
              <Space wrap size={screens.xs ? 0 : 'large'}>
                <Space wrap>
                  <Space>
                    <CalendarFilled />
                    <time>{getDateEvent()}</time>
                  </Space>
                  <Space>
                    <ClockCircleFilled />
                    <time>{getStartTime()}</time>
                  </Space>
                </Space>
                {/* {idEvent !== '6334782dc19fe2710a0b8753' && (
                  <Space wrap>
                    <Space>
                      <CalendarFilled />
                      <time>{getDateEnd()}</time>
                    </Space>
                    <Space>
                      <ClockCircleFilled />
                      <time>{getEndTime()}</time>
                    </Space>
                  </Space>
                )} */}
              </Space>
              {cEventValues?.type_event !== 'onlineEvent' && (cEventValues?.address || cEventValues?.venue) && (
                <Space>
                  <EnvironmentFilled />
                  <Space wrap split={screens.xs ? null : '/'}>
                    {cEventValues.address && (
                      <Typography.Text style={{ color: textColor }}>{cEventValues?.address}</Typography.Text>
                    )}
                    {cEventValues.venue && (
                      <Typography.Text style={{ color: textColor }} italic>
                        {cEventValues?.venue}
                      </Typography.Text>
                    )}
                  </Space>
                </Space>
              )}
            </Space>
          )}
        </>
      }></PageHeader>
  );
};

export default InfoEvent;
