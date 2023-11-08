import { FC, useEffect, useState } from 'react';
import { CertsApi } from '../../helpers/request';
import { useHistory, withRouter } from 'react-router-dom';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, Modal, Select, Button, Upload, Image } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, ExclamationOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { DispatchMessageService } from '../../context/MessageService';
import { CertificatesProps, ICertificate } from './types';
import { imgBackground } from './utils/constants';
import { UseUserEvent } from '@/context/eventUserContext';
import RowsCertificate from './components/RowsCertificate';
import { useGetCertificatesRows } from './hooks/useGetCertificatesRows';
import { nameCertificateRules, typeUserCertificateRules } from './utils/certificateFormRules';
import { useGetUserType } from './hooks/useGetUserType';
import { getAllEventCertificateTags } from './utils/propertiesTagsCerificate';
import { useGetCertificate } from './hooks/useGetCertificate';
import { useImageCertificate } from './hooks/useImageCertificate';
import { generate } from './utils/generateCertificate';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Certificado: FC<CertificatesProps> = (props) => {
  const [form] = Form.useForm<ICertificate>();
  const history = useHistory();
  let cEventUser = UseUserEvent();
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const { image, restoreImage, handleChangeImage, onChangeCertificateImage } = useImageCertificate();
  const properties = cEventUser.value.properties || {};
  const { certificatesRow, handleDragEnd, handledDelete, handledEdit, handledAdd } = useGetCertificatesRows(
    locationState?.edit ?? ''
  );
  const { userTypes, isLoadingUserTypes } = useGetUserType(props.event._id);
  const { certificate, isLoadingCertificate} = useGetCertificate(locationState.edit ?? '');
  const allTags = getAllEventCertificateTags(properties);

  const onSubmit = async (certificateForm: ICertificate) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });
    try {
      const data = {
        name: certificateForm.name,
        userTypes: certificateForm.userTypes,
        content: certificatesRow,
        event_id: props.event._id,
        background: image,
        rol_id: certificate?.rol?._id,
        rol: certificate?.rol,
      };
      return console.log('data',data)
      if (locationState.edit) {
        await CertsApi.editOne(data, locationState.edit);
      } else {
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


  useEffect(() => {
    form.setFieldsValue({name:certificate?.name ?? '', userTypes:certificate?.userTypes ?? []})
    if(certificate?.background) onChangeCertificateImage(certificate?.background)
  }, [certificate])
  

  if(isLoadingCertificate)return <>Cargando</>
  return (
    <Form form={form} onFinish={onSubmit} {...formLayout} >
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
                <Upload type='select' accept='image/*' showUploadList={false} onChange={(e) => handleChangeImage(e)}>
                  <Button type='primary' icon={<UploadOutlined />}>
                    {'Imagen de Fondo'}
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button type='primary' onClick={()=>{generate(props.event, certificatesRow, image)}}>
                  {'Generar'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        }
      />

      <Row justify='center' wrap gutter={[12, 22]}>
        <Col span={20}>
          <Row wrap gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <label style={{ marginTop: '2%' }} className='label'>
                    Nombre
                  </label>
                }
                rules={nameCertificateRules}
                name={'name'}>
                <Input
                  // value={certificado?.name}
                  name={'name'}
                  placeholder={'Nombre del certificado'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ margin: 0 }}
                label={'Tipo de usuario'}
                name={'userTypes'}
                rules={typeUserCertificateRules}>
                <Select
                  mode='multiple'
                  showArrow
                  maxTagCount={'responsive'}
                  style={{ width: '100%' }}
                  placeholder='Seleccione el tipo de usuario'
                  // defaultValue={certificado.userTypes}
                  options={userTypes}
                  loading={isLoadingUserTypes}
                />
              </Form.Item>
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
                name={'imgBackground'}
                tooltip={
                  <>
                    {'Si desea volver a tener la imagen anterior presione el siguiente botón'}
                    <Button
                      type='primary'
                      onClick={() =>
                        restoreImage()
                      }>
                      {'Cambiar a Imagen Original'}
                    </Button>
                  </>
                }
              />
              <Image
                src={
                  image
                }
                alt={'Imagen Certificado'}
              />
            </Col>
          </Row>
          {/* <Form.Item label={'Certificado'} name={'content'}>
            <CertificadoRow_Old handleDragEnd={handleDragEnd} rows={certificatesRow} onChange={setCertificateRows} />
          </Form.Item> */}
        </Col>
        <Col span={20}>
          <RowsCertificate
            handleDragEnd={handleDragEnd}
            certificateRows={certificatesRow}
            handledDelete={handledDelete}
            handledEdit={handledEdit}
            handledAdd={handledAdd}
          />
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
};
//@ts-ignore
export default withRouter(Certificado);
