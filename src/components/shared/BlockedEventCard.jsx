import { useState } from 'react';
import { Modal, Button, Space, Tooltip, Badge, Card, Typography } from 'antd';
import ContactInfo from '../eventOrganization/components/ContactInfo';
import { imageUtils } from '@/Utilities/ImageUtils';
import moment from 'moment';
import { getDateEvent } from './utils/getDatesEvents';

const { Meta } = Card;
const EventImage = imageUtils.EventImage;

const BlockedEventCard = ({ event }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  return (
    <div>
      <div onClick={handleOpenModal}>
        <Badge.Ribbon
          style={{
            maxWidth: '250px',
            height: 'auto',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
          text={
            <span style={{ fontSize: '12px' }}>
              <div>
                <Space>
                  <span>
                    <i className='fas fa-map-marker-alt' />
                  </span>
                  <Tooltip
                    title={
                      event.type_event === 'onlineEvent'
                        ? ''
                        : event.address
                        ? event.venue
                          ? event.address + ', ' + event.venue
                          : event.address
                        : event.venue
                    }>
                    <span>
                      {event.type_event === 'physicalEvent'
                        ? 'Físico'
                        : event.type_event === 'onlineEvent'
                        ? 'Virtual'
                        : event.type_event === 'hybridEvent'
                        ? 'Híbrido'
                        : 'Tipo de evento desconocido'}
                    </span>
                  </Tooltip>
                </Space>
              </div>
            </span>
          }>
          <Card
            bordered={false}
            style={{ width: '100%' }}
            cover={
              event.picture ? (
                <img
                  className='animate__animated animate__fadeIn animate__slower'
                  loading='lazy'
                  style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                  src={typeof event.picture === 'object' ? event.picture[0] : event.picture}
                  alt='Evius.co'
                />
              ) : (
                <img
                  className='animate__animated animate__fadeIn animate__slower'
                  loading='lazy'
                  style={{ objectFit: 'cover', height: '180px', width: '100%' }}
                  src={
                    event.styles
                      ? event.styles.banner_image && event.styles.banner_image !== undefined
                        ? event.styles.banner_image
                        : EventImage
                      : EventImage
                  }
                  alt='Evius.co'
                />
              )
            }
            bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <Meta
              style={{}}
              description={
                <Space size={1} direction='vertical'>
                  <span style={{ fontSize: '12px' }}>
                    <Space>
                      <i className='fas fa-calendar-alt' />
                      {getDateEvent(event)}
                    </Space>
                  </span>
                  <Typography.Text style={{ fontWeight: 'bold' }}>{event.name}</Typography.Text>
                  {event.organizer?.name
                    ? event.organizer?.name
                    : event.author?.displayName
                    ? event.author?.displayName
                    : event.author?.names}
                </Space>
              }
            />
          </Card>
        </Badge.Ribbon>
      </div>

      <Modal
        visible={modalVisible}
        onCancel={handleCloseModal}
        width={'800px'}
        footer={[
          <Button key='cerrar' onClick={handleCloseModal}>
            Aceptar
          </Button>,
        ]}>
        <ContactInfo organization={event.organizer || {}} />
      </Modal>
    </div>
  );
};

export default BlockedEventCard;
