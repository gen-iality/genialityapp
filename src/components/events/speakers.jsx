import React, { Component } from 'react';

//custom
import { SpeakersApi, ActivityBySpeaker, CategoriesAgendaApi } from '../../helpers/request';
import Moment from 'moment';
import { Card, Avatar, Button, Modal, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Background } from 'react-parallax';

const { Meta } = Card;

class Speakers extends Component {
  constructor(props) {
    //Se realiza constructor para traer props desde landing.jsx
    super(props);
    this.state = {
      speakers: [],
      infoSpeaker: [],
      activityesBySpeaker: [],
      modalVisible: false,
      speakersWithCategory: [],
      speakersWithoutCategory: [],
      speakerCategories: [],
    };
  }

  async componentDidMount() {
    const { eventId } = this.props;
    //Se hace la consulta a la api de speakers
    let speakers = await SpeakersApi.byEvent(eventId);
    //Se envia al estado para acceder desde ahí a los datos
    this.setState({ speakers });
    //Se comprueban los datos desde el estado
    // console.log(this.state.speakers)

    const speakersWithCategory = [];
    const speakersWithoutCategory = [];

    let categories = await CategoriesAgendaApi.byEvent(eventId);

    this.setState({ speakerCategories: categories });

    // se crea un array de arrays posicionados segun el orden de la categoria
    // en caso que dos categorias tengan el mismo orden podrian colisionar o perderse los datos
    categories.map((category) => {
      speakersWithCategory[category.order] = [];
    });

    speakers.map((speaker, index) => {
      //Solo funciona si la relacion es uno a uno -> a un speaker una categoria
      const categorySpeaker = categories.filter((category) => category._id === speaker.category_id);

      if (categorySpeaker.length > 0) {
        speakers[index].category = categorySpeaker[0].name;
        speakersWithCategory[categorySpeaker[0].order].push(speaker);
      } else {
        speakersWithoutCategory.push(speaker);
      }
    });
    this.setState({ speakersWithCategory });
    this.setState({ speakersWithoutCategory });
  }

  async activitySpeakers(id) {
    //Se consulta la api para traer la informacion de actividades por conferencista
    let InfoActivityesBySpeaker = await ActivityBySpeaker.byEvent(this.props.eventId, id);
    //Se manda al estado la consulta
    this.setState({
      activityesBySpeaker: InfoActivityesBySpeaker.data,
    });
  }

