import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { CertsApi, RolAttApi } from '../../helpers/request';
import { Card, Col, Alert, Modal, Spin, Row, Typography, Button, Space, Result, Image } from 'antd';
import { withRouter } from 'react-router-dom';
import withContext from '../../context/withContext';
import { ArrayToStringCerti, replaceAllTagValues } from './utils';
import { CertifiRow, Certificates, UserData } from './types';
import { imgBackground } from './utils/constants';
import { DownloadOutlined } from '@ant-design/icons';

function CertificadoLanding(props: any) {
  const [certificates, setCertificates] = useState<Certificates[]>([]);

  const getCerts = async () => {
    let certs: Certificates[] = await CertsApi.byEvent(props.cEvent.value._id);
    const userType = props.cEventUser?.value?.properties?.list_type_user
    if (certs && certs.length > 0) {
      if(userType) certs = certs.filter((item)=> item.userTypes?.includes(userType))
      setCertificates(certs); 
    }console.log(props.cEvent.value.styles, 'hola')
  };
  useEffect(() => {
    getCerts();
  },[]);

  const generateCert = async (dataUser: UserData, cert: Certificates) => {
    const modal = Modal.success({
      title: 'Generando certificado',
      content: <Spin>Espera</Spin>,
    });

    const roles = await RolAttApi.byEvent(props.cEvent.value._id);
    props.cEvent.value.datetime_from = Moment(props.cEvent.value.datetime_from).format('DD/MM/YYYY');
    props.cEvent.value.datetime_to = Moment(props.cEvent.value.datetime_to).format('DD/MM/YYYY');

    let content: string | CertifiRow[] = cert.content;
    if (Array.isArray(content)) {
      const rowsWithData = replaceAllTagValues(props.cEvent.value, dataUser, roles, content);
      content = ArrayToStringCerti(rowsWithData);
    }
    
    const body = { content, image: cert.background ? cert.background : imgBackground };
    const file = await CertsApi.generateCert(body);
    const blob = new Blob([file.blob], { type: file.type });

    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.type = 'json';
    link.href = data;
    link.download = 'certificado.pdf';
    link.dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      modal.destroy();
    }, 60);
  };
  return (
    <>
     {props.cEventUser.value && 
        <Row justify='center'>
          <Col span={23}>
            <Card style={{borderRadius: 20}}>
              <Space direction='vertical' style={{width: '100%'}}>
                <Typography.Title level={3} style={{color: props.cEvent.value.styles.textMenu}}>Certificado(s)</Typography.Title>
                {certificates.length > 0 ?
                  <Row justify='start' gutter={[16, 16]} style={{width: '100%'}}>
                    {certificates.map((certificate) => (
                      <Col key={'certi' + certificate._id} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <Image 
                          style={{borderRadius: 15}}
                          src={certificate.background}
                          alt={certificate.name}
                          preview={false}
                        />
                        <Result 
                          icon={<></>}
                          title={<Typography.Text style={{color: props.cEvent.value.styles.textMenu}}>{certificate.name}</Typography.Text>}
                          extra={
                            <Button
                              /* type='primary' */
                              onClick={() => generateCert(props.cEventUser.value, certificate)}
                              style={{ border: 'none', boxShadow: 'none' }}
                              key={'download' + certificate._id}
                              icon={<DownloadOutlined style={{fontSize: 30, color: props.cEvent.value.styles.textMenu}} />}
                            />
                          }
                          style={{position: 'absolute', top: 20, left: 70}}
                        />
                      </Col>
                    ))}
                  </Row>
                  : certificates.length === 0 &&
                  <Row justify='center' align='middle'>
                    <Col span={24}>
                      <Result 
                        status={'info'}
                        title={<Typography.Text strong style={{color: props.cEvent.value.styles.textMenu}}>¡No tiene(s) certificado(s) generados!</Typography.Text>}
                      />
                    </Col>
                  </Row>
                }
              </Space>
            </Card>
          </Col>
        </Row>
      }

      {!props.cUser.value ||
        (!props.cUser.value._id && <p>Debes ingresar con tu usuario para descargar el certificado</p>)}

      {props.cUser?.value?._id && !props.cEventUser.value && (
        <h1
          style={{
            justifyContent: 'center',
            fontSize: '27px',
            alignItems: 'center',
            display: 'flex',
            fontWeight: 'bold',
          }}>
          Debes estar registrado en el evento para poder descargar tu certificado{' '}
        </h1>
      )}

      {props.cUser?.value?._id && !props.cEventUser.value && (
        <h1 style={{ justifyContent: 'center', fontSize: '27px', alignItems: 'center', display: 'flex' }}>
          Debes Haber asistido para descargar el certificado
        </h1>
      )}

      {/* {props.cEventUser.value && (
        <Row gutter={[8, 8]} wrap justify='center'>
          <Col span={24}>
            <Card>
              <>
                <Alert message='Certificados disponibles / Click para descargarlos' type='success' />

                <div key={'certificados'}>
                  <br />
                  <Row justify='start' style={{ display: 'flex', height: 400, overflowY: 'auto' }}>
                    {certificates.map((certificate) => (
                      <Col key={'certi' + certificate._id} style={{ margin: 5 }}>
                        <Card
                          bodyStyle={{ height: 250 }}
                          style={{ width: 300, textAlign: 'center', borderRadius: 20 }}
                          actions={[
                            <Button
                              onClick={() => generateCert(props.cEventUser.value, certificate)}
                              style={{ width: '100%', border: 'none', boxShadow: 'none' }}
                              key={'download' + certificate._id}
                              icon={<DownloadOutlined />}
                            />,
                          ]}>
                          <Row style={{ position: 'absolute', top: '40%', justifyContent: 'center', width: '80%' }}>
                            <Typography.Title level={5}>{certificate.name}</Typography.Title>
                          </Row>
                          <img
                            alt={certificate.name}
                            src={certificate.background}
                            width={250}
                            style={{ maxHeight: 200 }}
                            title={certificate.name}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Row></Row>
                  <br />
                </div>
              </>
            </Card>
          </Col>
        </Row>
      )}

      {!props.cUser.value ||
        (!props.cUser.value._id && <p>Debes ingresar con tu usuario para descargar el certificado</p>)}

      {props.cUser?.value?._id && !props.cEventUser.value && (
        <h1
          style={{
            justifyContent: 'center',
            fontSize: '27px',
            alignItems: 'center',
            display: 'flex',
            fontWeight: 'bold',
          }}>
          Debes estar registrado en el evento para poder descargar tu certificado{' '}
        </h1>
      )}

      {props.cUser?.value?._id && !props.cEventUser.value && (
        <h1 style={{ justifyContent: 'center', fontSize: '27px', alignItems: 'center', display: 'flex' }}>
          Debes Haber asistido para descargar el certificado
        </h1>
      )} */}
    </>
  );
}
let CertificadoLandingwithContext = withContext(CertificadoLanding);
export default withRouter(CertificadoLandingwithContext);
