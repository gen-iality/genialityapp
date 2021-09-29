import { useState } from 'react';
import { Link } from 'react-router-dom';
import arrayMove from 'array-move';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { Table as TableAnt, Row, Col, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Table = ( props ) => {
  const { header, list, key, loading, pagination, draggable, components, actions, editPath, remove } = props;
  
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
  /* const componentFunctions = {
    body: {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
    },
  };
  const components = draggable ? componentFunctions : '';
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  console.log(m()); */

  //FN para búsqueda en la tabla 2/3
  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  //FN para búsqueda en la tabla 3/3
  function handleReset(clearFilters) {
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

  /* //FN para el draggable 2/3
  const DraggableContainer = (props) => (
    <SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
  );

  //FN para el draggable 3/3
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = sortAndIndexSpeakers()?.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  }; */
  
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