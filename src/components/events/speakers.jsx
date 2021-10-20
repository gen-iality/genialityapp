import React, { Component } from 'react';

//custom
import { SpeakersApi, ActivityBySpeaker, CategoriesAgendaApi } from '../../helpers/request';
import Moment from 'moment';
import { Card, Avatar, Button, Modal, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import withContext from '../../Context/withContext';

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
      renderSpeakerCategories: false,
    };
  }

  async componentDidMount() {
    //Se hace la consulta a la api de speakers
    let speakers = await SpeakersApi.byEvent(this.props.cEvent.value._id);

    //consultamos las categorias del evento
    let categories = await CategoriesAgendaApi.byEvent(this.props.cEvent.value._id);

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

    this.setState({ speakerCategories: categoriesOrderByOrder });

    // Si hay speakers con categorias entonces habilitamos el render agrupado de los speakers
    // sino entonces mostrasmos solo los spakers sin categorias
    const renderSpeakerCategories = categories.length ? true : false;

    this.setState({ renderSpeakerCategories });

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
    this.setState({ speakersWithCategory });
    this.setState({ speakersWithoutCategory });
  }

  //funcion para obtener el valor maximo del orden de una categoria
  calcMaxOrder(data) {
    const arrayWithOrderField = data.filter((category) => category.order);
    let maxOrder = 0;
    if (arrayWithOrderField.length) {
      const arrayToCalcMaxOrder = arrayWithOrderField.map((category) => parseInt(category.order));
      maxOrder = Math.max(...arrayToCalcMaxOrder);
    }
    return maxOrder;
  }

  async activitySpeakers(eventId, id) {
    //Se consulta la api para traer la informacion de actividades por conferencista
    let InfoActivityesBySpeaker = await ActivityBySpeaker.byEvent(eventId, id);
    //Se manda al estado la consulta
    this.setState({
      activityesBySpeaker: InfoActivityesBySpeaker.data,
    });
  }

  modal(eventId, id, image, name, profession, description, category) {
    //Se llama esta funcion para cargar la consulta de actividades por conferencista
    this.activitySpeakers(this.props.cEvent.value._id, id);
    // Se envian los datos al estado para mostrarlos en el modal, Esto para hacer el modal dinamico
    this.setState({
      infoSpeaker: {
        imagen: image,
        nombre: name,
        cargo: profession,
        descripcion: description,
        category,
      },

      modalVisible: true,
    });
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  btnViewMore = (speaker) => {
    if (speaker.description !== '<p><br></p>' && speaker.description !== undefined && speaker.description !== null) {
      return (
        <Button
          type='primary'
          className='modal-button'
          onClick={() => this.modal(speaker._id, speaker.image, speaker.name, speaker.profession, speaker.description)}
          key={'sp' + speaker._id}
          data-target='#myModal'
          aria-haspopup='true'>
          Ver más...
        </Button>
      );
    }
  };

  render() {
    const {
      infoSpeaker,
      activityesBySpeaker,
      speakerCategories,
      speakersWithCategory,
      speakersWithoutCategory,
      renderSpeakerCategories,
    } = this.state;

    let eventId = this.props.cEvent.value._id;

    return (
      <>
        {renderSpeakerCategories && speakerCategories.length && (
          <>
            {speakerCategories.map((category) => (
              <>
                {category.hasSpeaker && (
                  <>
                    <div
                      style={{
                        width: '98%',
                        margin: '30px auto',
                        padding: '5px',
                        borderRadius: '5px',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}>
                      <span style={{ fontSize: '18px', fontWeight: '700' }}>{category.name}</span>
                    </div>

                    {speakersWithCategory.length && (
                      <>
                        {speakersWithCategory[category.order].length && (
                          <div className='container-calendar-speaker calendar-speakers'>
                            <div className='calendar-speakers'>
                              {speakersWithCategory[category.order].map((speaker, key) => (
                                <div key={key}>
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
                                    style={{ paddingTop: '30px', borderRadius: '20px' }}
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
                                    actions={speaker.description && [this.btnViewMore(speaker)]}>
                                    <Meta
                                      title={[
                                        <div style={{ textAlign: 'center' }} key={'speaker-name' + key}>
                                          <span>{speaker.name}</span>
                                        </div>,
                                      ]}
                                      description={[
                                        <div
                                          style={{ minHeight: '100px', textAlign: 'center' }}
                                          key={'speaker-description' + key}>
                                          <p>{speaker.profession}</p>
                                        </div>,
                                      ]}
                                    />
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
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
        <div
          className='container-calendar-speaker calendar-speakers'
          style={{ marginTop: '40px', marginBottom: '40px' }}>
          {/* Mapeo de datos para mostrar los Speakers */}
          <div className='calendar-speakers'>
            {speakersWithoutCategory.length &&
              speakersWithoutCategory.map((speaker, key) => (
                <div key={key}>
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
                    style={{ paddingTop: '30px', borderRadius: '20px' }}
                    cover={
                      speaker.image ? (
                        <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} src={speaker.image} />
                      ) : (
                        <Avatar style={{ display: 'block', margin: '0 auto' }} size={210} icon={<UserOutlined />} />
                      )
                    }
                    actions={speaker.description && [this.btnViewMore(speaker)]}>
                    <Meta
                      title={[
                        <div style={{ textAlign: 'center' }} key={'speaker-name  ' + key}>
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{speaker.name}</span>
                        </div>,
                      ]}
                      description={[
                        <div key={'speaker-description  ' + key} style={{ minHeight: '100px', textAlign: 'center' }}>
                          <p>{speaker.profession}</p>
                        </div>,
                      ]}
                    />
                  </Card>
                </div>
              ))}
          </div>
        </div>

        {/* Modal de Speakers para mostrar la información del conferencista junto con sus actividades */}

        <Modal
          title={
            infoSpeaker.category
              ? infoSpeaker.category
              : this.props.cEvent.value._id !== '60cb7c70a9e4de51ac7945a2'
              ? 'Conferencista'
              : 'Artista'
          }
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
      </>
    );
  }
}

let SpeakerswithContext = withContext(Speakers);
export default SpeakerswithContext;
