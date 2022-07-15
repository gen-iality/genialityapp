import { CurrentEventContext } from '@/context/eventContext';
import { CategoriesAgendaApi, SpeakersApi } from '@/helpers/request';
import { CaretLeftFilled, CaretRightFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Space, Typography, Grid, Comment } from 'antd';
import { useContext, useEffect, useState } from 'react';

const { useBreakpoint } = Grid;
const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const SpeakersBlock = () => {
  const screens = useBreakpoint();
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
      //FILTRAMOS LOS SPEAKERS POR PUBLICADOS
      let filteredSpeakers = speakers.filter((speaker) => speaker.published);
      //ORDENAMOS LOS SPEAKERS
      const speakersWithoutCategory = filteredSpeakers.sort((a, b) => a.order - b.order);

      setSpeakersWithoutCategory(speakersWithoutCategory);
      setLoading(false);
    }
  }, [cEvent.value]);

  const scrollPlus = () => {
    let carrusel = document.getElementById('carrusel');
    carrusel.scrollLeft += 400;
  };
  const scrollMinus = () => {
    let carrusel = document.getElementById('carrusel');
    carrusel.scrollLeft -= 400;
  };
  return (
    <div style={{ height: '100%' }}>
      <Row gutter={[8, 8]} style={{ height: '100%' }}>
        <Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20} style={{ height: '100%' }}>
          <div
            id='carrusel'
            style={{
              borderRadius: '10px',
              height: '100%',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '1rem',
              scrollPaddingLeft: '2rem',
              scrollPaddingRight: '2rem',
              overflowX: `${screens.xs ? 'auto' : 'hidden'}`,
              scrollSnapType: 'x mandatory',
              touchAction: 'pan-x',
            }}>
            {speakersWithoutCategory.length > 0 && !loading
              ? speakersWithoutCategory.map((speaker, key) => (
                  <div
                    key={key}
                    style={{
                      height: '100%',
                      aspectRatio: '3/4',
                      borderRadius: '10px',
                      backgroundImage: `url(${speaker.image})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      scrollSnapAlign: 'center',
                    }}>
                    <Row
                      justify='start'
                      align='bottom'
                      style={{
                        height: '100%',
                        widows: '100%',
                        borderRadius: '10px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 65.94%, rgba(0, 0, 0, 020) 100%)`,
                      }}>
                      <Space size={0} direction='vertical'>
                        <Typography.Text
                          strong
                          style={{
                            color: '#FFFFFF',
                            textShadow: '0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%)',
                            userSelect: 'none',
                          }}>
                          {speaker.name}
                        </Typography.Text>
                        <Typography.Text
                          style={{
                            color: '#FFFFFF',
                            textShadow: '0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%)',
                            userSelect: 'none',
                          }}>
                          {speaker.profession}
                        </Typography.Text>
                      </Space>
                    </Row>
                  </div>
                ))
              : 'nada'}
          </div>
        </Col>
        <Col xs={0} sm={24} md={24} lg={4} xl={4} xxl={4}>
          <Row align='bottom' justify='end' style={{ height: '100%' }}>
            <Space>
              <Button size='large' icon={<CaretLeftFilled />} onClick={() => scrollMinus()}></Button>
              <Button size='large' icon={<CaretRightFilled />} onClick={() => scrollPlus()}></Button>
            </Space>
          </Row>
        </Col>
      </Row>
      {/* <Row wrap gutter={[16, 16]} justify='center'>
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
      </Row> */}
    </div>
  );
};

export default SpeakersBlock;