  modal(id, image, name, profession, description) {
    //Se llama esta funcion para cargar la consulta de actividades por conferencista
    this.activitySpeakers(id);
    // Se envian los datos al estado para mostrarlos en el modal, Esto para hacer el modal dinamico
    this.setState({
      infoSpeaker: {
        imagen: image,
        nombre: name,
        cargo: profession,
        descripcion: description,
      },

      modalVisible: true,
    });
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  render() {
    const { event } = this.props;
    const {
      speakers,
      infoSpeaker,
      activityesBySpeaker,
      speakerCategories,
      speakersWithCategory,
      speakersWithoutCategory,
    } = this.state;
    return (
      <div className='container-calendar-section'>
        <div className='columns is-centered'>
          <div className='container-calendar is-three-fifths'>
            {speakerCategories.length && (
              <>
                {speakerCategories.map((category, index) => {
                  return (
                    <div
                      className='container_agenda-information'
                      key={`category-${index}`}
                      style={{ marginBottom: '30px' }}>
                      <h2 style={{ backgroundColor: '#FFFFFF', fontSize: '18px', fontWeight: '900' }}>
                        {category.name}
                      </h2>

                      {speakersWithCategory.length && (
                        <>
                          {speakersWithCategory[category.order].length && (
                            <>
                              {speakersWithCategory[category.order].map((speaker, key) => (
                                <div key={key}>
                                  <Card
                                    onClick={() =>
                                      this.modal(
                                        speaker._id,
                                        speaker.image,
                                        speaker.name,
                                        speaker.profession,
                                        speaker.description
                                      )
                                    }
                                    hoverable
                                    style={{ paddingTop: '30px' }}
                                    cover={
                                      speaker.image ? (
                                        <Avatar
                                          style={{ display: 'block', margin: '0 auto' }}
                                          size={210}
                                          src={speaker.image}
                                        />
                                      ) : (
                                        <Avatar
                                          style={{ display: 'block', margin: '0 auto' }}
                                          size={210}
                                          icon={<UserOutlined />}
                                        />
                                      )
                                    }
                                    actions={[
                                      <Button
                                        type='primary'
                                        className='modal-button'
                                        onClick={() =>
                                          this.modal(
                                            speaker._id,
                                            speaker.image,
                                            speaker.name,
                                            speaker.profession,
                                            speaker.description
                                          )
                                        }
                                        key={key}
                                        data-target='#myModal'
                                        aria-haspopup='true'>
                                        Ver más...
                                      </Button>,
                                    ]}>
                                    <Meta
                                      title={[
                                        <div>
                                          <span>{speaker.name}</span>
                                        </div>,
                                      ]}
                                      description={[
                                        <div style={{ minHeight: '100px' }}>
                                          <p>{speaker.profession}</p>
                                        </div>,
                                      ]}
                                    />
                                  </Card>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            {/* Mapeo de datos para mostrar los Speakers */}
            <div className='calendar-speakers'>
              {speakersWithoutCategory.length &&
                speakersWithoutCategory.map((speaker, key) => (
                  <div key={key}>
                    <Card
                      onClick={() =>
                        this.modal(speaker._id, speaker.image, speaker.name, speaker.profession, speaker.description)
                      }
                      hoverable
                      style={{ paddingTop: '30px' }}
                      cover={
                        speaker.image ? (
                          <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} src={speaker.image} />
                        ) : (
                          <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} icon={<UserOutlined />} />
                        )
                      }
                      actions={[
                        <Button
                          type='primary'
                          className='modal-button'
                          onClick={() =>
                            this.modal(
                              speaker._id,
                              speaker.image,
                              speaker.name,
                              speaker.profession,
                              speaker.description
                            )
                          }
                          key={key}
                          data-target='#myModal'
                          aria-haspopup='true'>
                          Ver más...
                        </Button>,
                      ]}>
                      <Meta
                        title={[
                          <div>
                            <span>{speaker.name}</span>
                          </div>,
                        ]}
                        description={[
                          <div style={{ minHeight: '100px' }}>
                            <p>{speaker.profession}</p>
                          </div>,
                        ]}
                      />
                    </Card>
                  </div>
                ))}
            </div>

            {/* Modal de Speakers para mostrar la información del conferencista junto con sus actividades */}

            <Modal
              title='Conferencista'
              centered
              width={1000}
              visible={this.state.modalVisible}
              onCancel={() => this.setModalVisible(false)}
              footer={[
                <Button key='cerrar' type='primary' onClick={() => this.setModalVisible(false)}>
                  Cerrar
                </Button>,
              ]}>
              <Row>
                {/* Imagen del conferencista */}

                <Col flex='1 1 auto'>
                  {infoSpeaker.imagen ? (
                    <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} src={infoSpeaker.imagen} />
                  ) : (
                    <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} icon={<UserOutlined />} />
                  )}
                </Col>

                {/* Descripción del conferencista */}
                <Col flex='1 1 600px'>
                  <span>
                    <b>{infoSpeaker.nombre}</b>
                  </span>
                  <p>
                    <span>
                      <b>{infoSpeaker.cargo}</b>
                    </span>
                    <br />
                    <br />
                    <div style={{ width: '90%' }} dangerouslySetInnerHTML={{ __html: infoSpeaker.descripcion }} />
                  </p>
                </Col>
              </Row>
              {infoSpeaker.description_activity === 'true' && (
                <div>
                  {/* Contenedor para descripcion 
                            Se mapea tambien las actividades por Speaker 
                        */}
                  {activityesBySpeaker.map((activities, key) => (
                    <div key={key}>
                      <Card style={{ padding: '24px 40px', top: '50px', marginBottom: '30px' }}>
                        <div>
                          <p>
                            <b>
                              {Moment(activities.datetime_start).format('lll')} -{' '}
                              {Moment(activities.datetime_end).format('lll')}
                            </b>
                          </p>
                          <p>{activities.name}</p>
                          <br />
                          <div dangerouslySetInnerHTML={{ __html: activities.description }} />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default Speakers;
