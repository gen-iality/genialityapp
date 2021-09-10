import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      value: '',
      auxArr: [],
      filtered: [],
      message: ''
    };
  }

  // componentDidMount = () => {
  //   this.setState({
  //     data: this.props.data,
  //     kind: this.props.kind })
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { filtered } = this.state;
  //   //Fix
  //   if (nextProps.data !== this.props.data) {
  //     this.setState({ auxArr: nextProps.data });
  //     if (nextProps.clear && this.state.value.length === 0) {
  //       this.setState({ value: "" });
  //       if (filtered.length > 0) this.props.searchResult(filtered);
  //     }
  //   }
  //   if (nextProps.clear !== this.props.clear) {
  //     if (this.state.value.length >= 3) {
  //       // Validate if state is empty
  //       if (this.state.value) {
  //         // Run function filter by all columns
  //         let filtered = this.filterByAllColums(this.state.value);
  //         this.setState({ filtered });
  //         // Call function search result and set filtered variable
  //         if (filtered.length > 0) this.props.searchResult(filtered);
  //       }
  //     } else this.setState({ value: "" });
  //   }
  // }

  componentDidUpdate = (prevProps) => {
    if (this.props.data !== prevProps.data) {
      //
    }
  };

  filterByAllColums(value) {
    let arrAux;
    if (this.props.event === '5d24e15c1c9d4400004b4e0a') {
      arrAux = this.props.data.filter((item) => {
        if (item.properties && item.properties.dni) {
          return item.properties.dni.search(new RegExp(value, 'i')) >= 0;
        }
      });
    } else {
      if (this.props.kind === 'user') {
       
        arrAux = this.props.data.filter((item) => {
          
          if (!item.properties) {
            return false;
          }
          
          let found = false;
          //buscamos coindicencia por cada una de las propiedades
          for (let key in item.properties) {
            let propertyValue = item.properties[key];
            if (!propertyValue) continue;
            propertyValue = String(propertyValue);
            if(item.properties['names']=='Brayan Triana')console.log('busqueda',item.properties)
            found = found || propertyValue.search(new RegExp(value, 'i')) >= 0;
          }
          return found;
        });
      } else if (this.props.kind === 'invitation') {
        arrAux = this.props.data.filter(
          (item) => item.email.search(new RegExp(value, 'i')) >= 0 || item.state.search(new RegExp(value, 'i')) >= 0
        );
      } else if (this.props.kind === 'helpers') {
        arrAux = this.props.data.filter(
          (item) =>
            item.user.email.search(new RegExp(value, 'i')) >= 0 ||
            item.user.displayName.search(new RegExp(value, 'i')) >= 0
        );
      } else if (this.props.kind === 'agenda') {
        arrAux = this.props.data.filter(
          (item) =>
            item.name.search(new RegExp(value, 'i')) >= 0 ||
            item.space.name.search(new RegExp(value, 'i')) >= 0 ||
            item.hosts.find(({ name }) => name.search(new RegExp(value, 'i')) >= 0)
        );
      } else if (this.props.kind === 'speakers')
        arrAux = this.props.data.filter(({ name }) => name.search(new RegExp(value, 'i')) >= 0);
    }
    return arrAux;
  }

  handleFilter = (input) => {
    let value = input.target.value;
    this.setState({ value });
    

    // if(value === '*'){
    //   let filtered = this.filterByAllColums('');
    //   if (filtered.length > 0) this.setState({ showMessage: false, message: "", filtered });
    //   else this.setState({ showMessage: true, message: "not" });
    //   this.props.searchResult(filtered);
    // }
    if (value.length >= 3) {
      let filtered = this.filterByAllColums(value);
      if (filtered.length > 0) this.setState({ showMessage: false, message: '', filtered });
      else this.setState({ showMessage: true, message: 'not' });
      this.props.searchResult(filtered);
    }

    if (value.length <= 2) {
      console.log("VALUE ACA==>",value.length)
      if (value.length === 0 || value=='') {
        this.setState({ showMessage: false, message: '' });
       
        this.props.searchResult(this.props.data.slice(0, this.props.data.length));
      } else {
        this.setState(
          {
            showMessage: true,
            message: 'short'
          },
          () => this.props.searchResult(false)
        );
      }
    }
  };

  render() {
    return (
      <div className={this.props.classes} style={{ width: '100%' }}>
        <Form.Item rules={[{ required: true }]} onSubmit={this.searchCert}>
          <Input
            id='inputSearch'
            type='text'
            size='large'
           // onChange={this.handleFilter}
            onInput={this.handleFilter}
            placeholder={`Buscar ${this.props.placeholder || ''}`}
            value={this.state.value}
            suffix={
              <Tooltip>
                <SearchOutlined />
              </Tooltip>
            }
          />
         Total: {(this.props.users && this.props.users.length)?this.props.users.length:(this.props.data && this.props.data.length)?this.props.data.length:"-"}
        {this.state.showMessage && (
          <p className='help is-danger'>
            <FormattedMessage id={`global.search_${this.state.message}`} defaultMessage='Help' />
          </p>
        )}
        </Form.Item>
      </div>
    );
  }
}

export default SearchComponent;
