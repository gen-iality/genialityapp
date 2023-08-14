import { Button, Card, Col, Image, Modal, Result, Space, Spin, Typography } from 'antd';
import React from 'react';
import { CertifiRow, Certificates, UserData } from '../types';
import { CertsApi, RolAttApi } from '@/helpers/request';
import Moment from 'moment';
import { ArrayToStringCerti, replaceAllTagValues } from '../utils';
import { imgBackground } from '../utils/constants';
import { DownloadOutlined } from '@ant-design/icons';

interface Props {
  certificate: Certificates;
  isMobile: boolean;
  eventValue: any;
  eventUserValue: any;
}
export const CertificateItem = ({ certificate, isMobile, eventValue, eventUserValue }: Props) => {
  const generateCert = async (dataUser: UserData, cert: Certificates) => {
    const modal = Modal.success({
      title: 'Generando certificado',
      content: <Spin>Espera</Spin>,
    });

    const roles = await RolAttApi.byEvent(eventValue._id);
    eventValue.datetime_from = Moment(eventValue.datetime_from).format('DD/MM/YYYY');
    eventValue.datetime_to = Moment(eventValue.datetime_to).format('DD/MM/YYYY');

    let content: string | CertifiRow[] = cert.content;
    if (Array.isArray(content)) {
      const rowsWithData = replaceAllTagValues(eventValue, dataUser, roles, content);
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
    <Col key={'certi' + certificate._id} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
      <Card bordered={false} bodyStyle={{ padding: 0, backgroundColor: eventValue.styles.toolbarDefaultBg }}>
        <Image style={{ borderRadius: 15 }} src={certificate.background} alt={certificate.name} preview={false} />
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Result
              icon={<></>}
              title={
                <Space direction='vertical'>
                  <Typography.Text>{certificate.name}</Typography.Text>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    onClick={() => generateCert(eventUserValue, certificate)}
                    style={{
                      border: 'none',
                      boxShadow: 'none',
                      backgroundColor: eventValue.styles.toolbarDefaultBg,
                    }}
                    key={'download' + certificate._id}
                    icon={<DownloadOutlined style={{ color: eventValue.styles.textMenu }} />}>
                    <Typography.Text style={{ color: eventValue.styles.textMenu }}>Descargar</Typography.Text>
                  </Button>
                </Space>
              }
              style={{ width: '100%', height: '100%', padding: isMobile ? '20px' : '48px 32px' }}
            />
          </div>
        </div>
      </Card>
    </Col>
  );
};
