import { useState } from 'react'
import { DocumentsApi } from '@helpers/request'
import CMS from '../newComponent/CMS'
import { getColumnSearchProps } from '../speakers/getColumnSearch'

const Documents = (props) => {
  const [columnsData, setColumnsData] = useState({})
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'title',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title', columnsData),
    },
  ]

  return (
    <CMS
      API={DocumentsApi}
      eventId={props.event._id}
      title="Documentos"
      titleTooltip="Agregue o edite los Documentos que se muestran en la aplicación"
      addUrl={{
        pathname: `${props.parentUrl}/document`,
        state: { new: true },
      }}
      columns={columns}
      key="_id"
      editPath={`${props.parentUrl}/document`}
      pagination={false}
      actions
      downloadFile
      search
      setColumnsData={setColumnsData}
      widthAction={150}
    />
  )
}

export default Documents
