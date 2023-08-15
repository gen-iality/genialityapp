import { Avatar, Button, Card, Col, Image, List, Modal, Result, Space, Spin, Typography } from 'antd';
import { CertsApi, RolAttApi } from '@/helpers/request';
import Moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import { CertifiRow, Certificates, UserData } from '@/components/agenda/types';
import { ArrayToStringCerti, replaceAllTagValues } from '@/components/certificados/utils';
import { imgBackground } from '@/components/agenda/utils/constants';
import CertificateOutlineIcon from '@2fd/ant-design-icons/lib/CertificateOutline';

interface Props {
  certificate: Certificates;
  isMobile: boolean;
  eventValue: any;
  eventUserValue: any;
}
export const CertificateItemList = ({ certificate, isMobile, eventValue, eventUserValue }: Props) => {
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
  //toDo: corregir tema de mobile
  return (
    <List.Item 
      key={certificate.name} 
      extra={
        <Button
          size={isMobile ? 'small' : 'large'}
          onClick={() => generateCert(eventUserValue, certificate)}
          style={{
            border: 'none',
            boxShadow: 'none',
            backgroundColor: eventValue.styles.toolbarDefaultBg,
          }}
          key={'download' + certificate._id}
          icon={<DownloadOutlined style={{ color: eventValue.styles.textMenu/* , fontSize: '60px'  */}} />}>
          {!isMobile && <Typography.Text style={{ color: eventValue.styles.textMenu }}>Descargar</Typography.Text>}
        </Button>
      }
    >
      <List.Item.Meta
        avatar={<Avatar shape='square' style={{ fontSize: '70px', width: 60, height: 60 }}><CertificateOutlineIcon /></Avatar>}
        title={certificate.name}
      />
    </List.Item>
  );
};
