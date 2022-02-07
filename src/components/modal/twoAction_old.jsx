import React, { Component } from 'react';

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  getDerivedStateFromProps(nextProps) {
    if (nextProps.isLoading !== this.props.isLoading) {
      this.setState({ isLoading: nextProps.isLoading });
    }
  }

  render() {
    const { first, second, message } = this.props;
    return (
      <div className={`modal ${this.props.modal ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.title}</p>
          </header>
          <section className='modal-card-body'>
            {this.props.content}
            {message && (
              <div className={'msg'}>
                <p className={`help ${message.class}`}>{message.content}</p>
              </div>
            )}
          </section>
          <footer className='modal-card-foot'>
            {this.state.isLoading ? (
              <div>{this.state.isLoading}</div>
            ) : (
              <React.Fragment>
                <button
                  className={`button ${first.class} ${first.disabled ? 'is-loading' : ''}`}
                  onClick={first.action}>
                  {first.title}
                </button>
                {second && (
                  <button className={`button ${second.class}`} onClick={second.action}>
                    {second.title}
                  </button>
                )}
              </React.Fragment>
            )}
          </footer>
        </div>
      </div>
    );
  }
}

export default Dialog;
