import { CurrentEventContext } from '@/context/eventContext';
import { CategoriesAgendaApi, SpeakersApi } from '@/helpers/request';
import { CaretLeftFilled, CaretRightFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Space, Typography, Grid, Comment } from 'antd';
import { set } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';

const { useBreakpoint } = Grid;
const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const SpeakersBlock = () => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [speakersWithoutCategory, setSpeakersWithoutCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabledPlus, setDisabledPlus] = useState(false);
  const [disabledMinus, setDisabledMinus] = useState(false);

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
    let carrusel = document.getElementById('carrusel-speakers');
    let scrollLeftPrevious = carrusel.scrollLeft;
    carrusel.scrollLeft += 450;
    setTimeout(() => {
      if (carrusel.scrollLeft === scrollLeftPrevious) {
        setDisabledPlus(true);
      }
    }, 1000);
    setDisabledMinus(false);
  };

  const scrollMinus = () => {
    let carrusel = document.getElementById('carrusel-speakers');
    carrusel.scrollLeft -= 450;
    if (carrusel.scrollLeft < 50) {
      setDisabledMinus(true);
    }
    setDisabledPlus(false);
  };
  return (
    <div style={{ height: '100%' }}>
      <Row gutter={[8, 8]} style={{ height: '100%' }}>
        <Col style={{ zIndex: '100' }} span={!disabledMinus ? 1 : 0}>
          <Row align='middle' justify='center' style={{ height: '100%' }}>
            <Space>
              <Button
                shape='circle'
                disabled={disabledMinus}
                size='large'
                icon={<CaretLeftFilled />}
                onClick={() => scrollMinus()}></Button>
            </Space>
          </Row>
        </Col>
        <Col span={!disabledMinus || !disabledPlus ? 22 : 23} style={{ height: '100%' }}>
          <Row
            id='carrusel-speakers'
            onTouchMove={(e) => {
              setDisabledPlus(false);
              setDisabledMinus(false);
            }}
            style={{
              borderRadius: '10px',
              height: '100%',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '1rem',
              justifyContent: speakersWithoutCategory.length > 3 ? 'initial' : 'space-around',
              scrollPaddingLeft: '2rem',
              scrollPaddingRight: '2rem',
              overflowX: `${screens.xs ? 'auto' : 'hidden'}`,
              scrollSnapType: 'x mandatory',
              touchAction: 'auto',
              scrollBehavior: 'smooth',
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
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        paddingBottom: '15px',
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
          </Row>
        </Col>
        <Col span={!disabledPlus ? 1 : 0}>
          <Row align='middle' justify='center' style={{ height: '100%' }}>
            <Space>
              <Button
                shape='circle'
                disabled={disabledPlus}
                size='large'
                icon={<CaretRightFilled />}
                onClick={() => scrollPlus()}></Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SpeakersBlock;
