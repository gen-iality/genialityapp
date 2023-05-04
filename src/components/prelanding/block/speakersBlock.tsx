import Loading from '@/components/profile/loading';
import { CurrentEventContext } from '@/context/eventContext';
import {  SpeakersApi } from '@/helpers/request';
import { showImageOrDefaultImage } from '@/Utilities/imgUtils';
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import {  Button, Col, Row, Space, Typography, Grid, Carousel, Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { speakerWithoutImage } from '../constants';
import { Speaker } from '../types';

const { useBreakpoint } = Grid;

const SpeakersBlock = () => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [speakersWithoutCategory, setSpeakersWithoutCategory] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [disabledPlus, setDisabledPlus] = useState(false);
  const [disabledMinus, setDisabledMinus] = useState(false);

  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;

  useEffect(() => {
    if (!cEvent.value) return;

    obtenerSpeakers();
    async function obtenerSpeakers() {
      //Se hace la consulta a la api de speakers
      setLoading(true);
      let speakers : Speaker[] = await SpeakersApi.byEvent(cEvent.value._id);
     
      //FILTRAMOS LOS SPEAKERS POR PUBLICADOS
      let filteredSpeakers = speakers.filter((speaker) => speaker.published);
      //ORDENAMOS LOS SPEAKERS
      const speakersWithoutCategory = filteredSpeakers.sort((a, b) => a.order - b.order);

      setSpeakersWithoutCategory(speakersWithoutCategory);
      setLoading(false);
    }
  }, [cEvent.value]);

  const scrollPlus = () => {

  };

  const scrollMinus = () => {

  };
  return (
    speakersWithoutCategory.length > 0 && !loading ? (
            <Carousel afterChange={()=>{}} autoplay  draggable style={{height : '450px', width: '900px'}}>
              { speakersWithoutCategory.map((speaker, key) => (
                <div
                  key={key}
                /*   style={{
                    aspectRatio: '3/4',
                    borderRadius: '10px',
                    backgroundImage: `url(${showImageOrDefaultImage(speaker.image, speakerWithoutImage)})`,
                    backgroundSize: '',
                    backgroundRepeat: 'no-repeat',
                    scrollSnapAlign: 'center',
                    backgroundPosition: 'center',
                  }} */>
                  <Row
                    justify='start'
                    align='bottom'
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: '10px',
                      paddingLeft: '20px',
                      paddingRight: '15px',
                      paddingBottom: '30px',
                      background: `linear-gradient(180deg,rgb(0,0,0,0) 40%, rgb(0,0,0,0.9) 100%)`,
                    }} >
                      <Image width={250} src={showImageOrDefaultImage(speaker.image, speakerWithoutImage)}></Image>
                    <Space size={0} direction='vertical'>
                      <Typography.Text
                        strong
                        style={{
                          color: '#FFFFFF',
                          textShadow: '0 1px 2px rgb(0 0 0 / 60%), 0 0 2px rgb(0 0 0 / 30%)',
                          userSelect: 'none',
                          fontSize: '16px',
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
              )) }
              </Carousel>
              ) : (
              <Loading />
            )
  );
};

export default SpeakersBlock;
