import { Component } from 'react'
import ErrorServe from '../modal/serverError'
import {
  Row,
  Col,
  Button,
  Card,
  Typography,
  Form,
  Input,
  Modal,
  Space,
  Badge,
  Checkbox,
} from 'antd'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headers: [],
      loading: true,
      list: [],
      errorData: {},
      serverError: false,
      auxArr: [],
      showModal: false,
      password: null,
      genericPassword: false,
      showMessage: false,
      notifyToUsers: true,
    }
  }

  componentDidMount() {
    const llaves = [],
      headers = []
    const { list, extraFields } = this.props

    //Promesa para recorrer las propiedades del curso/organizaciòn para crear el header de las listas
    const results = extraFields.map(async (item) => {
      return headers.push({ ...item, tag: item.name, used: false })
    })
    Promise.all(results).then(() => {
      //Se crea el arreglo de llaves para comparar con el header
      list.map((list) => {
        return llaves.push(list.key)
      })

      this.setState({ headers })
      this.renderHead(llaves, list, extraFields)
    })
  }

  savePassword = (value) => {
    this.setState({ password: value.password, showModal: false })
  }

  content = () => {
    return (
      <Form onFinish={this.savePassword} preserve={false} layout="vertical">
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: true,
              message: '¡Por favor ingresa la contraseña!',
            },
            {
              type: 'string',
              min: 6,
              max: 18,
              message: 'La contraseña debe tener entre 6 a 18 caracteres',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmar contraseña"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '¡Por favor confirma la contraseña!',
            },
            {
              type: 'string',
              min: 6,
              max: 18,
              message: 'La contraseña debe tener entre 6 a 18 caracteres',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('¡Las constraseñas no coinciden!'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button
              onClick={() => {
                Modal.destroyAll()
                this.setState({ showModal: false, showMessage: true })
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                Modal.destroyAll()
                this.setState({ showMessage: false })
              }}
            >
              Continuar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  //Funcion para manejar las propiedades
  //Se parsea si las propiedaeds existen(verde) en el excel o no(rojo)
  renderHead = (llaves, list) => {
    const a = llaves
    const b = this.state.headers //campos de evius
    const addPassword = a.filter((x) => x === 'password')
    if (addPassword) {
      b.push({
        created_at: new Date(),
        label: 'Password',
        mandatory: false,
        name: 'password',
        tag: 'password',
        type: 'password',
        unique: true,
        updated_at: new Date(),
        used: false,
      })
    }

    //Se compara los headers con las llaves para realizar la validaciòn de campos
    const comparer = (otherArray) => {
      return (current) => {
        return (
          otherArray.filter((other) => {
            if (other === current.tag) {
              current.used = true
              return true
            } else {
              return false
            }
          }).length === 0 && current.mandatory
        )
      }
    }

    const onlyInB = b.filter(comparer(a))

    this.setState({ auxArr: onlyInB })

    list.map((item) => {
      return (item.used = this.headExist(item.key))
    })
    const auxList = JSON.parse(JSON.stringify(list)) //create a copy of list
    this.setState({ list, loading: false, auxList })
  }

  //Pinta rojo/verde en la cabecera
  headExist = (key) => {
    const j = this.state.headers
      .map((e) => {
        return e.tag
      })
      .indexOf(key)
    return j !== -1 ? this.state.headers[j].used : false
  }

  sChange = (item, key) => {
    const auxHead = this.state.auxArr
    const { headers, list } = this.state
    const i = auxHead
      .map((e) => {
        return e.tag
      })
      .indexOf(item.tag)
    const j = headers
      .map((e) => {
        return e.tag
      })
      .indexOf(item.tag)
    headers[j].used = true
    const listCopy = JSON.parse(JSON.stringify(list))
    listCopy[key].used = true
    listCopy[key].key = item.tag
    auxHead.splice(i, 1)
    this.setState({ auxArr: auxHead, headers, list: listCopy })
    this.headExist(key)
  }

  /*async addField(item, key) {
        
        try {
            const { list } = this.state;
            let resp = await Actions.post(`/api/user/events/${this.props.eventId}/addUserProperty`,{name:item.key});
            
            if(resp){
                list[key].used = true;
                this.setState({ list });
            }
        }catch (e) {
            
            this.setState({timeout: true});
        }
    };

    revertField = (item, position) => {
        const auxHead = this.state.auxArr;
        const list = JSON.parse(JSON.stringify(this.state.list));
        const head = [...this.state.headers];
        const j = head.map(e=>{ return e.tag; }).indexOf(item.key);
        head[j].used = false;
        list[position].used = false;
        list[position].key = this.state.auxList[position].key;
        auxHead.push({tag:item.key,used:false});
        this.setState({auxArr:auxHead,head,list});
    };*/

  render() {
    const { list, auxArr, serverError, errorData } = this.state
    const self = this
    return (
      <>
        <Row justify="center" gutter={[24, 24]}>
          <Col span={10}>
            <Badge.Ribbon
              text="Seleccionado"
              color={'#2593FC'}
              style={this.state.genericPassword ? { display: 'none' } : {}}
            >
              <div
                style={
                  this.state.genericPassword === false
                    ? {
                        borderColor: '#2593FC',
                        borderStyle: 'solid',
                        borderWidth: '4px',
                        borderRadius: '6px',
                      }
                    : {}
                }
              >
                <Card
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    this.setState({ genericPassword: false, password: null })
                  }
                >
                  <Typography.Text strong style={{ textAlign: 'justify' }}>
                    Deseo que la plataforma genere una contraseña para mis asistentes.
                  </Typography.Text>
                  <br />
                  <br />
                  <Typography.Paragraph style={{ textAlign: 'justify' }}>
                    El proceso de importación de usuario continuará de forma normal, debe
                    tomar en cuenta que la contraseña asignada por defecto será notificada
                    por el administrador, en su defecto un correo electrónico confirmando
                    la misma, esta contraseña por defecto aplica "sólo" para los nuevos
                    usuarios, los usuarios antiguos continuarán con su actual contraseña.
                  </Typography.Paragraph>
                </Card>
              </div>
            </Badge.Ribbon>
          </Col>
          <Col span={10}>
            <Badge.Ribbon
              text="Seleccionado"
              color={'#2593FC'}
              style={!this.state.genericPassword ? { display: 'none' } : {}}
            >
              <div
                style={
                  this.state.genericPassword
                    ? {
                        borderColor: '#2593FC',
                        borderStyle: 'solid',
                        borderWidth: '4px',
                        borderRadius: '6px',
                      }
                    : {}
                }
              >
                <Card
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    this.setState({ genericPassword: true, showModal: true })
                  }
                >
                  <Typography.Text strong style={{ textAlign: 'justify' }}>
                    Deseo específicar una contraseña para mis asistentes
                  </Typography.Text>
                  <br />
                  <br />
                  <Typography.Paragraph style={{ textAlign: 'justify' }}>
                    En este proceso aparecerá un modal confirmando la contraseña que desee
                    aplicar para los usuarios a importar, éste procedimiento aplicará
                    "sólo" a usuarios nuevos dentro de la plataforma, en caso de ya tener
                    una cuenta existente, dicha cuenta continuará con su actual
                    contraseña.
                    <br />
                    {this.state.genericPassword &&
                      (this.state.password === '' || this.state.password === null) &&
                      this.state.showMessage && (
                        <Typography.Text type="secondary">
                          No tienes una contraseña asignada para tus asistentes, si deseas
                          asignarla <strong>haz clic aquí</strong>
                        </Typography.Text>
                      )}
                    {this.state.genericPassword &&
                      this.state.password &&
                      !this.state.showMessage && (
                        <Typography.Text type="secondary">
                          Tienes una contraseña asignada para tus asistentes, si deseas
                          cambiarla <strong>haz clic aquí</strong>, ten en cuenta que por
                          seguridad mostrará los campos vacíos.
                        </Typography.Text>
                      )}
                  </Typography.Paragraph>
                </Card>
              </div>
            </Badge.Ribbon>
          </Col>
        </Row>
        <br />
        <br />
        <Checkbox
          defaultChecked={this.state.notifyToUsers}
          onChange={() => {
            this.state.notifyToUsers = !this.state.notifyToUsers
            console.log('this.state.notifyToUsers', this.state.notifyToUsers)
          }}
        >
          Deseo notificar por correo a los usuarios
        </Checkbox>
        <br />
        <br />
        <Button
          type="primary"
          icon={<UploadOutlined />}
          disabled={
            this.state.genericPassword &&
            (this.state.password === '' || this.state.password === null)
          }
          onClick={() => {
            this.props.importUsers(list, this.state.password, this.state.notifyToUsers)
          }}
        >
          Finalizar
        </Button>

        <Modal
          title="Por favor ingrese la contraseña para los asistentes"
          icon={<ExclamationCircleOutlined />}
          footer={null}
          destroyOnClose
          closable={false}
          visible={this.state.showModal}
        >
          {this.content()}
        </Modal>

        {serverError && <ErrorServe errorData={errorData} />}
      </>
    )
  }
}

export default Preview
