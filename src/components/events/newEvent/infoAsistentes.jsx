import React, { Component } from 'react';
import { uniqueID } from '../../../helpers/utils';
import FieldEvent from '../../modal/fieldEvent';

const initModal = { name: '', mandatory: false, label: '', description: '', type: '', options: [] };
class InfoAsistentes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      modal: false,
      edit: false,
      info: initModal,
    };
  }

  componentDidMount() {
    const fields = this.props.data;
    /*fields[0]={name:'image'
    ,mandatory:true
    ,label:'Avatar'
    ,description:'Imagen de perfil'
    ,type:'text'
    ,options:[],    
     uuid :uniqueID() 
  }*/
  
    this.setState({ fields });
  }

  addField = () => {
    this.setState({ info: initModal, modal: true });
  };
  //Guardar campo en el evento
  saveField = (field) => {
    if (this.state.edit) {
      const fields = [...this.state.fields];
      const pos = fields.map((f) => f.uuid).indexOf(field.uuid);
      fields[pos] = field;
      this.setState({ fields, modal: false, edit: false, newField: false });
    } else {
      const info = Object.assign({}, field);
      info.uuid = uniqueID();
      this.setState({ fields: [...this.state.fields, info], modal: false, edit: false, newField: false });
    }
  };
  //Editar campo en el evento
  editField = (info) => {
    this.setState({ info, modal: true, edit: true });
  };
  //Borrar campo en el evento o lista
  removeField = (key) => {
    const { fields } = this.state;
    fields.splice(key, 1);
    this.setState({ fields });
  };

  submit = (flag) => {
    const data = [...this.state.fields];
    flag ? this.props.nextStep(data) : this.props.prevStep('fields', data, 'main');
  };

  closeModal = () => {
    this.setState({ inputValue: '', modal: false, info: initModal });
  };

  render() {
    const { fields, newField } = this.state;
    return (
      <div>
        <h1>Información Asistentes</h1>
        <p>Aquí puedes agregar los campos de información que le solictarás a tus asistentes</p>
        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <p className='subtitle is-5'>
                <strong>Campos de Evento</strong>
              </p>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <button className='button is-primary' onClick={this.addField} disabled={newField}>
                Agregar Campo
              </button>
            </div>
          </div>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Tipo de Campo</th>
              <th>Nombre</th>
              <th>Obligatorio</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email</td>
              <td>Correo</td>
              <td>
                <input
                  className='is-checkradio is-primary'
                  type='checkbox'
                  id={'mandEmail'}
                  checked={true}
                  disabled={true}
                />
                <label className='checkbox' htmlFor={'mandEmail'} />
              </td>
              <td />
            </tr>
            <tr>
              <td>Texto</td>
              <td>Nombres</td>
              <td>
                <input
                  className='is-checkradio is-primary'
                  type='checkbox'
                  id={'mandName'}
                  checked={true}
                  disabled={true}
                />
                <label className='checkbox' htmlFor={'mandName'} />
              </td>
              <td />             
            </tr>
            <tr>
            <td>Imagen</td>
              <td>Avatar</td>
              <td>
                <input
                  className='is-checkradio is-primary'
                  type='checkbox'
                  id={'mandAvatar'}
                  checked={true}
                  disabled={true}
                />
                <label className='checkbox' htmlFor={'mandName'} />
              </td>
              <td />
            </tr>
            {fields.slice(1).map((field, key) => {
              return (
                <tr key={key}>
                  <td>{field.type}</td>
                  <td>{field.label}</td>
                  <td>
                    <input
                      className='is-checkradio is-primary'
                      type='checkbox'
                      name={`mandatory${field.uuid}`}
                      checked={field.mandatory}
                      onChange={(e) => this.changeFieldCheck(e, field.uuid)}
                    />
                    <label className='checkbox' htmlFor={`mandatory${field.uuid}`} />
                  </td>
                  <td>
                    <button onClick={() => this.editField(field)}>
                      <span className='icon'>
                        <i className='fas fa-edit' />
                      </span>
                    </button>
                    <button onClick={() => this.removeField(key+1)}>
                      <span className='icon'>
                        <i className='fas fa-trash-alt' />
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.modal && (
          <FieldEvent
            edit={this.state.fieldEdit}
            modal={this.state.modal}
            saveField={this.saveField}
            closeModal={this.closeModal}
          />
        )}
        <div className='buttons is-right'>
          <button
            onClick={() => {
              this.submit(true);
            }}
            className={`button is-primary`}>
            Crear
          </button>
          <button
            onClick={() => {
              this.submit(false);
            }}
            className={`button is-text`}>
            Anterior
          </button>
        </div>
      </div>
    );
  }
}

export default InfoAsistentes;
