import { Component, createRef } from 'react';
import { dynamicFieldOptions } from '@components/dynamic-fields/constants';
import CreatableSelect from 'react-select/lib/Creatable';
import { Checkbox, Form, Input, Radio, Select, InputNumber, Button, Row } from 'antd';
import { DispatchMessageService } from '@context/MessageService';

const html = document.querySelector('html');
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;
const { TextArea } = Input;

const extraInputs = {
  country: [
    {
      id: undefined,
      name: 'region',
      description: undefined,
      label: 'Region',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'region',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'city',
      description: undefined,
      label: 'Ciudad',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'city',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
  region: [
    {
      id: undefined,
      name: 'pais',
      description: undefined,
      label: 'Pais',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'country',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'city',
      description: undefined,
      label: 'Ciudad',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'city',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
  city: [
    {
      id: undefined,
      name: 'region',
      description: undefined,
      label: 'Region',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'region',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
    {
      id: undefined,
      name: 'pais',
      description: undefined,
      label: 'Pais',
      unique: false,
      mandatory: true,
      options: undefined,
      order_weight: undefined,
      type: 'country',
      visibleByAdmin: true,
      visibleByContacts: undefined,
    },
  ],
};

class DatosModal extends Component {
  formRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      info: {
        name: '',
        mandatory: false,
        visibleByContacts: false,
        visibleByAdmin: false,
        label: '',
        description: '',
        type: '',
        options: [],
        justonebyattendee: false,
      },
      valid: true,
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.info) this.setState({ info: this.props.info });
  }

  generateFieldNameForLabel(name, value) {
    //.replace(/[\u0300-\u036f]/g, "") = quita unicamente las tildes, normalize("NFD") pasa la cadena de texto a formato utf-8 y el normalize quita caracteres alfanumericos
    const generatedFieldName = toCapitalizeLower(value)
      .normalize('NFD')
      .replace(/[^a-z0-9_]+/gi, '');
    return generatedFieldName;
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    const tmpInfo = { ...this.state.info };

    //Generamos el nombre del campo para la base de datos(name) a partir del  label solo si el campo se esta creando
    if (name == 'label') {
      if (tmpInfo['name'] !== 'names' && tmpInfo['name'] !== 'email' && tmpInfo['name'] !== 'picture') {
        tmpInfo['name'] = this.generateFieldNameForLabel(name, value);
        this.formRef.current.setFieldsValue({
          name: tmpInfo['name'],
        });
      }
    }
    tmpInfo[name] = value;

    this.setState({ info: tmpInfo });
  };

  validForm = () => {
    const { name, label, type, options } = this.state.info;
    let valid = !(name.length > 0 && label.length > 0 && type !== '');
    if (type === 'list') {
      valid = !(!valid && options && options.length > 0);
      if (!options) {
        this.setState({ info: { ...this.state.info, options: [] } });
      }
    }
    this.setState({ valid });
  };
  //Cambiar mandatory del campo del curso o lista
  changeFieldjustonebyattendee = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, justonebyattendee: !prevState.info.justonebyattendee } };
    });
  };

  //Cambiar mandatory del campo del curso o lista
  changeFieldCheck = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, mandatory: !prevState.info.mandatory } };
    });
  };

  changeFieldCheckVisibleByContacts = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, visibleByContacts: !prevState.info.visibleByContacts } };
    });
  };

  changeFieldCheckVisibleByAdmin = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, visibleByAdmin: !prevState.info.visibleByAdmin } };
    });
  };

  //Funciones para lista de opciones del campo
  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  changeOption = (option) => {
    this.setState({ info: { ...this.state.info, options: option } }, this.validForm);
  };

  //funciona pra crear datos predeterminados

  handleKeyDown = (event) => {
    const { inputValue } = this.state;
    const value = inputValue;
    if (!value) return;
    switch (event.keyCode) {
      case 9:
      case 13:
        this.setState({
          inputValue: '',
          info: { ...this.state.info, options: [...(this.state.info?.options || []), createOption(value)] },
        });
        event.preventDefault();
        break;
      // eslint-disable-next-line no-empty
      default: {
      }
    }
  };

  //Guardar campo en el curso
  saveField = async (values) => {
    const info = Object.assign({}, this.state.info);

    if (
      info?.options?.length === 0 &&
      (info?.type === 'list' || info?.type === 'multiplelist' || info?.type === 'multiplelisttable')
    ) {
      DispatchMessageService({
        type: 'error',
        msj: `El campo de tipo ${info.type} debe tener al menos una opción válida`,
        action: 'show',
      });
      return;
    }
    info.name = toCapitalizeLower(info.name);
    values.mandatory = info?.mandatory;
    values.options = info?.options;
    values.visibleByAdmin = info?.visibleByAdmin;
    values.visibleByContacts = info.visibleByContacts;
    values.description = info.description;
    this.setState({ loading: true });
    if (info.type !== 'list' && info.type !== 'multiplelist') delete info.options;

    await this.props.action(values, this.state.event?._id);
    const initModal = {
      name: '',
      mandatory: false,
      visibleByContacts: false,
      label: '',
      description: '',
      type: '',
      options: [],
      justonebyattendee: false,
    };
    this.setState({ info: initModal, loading: false });
  };
  onSaveGeneral = async (values) => {
    if (values.type === 'country' || values.type === 'region' || values.type === 'city') {
      const inputsCountry = [...extraInputs[values.type], values];
      inputsCountry.map((input) => {
        this.saveField(input);
      });
    } else {
      this.saveField(values);
    }
  };
  render() {
    const { inputValue, info, valid, loading } = this.state;
    const { edit } = this.props;

    return (
      <>
        <Form
          autoComplete='off' // this was added
          initialValues={this.props.info}
          ref={this.formRef}
          onFinish={this.onSaveGeneral} // this changed, enable to avoid more bugs
          {...formLayout} // rest data
        >
          {/* Campo oculto  con el id del mismo para poder editar un campo a recolectar para una organización */}
          <Form.Item hidden initialValue={this.props.info?._id} name={'id'}>
            <Input name='label' type='text' />
          </Form.Item>
          <Form.Item
            initialValue={this.props.info?.label}
            //value={info?.label + 'h' || 'value'}
            label={'Nombre campo'}
            name={'label'}
            rules={[{ required: true }]}>
            <Input name={'label'} type='text' placeholder={'Ej: Celular'} onChange={this.handleChange} />
          </Form.Item>
          <Form.Item name='name' initialValue={this.props.info?.name}>
            <Input
              type='text'
              placeholder={'Nombre del campo en base de datos'}
              disabled={true}
              //onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item
            initialValue={info?.type}
            label={'Tipo de dato'}
            name='type'
            rules={[{ required: true, message: 'Seleccione un tipo de dato válido' }]}>
            <Select
              options={dynamicFieldOptions}
              disabled={info.name === 'picture' || info.name == 'email' || info.name == 'names' ? true : false}
              onChange={(value) => this.handleChange({ target: { name: 'type', value: value } })}></Select>
          </Form.Item>

          {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
            <CreatableSelect
              components={{ DropdownIndicator: null }}
              inputValue={inputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={this.changeOption}
              onInputChange={this.handleInputChange}
              onKeyDown={(e) => {
                this.handleKeyDown(e);
              }}
              placeholder='Escribe la opción y presiona Enter o Tab...x'
              value={info?.options}
              required={true}
            />
          )}

          {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
            <Form.Item name='justonebyattendee'>
              <Checkbox
                name={`justonebyattendee`}
                checked={info.justonebyattendee}
                onChange={this.changeFieldjustonebyattendee}>
                Solo una opción por usuario (cuando un asistente selecciona una opción esta desaparece del listado)
              </Checkbox>
            </Form.Item>
          )}
          <Form.Item
            label={'Obligatorio'}
            initialValue={info.mandatory || false}
            htmlFor={`mandatoryModal`}
            name='mandatory'>
            <Checkbox
              id={`mandatoryModal`}
              //name={`mandatory`}
              checked={info.mandatory}
              onChange={this.changeFieldCheck}
            />
          </Form.Item>
          <Form.Item label={'Visible para Contactos'} htmlFor={`visibleByContactsModal`} name='visibleByContacts'>
            <Checkbox
              id={`visibleByContactsModal`}
              name={`visibleByContacts`}
              checked={info?.visibleByContacts}
              onChange={this.changeFieldCheckVisibleByContacts}
            />
          </Form.Item>
          <Form.Item label={'Visible para Admin'} htmlFor={`visibleByAdminModal`} name='visibleByAdmin'>
            <Checkbox
              id={`visibleByAdminModal`}
              name={`visibleByAdmin`}
              checked={info.visibleByAdmin}
              onChange={this.changeFieldCheckVisibleByAdmin}
            />
          </Form.Item>
          <Form.Item label={'Descripción'} name='description'>
            <TextArea
              placeholder={'Descripción corta'}
              name={'description'}
              value={info.description || ''}
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item label={'Posición / Orden'} name='order_weight'>
            <InputNumber
              min={0}
              name={'order_weight'}
              placeholder='1'
              value={info.order_weight}
              onChange={(value) => this.handleChange({ target: { name: 'order_weight', value: value } })}
            />
          </Form.Item>
          <Form.Item>
            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                style={{ marginRight: 20 }}
                type='primary'
                htmlType='submit'
                id='btnSave'
                disabled={loading}
                loading={loading}>
                {'Guardar'}
              </Button>

              <Button onClick={() => this.props.cancel()} type='default' tmlType='button'>
                {'Cancelar'}
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
  }
}

const createOption = (label) => ({ label, value: label });

//Función para convertir una frase en camelCase: "Hello New World" → "helloNewWorld"
function toCapitalizeLower(str) {
  const splitted = str.split(' ');
  const init = splitted[0].toLowerCase();
  const end = splitted.slice(1).map((item) => {
    item = item.toLowerCase();
    return item.charAt(0).toUpperCase() + item.substr(1);
  });
  return [init, ...end].join('');
}

export default DatosModal;
