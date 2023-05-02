import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, Input, Tooltip, Alert } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

class SearchComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMessage: false,
      value: '',
      auxArr: [],
      filtered: [],
      message: '',
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.data !== prevProps.data) {
      //
    }
  }

  filterByAllColums(value) {
    let arrAux
    if (this.props.kind === 'user') {
      arrAux = this.props.data.filter((item) => {
        if (!item.properties) {
          return false
        }

        let found = false
        //buscamos coindicencia por cada una de las propiedades
        for (const key in item.properties) {
          let propertyValue = item.properties[key]
          if (!propertyValue) continue
          propertyValue = String(propertyValue)
          if (item.properties['names'] == 'Brayan Triana')
            console.log('busqueda', item.properties)
          found = found || propertyValue.search(new RegExp(value, 'i')) >= 0
        }
        return found
      })
    } else if (this.props.kind === 'invitation') {
      arrAux = this.props.data.filter(
        (item) =>
          item.email.search(new RegExp(value, 'i')) >= 0 ||
          item.state.search(new RegExp(value, 'i')) >= 0,
      )
    } else if (this.props.kind === 'helpers') {
      arrAux = this.props.data.filter(
        (item) =>
          item.user.email.search(new RegExp(value, 'i')) >= 0 ||
          item.user.displayName.search(new RegExp(value, 'i')) >= 0,
      )
    } else if (this.props.kind === 'agenda') {
      arrAux = this.props.data.filter(
        (item) =>
          item.name.search(new RegExp(value, 'i')) >= 0 ||
          item.space.name.search(new RegExp(value, 'i')) >= 0 ||
          item.hosts.find(({ name }) => name.search(new RegExp(value, 'i')) >= 0),
      )
    } else if (this.props.kind === 'speakers')
      arrAux = this.props.data.filter(
        ({ name }) => name.search(new RegExp(value, 'i')) >= 0,
      )
    return arrAux
  }

  handleFilter = (input) => {
    const value = input.target.value
    this.setState({ value })

    if (value.length >= 3) {
      const filtered = this.filterByAllColums(value)
      if (filtered.length > 0)
        this.setState({ showMessage: false, message: '', filtered })
      else this.setState({ showMessage: true, message: 'not' })
      this.props.searchResult(filtered)
    }

    if (value.length <= 2) {
      if (value.length === 0 || value == '') {
        this.setState({ showMessage: false, message: '' })

        this.props.searchResult(this.props.data.slice(0, this.props.data.length))
      } else {
        this.setState(
          {
            showMessage: true,
            message: 'short',
          },
          () => this.props.searchResult(false),
        )
      }
    }
  }

  render() {
    return (
      <div className={this.props.classes} style={{ width: '100%' }}>
        <Form.Item rules={[{ required: true }]} onSubmit={this.searchCert}>
          <Input
            id="inputSearch"
            type="text"
            size={this.props.size ? this.props.size : 'large'}
            // onChange={this.handleFilter}
            onInput={this.handleFilter}
            placeholder={`Buscar ${this.props.placeholder || ''}`}
            value={this.state.value}
            suffix={`Total: ${
              this.props.users && this.props.users.length
                ? this.props.users.length
                : this.props.data && this.props.data.length
                ? this.props.data.length
                : '-'
            }`}
            prefix={
              <Tooltip>
                <SearchOutlined />
              </Tooltip>
            }
          />
          {this.state.showMessage && (
            <Alert
              message={
                <FormattedMessage
                  id={`global.search_${this.state.message}`}
                  defaultMessage="Help"
                />
              }
              type="warning"
              showIcon
            />
          )}
        </Form.Item>
      </div>
    )
  }
}

export default SearchComponent
