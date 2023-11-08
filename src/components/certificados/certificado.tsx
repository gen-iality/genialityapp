import { FC, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Row, Col, Form, Input, Select, Button, Upload, Image } from 'antd';
import { UploadOutlined, ExclamationOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { CertificatesProps, ICertificate, ICertificateForm, ITagRow } from './types';
import { UseUserEvent } from '@/context/eventUserContext';
import RowsCertificate from './components/RowsCertificate';
import { useGetCertificatesRows } from './hooks/useGetCertificatesRows';
import { nameCertificateRules, typeUserCertificateRules } from './utils/certificateFormRules';
import { useGetUserType } from './hooks/useGetUserType';
import { getAllEventCertificateTags } from './utils/propertiesTagsCerificate';
import { useCrudCertificate } from './hooks/useCrudCertificate';
import { generate } from './utils/generateCertificate';
import Loading from '../profile/loading';


const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Certificado: FC<CertificatesProps> = (props) => {
  const [form] = Form.useForm<ICertificate>();
  const history = useHistory();
  let cEventUser = UseUserEvent();
  const certificateId = props.location.state?.edit ?? ''; 
  const properties = cEventUser.value.properties || {};
  const { certificatesRow, handleDragEnd, handledDelete, handledEdit, handledAdd } = useGetCertificatesRows(certificateId);
  const { userTypes, isLoadingUserTypes } = useGetUserType(props.event._id);
  const { certificate, isLoadingCertificate, handledAddCertificate, handledEditCertificate, handledDeleteCertificate, handleChangeImage, image, restoreImage } = useCrudCertificate(certificateId);
  const allTags:ITagRow[] = getAllEventCertificateTags(properties);

  const onSubmit = async (certificateForm: ICertificateForm) => {
    const data: Omit<ICertificate, '_id'> = {
      name: certificateForm.name,
      userTypes: certificateForm.userTypes,
      content: certificatesRow,
      event_id: props.event._id,
      background: image,
    };
    if (certificateId) {
      await handledEditCertificate(data)
    } else {
      await handledAddCertificate(data);
    }
    history.push(`${props.matchUrl}`);

  };

  const onDeleteCertificate = async()=>{
    await handledDeleteCertificate()
    history.push(`${props.matchUrl}`);
  }
  useEffect(() => {
    form.setFieldsValue({name:certificate?.name ?? '', userTypes:certificate?.userTypes ?? []})
  }, [certificate, form])
  
  //toDo: Style - Add a loader component
  if(isLoadingCertificate)return <Row style={{height:'500px'} } align='middle' justify='center'><Loading/></Row>

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
        remove={onDeleteCertificate}
        edit={certificateId}
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
                name={'background'}
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
            allTags={allTags}
          />
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
};
//@ts-ignore
export default withRouter(Certificado);
