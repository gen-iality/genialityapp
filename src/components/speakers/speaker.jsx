import { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import EviusReactQuill from '../shared/eviusReactQuill';
import { fieldsSelect, handleRequestError, sweetAlert, uploadImage, handleSelect } from '../../helpers/utils';
import { CategoriesAgendaApi, EventsApi, SpeakersApi } from '../../helpers/request';
import Creatable from 'react-select';
import { Button, Typography, Row, Col, Form, Input, Image, Empty, Switch, Modal, Tooltip, Select } from 'antd';
import {
  LeftOutlined,
  UserOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  UpOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { areaCode } from '../../helpers/constants';
import { DispatchMessageService } from '../../context/MessageService';
import ImageUploaderDragAndDrop from '@components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import Loading from '../profile/loading';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function Speaker(props) {
  const {
    eventID,
    location: { state },
    history,
    matchUrl,
    justCreate,
  } = props;
  const match = matchUrl.split('/').slice(0)[1];
  const newCategoryUrl = `/${match}/` + eventID; // Ruta creada para el boton de nueva categoria /event/[eventID]

  const [data, setData] = useState({
    name: '',
    description: '',
    description_activity: false,
    profession: '',
    published: true,
    image: null,
    order: 0,
    category_id: '',
    index: 0,
    newItem: true,
  });
  const [showDescription_activity, setShowDescription_activity] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errorImage, setErrorImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isloadingSelect, setIsloadingSelect] = useState({ types: true, categories: true });
  const [event, setEvent] = useState();
  const [areacodeselected, setareacodeselected] = useState(57);
  const [editDataIsLoading, setEditDataIsLoading] = useState(true);
  /* const [messageHeaderAlert, setMessageHeaderAlert] = useState(''); */

  useEffect(() => {
    dataTheLoaded();
  }, []);

  async function dataTheLoaded() {
    console.log('getting data to eventID:', eventID)
    let categoriesData = await CategoriesAgendaApi.byEvent(eventID);
    let event = await EventsApi.getOne(eventID);
    //const typeEvent = await TypesApi.getAll();
    if (event) {
      setEvent(event);
    }

    //Filtrado de categorias
    categoriesData = handleSelect(categoriesData);

    if (state.edit && !justCreate) {
      setEditDataIsLoading(true);
      const info = await SpeakersApi.getOne(state.edit, eventID);

      info ? setData({ ...info, newItem: false }) : '';

      setShowDescription_activity(info?.description_activity);
      const field = fieldsSelect(info.category_id, categoriesData);

      setSelectedCategories(field);

      if (info.description === '<p><br></p>') {
        setData({
          ...data,
          description: '',
        });
      }
    }
    const isloadingSelectChanged = { types: '', categories: '' };

    setCategories(categoriesData);
    setIsloadingSelect(isloadingSelectChanged);
    setEditDataIsLoading(false);
  }

  function handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  function chgTxt(content) {
    let description = content;
    if (description === '<p><br></p>') {
      description = '';
    }
    setData({
      ...data,
      description,
    });
  }

  async function handleImage(imageUrl) {
    setData({
      ...data,
      image: imageUrl,
    });
  }

  async function submit(values) {
    if (values.name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras guarda la información...',
        action: 'show',
      });

      const { name, profession, description, order, published, image } = values;

      const body = {
        name,
        image,
        description_activity: showDescription_activity,
        description,
        profession,
        published,
        category_id: selectedCategories?.value,
        order: parseInt(order),
        index: parseInt(order),
      };
      try {
        if (state.edit && !justCreate) await SpeakersApi.editOne(body, state.edit, eventID);
        else await SpeakersApi.create(eventID, body);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Conferencista guardado correctamente!',
          action: 'show',
        });
        if (!justCreate) history.push(`/${match}/${eventID}/speakers`);
        else if (props.onCreated) props.onCreated();
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
        /* if (handleRequestError(e).message === 'Speakers/host limit reached')
          setMessageHeaderAlert(handleRequestError(e).message); */
      }
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'El nombre es requerido',
        action: 'show',
      });
    }
  }

  function remove() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (state.edit && !justCreate) {
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
              setRedirect(true);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó al conferencista correctamente!',
                action: 'show',
              });
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemoveSpeaker();
        },
      });
    } else setRedirect(true);
  }

  //FN para guardar en el estado la opcion seleccionada
  function selectCategory(selectedCategories) {
    setSelectedCategories(selectedCategories);
  }

  //FN para ir a una ruta específica (ruedas en los select)
  function goSection(path, state) {
    history.push(path, state);
  }

  const prefixSelector = (
    <Select
      showSearch
      optionFilterProp='children'
      style={{ fontSize: '12px', width: 150 }}
      value={areacodeselected}
      onChange={(val) => {
        setareacodeselected(val);
        console.log(val);
      }}
      placeholder='Codigo de area del pais'>
      {areaCode.map((code, key) => {
        return (
          <Option key={key} value={code.value}>
            {`${code.label} (+${code.value})`}
          </Option>
        );
      })}
    </Select>
  );

  if (!props.location.state || redirect) return <Redirect to={matchUrl} />;

  return (
    <Form onFinish={() => submit(data)} {...formLayout}>
      <Header
        title={'Conferencistas' + (justCreate ? ' - crear nuevo': '')}
        back
        save
        form
        edit={state.edit && !justCreate}
        remove={remove}
        extra={
          <Form.Item label={'Visible'} labelCol={{ span: 13 }}>
            <Switch
              checkedChildren='Sí'
              unCheckedChildren='No'
              name={'published'}
              checked={data.published}
              onChange={(checked) =>
                setData({
                  ...data,
                  published: checked,
                })
              }
            />
          </Form.Item>
        }
        /* messageHeaderAlert={messageHeaderAlert} */
      />

      <Row justify='center' wrap gutter={12}>
        {state.edit && !justCreate && editDataIsLoading ? (
          <Loading />
        ) : (
          <Col span={justCreate ? 22 : 12}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }} className='label'>
                  Nombre <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'El nombre es requerido' }]}>
              <Input
                value={data.name}
                placeholder='Nombre del conferencista'
                name={'name'}
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>

            <Form.Item label={'Ocupación'}>
              <Input
                value={data.profession}
                placeholder='Ocupación del conferencista'
                name={'profession'}
                onChange={(e) => handleChange(e)}
              />
            </Form.Item>
            <Form.Item label={'Carga de imagen'}>
              <Form.Item noStyle>
                <ImageUploaderDragAndDrop
                  imageDataCallBack={handleImage}
                  imageUrl={data.image}
                  width='1080'
                  height='1080'
                />
              </Form.Item>
            </Form.Item>

            {event && event?.organizer?.type_event == 'Misiones' && (
              <Form.Item label={'Teléfono'} name={'phone'}>
                <Input
                  addonBefore={prefixSelector}
                  //onChange={(e) => setnumberareacode(e.target.value)}
                  value={data?.phone || ''}
                  //required={mandatory}
                  type='number'
                  key={'tel'}
                  style={{ width: '100%' }}
                  placeholder='Numero de telefono'
                />
              </Form.Item>
            )}

            <Form.Item label={'Descripción'}>
              <>
                {!showDescription_activity ? (
                  <Button
                    id='btnDescription'
                    type='link'
                    onClick={() => setShowDescription_activity(true)}
                    style={{ color: 'blue' }}>
                    {!showDescription_activity && !data.newItem ? (
                      <div>
                        {' '}
                        <EditOutlined style={{ marginRight: '5px' }} /> Editar/mostrar descripción{' '}
                      </div>
                    ) : (
                      <div>
                        {' '}
                        <PlusCircleOutlined style={{ marginRight: '5px' }} /> Agregar/mostrar descripción{' '}
                      </div>
                    )}
                  </Button>
                ) : (
                  <Tooltip
                    placement='top'
                    text={'Si oculta la infomación da a entender que no desea mostrar el contenido de la misma'}>
                    <Button type='link' onClick={() => setShowDescription_activity(false)} style={{ color: 'blue' }}>
                      <div>
                        <UpOutlined style={{ marginRight: '5px' }} />
                        Ocultar descripción{' '}
                      </div>
                    </Button>
                  </Tooltip>
                )}
              </>
              {showDescription_activity && (
                <EviusReactQuill
                  id='description'
                  name={'description'}
                  data={data.description}
                  handleChange={chgTxt}
                  style={{ marginTop: '5px' }}
                />
              )}
            </Form.Item>

            {/* <Form.Item label='Categoría'>
              <Row wrap gutter={16}>
                <Col span={22}>
                  <Creatable
                    isClearable
                    styles={catStyles}
                    onChange={selectCategory}
                    isDisabled={isloadingSelect.categories}
                    isLoading={isloadingSelect.categories}
                    options={categories}
                    placeholder={'Sin categoría....'}
                    value={selectedCategories}
                  />
                </Col>
                <Col span={2}>
                  <Form.Item>
                    <Button
                      id='goToCategory'
                      onClick={() => goSection(`${newCategoryUrl}/agenda/categorias`)}
                      icon={<SettingOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item> */}
          </Col>
        )}
      </Row>
      <BackTop />
    </Form>
  );
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
