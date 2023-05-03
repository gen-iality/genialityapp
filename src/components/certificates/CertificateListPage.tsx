import { useState, FunctionComponent } from 'react'
import { CertsApi, RolAttApi } from '@helpers/request'
import CMS from '../newComponent/CMS'
import { getColumnSearchProps } from '../speakers/getColumnSearch'
import dayjs from 'dayjs'

const CertificateListPage: FunctionComponent<any> = (props) => {
  const [columnsData, setColumnsData] = useState({})

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
      render(val: any, item: any) {
        return <div>{item.rol && item.rol.name ? item.rol.name : 'Sin rol'}</div>
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      ellipsis: true,
      width: 180,
      sorter: (a: any, b: any) => a.created_at.localeCompare(b.created_at),
      ...getColumnSearchProps('created_at', columnsData),
      render(val: any, item: any) {
        return <div>{dayjs(item.created_at).format('YYYY-DD-MM')}</div>
      },
    },
  ]

  return (
    <CMS
      API={CertsApi}
      eventId={props.event._id}
      title="Certificados"
      titleTooltip="Agregue o edite los Certificados que se muestran en la aplicación"
      addUrl={{
        pathname: `${props.matchUrl}/certificate`,
        state: { new: true },
      }}
      columns={columns}
      key="_id"
      editPath={`${props.matchUrl}/certificate`}
      pagination={false}
      actions
      search
      setColumnsData={setColumnsData}
    />
  )
}

export default CertificateListPage
