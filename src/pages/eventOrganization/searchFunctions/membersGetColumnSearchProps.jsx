import { Button, Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

const handleSearch = (selectedKeys, confirm, dataIndex, columnsData, closeDropdown) => {
  if (typeof closeDropdown === 'undefined' || closeDropdown === undefined) {
    confirm()
  } else {
    confirm({ closeDropdown })
  }
  columnsData.setSearchText(selectedKeys[0])
  columnsData.setSearchedColumn(dataIndex)
  // Set a filter to this dataIndex
  columnsData.thisDataIndexWasFiltered &&
    columnsData.thisDataIndexWasFiltered(dataIndex, selectedKeys[0])
}

const handleReset = (clearFilters, columnsData, dataIndex) => {
  clearFilters()
  columnsData.setSearchText('')
  // Remove the filter for this dataIndex
  columnsData.thisDataIndexWasFiltered &&
    columnsData.thisDataIndexWasFiltered(dataIndex, undefined)
}

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
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex, columnsData)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}>
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters, columnsData, dataIndex)}
          size="small"
          style={{ width: 90 }}>
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() =>
            handleSearch(selectedKeys, confirm, dataIndex, columnsData, false)
          }>
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
  render: (text) =>
    typeof text === 'undefined' ? (
      'N/A'
    ) : typeof text === 'boolean' ? (
      text ? (
        'Aceptado'
      ) : (
        'No Aceptado'
      )
    ) : columnsData.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[columnsData.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
})
