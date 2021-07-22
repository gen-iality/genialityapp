import React, { Component, Fragment } from 'react';
import { EventFieldsApi } from '../../../helpers/request';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import EventContent from '../shared/content';
import EventModal from '../shared/eventModal';
import DatosModal from './modal';
import Dialog from '../../modal/twoAction';
import { Tabs, Table, Checkbox, notification } from 'antd';
import RelationField from './relationshipFields';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DragDrop from './dragDrop';
import { firestore } from '../../../helpers/firebase';

const { TabPane } = Tabs;

class Datos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      newField: false,
      loading: true,
      deleteModal: false,
      edit: false,
      fields: [],
    };
    this.eventID = this.props.eventID;
    this.html = document.querySelector('html');
  }

  async componentDidMount() {
    await this.fetchFields();
    console.log(this.state.fields)
  }

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };
  // Funcion para traer la información
  fetchFields = async () => {
    try {
      let fields = await EventFieldsApi.getAll(this.eventID);
      fields = this.orderFieldsByWeight(fields);

      this.setState({ fields, loading: false });
    } catch (e) {
      this.showError(e);
    }
  };

  //Agregar nuevo campo
  addField = () => {
    this.setState({ edit: false, modal: true });
  };
  //Guardar campo en el evento
  saveField = async (field) => {
    try {
      if (this.state.edit) await EventFieldsApi.editOne(field, field._id, this.eventID);
      else await EventFieldsApi.createOne(field, this.eventID);
      let totaluser= await firestore.collection(`${this.eventID}_event_attendees`).get();
     
    if(totaluser.docs.length>0 && field.name=='pesovoto' ){
     firestore.collection(`${this.eventID}_event_attendees`).get().then((resp)=>{
         if(resp.docs.length>0){
           resp.docs.map((doc)=>{
            
            var datos=doc.data();            
              console.log(datos)
              var objectP=datos.properties;              
               var properties=objectP
               objectP={...objectP,pesovoto:properties&&properties.pesovoto?properties.pesovoto:1}         
               datos.properties=objectP;              
              firestore.collection(`${this.eventID}_event_attendees`).doc(doc.id).set(datos)            
          })
         }
        });
      }
      await this.fetchFields();
      this.setState({ modal: false, edit: false, newField: false });
    } catch (e) {
      this.showError(e);
    }
  };

  //Abrir modal para editar dato
  editField = (info) => {
    this.setState({ info, modal: true, edit: true });
  };
  //Borrar dato de la lista
  removeField = async () => {
    try {
      await EventFieldsApi.deleteOne(this.state.deleteModal, this.eventID);
      this.setState({ message: { ...this.state.message, class: 'msg_success', content: 'FIELD DELETED' } });
      await this.fetchFields();
      setTimeout(() => {
        this.setState({ message: {}, deleteModal: false });
      }, 800);
    } catch (e) {
      this.showError(e);
    }
  };
  closeModal = () => {
    this.html.classList.remove('is-clipped');
    this.setState({ inputValue: '', modal: false, info: {}, edit: false });
  };

  showError = (error) => {
    toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) this.setState({ timeout: true, loader: false });
      else this.setState({ serverError: true, loader: false, errorData: data });
    } else {
      let errorData = error.message;
      if (error.request) {
        errorData = error.request;
      }
      errorData.status = 708;
      this.setState({ serverError: true, loader: false, errorData });
    }
  };
  //Funcion para cambiar el valor de los checkboxes
  async changeCheckBox() {
    try {
      this.fetchFields();
      notification.open({
        message: 'Campo Actualizado',
      });
    } catch (e) {
      notification.open({
        message: 'No se ha actualizado el campo',
        description: 'El Campo no ha sido posible actualizarlo, intenta mas tarde',
      });
    }
  }

  render() {
    const { fields, modal, edit, info } = this.state;
    const columns = [
      {
        title: 'Dato',
        dataIndex: 'label',
      },
      {
        title: 'Tipo de dato',
        dataIndex: 'type',
      },
      {
        title: 'Obligatorio',
        dataIndex: 'mandatory',
        align: 'center',
        render: (record, key) =>
          key.name !== 'email' && key.name !== 'names'? (
            <Checkbox name='mandatory' onChange={() => this.changeCheckBox()} defaultChecked={record} />
          ) : (
            <Checkbox checked />
          ),
      },
      {
        title: 'Visible solo contactos',
        dataIndex: 'visibleByContacts',
        align: 'center',
        render: (record) => (
          <Checkbox name='visibleByContacts' onChange={() => this.changeCheckBox()} defaultChecked={record} />
        ),
      },
      {
        title: 'Visible solo admin',
        dataIndex: 'visibleByAdmin',
        align: 'center',
        render: (record, key) =>
          key.name !== 'email' && key.name !== 'names' ? (
            <Checkbox name='visibleByAdmin' onChange={() => this.changeCheckBox()} defaultChecked={record} />
          ) : (
            <Checkbox checked />
          ),
      },
      {
        title: 'Action',
        dataIndex: '',
        render: (key) => (
          <>
            <EditOutlined style={{ float: 'left' }} onClick={() => this.editField(key)} />
            {key.name !== 'email' && key.name !== 'names' && key.name!=='picture' && (
              <DeleteOutlined style={{ float: 'right' }} onClick={() => this.setState({ deleteModal: key._id })} />
            )}
          </>
        ),
      },
    ];
    return (
      <div>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Configuración General' key='1'>
            <Fragment>
              <EventContent
                title={'Recopilación de datos'}
                description={'Configure los datos que desea recolectar de los asistentes del evento'}
                addAction={this.addField}
                addTitle={'Agregar dato'}>
                <Table
                  columns={columns}
                  dataSource={fields}
                  pagination={{
                    total: fields.length,
                    pageSize: fields.length,
                    hideOnSinglePage: true,
                  }}
                />
              </EventContent>
              {modal && (
                <EventModal modal={modal} title={edit ? 'Editar Dato' : 'Agregar Dato'} closeModal={this.closeModal}>
                  <DatosModal edit={edit} info={info} action={this.saveField} />
                </EventModal>
              )}
              {this.state.deleteModal && (
                <Dialog
                  modal={this.state.deleteModal}
                  title={'Borrar Dato'}
                  content={<p>Seguro de borrar este dato?</p>}
                  first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.removeField }}
                  message={this.state.message}
                  second={{ title: 'Cancelar', class: '', action: this.closeDelete }}
                />
              )}
            </Fragment>
          </TabPane>
          <TabPane tab='Campos Relacionados' key='2'>
            <RelationField eventId={this.props.eventID} fields={fields} />
          </TabPane>
        </Tabs>
        <DragDrop eventId={this.props.eventID} list={fields} />
      </div>
    );
  }
}

export default Datos;
