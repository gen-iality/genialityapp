import { Component, createRef, Fragment } from 'react';
import { typeInputs } from '../../../helpers/constants';
import CreatableSelect from 'react-select/lib/Creatable';
import { Checkbox, Form, Input, Radio, Select, InputNumber, Button, Row, Alert } from 'antd';
import { DispatchMessageService } from '@/context/MessageService';
import { InfoCircleOutlined } from '@ant-design/icons';

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
    let { name, value } = e.target;

    let tmpInfo = { ...this.state.info };

    //Generamos el nombre del campo para la base de datos(name) a partir del  label solo si el campo se esta creando
    if (name == 'label' && !this.props.edit) {
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
  //Cambiar mandatory del campo del evento o lista
  changeFieldjustonebyattendee = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, justonebyattendee: !prevState.info.justonebyattendee } };
    });
  };

  //Cambiar mandatory del campo del evento o lista
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

  //Guardar campo en el evento
  saveField = async (values) => {
    const info = Object.assign({}, this.state.info);

    if (
      (!info?.options || info?.options?.length === 0) &&
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
      let inputsCountry = [...extraInputs[values.type], values];
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
      <Fragment>
        {/* <section className='modal-card-body'> */}
        <Form
          autoComplete='off'
          initialValues={this.props.info}
          ref={this.formRef}
          onFinish={this.onSaveGeneral}
          {...formLayout}>
          {/* Campo oculto  con el id del mismo para poder editar un campo a recolectar para una organización */}
          <Form.Item hidden initialValue={this.props.info?._id} name={'id'}>
            <Input name='label' type='text' />
          </Form.Item>
          <Form.Item
            initialValue={this.props.info?.label}
            //value={info?.label + 'h' || 'value'}
            label={'Nombre Campo'}
            name={'label'}
            rules={[{ required: true }]}>
            <Input
              autocomplete={false}
              name={'label'}
              type='text'
              placeholder={'Ej: Celular'}
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item name='name' initialValue={this.props.info?.name}>
            <Input
              type='text'
              placeholder={'Nombre del campo en base de datos'}
              disabled={true}
              //onChange={this.handleChange}
            />
          </Form.Item>
          {/* <Form.Item label={'Posición Nombre del Campo'} name='labelPosition'>
            <Radio.Group onChange={this.handleChange} value={info.labelPosition} name={'labelPosition'}>
              <Radio value={'arriba'} checked={info.labelPosition === 'arriba' || !info.labelPosition}>
                Arriba &nbsp;
              </Radio>
              <Radio value={'izquierda'} checked={info.labelPosition === 'izquierda'}>
                Izquierda &nbsp;
              </Radio>
              <Radio value={'derecha'} checked={info.labelPosition === 'derecha'}>
                Derecha &nbsp;
              </Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item
            initialValue={info?.type}
            label={'Tipo de dato'}
            name='type'
            rules={[{ required: true, message: 'Seleccione un tipo de dato válido' }]}>
            <Select
              defaultValue={typeInputs}
              options={typeInputs}
              disabled={
                info.name === 'picture' || info.name == 'email' || info.name == 'names'
                  ? true
                  : false ||
                    info.type === 'checkInField' ||
                    info.name === 'birthdate' ||
                    info.name === 'bloodtype' ||
                    info.name === 'gender'
              }
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
              disabled={info.type === 'checkInField'}
            />
          </Form.Item>
          <Form.Item label={'Visible para Contactos'} htmlFor={`visibleByContactsModal`} name='visibleByContacts'>
            <Checkbox
              id={`visibleByContactsModal`}
              name={`visibleByContacts`}
              checked={info?.visibleByContacts}
              onChange={this.changeFieldCheckVisibleByContacts}
              disabled={
                info.type === 'checkInField' ||
                info.name === 'birthdate' ||
                info.name === 'bloodtype' ||
                info.name === 'gender'
              }
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
        {/* <div className='field'>
            <label className='label required has-text-grey-light'>Nombre Campo </label>
            <div className='control'>
              <input
                className='input'
                name={'label'}
                type='text'
                placeholder='Ej: Celular'
                value={info.label}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <input
            className='input is-small'
            name={'name'}
            type='text'
            placeholder='Nombre del campo en base de datos'
            value={info.name}
            disabled={true}
            onChange={this.handleChange}
          />
          <div className='field'>
            <label className='label has-text-grey-light'>Posición Nombre del Campo </label>
            <div className=''>
              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='arriba'
                  className='form-check-input'
                  checked={info.labelPosition === 'arriba' || !info.labelPosition}
                  onChange={this.handleChange}
                />
                Arriba &nbsp;
              </label>

              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='izquierda'
                  className='form-check-input'
                  checked={info.labelPosition === 'izquierda'}
                  onChange={this.handleChange}
                />
                Izquierda &nbsp;
              </label>
              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='derecha'
                  className='form-check-input'
                  checked={info.labelPosition === 'derecha'}
                  onChange={this.handleChange}
                />
                Derecha &nbsp;
              </label>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <label className='label required'>Tipo de dato</label>
              <div className='control'>
                <div className='select'>
                  <select
                    disabled={info.name === 'picture' || info.name == 'email' || info.name == 'names' ? true : false}
                    onChange={this.handleChange}
                    name={'type'}
                    value={info.type}>
                    <option value={''}>Seleccione...</option>
                    {typeInputs.map((type, key) => {
                      return (
                        <option key={key} value={type.value}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
              <div className='control'>
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
                  value={info.options}
                  //required={true}
                />
                <Checkbox
                  name={`justonebyattendee`}
                  checked={info.justonebyattendee}
                  onChange={this.changeFieldjustonebyattendee}>
                  Solo una opción por usuario (cuando un asistente selecciona una opción esta desaparece del listado)
                </Checkbox>
              </div>
            )}
          </div>
          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`mandatoryModal`}
              type='checkbox'
              name={`mandatory`}
              checked={info.mandatory}
              onChange={this.changeFieldCheck}
            />
            <label htmlFor={`mandatoryModal`}>Obligatorio</label>
          </div>

          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`visibleByContactsModal`}
              type='checkbox'
              name={`visibleByContacts`}
              checked={info.visibleByContacts}
              onChange={this.changeFieldCheckVisibleByContacts}
            />
            <label htmlFor={`visibleByContactsModal`}>Visible para Contactos</label>
          </div>

          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`visibleByAdminModal`}
              type='checkbox'
              name={`visibleByAdmin`}
              checked={info.visibleByAdmin}
              onChange={this.changeFieldCheckVisibleByAdmin}
            />
            <label htmlFor={`visibleByAdminModal`}>Visible para Admin</label>
          </div>

          <div className='field'>
            <label className='label has-text-grey-light'>Descripción</label>
            <textarea
              className='textarea'
              placeholder='descripción corta'
              name={'description'}
              value={info.description || ''}
              onChange={this.handleChange}
            />
          </div>

          <div className='field'>
            <label className='label has-text-grey-light'>Posición / Orden </label>
            <div className='control'>
              <input
                className='input'
                name={'order_weight'}
                type='number'
                placeholder='1'
                value={info.order_weight}
                onChange={this.handleChange}
              />
            </div>
          </div> */}
        {/* </section>
        <footer className='modal-card-foot'>
          <Button type='primary' onClick={this.saveField} disabled={valid}>
            {edit ? 'Guardar' : 'Agregar'}
          </Button>
        </footer> */}
      </Fragment>
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
