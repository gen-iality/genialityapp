import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Importacion from './importacion';
import Preview from './preview';
import Result from './result';
import Async from 'async';
import Header from '../../antdComponents/Header';
import { Steps, Divider, message } from 'antd';

const { Step } = Steps;

class ImportUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      list: [],
      toImport: [],
    };
  }

  handleXls = (list) => {
    if (list.length >= 2) {
      this.setState((prevState) => {
        return { list, step: prevState.step + 1 };
      });
    }
  };

  importUsers = (users) => {
    const self = this;
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se envía la información..</>,
    });

    try {

      /* Agregamos el campo ticket_id sino hacemos esto, la validación de campos seleccionados para importar lo quita y finalmente se pierde */
      users = users.map((column) => {
        if (column.key === 'ticket_id') {
          column.used = true;
        }
        return column;
      });
  
      /* console.log('USERS COLUMNS==>', users); */
  
      //Quitamos de los usuarios traidos del excel los campos que no se seleccionaron para importar  y luego enviamos
      //al componente result que realiza la importación uno a uno usando el api
      Async.waterfall(
        [
          function(cb) {
            let newUsers = users.filter((user) => {
              return user.used;
            });
            cb(null, newUsers);
          },
          function(newUsers, cb) {
            let long = newUsers[0].list.length;
            let itemsecondwaterfall = [];
            let initwaterfallcounter = 0;
            for (; initwaterfallcounter < long; ) {
              itemsecondwaterfall[initwaterfallcounter] = {};
              initwaterfallcounter++;
            }
            if (initwaterfallcounter === long) {
              cb(null, itemsecondwaterfall, newUsers);
            }
          },
          function(items, newUsers, cb) {
            let len = newUsers.length;
            for (let i = 0; i < items.length; i++) {
              for (let j = 0; j < len; j++) {
                items[i][newUsers[j].key] = newUsers[j].list[i];
              }
            }
            cb(items);
          },
        ],
        function(result) {
          self.setState((prevState) => {
            return { step: prevState.step + 1, toImport: result };
          });
        }
      );
      message.destroy(loading.key);
      message.open({
        type: 'success',
        content: <>Información cargada correctamente!</>,
      });
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: <>Error cargando la información</>,
      });
    }

  };

  closeModal = () => {
    this.setState({ list: [] });
    this.props.handleModal();
  };

  getDerivedStateFromProps(nextProps) {
    if (nextProps.modal !== this.props.modal) {
      this.setState({ modal: nextProps.modal, step: 0 });
    }
  }

  /* onChange = step => {
    console.log('onChange:', step);
    this.setState({ step });
  }; */

  render() {
    const layout = [
      <Importacion
        key={1}
        handleXls={this.handleXls}
        extraFields={this.props.extraFields}
        organization={this.props.organization}
        event={this.props.event || null}
      />,
      <Preview
        key={2}
        list={this.state.list}
        eventId={this.props.eventId}
        importUsers={this.importUsers}
        extraFields={this.props.extraFields}
      />,
      <Result
        key={3}
        list={this.state.toImport}
        eventId={this.props.eventId}
        extraFields={this.props.extraFields}
        organization={this.props.organization}
      />,
    ];
    return (
      <>
        <Header
          title={<Link to={this.props.matchUrl}>{'Invitados'}</Link>}
          back
          description={'Importación de usuarios - Excel'}
        />
        <br />
        <Steps current={this.state.step} /* onChange={this.onChange} */>
          <Step title='Importar' />
          <Step title='Relacionar' />
          <Step title='Resultado' />
        </Steps>
        <br />

        <div className='step-content'>{layout[this.state.step]}</div>

        {/* {<div className={`event-datos modal-import-user`}>
          <Link to={this.props.matchUrl}>
            <h2 className='title-section'>Invitados</h2>
          </Link>
          <h4 className='subtitle-section'>Importación de usuarios - Excel</h4>
          <div className='steps'>
            <div className={`step-item is-completed`}>
              <div className='step-marker'>1</div>
              <div className='step-details'>
                <p className='step-title'>Importar</p>
              </div>
            </div>
            <div className={`step-item ${this.state.step >= 1 ? 'is-completed' : ''}`}>
              <div className='step-marker'>2</div>
              <div className='step-details'>
                <p className='step-title'>Relacionar</p>
              </div>
            </div>
            <div className={`step-item ${this.state.step >= 2 ? 'is-completed' : ''}`}>
              <div className='step-marker'>3</div>
              <div className='step-details'>
                <p className='step-title'>Resultado</p>
              </div>
            </div>
          </div>
          <div className='step-content'>{layout[this.state.step]}</div>
        </div>} */}
      </>
    );
  }
}

export default ImportUsers;
