import { CurrentEventContext } from '@/context/eventContext';
import { CategoriesAgendaApi, SpeakersApi } from '@/helpers/request';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Typography } from 'antd';

import { useContext, useEffect, useState } from 'react';
const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const SpeakersBlock = () => {
  const cEvent = useContext(CurrentEventContext);
  const [speakerCategories, setSpeakerCategories] = useState([]);
  const [renderSpeakerCategories, setRenderSpeakerCategories] = useState([]);
  const [speakersWithCategory, setSpeakerWithCategory] = useState([]);
  const [speakersWithoutCategory, setSpeakersWithoutCategory] = useState([]);
  useEffect(() => {
    if (!cEvent.value) return;
    obtenerSpeakers();
    async function obtenerSpeakers() {
      //Se hace la consulta a la api de speakers
      let speakers = await SpeakersApi.byEvent(cEvent.value._id);

      //consultamos las categorias del evento
      let categories = await CategoriesAgendaApi.byEvent(cEvent.value._id);

      //Recorremos las categorias si tienen el campo orden
      //en caso que no lo tengan le asignamos el ultimo orden basado en el maximo valor que exista

      const categoriesFixedOrder = categories.map((category, index) => {
        const maxOrder = this.calcMaxOrder(categories);
        if (!category.order) {
          categories[index].order = maxOrder + 1;
        }
        return category;
      });

      const categoriesOrderByOrder = categoriesFixedOrder.sort((a, b) => a.order - b.order);

      //Constantes donde vamos a almacenar a los speakers que tengan asignada una categoria o no tenga categoria
      const speakersWithCategory = [];
      const speakersWithoutCategory = [];

      // se crea un array de arrays posicionados segun el orden de la categoria
      // en caso que dos categorias tengan el mismo orden podrian colisionar o perderse los datos

      categoriesOrderByOrder.map((category, index) => {
        speakersWithCategory[category.order] = [];

        const hasSpeaker = speakers.filter((speaker) => speaker.category_id === category._id);
        if (hasSpeaker.length) {
          categoriesOrderByOrder[index].hasSpeaker = true;
        } else {
          categoriesOrderByOrder[index].hasSpeaker = false;
        }
      });
      setSpeakerCategories(categoriesOrderByOrder);

      // Si hay speakers con categorias entonces habilitamos el render agrupado de los speakers
      // sino entonces mostrasmos solo los spakers sin categorias
      const renderSpeakerCategories = categories.length ? true : false;
      setRenderSpeakerCategories(renderSpeakerCategories);

      speakers.map((speaker, index) => {
        //Solo funciona si la relacion es uno a uno -> a un speaker una categoria
        const categorySpeaker = categoriesOrderByOrder.filter((category) => category._id === speaker.category_id);

        if (categorySpeaker.length > 0) {
          speakers[index].category = categorySpeaker[0].name;
          speakersWithCategory[categorySpeaker[0].order].push(speaker);
        } else {
          speakersWithoutCategory.push(speaker);
        }
      });
      setSpeakerWithCategory(speakersWithCategory);
      setSpeakersWithoutCategory(speakersWithoutCategory);
    }
  }, [cEvent.value]);
  return (
    <div style={{ padding: '20px' }}>
      {renderSpeakerCategories && speakerCategories.length && (
        <>
          {speakerCategories.map((category) => (
            <>
              {category.hasSpeaker && (
                <>
                  {speakersWithCategory.length && (
                    <>
                      {speakersWithCategory[category.order].length && (
                        <Row wrap gutter={[16, 16]} justify='center'>
                          <div
                            style={{
                              width: '98%',
                              margin: '50px auto 0px auto',
                              padding: '5px',
                              borderRadius: '5px',
                              backgroundColor: '#FFFFFF',
                              boxSizing: 'border-box',
                            }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>{category.name}</span>
                          </div>
                          {speakersWithCategory[category.order].map((speaker, key) => (
                            <>
                              {speaker.published && (
                                <Col key={key} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                  <Card
                                    onClick={() => {
                                      if (
                                        speaker.description !== '<p><br></p>' &&
                                        speaker.description !== undefined &&
                                        speaker.description !== null
                                      ) {
                                        this.modal(
                                          eventId,
                                          speaker._id,
                                          speaker.image,
                                          speaker.name,
                                          speaker.profession,
                                          speaker.description,
                                          speaker.category
                                        );
                                      }
                                    }}
                                    hoverable={speaker.description ? true : false}
                                    style={{
                                      paddingTop: '30px',
                                      borderRadius: '20px',
                                      /* paddingLeft: '50px',
                                  paddingRight: '50px', */
                                      minHeight: '100px',
                                    }}
                                    cover={
                                      speaker.image ? (
                                        <Avatar
                                          style={{ display: 'block', margin: 'auto' }}
                                          size={{ xs: 130, sm: 160, md: 120, lg: 170, xl: 40, xxl: 40 }}
                                          /* size={210} */ src={speaker.image}
                                        />
                                      ) : (
                                        <Avatar
                                          style={{ display: 'block', margin: 'auto' }}
                                          size={{ xs: 130, sm: 160, md: 120, lg: 170, xl: 40, xxl: 40 }}
                                          /* size={210} */ icon={<UserOutlined />}
                                        />
                                      )
                                    }>
                                    <Meta
                                      /* title={[
                                    <div style={{ textAlign: 'center' }} key={'speaker-name  ' + key}>
                                      <p
                                        style={{
                                          fontSize: '18px',
                                          fontWeight: 'bold',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                        }}>
                                        <Tooltip placement='bottomLeft' title={speaker.name}>
                                          {speaker.name}
                                        </Tooltip>
                                      </p>
                                    </div>,
                                  ]} */
                                      description={[
                                        <div
                                          key={'speaker-description  ' + key}
                                          style={{ minHeight: '100px', textAlign: 'center' }}>
                                          <Title level={4}>{speaker.name}</Title>
                                          <Paragraph>{speaker.profession}</Paragraph>
                                          {/* <p
                                        style={{
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                        }}>
                                        <Tooltip placement='bottomLeft' title={speaker.profession}>
                                          <span>{speaker.profession}</span>
                                        </Tooltip>
                                      </p> */}
                                        </div>,
                                      ]}
                                    />
                                  </Card>
                                </Col>
                              )}
                            </>
                          ))}
                        </Row>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ))}
        </>
      )}
      {/* Mapeo de datos para mostrar los Speakers */}
      {/* <div style={{ padding: '40px' }}> */}
      <Row wrap gutter={[16, 16]} justify='center' style={{ padding: '40px' }}>
        {/* Mapeo de datos para mostrar los Speakers */}
        {speakersWithoutCategory.length > 0 &&
          speakersWithoutCategory.map((speaker, key) => (
            <>
              {speaker.published && (
                <Col key={key} xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Card
                    onClick={() => {
                      if (
                        speaker.description !== '<p><br></p>' &&
                        speaker.description !== undefined &&
                        speaker.description !== null
                      ) {
                        this.modal(
                          eventId,
                          speaker._id,
                          speaker.image,
                          speaker.name,
                          speaker.profession,
                          speaker.description,
                          speaker.category
                        );
                      }
                    }}
                    hoverable={speaker.description ? true : false}
                    style={{
                      paddingTop: '30px',
                      borderRadius: '20px',
                      /* paddingLeft: '50px',
                    paddingRight: '50px', */
                      minHeight: '100px',
                    }}
                    cover={
                      speaker.image ? (
                        <Avatar
                          style={{ display: 'block', margin: 'auto' }}
                          size={{ xs: 130, sm: 160, md: 120, lg: 170, xl: 40, xxl: 40 }}
                          /* size={210} */ src={speaker.image}
                        />
                      ) : (
                        <Avatar
                          style={{ display: 'block', margin: 'auto' }}
                          size={{ xs: 130, sm: 160, md: 120, lg: 170, xl: 40, xxl: 40 }}
                          /* size={210} */ icon={<UserOutlined />}
                        />
                      )
                    }>
                    <Meta
                      /* title={[
                      <div style={{ textAlign: 'center' }} key={'speaker-name  ' + key}>
                        <Title level={4} >
                          {speaker.name}
                        </Title>
                        <p
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}>
                          <Tooltip placement='bottomLeft' title={speaker.name}>
                            {speaker.name}
                          </Tooltip>
                        </p>
                      </div>,
                    ]} */
                      description={[
                        <div key={'speaker-description  ' + key} style={{ minHeight: '100px', textAlign: 'center' }}>
                          <Title level={4}>{speaker.name}</Title>
                          <Paragraph>{speaker.profession}</Paragraph>
                          {/* <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          <Tooltip placement='bottomLeft' title={speaker.profession}>
                            <span>{speaker.profession}</span>
                          </Tooltip>
                        </p> */}
                        </div>,
                      ]}
                    />
                  </Card>
                </Col>
              )}
            </>
          ))}
      </Row>
    </div>
  );
};

export default SpeakersBlock;
