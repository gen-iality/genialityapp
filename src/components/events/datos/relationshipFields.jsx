import React, { Component } from 'react';
import { Form, Divider, Button, Table, Input, Space } from 'antd';
import { EventsApi } from '../../../helpers/request';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Modal from './modalRelation';

class RelationshipFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      state: 'disabled',
      data: [],
      showModal: false,
    };
    //this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const { fields } = this.props;
    this.setState({ fields });
    this.getData();
  }
  async getData() {
    const { eventId } = this.props;
    const data = [];
    const info = await EventsApi.getOne(eventId);

    if (info.fields_conditions !== undefined) {
      data.push({
        key: info.fields_conditions._id,
        field: info.fields_conditions.field,
        fieldToValidate: info.fields_conditions.fieldToValidate,
        state: info.fields_conditions.state,
        value: info.fields_conditions.value,
      });
      this.setState({ data });
    }
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

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

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  delete() {}

  showModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    const { fields } = this.props;
    const { data } = this.state;
    const columns = [
      {
        title: 'Campo',
        dataIndex: 'field',
        key: 'field',
        width: '30%',
        ...this.getColumnSearchProps('field'),
      },
      {
        title: 'Estado',
        dataIndex: 'state',
        key: 'state',
        width: '20%',
        ...this.getColumnSearchProps('state'),
      },
      {
        title: 'Campo relacionado',
        dataIndex: 'fieldToValidate',
        key: 'fieldToValidate',
        ...this.getColumnSearchProps('fieldToValidate'),
      },
      {
        title: 'Valor de campo relacionado',
        dataIndex: 'value',
        key: 'value',
        ...this.getColumnSearchProps('value'),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <>
            <Button type='primary' onClick={this.showModal}>
              Editar
            </Button>
          </>
        ),
      },
      {
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
      },
    ];
    return (
      <Form layout='inline'>
        <>
          <div>
            <label>El campo: </label>
            <div className='select'>
              <select defaultValue='' name='field' onChange={(e) => this.handleChange(e)}>
                <option value=''>Seleccione...</option>
                {fields.map((field, key) => {
                  return (
                    <option key={key} value={field.name}>
                      {field.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <Divider type='vertical' />
          <div>
            <label>Estará: </label>
            <div className='select'>
              <select defaultValue='disabled' name='state' onChange={(e) => this.handleChange(e)}>
                <option value='enabled'>Habilitado</option>
                <option value='disabled'>Inhabilitado</option>
              </select>
            </div>
          </div>
          <Divider type='vertical' />
          <label>Cuando el campo: </label>
          {fields.map((item, key) => {
            return (
              <div key={key}>
                {item.type === 'list' && (
                  <>
                    <div className='select'>
                      <select defaultValue='' name='fieldToValidate' onChange={(e) => this.handleChange(e)}>
                        <option value=''>Seleccione...</option>
                        <option key={key} value={item.name}>
                          {item.label}
                        </option>
                      </select>
                    </div>
                    <Divider type='vertical' />
                    <label>Tenga el valor de: </label>
                    <div className='select'>
                      <select defaultValue='' name='value' onChange={(e) => this.handleChange(e)}>
                        <option value=''>Seleccione...</option>
                        {item.options.map((item, key) => (
                          <option key={key} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <Button style={{ marginTop: '3%' }}>Guardar</Button>

          <Table style={{ marginTop: '8%' }} columns={columns} dataSource={data} />
          <Modal fields={fields} show={this.state.showModal} />
        </>
      </Form>
    );
  }
}

export default RelationshipFields;
