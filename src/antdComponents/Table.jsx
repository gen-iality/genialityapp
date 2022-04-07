import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import arrayMove from 'array-move';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { Table as TableAnt, Row, Col, Tooltip, Button } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  DownloadOutlined,
  SettingOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';
// import ExportExcel from '../components/newComponent/ExportExcel';
import moment from 'moment';
import { Suspense } from 'react';
import { ExportExcel } from '../components/newComponent/ExportExcel';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Table = (props) => {
  let {
    header,
    list,
    key,
    loading,
    pagination,
    draggable,
    actions,
    editPath,
    remove,
    noRemove,
    search,
    setColumnsData,
    setList,
    downloadFile,
    exportData,
    fileName,
    editFn,
    extraFn,
    extraFnIcon,
    extraFnType,
    extraFnTitle,
    titleTable,
    extraPath,
    extraPathTitle,
    extraPathIcon,
    extraPathType,
    extraPathId,
    extraPathStateName,
    scroll,
    widthAction,
    extraPathUpdate,
    extraPathUpdateTitle,
    updateMails,
    takeOriginalHeader,
  } = props;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [components, setComponents] = useState('');
  let [headerState, setHeaderState] = useState(header);

  useEffect(() => {
    const options = {
      title: 'Opciones',
      dataIndex: 'options',
      fixed: 'right',
      width: widthAction ? widthAction : 110,
      render(val, item) {
        console.log(item);
        return (
          <Row wrap gutter={[8, 8]}>
            {extraFn && (
              <Col>
                <Tooltip placement='topLeft' title={extraFnTitle}>
                  <Button
                    key={`extraAction${item.index}`}
                    id={`extraAction${item.index}`}
                    onClick={() => extraFn(item)}
                    icon={extraFnIcon ? extraFnIcon : <SettingOutlined />}
                    type={extraFnType ? extraFnType : 'primary'}
                    size='small'
                  />
                </Tooltip>
              </Col>
            )}
            {extraPath && (
              <Col>
                <Tooltip placement='topLeft' title={extraPathTitle}>
                  <Link
                    key={`extraPathAction${item.index}`}
                    id={`extraPathAction${item.index}`}
                    to={
                      !extraPathStateName
                        ? { pathname: `${extraPath}/${item._id}`, state: { item: item } }
                        : { pathname: `${extraPath}`, state: { report: item._id } }
                    }>
                    <Button
                      icon={extraPathIcon ? extraPathIcon : <SettingOutlined />}
                      type={extraPathType ? extraPathType : 'primary'}
                      size='small'
                    />
                  </Link>
                </Tooltip>
              </Col>
            )}
            {/* ACTUALIZAR STATUS MAILS */}
            {extraPathUpdate && (
              <Col>
                <Tooltip placement='topLeft' title={extraPathUpdateTitle}>
                  <Button
                    style={{ backgroundColor: '#00C851', borderColor: '#00C851' }}
                    onClick={() => updateMails(item._id)}
                    icon={extraPathUpdate}
                    type={'primary'}
                    size='small'
                  />
                </Tooltip>
              </Col>
            )}
            {/*Esto de momento es por la encuesta el ranking, esto queda pendiente para modificar*/}
            {extraPathStateName && (
              <Col>
                <Tooltip placement='topLeft' title={extraPathTitle ? 'Ranking' : ''}>
                  <Link
                    key={`extraPathAction${item.index}`}
                    id={`extraPathAction${item.index}`}
                    to={{ pathname: `${extraPathStateName}/${item._id}`, state: { report: item._id } }}>
                    <Button icon={<CrownOutlined />} type={extraPathType ? extraPathType : 'primary'} size='small' />
                  </Link>
                </Tooltip>
              </Col>
            )}
            {downloadFile && item.type !== 'folder' && (
              <Col>
                <Tooltip placement='topLeft' title='Descargar'>
                  <a href={item.file} target='_blank'>
                    <Button
                      key={`downloadAction${item.index}`}
                      id={`downloadAction${item.index}`}
                      icon={<DownloadOutlined />}
                      size='small'
                      type='primary'
                    />
                  </a>
                </Tooltip>
              </Col>
            )}
            {editPath && (
              <Col>
                <Tooltip placement='topLeft' title='Editar'>
                  <Link
                    key={`editAction${item.index}`}
                    id={`editAction${item.index}`}
                    to={{ pathname: editPath, state: { edit: item._id } }}>
                    <Button icon={<EditOutlined />} type='primary' size='small' />
                  </Link>
                </Tooltip>
              </Col>
            )}
            {editFn && (
              <Col>
                <Tooltip placement='topLeft' title='Editar'>
                  <Button
                    key={`editAction${item.index}`}
                    id={`editAction${item.index}`}
                    onClick={() => editFn(item)}
                    icon={<EditOutlined />}
                    type='primary'
                    size='small'
                  />
                </Tooltip>
              </Col>
            )}
            {remove && !noRemove && (
              <Col>
                <Tooltip placement='topLeft' title='Eliminar'>
                  <Button
                    key={`removeAction${item.index}`}
                    id={`removeAction${item.index}`}
                    onClick={() => remove(item.chatId ? item.chatId : item._id, item.name)}
                    icon={<DeleteOutlined />}
                    type='danger'
                    size='small'
                  />
                </Tooltip>
              </Col>
            )}
          </Row>
        );
      },
    };
    if (actions) {
      let auxHeader = header;
      if (!auxHeader.includes(options)) {
        auxHeader.push(options);
        setHeaderState(auxHeader);
      } else {
        setHeaderState(auxHeader);
      }
    }
  }, [header]);

  if (list && list.length) {
    list.map((list, index) => {
      if (!list.index) {
        list.index = index;
      }
    });
  }

  useEffect(() => {
    if (draggable) {
      draggableFn();
    }

    if (search) {
      searchFn();
    }
  }, []);

  const draggableFn = () => {
    headerState.unshift(
      {
        title: '',
        dataIndex: 'move',
        width: '50px',
        render(val, item) {
          const DragHandle = sortableHandle(() => (
            <DragOutlined id={`drag${item.index}`} style={{ cursor: 'grab', color: '#999', visibility: 'visible' }} />
          ));
          return <DragHandle />;
        },
      },
      {
        title: 'Orden',
        dataIndex: 'index',
        render(val, item) {
          return <div>{val + 1}</div>;
        },
      }
    );

    const componentFunctions = {
      body: {
        wrapper: DraggableContainer,
        row: DraggableBodyRow,
      },
    };

    setComponents(draggable ? componentFunctions : '');
  };

  const searchFn = () => {
    setColumnsData({
      data: props,
      searchedColumn: searchedColumn,
      handleSearch,
      handleReset,
      searchText: searchText,
      list: list,
    });
  };

  //FN para búsqueda en la tabla 2/3
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  //FN para búsqueda en la tabla 3/3
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  //FN para el draggable 1/3
  function onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      let newData = arrayMove([].concat(list), oldIndex, newIndex).filter((el) => !!el);
      if (newData) {
        newData = newData.map((data, key) => {
          return { ...data, index: key };
        });
      }
      list = newData;
    }
  }

  //FN para el draggable 2/3
  const DraggableContainer = (props) => (
    <SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
  );

  //FN para el draggable 3/3
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = list.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Suspense fallback={<h1>Cargando ...</h1>}>
      <TableAnt
        columns={takeOriginalHeader ? header : headerState}
        dataSource={list}
        size='small'
        rowKey={(record) => record.index}
        loading={loading}
        pagination={pagination}
        components={components}
        title={() => (
          <Row wrap justify='end' gutter={[8, 8]}>
            {exportData && (
              <Col>
                <ExportExcel list={list} fileName={`${fileName}${moment(new Date()).format('YYYY-DD-MM')}`} />
              </Col>
            )}
            {titleTable && <Col>{titleTable}</Col>}
          </Row>
        )}
        scroll={scroll}
      />
    </Suspense>
  );
};

export default Table;
