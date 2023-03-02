import { Component, createRef } from 'react';
import { dynamicFieldOptions } from '@components/dynamic-fields/constants';
import { Creatable as CreatableSelect } from 'react-select';
import { Checkbox, Form, Input, Radio, Select, InputNumber, Button, Row, Divider } from 'antd';
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

/**
 * @deprecated use DynamicFieldCreationForm instead
 */
class DatosModal extends Component {
  formRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputValueDependency: '',
      isDependent: false,
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
        dependency: {
          fieldName: '',
          triggerValues: [],
        },
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
    const { isDependent } = this.state
    const { name, label, type, options, dependency } = this.state.info;
    let valid = !(name.length > 0 && label.length > 0 && type !== '');
    if (type === 'list') {
      valid = !(!valid && options && options.length > 0);
      if (!options) {
        this.setState({ info: { ...this.state.info, options: [] } });
      }
    }
    if (isDependent) {
      if (!dependency || !dependency.fieldName) {
        valid = false
      }
      if (!dependency || (dependency.triggerValues || []).length === 0) {
        valid = false
      }
    }
    this.setState({ valid });
  };
  //Cambiar justonebyattendee del campo del curso o lista
  changeFieldjustonebyattendee = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, justonebyattendee: !prevState.info.justonebyattendee } };
    });
  };

  changeFieldAsDependent = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      isDependent: e.target.checked,
    }));
  }

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
  handleInputChangeDependency = (inputValueDependency) => {
    this.setState({ inputValueDependency });
  };

  changeOption = (option) => {
    this.setState({ info: { ...this.state.info, options: option } }, this.validForm);
  };

  changeDependencies = (triggerValues) => {
    console.log('changeDependencies', triggerValues)
    this.setState((previous) => {
      const newState = { ...previous }
      newState.inputValueDependency = ''
      newState.info = newState.info || {}
      newState.info.dependency = newState.info.dependency || {}
      newState.info.dependency.triggerValues = triggerValues
      return newState;
    }, this.validForm)
  };

  checkIfEnter = (event) => {
    if (event.keyCode === 9 || event.keyCode === 13) {
      return true
    }
    return false
  }

  //funciona pra crear datos predeterminados

  handleKeyDown = (event) => {
    const { inputValue } = this.state;
    const value = inputValue;
    if (!value) return;
    if (this.checkIfEnter(event)) {
      this.setState({
        inputValue: '',
        info: { ...this.state.info, options: [...(this.state.info?.options || []), createOption(value)] },
      });
      event.preventDefault();
    }
  };

  handleKeyDownDependent = (event) => {
    const { inputValueDependency } = this.state;
    const value = inputValueDependency;
    if (!value) return;
    if (this.checkIfEnter(event)) {
      console.log('handleKeyDownDependent Enter:', value)
      this.setState((previous) => {
        const newState = { ...previous }
        newState.inputValueDependency = ''
        newState.info = newState.info || {}
        newState.info.dependency = newState.info.dependency || {}
        newState.info.dependency.triggerValues = newState.info.dependency.triggerValues || []
        newState.info.dependency.triggerValues.push(value)
        return newState;
      });
      this.forceUpdate()
      event.preventDefault();
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
    values.dependency = values.dependency || {}
    values.dependency.fieldName = info.dependency?.fieldName || ''
    values.dependency.triggerValues = info.dependency?.triggerValues || []
    values.link = info.link
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
    const { inputValue, inputValueDependency, info, valid, loading, isDependent } = this.state;
    const { edit } = this.props;

    return (
      <>
        <Form
          autoComplete="off" // this was added
          initialValues={this.props.info}
          ref={this.formRef}
          onFinish={this.onSaveGeneral} // this changed, enable to avoid more bugs
          {...formLayout} // rest data
        >
          {/* Campo oculto  con el id del mismo para poder editar un campo a recolectar para una organización */}
          <Form.Item hidden initialValue={this.props.info?._id} name="id">
            <Input name="label" type="text" />
          </Form.Item>
          <Form.Item
            initialValue={this.props.info?.label}
            //value={info?.label + 'h' || 'value'}
            label="Nombre campo"
            name="label"
            rules={[{ required: true }]}
          >
            <Input name="label" type="text" placeholder="Ej: Celular" onChange={this.handleChange} />
          </Form.Item>
          <Form.Item name="name" initialValue={this.props.info?.name}>
            <Input
              type="text"
              placeholder="Nombre del campo en base de datos"
              disabled
              //onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item
            initialValue={info?.type}
            label="Tipo de dato"
            name="type"
            rules={[{ required: true, message: 'Seleccione un tipo de dato válido' }]}
          >
            <Select
              options={dynamicFieldOptions}
              disabled={info.name === 'picture' || info.name == 'email' || info.name == 'names' ? true : false}
              onChange={(value) => this.handleChange({ target: { name: 'type', value: value } })}></Select>
          </Form.Item>

          {/* Mark this field as dependent */}
          <Form.Item name="isDependent">
            <Checkbox
              name="isDependent"
              checked={(isDependent || info?.dependency?.fieldName)}
              onChange={this.changeFieldAsDependent}
            >
              Marca este campo como dependiente de otro campo
            </Checkbox>
          </Form.Item>

          {(isDependent || info?.dependency?.fieldName) && (
            <>
            <Form.Item name="fieldName">
              <Input
                value={info.dependency?.fieldName}
                onChange={(e) => {
                  const value = e.target.value
                  this.setState((previous) => {
                    const newState = { ...previous }
                    newState.info = newState.info || {}
                    newState.info.dependency = newState.info.dependency || {}
                    newState.info.dependency.fieldName = value
                    return newState
                  })
                }}
                placeholder="Escribe el nombre, en base de datos, exacto del otro campo"
              />
            </Form.Item>
            <Form.Item name="triggerValues" label="Valores exactos">
              <CreatableSelect
                components={{ DropdownIndicator: null }}
                inputValue={inputValueDependency}
                isClearable
                isMulti
                onChange={this.changeDependencies}
                onInputChange={this.handleInputChangeDependency}
                onKeyDown={(e) => this.handleKeyDownDependent(e)}
                placeholder="Escribe la opción y presiona Enter o Tab..."
                defaultValue={(info?.dependency?.triggerValues ?? []).map(createOption)}
                value={(info?.dependency?.triggerValues ?? []).map(createOption)}
                required
              />
            </Form.Item>
            <Divider />
            </>
          )}

          {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
            <Form.Item name="options" label="Optiones">
              <CreatableSelect
                components={{ DropdownIndicator: null }}
                inputValue={inputValue}
                isClearable
                isMulti
                onChange={this.changeOption}
                onInputChange={this.handleInputChange}
                onKeyDown={(e) => this.handleKeyDown(e)}
                placeholder="Escribe la opción y presiona Enter o Tab...x"
                defaultValue={info?.options}
                required
              />
            </Form.Item>
          )}

          {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
            <Form.Item name="justonebyattendee">
              <Checkbox
                name="justonebyattendee"
                checked={info.justonebyattendee}
                onChange={this.changeFieldjustonebyattendee}
              >
                Solo una opción por usuario (cuando un asistente selecciona una opción esta desaparece del listado)
              </Checkbox>
              <Divider />
            </Form.Item>
          )}

          {(info.type === 'TTCC') && (
            <Form.Item name="link" label="Enlace para los términos y condiciones">
            <Input
              value={info.link}
              onChange={(e) => {
                const value = e.target.value
                this.setState((previous) => {
                  const newState = { ...previous }
                  newState.info = newState.info || {}
                  newState.info.link = value
                  return newState
                })
              }}
              placeholder="Enlace (esto depende el tipo de campo)"
            />
            <Divider />
          </Form.Item>
          )}

          <Form.Item
            label="Obligatorio"
            initialValue={info.mandatory || false}
            htmlFor="mandatoryModal"
            name="mandatory">
            <Checkbox
              id="mandatoryModal"
              //name="mandatory"
              checked={info.mandatory}
              onChange={this.changeFieldCheck}
            />
          </Form.Item>
          <Form.Item label="Visible para Contactos" htmlFor="visibleByContactsModal" name="visibleByContacts">
            <Checkbox
              id="visibleByContactsModal"
              name="visibleByContacts"
              checked={info?.visibleByContacts}
              onChange={this.changeFieldCheckVisibleByContacts}
            />
          </Form.Item>
          <Form.Item label="Visible para Admin" htmlFor="visibleByAdminModal" name="visibleByAdmin">
            <Checkbox
              id="visibleByAdminModal"
              name="visibleByAdmin"
              checked={info.visibleByAdmin}
              onChange={this.changeFieldCheckVisibleByAdmin}
            />
          </Form.Item>
          <Form.Item label="Descripción" name="description">
            <TextArea
              placeholder="Descripción corta"
              name="description"
              value={info.description || ''}
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item label="Posición / Orden" name="order_weight">
            <InputNumber
              min={0}
              name="order_weight"
              placeholder="1"
              value={info.order_weight}
              onChange={(value) => this.handleChange({ target: { name: 'order_weight', value: value } })}
            />
          </Form.Item>
          <Form.Item>
            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                htmlType="submit"
                id="btnSave"
                disabled={loading}
                loading={loading}
              >
                Guardar
              </Button>

              <Button onClick={() => this.props.cancel()} type="default" tmlType="button">
                Cancelar
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
