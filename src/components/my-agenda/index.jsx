import { Component, Fragment } from 'react';
import { Table, Input, Button, Space, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    hour: '10:24 AM',
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 42,
    hour: '11:15 AM',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 32,
    hour: '3:30 PM',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    hour: '6:15 PM',
  },
];

class MyAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
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
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '20%',
        ...this.getColumnSearchProps('age'),
      },
      {
        title: 'Time',
        dataIndex: 'hour',
        key: 'hour',
        ...this.getColumnSearchProps('hour'),
      },
    ];
    return (
      <Fragment>
        <Title>Agenda personal</Title>
        <Table columns={columns} dataSource={data} />
      </Fragment>
    );
  }
}

export default MyAgenda;
