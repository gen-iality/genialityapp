import { ArrowLeftOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Tooltip, Typography, Row, Col, Button, Table } from 'antd'
import { FunctionComponent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import useRequestActivities from './hooks/useRequestActivities'
import useDefineColumns from './hooks/useDefineColumns'

// DnD

import arrayMove from 'array-move'
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

// Styles for DnD
import './styles.css'
import useOrderUpdater from './hooks/useOrderUpdater'

interface IActivityListPageProps {
  event: any
}

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
))

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
)
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
)

const ActivityListPage: FunctionComponent<IActivityListPageProps> = (props) => {
  const { event } = props
  const navigate = useNavigate()

  const [dataSource, setDataSource] = useState<any[]>([])

  const {
    activities,
    isLoading: isActivitiesLoading,
    deleteActivityById,
    refreshActivities,
  } = useRequestActivities(event._id)

  const { updateOrder } = useOrderUpdater()

  const columns = useDefineColumns(event._id, {
    editUrl: `activity`,
    removeMethod: (id) => {
      deleteActivityById(id, {
        useConfirmation: true,
        onDelete: () => {
          refreshActivities()
        },
      })
    },
    // extra dnd
    extraBefore: [
      {
        title: 'Sort',
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
    ],
  })

  useEffect(() => {
    const maxOrder = activities
      .filter((activity) => typeof activity.order === 'number')
      .map((activity) => activity.order)
      .reduce((a, b) => Math.max(a, b), 0)
    setDataSource(
      activities
        .map((activity, index) => {
          let newIndex = maxOrder + index
          if (typeof activity.order === 'number') {
            newIndex = activity.order
          }
          return {
            order: newIndex,
            ...activity,
          }
        })
        .sort((a, b) => a.order - b.order),
    )
  }, [activities])

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
        updateOrder(event._id, data._id, index /* data.order */)
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

  const DraggableBodyRow: FunctionComponent<any> = ({
    className,
    style,
    ...restProps
  }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.order === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    <main>
      <header>
        <Typography.Title level={4}>
          <Tooltip placement="bottomLeft" title="Atrás">
            <ArrowLeftOutlined
              id="goBack"
              onClick={() => navigate('..')}
              style={{ marginRight: '10px' }}
            />
          </Tooltip>
          <Tooltip
            placement="bottomLeft"
            title="Agregue o edite las Agendas que se muestran en la aplicación"
          >
            Lecciones
          </Tooltip>
        </Typography.Title>

        <Row wrap justify="end" gutter={[8, 8]}>
          <Col>
            <Link to="create-activity" state={{ new: true }}>
              <Button type="primary" icon={<PlusCircleOutlined />} size="middle">
                Agregar
              </Button>
            </Link>
          </Col>
        </Row>
      </header>

      <section>
        <Table
          loading={isActivitiesLoading}
          size="small"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 'auto' }}
          pagination={false}
          rowKey="order"
          // DnD
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </section>
    </main>
  )
}

export default ActivityListPage
