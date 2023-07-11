import React, { useEffect, useState } from 'react'
import { Component, createElement } from 'react';
import Moment from 'moment';
import { firestore } from '../../helpers/firebase';
import { CertsApi, RolAttApi } from '../../helpers/request';
import { Button, Card, Col, Alert, Modal, Spin, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import withContext from '../../context/withContext';
import { ArrayToStringCerti, replaceAllTagValues } from './utils';
import { availableTags, imgBackground } from './utils/constants';
import { CertifiRow, Certificates, UserData } from './types';


const IconText = ({ icon, text, onSubmit } : any) => (
    <Button htmlType='submit' type='primary' onClick={onSubmit}>
      {createElement(icon, { style: { marginRight: 8 } })}
      {text}
    </Button>
  );
function CertificadoLanding(props: any) {
const [first, setfirst] = useState('')
const [certificates, setCertificates] = useState<Certificates[]>([])
const [state, setState] = useState(  {
  
    disabled: true,
    toSearch: '',
    dataUser: [],
    message: false,
    background: imgBackground
  })

const getCerts = async () => {
  const certs : Certificates[]  = await CertsApi.byEvent(props.cEvent.value._id);
  if(certs && certs.length > 0)  {
    setCertificates(certs)
  }  
}
useEffect(()=>{
  getCerts()
},[])

const  generateCert = async (dataUser : UserData, cert: Certificates ) => {
        const modal = Modal.success({
          title: 'Generando certificado',
          content: <Spin>Espera</Spin>,
        });

        const roles = await RolAttApi.byEvent(props.cEvent.value._id);
        props.cEvent.value.datetime_from = Moment(props.cEvent.value.datetime_from).format('DD/MM/YYYY');
        props.cEvent.value.datetime_to = Moment(props.cEvent.value.datetime_to).format('DD/MM/YYYY');
   
    
        let content : string | CertifiRow[] = cert.content 
        if (Array.isArray(content)) {
          const rowsWithData = replaceAllTagValues(props.cEvent.value,dataUser,roles,content)
          content = ArrayToStringCerti(rowsWithData)
      }
        const body = { content, image: cert.background ? cert.background : state.background };
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
      }

    let checkedInUsers = props.cEventUser.value ? [props.cEventUser.value] : [];
    return (
        <>
          { props.cUser?.value?._id && checkedInUsers && checkedInUsers.length > 0 && (
            <Row gutter={[8, 8]} wrap justify='center'>
              <Col span={24}>
                <Card>
                  <>
                    <Alert message='Certificados disponibles' type='success' />
                    {checkedInUsers.map((user, key) => (
                      <div key={key}>
                        <br />
                        {certificates.map((certificate)=> (
                          <Card title={certificate.name} hoverable />
                        ))}
                        {/* <IconText
                          text='Descargar Certificado'
                          icon={DownloadOutlined}
                          onSubmit={() => generateCert(user)}
                        /> */}
                        <br />
                      </div>
                    ))}
                  </>
                </Card>
              </Col>
            </Row>
          )}
  
          {!props.cUser.value ||
            (!props.cUser.value._id && <p>Debes ingresar con tu usuario para descargar el certificado</p>)}
  
          {props.cUser.value && props.cUser.value._id && checkedInUsers && checkedInUsers.length <= 0 && (
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
  
          {props.cUser.value && props.cUser.value._id && checkedInUsers && checkedInUsers.length <= 0 && (
            <h1 style={{ justifyContent: 'center', fontSize: '27px', alignItems: 'center', display: 'flex' }}>
              Debes Haber asistido para descargar el certificado
            </h1>
          )}
        </>
      );
}
let CertificadoLandingwithContext = withContext(CertificadoLanding);
export default withRouter(CertificadoLandingwithContext);