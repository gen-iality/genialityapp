import React from 'react';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

//FN para búsqueda en la tabla 1/3
export const getColumnSearchProps = (dataIndex, columnsData) => ({
   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
         <Input
            id={`search ${dataIndex}`}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => columnsData.handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
         />
         <Space>
            <Button
               type='primary'
               onClick={() => columnsData.handleSearch(selectedKeys, confirm, dataIndex)}
               icon={<SearchOutlined />}
               size='small'
               style={{ width: 90 }}>
               Buscar
            </Button>
            <Button onClick={() => columnsData.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
               Borrar
            </Button>
         </Space>
      </div>
   ),
   filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} id={`searchIcon${dataIndex}`} />,
   onFilter: (value, record) =>
      record[dataIndex]
         ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
         : '',
   render: (text) =>
      columnsData.searchedColumn === dataIndex ? (
         <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[columnsData.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
         />
      ) : (
         text
      ),
});
