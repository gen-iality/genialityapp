import { useState, useEffect } from 'react'
import { CategoriesAgendaApi, TypesAgendaApi } from '@helpers/request'
import { Tag } from 'antd'
import CMS from '../newComponent/CMS'
import { useMatch } from 'react-router'

const AgendaTypeCat = (props) => {
  const columnsOriginal = [
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
  ]
  const match = useMatch()

  const [columns, setColumns] = useState([])
  const eventID = props.event._id
  const subject = match.url.split('/').slice(-1)[0]
  const apiURL = subject === 'categorias' ? CategoriesAgendaApi : TypesAgendaApi

  useEffect(() => {
    if (subject === 'categorias') {
      /*Validación que me permite anexar en las columnas el campo de color en caso de que 'subjet' sea 'categoria'*/
      columnsOriginal.splice(1, 0, {
        title: 'Color',
        dataIndex: 'color',
        render(val, item) {
          return (
            <Tag color={val} style={{ width: '70px' }}>
              {val}
            </Tag>
          )
        },
      })
    }
    setColumns(columnsOriginal)
  }, [])

  return (
    <CMS
      API={apiURL}
      eventId={eventID}
      title={`${subject === 'categorias' ? 'Categorías' : 'Tipos'} de Lección`}
      //back
      titleTooltip="Agregue o edite las Preguntas frecuentes que se muestran en la aplicación"
      addUrl={{
        pathname: `add${subject}`,
        state: { new: true },
      }}
      columns={columns}
      key="_id"
      editPath={`/edit${subject}`}
      pagination={false}
      actions
    />
  )
}

export default AgendaTypeCat
