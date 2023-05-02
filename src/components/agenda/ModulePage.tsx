import { useState, useEffect, useCallback, useRef } from 'react'
import { Modal, Form, Input, Button, Table, Space, Typography, Tooltip } from 'antd'
import { ModulesApi } from '@helpers/request'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { MenuOutlined } from '@ant-design/icons'

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './ModulePage.css'

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
}

const type = 'DraggableBodyRow'

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: DraggableBodyRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: any) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  )
}

function ModulePage(props: any) {
  const [columnsData, setColumnsData] = useState<ColumnsType<any>>([])
  const [dataSource, setDataSource] = useState<any[]>([])

  const [currentEditingItem, setCurrentEditingItem] = useState<any | null>(null)
  const [isOpened, setIsOpened] = useState(false)

  const [form] = Form.useForm()

  const openModal = () => {
    setIsOpened(true)
  }

  const closeModal = () => {
    setIsOpened(false)
  }

  const cancelModel = () => {
    form.resetFields()
    setCurrentEditingItem(null)
    closeModal()
  }

  const loadAllModules = async () => {
    const modules: any[] = await ModulesApi.byEvent(props.event._id)
    const data = modules.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    setDataSource(data)
  }

  const onFormFinish = (values: any) => {
    values.event_id = props.event._id
    console.log('finish', values)

    if (currentEditingItem === null) {
      ModulesApi.create(values.moduleName, props.event._id).finally(() => {
        closeModal()
        form.resetFields()
        loadAllModules()
      })
    } else {
      ModulesApi.update(currentEditingItem._id, values.moduleName).finally(() => {
        closeModal()
        setCurrentEditingItem(null)
        form.resetFields()
        loadAllModules()
      })
    }
  }

  const sortDataSource = (oldIndex: number, newIndex: number) => {
    const currentDataSource = [...dataSource.slice()] // redundant?
    if (oldIndex !== newIndex) {
      const item = currentDataSource.splice(oldIndex, 1)[0]
      currentDataSource.splice(newIndex, 0, item)
      console.log('Sorted items: ', currentDataSource)
      // setDataSource(currentDataSource);

      // Update the order
      // currentDataSource.forEach((module: any, index: number) => {
      //   ModulesApi.update(module._id, module.module_name, index).then()
      // })
      ModulesApi.update(
        dataSource[oldIndex]._id,
        dataSource[oldIndex].module_name,
        newIndex,
      ).then()
      ModulesApi.update(
        dataSource[newIndex]._id,
        dataSource[newIndex].module_name,
        oldIndex,
      ).then()
    }
    return currentDataSource
  }

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setDataSource(sortDataSource(dragIndex, hoverIndex))
    },
    [dataSource],
  )

  useEffect(() => {
    const columns: ColumnsType = [
      {
        key: 'sort',
        render: () => <MenuOutlined />,
      },
      {
        key: 'name',
        title: 'Module',
        render: (module: any) => module.module_name,
      },
      {
        key: 'options',
        title: 'Opciones',
        render: (module: any) => (
          <Space direction="horizontal">
            <Tooltip title="Editar módulo">
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => {
                  setCurrentEditingItem(module)
                  openModal()
                }}
              />
            </Tooltip>

            <Tooltip title="Eliminar módulo">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  ModulesApi.deleteOne(module._id).finally(loadAllModules)
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ]
    setColumnsData(columns)
    loadAllModules()
  }, [])

  useEffect(() => {
    if (currentEditingItem) {
      form.setFields([{ name: 'moduleName', value: currentEditingItem.module_name }])
      openModal()
    }
  }, [currentEditingItem])

  return (
    <>
      <Space
        direction="horizontal"
        style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Text>
          Agregue o edite los modules disponibles en este curso
        </Typography.Text>
        <Button type="primary" onClick={openModal}>
          Agregar módulo
        </Button>
      </Space>
      <DndProvider backend={HTML5Backend}>
        <Table
          pagination={false}
          columns={columnsData}
          dataSource={dataSource}
          rowKey="index"
          components={{
            body: {
              row: DraggableBodyRow,
            },
          }}
          onRow={(_, index) => {
            const attr = {
              index,
              moveRow,
            }
            return attr as React.HTMLAttributes<any>
          }}
        />
      </DndProvider>
      <Modal
        visible={isOpened}
        title={currentEditingItem === null ? 'Agregar nuevo modulo' : 'Editar módulo'}
        onCancel={cancelModel}
        onOk={() => form.submit()}>
        <Form form={form} onFinish={onFormFinish}>
          <Form.Item
            name="moduleName"
            label="Nombre del módulo"
            rules={[{ required: true, message: 'Es necesario el nombre de módulo' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModulePage
