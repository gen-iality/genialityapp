import { CurrentEventContext } from '@/context/eventContext';
import { CategoriesAgendaApi, SpeakersApi } from '@/helpers/request';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Spin, Typography } from 'antd';

import { useContext, useEffect, useState } from 'react';
const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const SpeakersBlock = () => {
  const cEvent = useContext(CurrentEventContext);
  const [speakersWithoutCategory, setSpeakersWithoutCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cEvent.value) return;

    obtenerSpeakers();
    async function obtenerSpeakers() {
      //Se hace la consulta a la api de speakers
      setLoading(true);
      let speakers = await SpeakersApi.byEvent(cEvent.value._id);
      console.log('SPEAKERS ACA=>', speakers);
      //ORDENAMOS LOS SPEAKERS
      const speakersWithoutCategory = speakers.sort((a, b) => a.order - b.order);

      setSpeakersWithoutCategory(speakersWithoutCategory);
      setLoading(false);
    }
  }, [cEvent.value]);
  return (
    <div>
      <Row wrap gutter={[16, 16]} justify='center'>
        {/* Mapeo de datos para mostrar los Speakers */}
        {speakersWithoutCategory.length > 0 && !loading ? (
          speakersWithoutCategory.map((speaker, key) => (
            <>
              {speaker.published && (
                <Col key={key} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    hoverable={false}
                    style={{
                      paddingTop: '30px',
                      borderRadius: '20px',
                      minHeight: '90px',
                    }}
                    cover={
                      speaker.image ? (
                        <Avatar
                          style={{ display: 'block', margin: 'auto' }}
                          size={{ xs: 70, sm: 70, md: 70, lg: 70, xl: 70, xxl: 70 }}
                          src={speaker.image}
                        />
                      ) : (
                        <Avatar
                          style={{ display: 'block', margin: 'auto' }}
                          size={{ xs: 70, sm: 70, md: 70, lg: 70, xl: 70, xxl: 70 }}
                          icon={<UserOutlined />}
                        />
                      )
                    }>
                    <Meta
                      description={[
                        <div key={'speaker-description  ' + key} style={{ minHeight: '100px', textAlign: 'center' }}>
                          <Title level={4}>{speaker.name}</Title>
                          <Paragraph>{speaker.profession}</Paragraph>
                        </div>,
                      ]}
                    />
                  </Card>
                </Col>
              )}
            </>
          ))
        ) : speakersWithoutCategory.length == 0 && !loading ? (
          <Card>No existen conferencistas</Card>
        ) : (
          <Spin />
        )}
      </Row>
    </div>
  );
};

export default SpeakersBlock;
