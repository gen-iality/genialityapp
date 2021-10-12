import React, { Component, Fragment } from 'react';
import { Actions, EventFieldsApi, OrganizationApi } from '../../../helpers/request';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import EventContent from '../shared/content';
import EventModal from '../shared/eventModal';
import DatosModal from './modal';
import Dialog from '../../modal/twoAction';
import { Tabs, Table, Checkbox, notification, Button } from 'antd';
import RelationField from './relationshipFields';
import { EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { firestore } from '../../../helpers/firebase';
import ModalCreateTemplate from '../../shared/modalCreateTemplate';

const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
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
      properties: null,
    };
    this.eventID = this.props.eventID;
    this.html = document.querySelector('html');
    this.submitOrder = this.submitOrder.bind(this);
    this.organization = this.props?.org
  }

  async componentDidMount() {
    await this.fetchFields();
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
      let fields
      if(this.organization){
        fields = this.organization.user_properties
      }else{
        fields = await EventFieldsApi.getAll(this.eventID);
        fields = this.orderFieldsByWeight(fields);
        fields = this.updateIndex(fields);
      }
      this.setState({ fields, loading: false });
    } catch (e) {
      this.showError(e);
    }
  };
  //Permite asignarle un index a los elementos
  updateIndex = (fields) => {
    for (var i = 0; i < fields.length; i++) {
      fields[i].index = i;
      fields[i].order_weight = i + 1;
    }
    return fields;
  };

  //Agregar nuevo campo
  addField = () => {
    this.setState({ edit: false, modal: true });
  };
  //Guardar campo en el evento
  saveField = async (field) => {
    try {
      let totaluser = {}
      if(this.organization){
        console.log("10. aqui se editan los checkBox, falta api ", field, field._id, this.organization._id)
      }else{
        if (this.state.edit) await EventFieldsApi.editOne(field, field._id, this.eventID);
        else await EventFieldsApi.createOne(field, this.eventID);
        totaluser = await firestore.collection(`${this.eventID}_event_attendees`).get();
      }
      if (totaluser?.docs?.length > 0 && field.name == 'pesovoto') {
        firestore
          .collection(`${this.eventID}_event_attendees`)
          .get()
          .then((resp) => {
            if (resp.docs.length > 0) {
              resp.docs.map((doc) => {
                var datos = doc.data();
                var objectP = datos.properties;
                var properties = objectP;
                objectP = { ...objectP, pesovoto: properties && properties.pesovoto ? properties.pesovoto : 1 };
                datos.properties = objectP;
                firestore
                  .collection(`${this.eventID}_event_attendees`)
                  .doc(doc.id)
                  .set(datos);
              });
            }
          });
      }
      await this.fetchFields();
      this.setState({ modal: false, edit: false, newField: false });
    } catch (e) {
      this.showError(e);
    }
  };

  //Funcion para guardar el orden de los datos
  async submitOrder() {
    if(this.organization){
      console.log("10. Aqui se edita el orden de los campos ", this.state.properties, this.organization._id)
      const data = await OrganizationApi.editOne(this.state.properties, this.organization._id)
      console.log("10.data ", data)
    }else{
      await Actions.put(`api/events/${this.props.eventID}`, this.state.properties);
    }

    notification.open({
      message: 'Información salvada',
      description: 'El orden de la recopilacion de datos se ha guardado',
      onClick: () => {},
    });
    this.fetchFields();
  }

  //Abrir modal para editar dato
  editField = (info) => {
    this.setState({ info, modal: true, edit: true });
  };
  //Borrar dato de la lista
  removeField = async () => {
    try {
      if(this.organization){
        console.log("10. Aqui se eleminan los campos ", this.state.deleteModal, this.organization._id)
        this.setState({ message: { ...this.state.message, class: 'msg_success', content: 'FIELD DELETED' } });
      }else{
        await EventFieldsApi.deleteOne(this.state.deleteModal, this.eventID);
        this.setState({ message: { ...this.state.message, class: 'msg_success', content: 'FIELD DELETED' } });
      }
      await this.fetchFields();
      setTimeout(() => {
        this.setState({ message: {}, deleteModal: false });
      }, 800);
    } catch (e) {
      this.showError(e);
    }
  };
  
  closeDelete = () => {
    this.setState({ deleteModal: false });
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
  async changeCheckBox(field, key, key2 = null) {
    notification.open({
      message: 'Espere..',
      description: 'Por favor espere mientras se guarda la configuración',
    });
    try {
      this.setState({ edit: true }, () => {
        field[key] = !field[key];
        if (key2 != null) {
          field[key2] = field[key2] == true ? false : field[key2];
        }

        this.saveField(field).then((resp) => {
          notification.open({
            message: 'Correcto!',
            description: 'Se ha editado correctamente el campo..!',
          });
        });
      });
    } catch (e) {
      notification.open({
        message: 'No se ha actualizado el campo',
        description: 'El Campo no ha sido posible actualizarlo, intenta mas tarde',
      });
    }
  }
  //Contenedor draggable
  DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass='row-dragging'
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );
  //Función para hacer que el row sea draggable
  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { fields } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = fields.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  //Función que se ejecuta cuando se termina de hacer drag
  onSortEnd = ({ oldIndex, newIndex }) => {
    let user_properties = this.state.user_properties;
    const { fields } = this.state;
    if (oldIndex !== newIndex) {
      let newData = arrayMove([].concat(fields), oldIndex, newIndex).filter((el) => !!el);
      newData = this.updateIndex(newData);
      user_properties = newData;
      this.setState({
        fields: newData,
        user_properties,
        available: false,
        properties: { user_properties: user_properties },
      });
    }
  };

  render() {
    const { fields, modal, edit, info } = this.state;
    const columns = [
      {
        title: '',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
      },
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
          key.name !== 'email' && key.name !== 'names' ? (
            <Checkbox name='mandatory' onChange={() => this.changeCheckBox(key, 'mandatory')} defaultChecked={record} />
          ) : (
            <Checkbox checked />
          ),
      },
      {
        title: 'Visible solo contactos',
        dataIndex: 'visibleByContacts',
        align: 'center',
        render: (record, key) => (
          <Checkbox
            name='visibleByContacts'
            onChange={() => this.changeCheckBox(key, 'visibleByContacts', 'visibleByAdmin')}
            checked={record}
          />
        ),
      },
      {
        title: 'Sensible (Networking)',
        dataIndex: 'sensibility',
        align: 'center',
        render: (record, key) => (
          <Checkbox
            name='sensibility'
            onChange={() => this.changeCheckBox(key, 'sensibility')}
            checked={record}
          />
        ),
      },
      {
        title: 'Visible solo admin',
        dataIndex: 'visibleByAdmin',
        align: 'center',
        render: (record, key) =>
          key.name !== 'email' && key.name !== 'names' ? (
            <Checkbox
              name='visibleByAdmin'
              onChange={() => this.changeCheckBox(key, 'visibleByAdmin', 'visibleByContacts')}
              checked={record}
            />
          ) : (
            <Checkbox checked />
          ),
      },
      {
        title: 'Action',
        dataIndex: '',
        render: (key) => (
          <>
           {key.name !== 'email' &&  (
            <EditOutlined style={{ float: 'left' }} onClick={() => this.editField(key)} />
           )}
            {key.name !== 'email' && key.name !== 'names' &&  (
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
              {/* <ModalCreateTemplate /> */}
              <EventContent
                title={'Recopilación de datos'}
                description={`Configure los datos que desea recolectar de los asistentes ${this.organization ?'de la organización':'del evento'}`}
                addAction={this.addField}
                addTitle={'Agregar dato'}>
                <Table
                  columns={columns}
                  dataSource={fields}
                  pagination={false}
                  rowKey='index'
                  components={{
                    body: {
                      wrapper: this.DraggableContainer,
                      row: this.DraggableBodyRow,
                    },
                  }}
                />
                <Button style={{ marginTop: '3%' }} disabled={this.state.available} onClick={this.submitOrder}>
                  Guardar orden de Datos
                </Button>
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
          {this.props.eventID && <TabPane tab='Campos Relacionados' key='2'>
            <RelationField eventId={this.props.eventID} fields={fields} />
          </TabPane>}
        </Tabs>
        {/*<DragDrop eventId={this.props.eventID} list={fields} />*/}
      </div>
    );
  }
}

export default Datos;
