import { useState, useEffect, useCallback, useRef, FunctionComponent } from 'react'
import { Modal, Form, Input, Button, Table, Space, Typography, Tooltip } from 'antd'
import { ModulesApi } from '@helpers/request'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { MenuOutlined } from '@ant-design/icons'

import Header from '@antdComponents/Header'

// DnD

import arrayMove from 'array-move'
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

// Styles for DnD
import './ModulePage.css'

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
))

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
)
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
)

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

    const maxOrder = modules
      .filter((module) => typeof module.order === 'number')
      .map((module) => module.order)
      .reduce((a, b) => Math.max(a, b), 0)

    const data = modules
      .map((module, index) => {
        let newIndex = maxOrder + index
        if (typeof module.order === 'number') {
          newIndex = module.order
        }
        return {
          order: newIndex,
          ...module,
        }
      })
      .sort((a, b) => a.order - b.order)
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

  useEffect(() => {
    const columns: ColumnsType = [
      {
        key: 'sort',
        dataIndex: 'order',
        width: 30,
        className: 'drag-visible',
        render: (item) => (
          <Tooltip title={`último order ${item + 1}`}>
            {' '}
            <DragHandle />{' '}
          </Tooltip>
        ),
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

  // Dnd too
  const DraggableBodyRow: FunctionComponent<any> = ({
    className,
    style,
    ...restProps
  }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.order === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  // DnD
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      console.log('wanna change', oldIndex, newIndex)
      const newData = arrayMove(dataSource.slice(), oldIndex, newIndex).filter(
        (el: any) => !!el,
      )
      console.log('Sorted items: ', newData)

      // Update all the order
      newData.forEach((data, index) => {
        ModulesApi.update(data._id, data.module_name, index)
      })

      setDataSource(newData)
    }
  }

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  return (
    <>
      <Space
        direction="horizontal"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Header
          title="Módulos"
          back
          description="Agregue o edite los modules disponibles en este curso"
        />
        <Button type="primary" onClick={openModal}>
          Agregar módulo
        </Button>
      </Space>

      <Table
        pagination={false}
        columns={columnsData}
        dataSource={dataSource}
        rowKey="order"
        // DnD
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
      <Modal
        open={isOpened}
        title={currentEditingItem === null ? 'Agregar nuevo modulo' : 'Editar módulo'}
        onCancel={cancelModel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFormFinish}>
          <Form.Item
            name="moduleName"
            label="Nombre del módulo"
            rules={[{ required: true, message: 'Es necesario el nombre de módulo' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModulePage
