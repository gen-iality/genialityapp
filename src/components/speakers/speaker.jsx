import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import EviusReactQuill from '../shared/eviusReactQuill';
import { FaChevronLeft } from 'react-icons/fa';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import { fieldsSelect, handleRequestError, sweetAlert, uploadImage, handleSelect } from '../../helpers/utils';
import { imageBox } from '../../helpers/constants';
import { CategoriesAgendaApi, SpeakersApi } from '../../helpers/request';
import Creatable from 'react-select';
import { Button, Typography, Row, Col, Form, Input, Upload, Image, Empty, Card, Switch, Modal, notification, Tooltip } from 'antd';
import { LeftOutlined, UserOutlined , SettingOutlined, DeleteOutlined, SaveOutlined, ExclamationCircleOutlined, PlusCircleOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
/* import ImgCrop from 'antd-img-crop'; */

const { Title } = Typography;
const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

class Speaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLoading: false,
      name: '',
      profession: '',
      description: '',
      description_activity: false,
      published: true,
      image: '',
      imageData: '',
      networks: [],
      order: 0,
      selectedCategories: [],
      category_id: '',
      categories: [],
      index: 0,
      isloadingSelect: { types: true, categories: true },
    };
  }

  async componentDidMount() {
    const {
      eventID,
      location: { state },
    } = this.props;
    let categories = await CategoriesAgendaApi.byEvent(this.props.eventID);
    
    categories = handleSelect(categories);

    if (state.edit) {
      const info = await SpeakersApi.getOne(state.edit, eventID);
      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));
      const field = fieldsSelect(info.category_id, categories);
      this.setState({ 
        selectedCategories: fieldsSelect(info.category_id, categories)
      });
      if(info.description === '<p><br></p>')
      {
        this.setState({description: ''});
      }
    }
    const isloadingSelect = { types: false, categories: false };
    this.setState({ loading: false, isloadingSelect, categories });
  }

  handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  handleImage = async (files) => {
    try {
      const file = files[0];
      if (file) {
        const image = await uploadImage(file);
        this.setState({ image });
      } else {
        this.setState({ errImg: 'Only images files allowed. Please try again :)' });
      }
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  chgTxt = (content) => {
    let description = content;
    if(description === '<p><br></p>'){
      description = '';
    } 
    this.setState({ description });
  };

  submit = async (values) => {
    try {
      const {
        eventID,
        location: { state },
      } = this.props;
      this.setState({ isLoading: true });
      const { name, profession, description_activity, description, image, order, published, selectedCategories } = values;
      
      const info = {
        name,
        image,
        description_activity,
        description,
        profession,
        published,
        category_id: selectedCategories.value,
        order: parseInt(order),
        index: parseInt(order)
      };
      if (state.edit) await SpeakersApi.editOne(info, state.edit, eventID);
      else await SpeakersApi.create(eventID, info);
      notification.success({
        message: 'Operación Exitosa',
        description: 'Información guardada',
        placement:'bottomRight'
      })
      this.props.history.push(`/event/${eventID}/speakers`)
    } catch (e) {
      notification.error({
        message: handleRequestError(e).message,
        description: 'Hubo un error guardando',
        placement:'bottomRight'
      })
    }
  };

  remove = () => {
    let self = this;
    const {
      eventID,
      location: { state },
    } = self.props;
    if (state.edit) {
      confirm({
        title: `¿Está seguro de eliminar al conferencista?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemoveSpeaker = async () => {
            try {
              await SpeakersApi.deleteOne(state.edit, eventID);
              self.setState({ redirect: true });
              notification.success({
                message: 'Operación Exitosa',
                description: 'Se eliminó al conferencista ',
                placement:'bottomRight'
              })
            } catch (e) {
              notification.error({
                message: handleRequestError(e).message,
                description: 'Hubo un error eliminando al conferencista',
                placement:'bottomRight'
              })
            }
          }
          onHandlerRemoveSpeaker();
        }
      });
    } else this.setState({ redirect: true });
  };

  //FN para guardar en el estado la opcion seleccionada
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories });
  };

  //FN para ir a una ruta específica (ruedas en los select)
  goSection = (path, state) => {
    this.props.history.push(path, state);
  };

  render() {
    const { matchUrl } = this.props;
    const newCategoryUrl = '/event/' + this.props.eventID; // Ruta creada para el boton de nueva categoria /event/[eventID]
    const {
      redirect,
      loading,
      name,
      profession,
      description_activity,
      description,
      image,
      order,
      categories,
      published,
      selectedCategories,
      isloadingSelect,
    } = this.state;

    if (!this.props.location.state || redirect) return <Redirect to={matchUrl} />;
    return (
      <Form
        onFinish={() => this.submit(this.state)}
        {...formLayout}
      >
        <Title level={4} >
          <Link to={matchUrl}><LeftOutlined /></Link> 
          {'Conferencistas'}
        </Title>

        <Row justify='end' gutter={8}>
          <Col>
            <Form.Item label={'Visible'} labelCol={{span: 13}}>
              <Switch 
                checkedChildren="Sí"
                unCheckedChildren="No" 
                name={'published'}
                defaultChecked={published}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item >
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {'Guardar'}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            {
              this.props.location.state.edit && (
                <Form.Item>
                  <Button onClick={this.remove} type="link" danger icon={<DeleteOutlined />}>
                    {'Eliminar'}
                  </Button>
                </Form.Item>
              ) 
            }
          </Col>
        </Row>

        <Row justify='center' wrap gutter={12}>
          <Col span={12}>
            <Form.Item label={'Nombre'} >
              <Input
                value={name}
                placeholder='Nombre del conferencista'
                name={'name'}
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Item>
            
            <Form.Item label={'Ocupación'} >
              <Input
                value={profession}
                placeholder='Ocupación del conferencista'
                name={'profession'}
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Item>
            <Form.Item label={'Carga de imagen'}>
              <Card style={{'textAlign': 'center'}}>
                <Form.Item noStyle>
                  <p>Dimensiones: 1080px x 1080px</p>
                  <Dropzone
                    style={{ fontSize: '21px', fontWeight: 'bold' }}
                    onDrop={this.handleImage}
                    accept='image/*'
                    className='zone'>
                    <Button type='dashed' danger>
                      {image ? 'Cambiar imagen' : 'Subir imagen'}
                    </Button>
                  </Dropzone>
                  <div style={{'marginTop': '10px'}}>
                    {
                      image ? (
                      <Image src={this.state.image} height={250} width={300} />
                      ) : (
                        <Empty 
                          image={<UserOutlined style={{'fontSize': '100px'}} />}
                          description="No hay Imagen"
                        />
                    )}
                  </div>
                </Form.Item>
              </Card>
            </Form.Item>
            
            <Form.Item label={'Descripción'} >
              <p 
                onClick={() => this.setState({ description_activity: !description_activity})} 
                style={{'color': 'blue', 'cursor': 'pointer'}}
              >
                {
                  !description_activity ? (
                    <div>
                      { description ? (
                        <EditOutlined style={{'marginRight': '5px'}} />
                      ) : (
                        <PlusCircleOutlined style={{'marginRight': '5px'}} />
                      )}
                      {!description ? 'Agregar' : 'Editar'} {'descripción'}
                    </div>
                  ) : (
                    <Tooltip text={'Si oculta la infomación da a entender que no desea mostrar el contenido de la misma'}>
                      <UpOutlined style={{'marginRight': '5px'}}/>
                      {'Ocultar descripción'}
                    </Tooltip>
                  )
                }
              </p>
              {
                description_activity && (
                  <EviusReactQuill 
                    name={'description'} 
                    data={description} 
                    handleChange={this.chgTxt}
                    style={{'marginTop': '5px'}}
                  />
                )
              }
            </Form.Item>
            
            <Form.Item label='Categoría'>
              <Row wrap gutter={16}>
                <Col span={22}>
                  <Creatable
                    isClearable
                    styles={catStyles}
                    onChange={this.selectCategory}
                    isDisabled={isloadingSelect.categories}
                    isLoading={isloadingSelect.categories}
                    options={categories}
                    placeholder={'Sin categoría....'}
                    value={selectedCategories}
                  />
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button onClick={() => this.goSection(`${newCategoryUrl}/agenda/categorias`)} icon={<SettingOutlined />}>
                    </Button> 
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            
          </Col>
        </Row>
      </Form>
    );
  }
}

//Estilos para el tipo
const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10,
  },
});

const catStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' }),
  multiValue: (styles, { data }) => ({ ...styles, ...dot(data.item.color) }),
};

export default withRouter(Speaker);