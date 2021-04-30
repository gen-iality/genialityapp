import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MessageUser from './messageUser';
import EmailPrev from './emailPreview';

class InvitationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  close = () => {
    this.props.history.goBack();
  };

  render() {
    const { users, item } = this.props.location.state;
    const layout = [
      <MessageUser key='users' users={users} />,
      <EmailPrev key='email' event={this.props.event} item={item} />,
    ];
    return (
      <React.Fragment>
        <nav className='tabs' aria-label='breadcrumbs'>
          <ul>
            <li onClick={this.close}>
              <a>
                <span className='icon is-medium'>
                  <i className='far fa-arrow-left fas fa-lg' />
                </span>
              </a>
            </li>
            <li
              className={`${this.state.step === 0 ? 'is-active' : ''}`}
              onClick={() => {
                this.setState({ step: 0 });
              }}>
              <a>Reporte Envios</a>
            </li>
            <li
              className={`${this.state.step === 1 ? 'is-active' : ''}`}
              onClick={() => {
                this.setState({ step: 1 });
              }}>
              <a>Mensaje Enviado</a>
            </li>
          </ul>
        </nav>
        {layout[this.state.step]}
      </React.Fragment>
    );
  }
}

export default withRouter(InvitationDetail);
