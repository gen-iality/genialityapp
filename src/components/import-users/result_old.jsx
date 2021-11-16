import React, { Component } from 'react';
import Async from 'async';
import { Actions } from '../../helpers/request';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      ok: [],
      notok: [],
      total: 0,
      saved: 0,
      fails: 0,
      updated: 0,
      step: 1,
    };
  }

  componentDidMount() {
    const { list } = this.props;
    this.setState({ list });
    this.uploadByOne(list);
  }

  uploadByOne = (users) => {
    const self = this;
    const { extraFields } = this.props;
    let ok = [],
      notok = [];
    const toImport = users.filter((user) => !this.isEmptyObject(user));
    Async.eachOfSeries(
      toImport,
      (user, key, cb) => {
        if (!this.isEmptyObject(user)) {
          if (this.props.organization) {
            Actions.post(`/api/organizations/${this.props.eventId}/users`, user)
              .then((resp) => {
                if (resp.message === 'OK') {
                  ok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: resp.status,
                  };
                  if (resp.status === 'UPDATED') {
                    self.setState((prevState) => {
                      return { updated: prevState.updated + 1, total: prevState.total + 1 };
                    });
                  } else {
                    self.setState((prevState) => {
                      return { saved: prevState.saved + 1, total: prevState.total + 1 };
                    });
                  }
                }
                cb();
              })
              .catch((err) => {
                if (err.response) {
                  const { data } = err.response;
                  let error = 'ERROR ';
                  Object.keys(data).map((field) => {
                    return (error = error + data[field][0] + ' ');
                  });
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: error,
                  };
                } else {
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: 'ERROR DESCONOCIDO',
                  };
                }
                self.setState((prevState) => {
                  return { fails: prevState.fails + 1, total: prevState.total + 1 };
                });
                cb();
              });
          } else {
            Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${this.props.eventId}`, user)
              .then((resp) => {
                if (resp.message === 'OK') {
                  ok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: resp.status,
                  };
                  if (resp.status === 'UPDATED') {
                    self.setState((prevState) => {
                      return { updated: prevState.updated + 1, total: prevState.total + 1 };
                    });
                  } else {
                    self.setState((prevState) => {
                      return { saved: prevState.saved + 1, total: prevState.total + 1 };
                    });
                  }
                }
                cb();
              })
              .catch((err) => {
                if (err.response) {
                  const { data } = err.response;
                  let error = 'ERROR ';
                  Object.keys(data).map((field) => {
                    return (error = error + data[field][0] + ' ');
                  });
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: error,
                  };
                } else {
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: 'ERROR DESCONOCIDO',
                  };
                }
                self.setState((prevState) => {
                  return { fails: prevState.fails + 1, total: prevState.total + 1 };
                });
                cb();
              });
          }
        }
      },
      (err) => {
        self.setState({ ok, notok });
        if (err) {
          err;
        }
      }
    );
  };

  isEmptyObject = (o) => {
    return Object.keys(o).every(function(x) {
      return !o[x] || o[x] === null;
    });
  };

  render() {
    const { total, saved, fails, updated, step, ok, notok } = this.state;
    const { extraFields } = this.props;
    const data = [notok, ok];
    return (
      <React.Fragment>
        <div className='columns is-mobile is-gapless'>
          <div className='column'>
            <div className='tags'>
              <span className='tag is-size-7'>{total}</span>
              <span className='tag is-white is-size-7'>Total</span>
            </div>
          </div>
          <div className='column'>
            <div className='tags'>
              <span className='tag is-primary is-size-7'>{saved}</span>
              <span className='tag is-white is-size-7'>Importados</span>
            </div>
          </div>
          <div className='column'>
            <div className='tags'>
              <span className='tag is-danger is-size-7'>{fails}</span>
              <span className='tag is-white is-size-7'>Fallidos</span>
            </div>
          </div>
          <div className='column'>
            <div className='tags'>
              <span className='tag is-warning is-size-7'>{updated}</span>
              <span className='tag is-white is-size-7'>Actualizados</span>
            </div>
          </div>
        </div>
        {total > 0 && (
          <React.Fragment>
            <div className='tabs is-fullwidth'>
              <ul>
                <li
                  className={`${step === 0 ? 'is-active' : ''}`}
                  onClick={() => {
                    this.setState({ step: 0 });
                  }}>
                  <a>Incorrectos</a>
                </li>
                <li
                  className={`${step === 1 ? 'is-active' : ''}`}
                  onClick={() => {
                    this.setState({ step: 1 });
                  }}>
                  <a>Correctos</a>
                </li>
              </ul>
            </div>
            <table className='table def is-fullwidth is-striped'>
              <thead>
                <tr>
                  <th>{extraFields[0].name}</th>
                  <th>{extraFields[1].name}</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data[step].map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>{item[extraFields[0].name]}</td>
                      <td>{item[extraFields[1].name]}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Result;
