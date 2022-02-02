import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Moment from 'moment';
import { Actions } from '../../helpers/request';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import SearchComponent from '../shared/searchTable';
import { AgendaApi } from '../../helpers/request';
import { fieldsSelect, handleRequestError, handleSelect, sweetAlert, uploadImage } from '../../helpers/utils';

class configApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    //https://api.evius.co/api/events/5d6eb0cbd74d5c163179d002/activities/5e1b8718d74d5c0c324749d2
    const info = await Actions.getAll(`/api/events/${this.props.eventId}/activities`);
    this.setState({ info });
  }

  submit = async () => {
    const { event } = this.props;
  };

  render() {
    return (
      <React.Fragment>
        <div className='field'>
          <button className='button is-primary' onClick={this.submit}>
            Guardar
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default configApp;
