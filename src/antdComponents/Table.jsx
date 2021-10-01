import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import arrayMove from 'array-move';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { Table as TableAnt, Row, Col, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Table = ( props ) => {
  const { header, list, key, loading, pagination, draggable, actions, editPath, remove, search, setColumnsData
  } = props;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [components, setComponents] = useState('');
  
  const options = {
    title: 'Opciones',
    dataIndex: 'options',
    render(val, item) {      
      return (
        <Row wrap gutter={[8, 8]}>
          <Col >
            {
              editPath && (
                <Tooltip placement='topLeft' title='Editar' >
                  <Link 
                    key='edit'
                    to={{ pathname: editPath, state: { edit: item._id } }}
                  >
                    <Button icon={<EditOutlined />} type='primary' size="small" />
                  </Link>
                </Tooltip>
              )
            }
          </Col>
          <Col >
            {
              remove && (
                <Tooltip placement='topLeft' title='Eliminar' >
                  <Button
                    key='delete'
                    onClick={() => remove(item._id)}
                    icon={<DeleteOutlined />}
                    type='danger'
                    size="small"
                  />
                </Tooltip>
              )
            }
          </Col>    
        </Row>
      );
    },
  }

  if(actions) {
    header.push(options);
  }

  useEffect(() => {
    if(search) {
      setColumnsData({
        data: props,
        searchedColumn: searchedColumn,
        handleSearch,
        handleReset,
        searchText: searchText,
      });
    }

    if(draggable) {
      header.unshift({
        title: '',
        dataIndex: 'move',
        width: '50px',
        render(val, item) {
           const DragHandle = sortableHandle(() => <DragOutlined id={`drag${item.index}`} style={{ cursor: 'grab', color: '#999', 'visibility': 'visible' }} />);
           return <DragHandle />;
        }
     },
     {
        title: 'Orden',
        dataIndex: 'index',
        render(val, item) {
           return <div>{val + 1}</div>;
        },
     });

      const componentFunctions = {
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      };
      setComponents(draggable ? componentFunctions : '');
    }
  }, [])

  //FN para búsqueda en la tabla 2/3
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  //FN para búsqueda en la tabla 3/3
  const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
  }

  //FN para el draggable 1/3
  function onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
       let newData = arrayMove([].concat(list), oldIndex, newIndex).filter((el) => !!el);
       if (newData) {
          newData = newData.map((speaker, key) => {
             return { ...speaker, index: key };
          });
       }
       //setear la lista
       //this.setState({list: newData });
       //updateOrDeleteSpeakers.mutateAsync({ newData, state: 'update' });
    }
  }

  //FN para el draggable 2/3
  const DraggableContainer = (props) => (
    <SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
  );

  //FN para el draggable 3/3
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = sortAndIndexSpeakers()?.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <TableAnt 
      columns={header}
      dataSource={list}
      hasData={list.length}
      rowKey={key}
      loading={loading}
      pagination={pagination}
      components={components}
    />
  )
}

export default Table;