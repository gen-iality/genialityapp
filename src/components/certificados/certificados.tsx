import { FC, useState } from 'react';
import { CertsApi } from '../../helpers/request';
import CMS from '../newComponent/CMS';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import moment from 'moment';
import { Event } from './types';
import { EyeOutlined } from '@ant-design/icons';
import { UsersByCertificates } from './components/UsersByCertificates';
import { Certificates } from '../agenda/types';

const Certificados: FC<{
  event: Event;
  matchUrl: string;
}> = (props) => {
  let [columnsData, setColumnsData] = useState({});
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [certificateSelected, setCertificateSelected] = useState<Certificates>();
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      ellipsis: true,
      sorter: (a: any, b: any) => a.rol.name.localeCompare(b.rol.name),
      ...getColumnSearchProps('rol', columnsData),
      render(_val: any, item: any) {
        return <div>{item.rol?.name ? item.rol.name : 'Sin Rol'}</div>;
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      ellipsis: true,
      width: 180,
      sorter: (a: any, b: any) => a.created_at.localeCompare(b.created_at),
      ...getColumnSearchProps('created_at', columnsData),
      render(_val: any, item: any) {
        return <div>{moment(item.created_at).format('YYYY-DD-MM')}</div>;
      },
    },
  ];

  const openDrawer = (certificate: Certificates) => {
    setIsOpenDrawer(true);
    setCertificateSelected(certificate);
  };
  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  return (
    <>
      <CMS
        API={CertsApi}
        eventId={props.event._id}
        title={'Certificados'}
        titleTooltip={'Agregue o edite los Certificados que se muestran en la aplicación'}
        addUrl={{
          pathname: `${props.matchUrl}/certificado`,
          state: { new: true },
        }}
        columns={columns}
        key='_id'
        editPath={`${props.matchUrl}/certificado`}
        pagination={false}
        actions
        search
        extraFn={openDrawer}
        extraFnTitle={'Ver usuarios'}
        extraFnIcon={<EyeOutlined />}
        setColumnsData={setColumnsData}
      />
      {isOpenDrawer && certificateSelected && (
        <UsersByCertificates
          onCloseDrawer={onCloseDrawer}
          visible={isOpenDrawer}
          certificate={certificateSelected}
          eventValue={props.event}
        />
      )}
    </>
  );
};

export default Certificados;
