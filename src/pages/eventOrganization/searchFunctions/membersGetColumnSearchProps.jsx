import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const handleSearch = (selectedKeys, confirm, dataIndex, columnsData) => {
  confirm();
  columnsData.setSearchText(selectedKeys[0]);
  columnsData.setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, columnsData) => {
  clearFilters();
  columnsData.setSearchText('');
};

export const membersGetColumnSearchProps = (dataIndex, columnsData) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, columnsData)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type='primary'
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex, columnsData)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}>
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters, columnsData)} size='small' style={{ width: 90 }}>
          Reset
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            confirm({ closeDropdown: false });
            columnsData.setSearchText(selectedKeys[0]);
            columnsData.setSearchedColumn(dataIndex);
          }}>
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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
