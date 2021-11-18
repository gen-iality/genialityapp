import React, { Component } from 'react';
import Pagination from '../shared/pagination';

class MessageUser extends Component {
  constructor(props) {
    super(props);
    this.state = { pageOfItems: [] };
  }

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  render() {
    return (
      <React.Fragment>
        <table className='table is-fullwidth'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>            
            </tr>
          </thead>
          <tbody>
            {this.state.pageOfItems.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{item.email}</td>
                  <td>{item.status}</td>                
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination items={this.props.users} onChangePage={this.onChangePage} />
      </React.Fragment>
    );
  }
}

export default MessageUser;
