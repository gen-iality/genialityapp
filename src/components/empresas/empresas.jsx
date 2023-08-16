import { Button, Empty, Row, Table, Tag, Col, Tooltip, Modal } from 'antd'
import {
  DragOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import arrayMove from 'array-move'

import Loading from '../loaders/loading'
import useGetEventCompanies from './customHooks/useGetEventCompanies'
import { useState } from 'react'
import { useEffect } from 'react'
import { firestore } from '@helpers/firebase'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { handleRequestError } from '@helpers/utils'

const { confirm } = Modal

const tableLocale = {
  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay datos" />,
}

function Empresas({ event }) {
  const [companies, loadingCompanies] = useGetEventCompanies(event._id)
  const [companyList, setCompanyList] = useState([])
  const { eventIsActive } = useHelper()

  useEffect(() => {
    if (companies.length > 0) {
      let newCompanies = companies.map((company, ind) => {
        return { ...company, index: company.index ? company.index : ind + 1 }
      })

      newCompanies = newCompanies.sort(function (a, b) {
        return a.index - b.index
      })
      setCompanyList(newCompanies)
    }
  }, [companies])

  const SortableItem = sortableElement((props) => <tr {...props} />)
  const SortableContainer = sortableContainer((props) => <tbody {...props} />)
  const DragHandle = sortableHandle(() => (
    <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
  ))

  const orderCompany = async (updateList) => {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se guarda el orden...',
    )
    const companies = updateList ? updateList : companyList
    try {
      for (let i = 0; i < companies.length; i++) {
        companies[i].index = i + 1
        const { id, ...company } = companies[i]
        await firestore
          .collection('event_companies')
          .doc(event._id)
          .collection('companies')
          .doc(companies[i].id)
          .set(
            {
              ...company,
            },
            { merge: true },
          )
      }
      StateMessage.destroy('loading')
      StateMessage.show(null, 'success', 'Orden guardado correctamente!')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'Error', 'Ha ocurrido un problema al ordenar!')
    }
  }

  function deleteCompany(id) {
    StateMessage.show(
      'loading',
      'loading',
      'Por favor espere mientras se borra la información...',
    )
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            firestore
              .collection('event_companies')
              .doc(event._id)
              .collection('companies')
              .doc(id)
              .delete()
              .then((resp) => {
                const updateList = companyList.filter((company) => company.id !== id)
                setCompanyList(updateList)
                orderCompany(updateList).then((r) => {})
              })
            StateMessage.destroy('loading')
            StateMessage.show(null, 'success', 'Se eliminó la información correctamente!')
          } catch (e) {
            StateMessage.destroy('loading')
            StateMessage.show(null, 'error', handleRequestError(e).message)
          }
        }
        onHandlerRemove()
      },
    })
  }

  const companyColumns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render(companyName, record) {
        return !eventIsActive &&
          window.location.toString().includes('eventadmin') ? null : (
          <DragHandle />
        )
      },
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render(companyName, record) {
        return (
          <Link to={`editar/${record.id}`} title="Editar">
            {companyName}
          </Link>
        )
      },
    },
    {
      title: 'Tipo de stand',
      dataIndex: 'stand_type',
      ellipsis: true,
      sorter: (a, b) => a.stand_type.localeCompare(b.stand_type),
    },
    {
      title: 'Visible',
      dataIndex: 'visible',
      width: '100px',
      ellipsis: true,
      render(visible) {
        return visible ? <Tag color="green">Visible</Tag> : <Tag color="red">Oculto</Tag>
      },
    },
    {
      title: 'Opciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 110,
      render(value, record) {
        return (
          <Row gutter={[8, 8]}>
            <Col>
              <Tooltip placement="topLeft" title="Editar">
                <Link
                  key={`editAction${value.index}`}
                  id={`editAction${value.index}`}
                  to={`crear`}
                  state={{ edit: value }}
                >
                  <Button icon={<EditOutlined />} type="primary" size="small" />
                </Link>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement="topLeft" title="Eliminar">
                <Button
                  key={`removeAction${record.index}`}
                  id={`removeAction${record.index}`}
                  onClick={() => deleteCompany(value)}
                  icon={<DeleteOutlined />}
                  type="danger"
                  size="small"
                  disabled={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                  }
                />
              </Tooltip>
            </Col>
          </Row>
        )
      },
    },
  ]

  if (loadingCompanies) {
    return <Loading />
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(companyList), oldIndex, newIndex).filter(
        (el) => !!el,
      )
      for (let i = 0; i < newData.length; i++) {
        newData[i].index = i
      }
      setCompanyList(newData)
    }
  }

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = companyList.findIndex((x) => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    <div>
      <Header
        title="Empresas"
        back
        titleTooltip="Agregue o edite las Empresas que se muestran en la aplicación"
        addUrl="crear"
        addUrlState={{ new: true }}
        extra={
          <Row wrap gutter={[8, 8]}>
            <Col>
              <Button
                onClick={() => orderCompany()}
                type="primary"
                icon={<SaveOutlined />}
                disabled={
                  !eventIsActive && window.location.toString().includes('eventadmin')
                }
              >
                Guardar orden
              </Button>
            </Col>
            <Col>
              <Link to={`configuration`}>
                <Button type="primary" icon={<SettingOutlined />} id="configuration">
                  Configuración
                </Button>
              </Link>
            </Col>
          </Row>
        }
      />

      <Table
        locale={tableLocale}
        dataSource={companyList}
        columns={companyColumns}
        pagination={false}
        rowKey="index"
        size="small"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </div>
  )
}

export default Empresas
