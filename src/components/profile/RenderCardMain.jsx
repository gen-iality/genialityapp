import { Col, Space } from 'antd';
import eventCard from '@/components/shared/eventCard';
import { Link } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import EventCard from '@/components/shared/eventCard';
import BlockedEventCard from '@/components/shared/BlockedEventCard';

const EventCardRenderer = ({ eventDataArray, isAdmin, props, cUser }) => {
  const renderEventCards = () => {
    return eventDataArray.map((eventData, index) => {
      const commonProps = {
        isAdmin: isAdmin,
        bordered: false,
        event: eventData.event,
        action: { name: 'Ver', url: `landing/${eventData.event._id}` },
        blockedEvent: props?.cUser?.value?.plan?.availables?.later_days || eventCard.value?.later_days,
        currentUser: cUser,
      };

      return (
        <Col key={index} xs={24} sm={12} md={12} lg={8} xl={6}>
          {eventData.is_active === true ? (
            <EventCard
              {...commonProps}
              right={isAdmin ? (
                <div key={'admin'}>
                  <Link to={`/eventadmin/${eventData.event._id}`}>
                    <Space>
                      <SettingOutlined />
                      <span>Administrar</span>
                    </Space>
                  </Link>
                </div>
              ) : null}
            />
          ) : (
            <BlockedEventCard event={eventData.event} />
          )}
        </Col>
      );
    });
  };

  return <>{renderEventCards()}</>;
};

export default EventCardRenderer;
