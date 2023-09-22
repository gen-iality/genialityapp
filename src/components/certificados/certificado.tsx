import { FC, useEffect, useState } from 'react';
import { CertsApi, EventsApi, RolAttApi } from '../../helpers/request';
import { useHistory, withRouter } from 'react-router-dom';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, Modal, Select, Button, Upload, Image } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, ExclamationOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import moment from 'moment';
import { firestore } from '../../helpers/firebase';
import { DispatchMessageService } from '../../context/MessageService';
import { ICertificado, CertificatesProps, CertifiRow } from './types';
import CertificadoRow from './components/CertificadoRows';
import { ArrayToStringCerti, defaultCertRows, replaceAllTagValues } from './utils';
import { PropertyTypeUser, imgBackground } from './utils/constants';
import { UseUserEvent } from '@/context/eventUserContext';

const { confirm } = Modal;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Certificado: FC<CertificatesProps> = (props) => {
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [certificado, setCertificado] = useState<ICertificado>({
    imageFile: imgBackground,
    imageData: imgBackground,
    image: imgBackground,
  });
  const [types, setTypes] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [certificateRows, setCertificateRows] = useState<CertifiRow[]>([]);
  const [rol, setRol] = useState({} as any);
  const [previewCert] = useState({});
  const tags = [
    { tag: 'event.name', label: 'Nombre del Evento', value: 'name' },
    { tag: 'event.start', label: 'Fecha Inicio del Evento', value: 'datetime_from' },
    { tag: 'event.end', label: 'Fecha Fin del Evento', value: 'datetime_to' },
    { tag: 'event.venue', label: 'Lugar del Evento', value: 'venue' },
    { tag: 'event.address', label: 'Dirección del Evento', value: 'location.FormattedAddress' },
    { tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names' },
    { tag: 'user.email', label: 'Correo de asistente', value: 'email' },
    { tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title' },
    { tag: 'rol.name', label: 'Nombre del Rol', value: '' },
  ];
  let cEventUser = UseUserEvent();

  const properties = cEventUser.value.properties || {};
  const filteredPropertiesTags = Object.keys(properties)
    .filter((key) => {
      return key !== 'names' && key !== 'email' && key !== 'list_type_user' && key !== 'rol_id' && key !== 'code';
    })
    .map((key) => {
      return {
        tag: `properties.${key}`,
        label: `Propiedad ${key}`,
        value: key,
      };
    });

  const allTags = [...tags, ...filteredPropertiesTags];

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    } else {
      setCertificateRows(defaultCertRows);
    }
    getTypes();
  }, [locationState.edit]);

  const getOne = async () => {
    const data = await CertsApi.getOne(locationState.edit);
    setCertificateRows(Array.isArray(data.content) ? data.content : defaultCertRows);
    setCertificado({ ...data, imageFile: data.background });
  };
  const handleDragEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const uptadeRows = [...certificateRows];
      const movedItem = uptadeRows.splice(oldIndex, 1)[0];
      uptadeRows.splice(newIndex, 0, movedItem);
      setCertificateRows(uptadeRows);
    }
  };
  const onSubmit = async () => {
    if (certificado.name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (locationState.edit) {
          const data = {
            name: certificado.name,
            content: certificateRows,
            background: certificado.image?.data || certificado.image,
            rol: certificado?.rol,
            rol_id: certificado.rol?._id,
            event_id: props.event._id,
            userTypes: certificado.userTypes,
          };
          await CertsApi.editOne(data, locationState.edit);
        } else {
          const data = {
            name: certificado.name,
            rol_id: certificado.rol?._id,
            content: certificateRows,
            event_id: props.event._id,
            background: certificado.image?.data || certificado.image,
            rol: certificado?.rol,
            userTypes: certificado.userTypes,
          };
          await CertsApi.create(data);
        }
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
        history.push(`${props.matchUrl}`);
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
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'El nombre es requerido',
        action: 'show',
      });
    }
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        //@ts-ignore
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await CertsApi.deleteOne(locationState.edit);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(`${props.matchUrl}`);
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
          onHandlerRemove();
        },
      });
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCertificado({ ...certificado, [name]: value });
  };
  const selectChange = (data: string[]) => {
    setCertificado((prev) => ({ ...prev, userTypes: data }));
  };

  const getRoles = async () => {
    const data = await RolAttApi.byEvent(props.event._id);
    setRoles(data);
  };

  const getTypes = async () => {
    const data = await EventsApi.getOne(props.event._id);
    if (data) {
      const dataTypes = data.user_properties.find((item: any) => item.name === PropertyTypeUser);
      if (dataTypes) setTypes(dataTypes.options);
    }
  };

  const onChangeRol = async (e: any) => {
    setRol(roles.find((rol) => rol?._id === e) ?? {});
    setCertificado({ ...certificado, rol: roles.find((rol) => rol?._id === e) });
  };

  const handleImage = (e: any) => {
    const file = e.file;
    if (file) {
      //Si la imagen cumple con el formato se crea el URL para mostrarlo
      setCertificado({ ...certificado, imageFile: window.URL.createObjectURL(file.originFileObj) });
      //Se crea un elemento Image para convertir la image en Base64 y tener el tipo y el formato

      let reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        const imageData = { data: reader.result, full: file.type, type: file.type.split('/')[1] };
        setCertificado({ ...certificado, imageData: imageData, imageFile: imageData, image: imageData });
      };
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Solo se permiten imágenes. Intentalo de nuevo',
        action: 'show',
      });
    }
  };

  const generate = () => {
    props.event.datetime_from = moment(props.event.datetime_from).format('DD-MM-YYYY');
    props.event.datetime_to = moment(props.event.datetime_to).format('DD-MM-YYYY');
    const userRef = firestore.collection(`${props.event._id}_event_attendees`);
    userRef
      .orderBy('updated_at', 'desc')
      .limit(1)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const oneUser = querySnapshot.docs[0].data();
          const rowsWithData = replaceAllTagValues(props.event, oneUser, roles, certificateRows);
          const stringCerti = ArrayToStringCerti(rowsWithData);
          const body = {
            content: stringCerti,
            image: certificado.imageFile?.data ? certificado.imageFile?.data : certificado.imageFile || imgBackground,
          };

          CertsApi.generateCert(body).then((file) => {
            //@ts-ignore
            const blob = new Blob([file.blob], { type: file.type, charset: 'UTF-8' });

            const data = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.type = 'json';
            link.href = data;
            link.target = '_blank';
            link.dispatchEvent(new MouseEvent('click'));
            setTimeout(() => {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
            }, 60);
          });
        }
      });
  };

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title={'Certificado'}
        description={
          <>
            <ExclamationOutlined
              style={{ color: 'orange' }}
              className='animate__animated animate__pulse animate__infinite'
            />
            {'Para tener una vista más exacta del certificado por favor presione el botón de generar'}
            <br />
            <br />
          </>
        }
        back
        save
        form
        remove={onRemoveId}
        edit={locationState.edit}
        extra={
          <Form.Item>
            <Row wrap gutter={[16, 8]}>
              <Col>
                <Upload type='select' accept='image/*' showUploadList={false} onChange={(e) => handleImage(e)}>
                  <Button type='primary' icon={<UploadOutlined />}>
                    {'Imagen de Fondo'}
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button type='primary' onClick={generate}>
                  {'Generar'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        }
      />

      <Row justify='center' wrap gutter={12}>
        <Col span={20}>
          <Row wrap gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <label style={{ marginTop: '2%' }} className='label'>
                    Nombre <label style={{ color: 'red' }}>*</label>
                  </label>
                }
                rules={[{ required: true, message: 'El nombre es requerido' }]}>
                <Input
                  value={certificado.name}
                  name={'name'}
                  placeholder={'Nombre del certificado'}
                  onChange={(e) => handleChange(e)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ margin: 0 }}
                label={'Tipo de usuario'}
                name={'userType'}
                initialValue={certificado.rol}
              />
              <Select
                mode='multiple'
                showArrow
                maxTagCount={'responsive'}
                style={{ width: '100%' }}
                placeholder='Seleccione el tipo de usuario'
                onChange={selectChange}
                value={certificado.userTypes}
                options={types}
              />
              {/* <Form.Item
                label={'Rol'}
                name={'Rol'}>
                <Select
                  onChange={(e) => {
                    onChangeRol(e);
                  }}
                  placeholder={'Seleccione Rol'}
                  value={certificado.rol?._id || rol?._id}>
                  {roles.map((rol) => (
                    <Option key={rol?._id} value={rol?._id}>
                      {rol.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item label={'Etiquetas Disponibles'}>
                <p>Use etiquetas para ingresar información referente al evento o los asistentes</p>
                <Row wrap gutter={[18, 8]}>
                  {allTags.map((item, key) => (
                    <Col key={key}>
                      <code>{item.tag}</code>
                      <p>{item.label}</p>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={'Imagen de Fondo'}
                tooltip={
                  <>
                    {'Si desea volver a tener la imagen anterior presione el siguiente botón'}
                    <Button
                      type='primary'
                      onClick={() =>
                        setCertificado({
                          ...certificado,
                          imageFile: imgBackground,
                          imageData: imgBackground,
                          image: imgBackground,
                        })
                      }>
                      {'Cambiar a Imagen Original'}
                    </Button>
                  </>
                }
              />
              <Image
                src={certificado.imageFile?.data ? certificado.imageFile?.data : certificado.imageFile || imgBackground}
                alt={'Imagen Certificado'}
                preview={previewCert}
              />
            </Col>
          </Row>

          <Form.Item label={'Certificado'} name={'content'}>
            <CertificadoRow handleDragEnd={handleDragEnd} rows={certificateRows} onChange={setCertificateRows} />
          </Form.Item>
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
};
//@ts-ignore
export default withRouter(Certificado);
