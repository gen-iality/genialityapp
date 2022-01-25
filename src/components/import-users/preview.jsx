import React, { Component } from 'react';
import ErrorServe from '../modal/serverError';
import LogOut from '../shared/logOut';
import { Row, Col, Button, Dropdown, Menu, message, Divider } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      loading: true,
      list: [],
      errorData: {},
      serverError: false,
      auxArr: [],
    };
  }

  componentDidMount() {
    let llaves = [],
      headers = [];
    const { list, extraFields } = this.props;

    //Promesa para recorrer las propiedades del evento/organizaciòn para crear el header de las listas
    const results = extraFields.map(async (item) => {
      return headers.push({ ...item, tag: item.name, used: false });
    });
    Promise.all(results).then(() => {
      //Se crea el arreglo de llaves para comparar con el header
      list.map((list) => {
        return llaves.push(list.key);
      });

      this.setState({ headers });
      this.renderHead(llaves, list, extraFields);
    });
  }

  //Funcion para manejar las propiedades
  //Se parsea si las propiedaeds existen(verde) en el excel o no(rojo)
  renderHead = (llaves, list) => {
    const a = llaves;
    const b = this.state.headers; //campos de evius

    //Se compara los headers con las llaves para realizar la validaciòn de campos
    const comparer = (otherArray) => {
      return (current) => {
        return (
          otherArray.filter((other) => {
            if (other === current.tag) {
              current.used = true;

              return true;
            } else {
              return false;
            }
          }).length === 0 && current.mandatory
        );
      };
    };

    const onlyInB = b.filter(comparer(a));

    this.setState({ auxArr: onlyInB });

    list.map((item) => {
      return (item.used = this.headExist(item.key));
    });
    let auxList = JSON.parse(JSON.stringify(list)); //create a copy of list

    this.setState({ list, loading: false, auxList });
  };

  //Pinta rojo/verde en la cabecera
  headExist = (key) => {
    const j = this.state.headers
      .map((e) => {
        return e.tag;
      })
      .indexOf(key);
    return j !== -1 ? this.state.headers[j].used : false;
  };

  sChange = (item, key) => {
    const auxHead = this.state.auxArr;
    const { headers, list } = this.state;
    const i = auxHead
      .map((e) => {
        return e.tag;
      })
      .indexOf(item.tag);
    const j = headers
      .map((e) => {
        return e.tag;
      })
      .indexOf(item.tag);
    headers[j].used = true;
    let listCopy = JSON.parse(JSON.stringify(list));
    listCopy[key].used = true;
    listCopy[key].key = item.tag;
    auxHead.splice(i, 1);
    this.setState({ auxArr: auxHead, headers, list: listCopy });
    this.headExist(key);
  };

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
    const { list, auxArr, timeout, serverError, errorData } = this.state;
    const self = this;
    return (
      <React.Fragment>
        <Button 
          type='primary' 
          icon={<UploadOutlined />} 
          disabled={auxArr.length > 0}
          onClick={() => {
            this.props.importUsers(list);
          }}
        >
          Importar
        </Button>
        <br /><br />
        {
          this.state.loading ? (
            <Row justify='center'>Parsing excel</Row>
        ) : (
          <Row wrap gutter={[16, 16]} >
            <Col span={14} >
              <Row wrap gutter={[16, 16]}>
                {list.map((item, index) => {
                  return (
                    <Col key={index}>
                      <div style={{border: '1px solid gray', borderRadius: '3px', padding: '5px'/* , boxShadow: '5px 5px 5px gray' */}}>
                        <div style={{textAlign: 'center'}}>
                          {!item.used && auxArr.length > 0 && (
                            <ReloadOutlined />
                          )}
                          <span
                            className={`${
                              item.used
                                ? 'has-text-success'
                                : `${auxArr.length > 0 ? 'has-text-danger' : 'has-text-warning'}`
                            }`}
                            style={{fontSize: '16px'}}
                          >
                            Campo "{item.key}"
                          </span>
                          {/* <Divider style={{margin: '0 !important'}} /> */}
                          {!item.used && auxArr.length > 0 && (
                            <Dropdown overlay={(
                              <Menu>
                                {auxArr.map((head, llave) => {
                                  return (
                                    <Menu.Item>
                                      <a
                                        key={llave}
                                        onClick={() => {
                                          self.sChange(head, index);
                                        }}>
                                        {head.tag}
                                      </a>
                                    </Menu.Item>
                                  );
                                })}
                              </Menu>
                            )} placement="bottomCenter">
                              <Button type='text' icon={<DownOutlined />} />
                            </Dropdown>
                          )}
                        </div>
                        <div>
                          {item.list.slice(0, 2).map((item, j) => {
                            return <p key={j}>{item}</p>;
                          })}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col span={10}>
              {auxArr.length > 0 && (
                <p className='has-text-grey-light'>
                  <ExclamationCircleOutlined className='has-text-danger'/>
                  <span>Los siguientes campos <strong className='has-text-danger'>Obligatorios</strong> no se han definido:{' '}</span>
                  
                  <p>
                    {auxArr.map((item) => {
                      return <strong key={item.tag}>{item.tag} </strong>;
                    })}
                  </p>
                </p>
              )}
              {auxArr.length < 0 && (
                <p className='has-text-grey-light'>
                  <ExclamationCircleOutlined className='has-text-danger'/>
                  <span>Tienes algunos campos <strong className='has-text-warning'>Opcionales</strong> sin definir.</span>
                </p>
              )}
            </Col>
          </Row>
        )}
        
        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
      </React.Fragment>
    );
  }
}

export default Preview;
