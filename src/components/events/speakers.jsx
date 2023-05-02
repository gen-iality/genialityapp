import { Component } from 'react'

//custom
import { SpeakersApi, ActivityBySpeaker, CategoriesAgendaApi } from '@helpers/request'
import dayjs from 'dayjs'
import { Card, Avatar, Button, Modal, Row, Col, Tooltip, Typography } from 'antd'
import { CloseOutlined, UserOutlined } from '@ant-design/icons'
import withContext from '@context/withContext'
import ReactQuill from 'react-quill'

const { Meta } = Card
const { Paragraph, Text, Title } = Typography

class Speakers extends Component {
  constructor(props) {
    //Se realiza constructor para traer props desde landing.jsx
    super(props)
    this.state = {
      speakers: [],
      infoSpeaker: [],
      activityesBySpeaker: [],
      modalVisible: false,
      speakersWithCategory: [],
      speakersWithoutCategory: [],
      speakerCategories: [],
      renderSpeakerCategories: false,
    }
  }

  async componentDidMount() {
    //Se hace la consulta a la api de speakers
    const speakers = await SpeakersApi.byEvent(this.props.cEvent.value._id)

    //consultamos las categorias del curso
    const categories = await CategoriesAgendaApi.byEvent(this.props.cEvent.value._id)

    //Recorremos las categorias si tienen el campo orden
    //en caso que no lo tengan le asignamos el ultimo orden basado en el maximo valor que exista

    const categoriesFixedOrder = categories.map((category, index) => {
      const maxOrder = this.calcMaxOrder(categories)
      if (!category.order) {
        categories[index].order = maxOrder + 1
      }
      return category
    })

    const categoriesOrderByOrder = categoriesFixedOrder.sort((a, b) => a.order - b.order)

    //Constantes donde vamos a almacenar a los speakers que tengan asignada una categoria o no tenga categoria
    const speakersWithCategory = []
    const speakersWithoutCategory = []

    // se crea un array de arrays posicionados segun el orden de la categoria
    // en caso que dos categorias tengan el mismo orden podrian colisionar o perderse los datos

    categoriesOrderByOrder.map((category, index) => {
      speakersWithCategory[category.order] = []

      const hasSpeaker = speakers.filter(
        (speaker) => speaker.category_id === category._id,
      )
      if (hasSpeaker.length) {
        categoriesOrderByOrder[index].hasSpeaker = true
      } else {
        categoriesOrderByOrder[index].hasSpeaker = false
      }
    })

    this.setState({ speakerCategories: categoriesOrderByOrder })

    // Si hay speakers con categorias entonces habilitamos el render agrupado de los speakers
    // sino entonces mostrasmos solo los spakers sin categorias
    const renderSpeakerCategories = !!categories.length

    this.setState({ renderSpeakerCategories })

    speakers.map((speaker, index) => {
      //Solo funciona si la relacion es uno a uno -> a un speaker una categoria
      const categorySpeaker = categoriesOrderByOrder.filter(
        (category) => category._id === speaker.category_id,
      )

      if (categorySpeaker.length > 0) {
        speakers[index].category = categorySpeaker[0].name
        speakersWithCategory[categorySpeaker[0].order].push(speaker)
      } else {
        speakersWithoutCategory.push(speaker)
      }
    })
    this.setState({ speakersWithCategory })
    this.setState({ speakersWithoutCategory })
  }

  //funcion para obtener el valor maximo del orden de una categoria
  calcMaxOrder(data) {
    const arrayWithOrderField = data.filter((category) => category.order)
    let maxOrder = 0
    if (arrayWithOrderField.length) {
      const arrayToCalcMaxOrder = arrayWithOrderField.map((category) =>
        parseInt(category.order),
      )
      maxOrder = Math.max(...arrayToCalcMaxOrder)
    }
    return maxOrder
  }

  async activitySpeakers(eventId, id) {
    //Se consulta la api para traer la informacion de lecciones por conferencista
    const InfoActivityesBySpeaker = await ActivityBySpeaker.byEvent(eventId, id)
    //Se manda al estado la consulta
    this.setState({
      activityesBySpeaker: InfoActivityesBySpeaker.data,
    })
  }

