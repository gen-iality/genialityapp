import { Fragment } from 'react'
import dayjs from 'dayjs'
import { RolAttApi } from '@helpers/request'

import CMS from '../../newComponent/CMS'

const TipoAsistentes = (props) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      width: 160,
      render(val, item) {
        return <div>{dayjs(item.created_at).format('DD/MM/YYYY')}</div>
      },
    },
  ]

  return (
    <Fragment>
      <CMS
        API={RolAttApi}
        eventId={props.event._id}
        title="Organizadores"
        titleTooltip="Administre los organizadores que se muestran en la aplicación"
        addUrl={{
          pathname: `${props.matchUrl}/tipoAsistente`,
          state: { new: true },
        }}
        columns={columns}
        editPath={`${props.matchUrl}/tipoAsistente`}
        pagination={false}
        actions
      />
    </Fragment>
  )
}

export default TipoAsistentes
