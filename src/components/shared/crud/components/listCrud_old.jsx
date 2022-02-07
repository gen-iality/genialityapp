import React, { Component } from 'react';
import '../crud.css';
import Pagination from '../../pagination';

class ListCrud extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalFields: [],
      pageOfItems: this.props.data
    };
  }
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  componentDidMount() {
    const fields = this.props.config.fieldsModal;
    this.setState({ modalFields: fields });
    let newInfo = {};
    /*
     * This is to create keys inside newInfo object and avoid uncontrolled input error
     */
    fields.map((info) => (newInfo[info.name] = ''));
    this.setState({ newInfo, edit: false });
  }

  async componentWillReceiveProps(props) {
    this.setState({ go: 'hi' });
    // alert('props ',this.props.refresh )
    // this.state.pageOfItems = await this.props.refresh
    //
  }

  componentWillUnmount() {
    this.setState({ modalFields: [], pageOfItems: [] });
  }

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  render() {
    return (
      <React.Fragment>
        <table className='table'>
          <thead>
            <tr>
              {this.props.config.ListCrud.headers.map((item, key) => {
                return <th key={key}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.pageOfItems.map((item, key) => {
              return (
                <tr key={key}>
                  {this.props.config.ListCrud.fieldsTable.map((keyField, key) => {
                    //Si el campo no se llama imagen no mostramos la imagen y si el campo es nulo igualmente no lo mostramos
                    return item[keyField] ? (
                      <td key={key}>
                        {keyField !== 'picture' ? (
                          item[keyField]
                        ) : (
                          <img className='imageTable' src={item[keyField]} height='35' width='35' alt='' />
                        )}{' '}
                      </td>
                    ) : (
                      <td key={key}>-</td>
                    );
                  })}
                  <td>
                    <a
                      className='level-item'
                      onClick={(e) => {
                        this.props.update(item._id);
                      }}>
                      <i className='fas fa-edit' />
                    </a>
                    <a
                      className='level-item'
                      onClick={(e) => {
                        this.props.delete(item._id);
                      }}>
                      <span className='icon has-text-danger'>
                        <i className='fas fa-trash'></i>
                      </span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination items={this.props.data} onChangePage={this.onChangePage} />
      </React.Fragment>
    );
  }
}

export default ListCrud;
