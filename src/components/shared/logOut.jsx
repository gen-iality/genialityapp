import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import * as Cookie from 'js-cookie';
import { AuthUrl } from '../../helpers/constants';

class LogOut extends Component {
  logout = () => {
    const element = document.getElementById('modal');
    element.classList.remove('is-active');
    const history = this.props.history;
    history.length = 0;
    Cookie.remove('token');
    Cookie.remove('evius_token');
    window.location.replace(`${AuthUrl}/logout`);
  };
  closeModal = () => {
    const element = document.getElementById('modal');
    element.classList.remove('is-active');
    Cookie.remove('token');
    Cookie.remove('evius_token');
    window.location.reload();
  };

  render() {
    return (
      <div className={`modal is-active`} id={'modal'} ref={(element) => (this.inputElement = element)}>
        <div className='modal-background' />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              <FormattedMessage id='header.expired_title' defaultMessage='Sign In' />
            </p>
          </header>
          <section className='modal-card-body'>
            <FormattedMessage id='header.expired_content' defaultMessage='Sign In' />
          </section>
          <footer className='modal-card-foot'>
            <button className={`button is-info`} onClick={this.logout}>
              <FormattedMessage id='header.expired_signin' defaultMessage='Sign In' />
            </button>
            <button className={`button`} onClick={this.closeModal}>
              <FormattedMessage id='header.expired_cancel' defaultMessage='Sign In' />
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export default withRouter(LogOut);