  modal(eventId, id, image, name, profession, description, category) {
    //Se llama esta funcion para cargar la consulta de lecciones por conferencista
    this.activitySpeakers(this.props.cEvent.value._id, id)
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
    })
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible })
  }

  btnViewMore = (speaker) => {
    if (
      speaker.description !== '<p><br></p>' &&
      speaker.description !== undefined &&
      speaker.description !== null
    ) {
      return (
        <Button
          type="primary"
          /* className="modal-button" */
          onClick={() =>
            this.modal(
              speaker._id,
              speaker.image,
              speaker.name,
              speaker.profession,
              speaker.description,
            )
          }
          key={'sp' + speaker._id}
          data-target="#myModal"
          aria-haspopup="true">
          Ver más...
        </Button>
      )
    }
  }

  render() {
    const {
      infoSpeaker,
      activityesBySpeaker,
      speakerCategories,
      speakersWithCategory,
      speakersWithoutCategory,
      renderSpeakerCategories,
    } = this.state

    const eventId = this.props.cEvent.value._id

    const eventColor = this.props.cEvent.value.styles.toolbarDefaultBg // outline:`5px dotted ${eventColor}`, outlineOffset:'10px' a los avatar

    return (
      <div style={{ padding: '20px' }}>
        {renderSpeakerCategories && speakerCategories.length && (
          <>
            {speakerCategories.map((category, index) => (
              <>
                {category.hasSpeaker && (
                  <>
                    {speakersWithCategory.length && (
                      <>
                        {speakersWithCategory[category.order].length && (
                          <Row wrap key={index} gutter={[16, 16]} justify="center">
                            <div
                              style={{
                                width: '98%',
                                margin: '50px auto 0px auto',
                                padding: '5px',
                                borderRadius: '5px',
                                backgroundColor: '#FFFFFF',
                                boxSizing: 'border-box',
                              }}>
                              <span style={{ fontSize: '18px', fontWeight: '700' }}>
                                {category.name}
                              </span>
                            </div>
                            {speakersWithCategory[category.order].map((speaker, key) => (
                              <>
                                {speaker.published && (
                                  <Col
                                    key={key}
                                    xs={24}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    xxl={12}>
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
                                            speaker.category,
                                          )
                                        }
                                      }}
                                      hoverable={!!speaker.description}
                                      style={{
                                        paddingTop: '30px',
                                        borderRadius: '20px',
                                        /* paddingLeft: '50px',
                                        paddingRight: '50px', */
                                        minHeight: '428px',
                                        backgroundColor:
                                          this.props.cEvent.value?.styles
                                            ?.toolbarDefaultBg,
                                      }}
                                      cover={
                                        speaker.image ? (
                                          <Avatar
                                            style={{ display: 'block', margin: 'auto' }}
                                            size={{
                                              xs: 130,
                                              sm: 160,
                                              md: 120,
                                              lg: 170,
                                              xl: 210,
                                              xxl: 210,
                                            }}
                                            /* size={210} */ src={speaker.image}
                                          />
                                        ) : (
                                          <Avatar
                                            style={{ display: 'block', margin: 'auto' }}
                                            size={{
                                              xs: 130,
                                              sm: 160,
                                              md: 120,
                                              lg: 170,
                                              xl: 210,
                                              xxl: 210,
                                            }}
                                            /* size={210} */ icon={<UserOutlined />}
                                          />
                                        )
                                      }
                                      actions={
                                        speaker.description && [this.btnViewMore(speaker)]
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
                                              <Tooltip placement="bottomLeft" title={speaker.name}>
                                                {speaker.name}
                                              </Tooltip>
                                            </p>
                                          </div>,
                                        ]} */
                                        description={[
                                          <div
                                            key={'speaker-description  ' + key}
                                            style={{
                                              minHeight: '100px',
                                              textAlign: 'center',
                                            }}>
                                            <Title
                                              level={4}
                                              style={{
                                                color:
                                                  this.props.cEvent.value?.styles
                                                    ?.textMenu,
                                              }}>
                                              {speaker.name}
                                            </Title>
                                            <Paragraph
                                              style={{
                                                color:
                                                  this.props.cEvent.value?.styles
                                                    ?.textMenu,
                                              }}>
                                              {speaker.profession}
                                            </Paragraph>
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
        <Row wrap gutter={[16, 16]} justify="center" style={{ padding: '40px' }}>
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
                            speaker.category,
                          )
                        }
                      }}
                      hoverable={!!speaker.description}
                      style={{
                        paddingTop: '30px',
                        borderRadius: '20px',
                        /* paddingLeft: '50px',
                          paddingRight: '50px', */
                        minHeight: '428px',
                        backgroundColor:
                          this.props.cEvent.value?.styles?.toolbarDefaultBg,
                      }}
                      cover={
                        speaker.image ? (
                          <Avatar
                            style={{ display: 'block', margin: 'auto' }}
                            size={{
                              xs: 130,
                              sm: 160,
                              md: 120,
                              lg: 170,
                              xl: 210,
                              xxl: 210,
                            }}
                            /* size={210} */ src={speaker.image}
                          />
                        ) : (
                          <Avatar
                            style={{ display: 'block', margin: 'auto' }}
                            size={{
                              xs: 130,
                              sm: 160,
                              md: 120,
                              lg: 170,
                              xl: 210,
                              xxl: 210,
                            }}
                            /* size={210} */ icon={<UserOutlined />}
                          />
                        )
                      }
                      actions={speaker.description && [this.btnViewMore(speaker)]}>
                      <Meta
                        description={[
                          <div
                            key={'speaker-description  ' + key}
                            style={{ minHeight: '100px', textAlign: 'center' }}>
                            <Title
                              level={4}
                              style={{
                                color: this.props.cEvent.value?.styles?.textMenu,
                              }}>
                              {speaker.name}
                            </Title>
                            <Paragraph
                              style={{
                                color: this.props.cEvent.value?.styles?.textMenu,
                              }}>
                              {speaker.profession}
                            </Paragraph>
                          </div>,
                        ]}
                      />
                    </Card>
                  </Col>
                )}
              </>
            ))}
        </Row>

        {/* Modal de Speakers para mostrar la información del conferencista junto con sus lecciones */}

        <Modal
          closeIcon={
            <CloseOutlined style={{ color: this.props.cEvent.value?.styles?.textMenu }} />
          }
          bodyStyle={{
            backgroundColor: this.props.cEvent.value?.styles?.toolbarDefaultBg,
          }}
          centered
          width={1000}
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          footer={null}>
          <Row>
            {/* Imagen del conferencista */}

            <Col flex="1 1 auto">
              {infoSpeaker.imagen ? (
                <Avatar
                  style={{ display: 'block', margin: '0 auto' }}
                  size={210}
                  src={infoSpeaker.imagen}
                />
              ) : (
                <Avatar
                  style={{ display: 'block', margin: '0 auto' }}
                  size={210}
                  icon={<UserOutlined />}
                />
              )}
            </Col>

            {/* Descripción del conferencista */}
            <Col flex="1 1 600px">
              <span>
                <b style={{ color: this.props.cEvent.value?.styles?.textMenu }}>
                  {infoSpeaker.nombre}
                </b>
              </span>
              <p style={{ color: this.props.cEvent.value?.styles?.textMenu }}>
                <span>
                  <b>{infoSpeaker.cargo}</b>
                </span>
                <br />
                <br />
                <Row justify="center">
                  <Col span={24} id="img-description">
                    <ReactQuill
                      style={{ color: this.props.cEvent.value?.styles?.textMenu }}
                      value={infoSpeaker.descripcion}
                      readOnly
                      className="hide-toolbar ql-toolbar"
                      theme="bubble"
                    />
                  </Col>
                </Row>
              </p>
            </Col>
            <Col span={24}>
              <Row justify="end">
                <Button
                  key="cerrar"
                  size="large"
                  type="primary"
                  onClick={() => this.setModalVisible(false)}>
                  Cerrar
                </Button>
              </Row>
            </Col>
          </Row>
          {infoSpeaker.description_activity === 'true' && (
            <div>
              {/* Contenedor para descripcion 
                            Se mapea tambien las lecciones por Speaker 
                        */}
              {activityesBySpeaker.map((activities, key) => (
                <div key={key}>
                  <Card
                    style={{ padding: '24px 40px', top: '50px', marginBottom: '30px' }}>
                    <div>
                      <p>
                        <b>
                          {dayjs(activities.datetime_start).format('lll')} -{' '}
                          {dayjs(activities.datetime_end).format('lll')}
                        </b>
                      </p>
                      <p>{activities.name}</p>
                      <br />
                      <Row justify="center">
                        <Col span={24} id="img-description">
                          <ReactQuill
                            value={activities.description}
                            readOnly
                            className="hide-toolbar ql-toolbar"
                            theme="bubble"
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </div>
    )
  }
}

const SpeakerswithContext = withContext(Speakers)
export default SpeakerswithContext
