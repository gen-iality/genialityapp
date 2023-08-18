import { Modal, Spin } from 'antd';
import { CertifiRow, Certificates, UserData } from '../types';
import { CertsApi, RolAttApi } from '@/helpers/request';
import { ArrayToStringCerti, replaceAllTagValues } from '../utils';
import Moment from 'moment';
import { imgBackground } from '../utils/constants';

export const generateCert = async (dataUser: UserData, cert: Certificates, eventValue: any) => {
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
