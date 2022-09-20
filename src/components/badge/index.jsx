import QRCode from 'qrcode.react';
import { BadgeApi } from '../../helpers/request';
import Header from '@/antdComponents/Header';
import { Form, Row, Col, Button, Space, Modal, Select, Typography, message, Table } from 'antd';
import { useState, useEffect, useRef } from 'react';
const { Option } = Select;
const { Text, Link } = Typography;
import { MinusCircleOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';
export default function Index(props) {
  const { event } = props;
  const ifrmPrint = useRef();
  const [badge, setBadge] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  console.log('🚀 ~ file: index.jsx ~ line 9 ~ Index ~ badge', badge);
  const [qrExist, setQrExist] = useState(false);
  const [extraFields, setExtraFields] = useState([]);
  console.log('🚀 ~ file: index.jsx ~ line 13 ~ Index ~ extraFields', extraFields);
  const [newField, setNewField] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const fontSize = [18, 22, 36, 44];
  const qrSize = [32, 64, 128];
  const [form] = Form.useForm();
  const getIValuesInitial = async () => {
    if (event) {
      const properties = event.user_properties;
      console.log('🚀 ~ file: index.jsx ~ line 22 ~ getIValuesInitial ~ properties', properties);
      const resp = await BadgeApi.get(event._id);
      //Manejo adecuado de campos, no se neceista toda la información
      properties.map((prop) => {
        return setExtraFields([...extraFields, { value: prop.name, label: prop.label }]);
      });
      //Si hay escarapela se muestra el preview y se setean los datos
      if (resp._id) {
        let badgeFilter = resp.BadgeFields.filter((i) => i.qr || (!i.qr && i.id_properties));
        setBadge(badgeFilter);
        setShowPrev(true);
      }
    }
  };

  useEffect(() => {
    getIValuesInitial();
  }, []);

  const renderPrint = () => {
    let items = [];
    let i = 0;
    //Se itera sobre cada campo
    for (; i < badge.length; ) {
      let item;
      //Si el campo es line ocupa una fila completa
      if (badge[i].line) {
        //Si es QR muestro un QR de ejemplo, sino muestro el nombre del campo
        item = badge[i].qr ? (
          <QRCode value={'alejomg27@gmail.com'} size={64} />
        ) : (
          <div>
            <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
          </div>
        );
        items.push(item);
        i++;
      } else {
        //Sino es line, ocupa la mitad de una columna siempre y cuando el campo siguiente tampoco sea line
        if (badge[i + 1] && !badge[i + 1].line) {
          item = (
            <div style={{ display: 'flex' }}>
              {!badge[i].qr ? (
                <div style={{ marginRight: '20px' }}>
                  <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
                </div>
              ) : (
                <div style={{ marginRight: '20px' }}>
                  <QRCode value={'evius.co'} size={badge[i].size} />
                </div>
              )}
              {!badge[i + 1].qr ? (
                <div style={{ marginRight: '20px' }}>
                  <p style={{ fontSize: `${badge[i + 1].size}px` }}>{badge[i + 1].id_properties.label}</p>
                </div>
              ) : (
                <div>
                  <QRCode value={'evius.co'} size={badge[i + 1].size} />
                </div>
              )}
            </div>
          );
          items.push(item);
          i = i + 2;
        } else {
          item = (
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: '20px' }}>
                {!badge[i].qr ? (
                  <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
                ) : (
                  <QRCode value={'evius.co'} size={badge[i].size} />
                )}
              </div>
            </div>
          );
          items.push(item);
          i++;
        }
      }
    }
    return items.map((item, key) => {
      return <React.Fragment key={key}>{item}</React.Fragment>;
    });
  };
  const addQR = () => {
    setBadge([...badge, { edit: true, line: true, qr: true }]);
    setQrExist(true);
    setNewField(true);
  };
  const printPreview = () => {
    //Para el preview se crea un iframe con el contenido, se usa la misma logica de iteración que renderPrint
    const canvas = document.getElementsByTagName('CANVAS')[0];
    let qr = canvas ? canvas.toDataURL() : '';
    let oIframe = ifrmPrint.current;

    let oDoc = oIframe.contentWindow || oIframe.contentDocument;

    if (oDoc.document) {
      oDoc = oDoc.document;
    }
    // Head
    oDoc.write('<head><title>Escarapela</title>');
    // body, se ejcuta la función de imprimir
    oDoc.write('<body onload="window.print()"><div>');
    // Datos
    let i = 0;
    for (; i < badge.length; ) {
      if (badge[i].line) {
        if (badge[i].qr) oDoc.write(`<div><img src=${qr}></div>`);
        else
          oDoc.write(
            `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${badge[i].id_properties.value}</p>`
          );
        i++;
      } else {
        if (badge[i + 1] && !badge[i + 1].line) {
          oDoc.write(`<div style="display: flex">`);
          if (!badge[i].qr) {
            oDoc.write(`<div style="margin-right: 20px">`);
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${
                badge[i + 1].name
              }</p>`
            );
            oDoc.write(`</div>`);
          } else {
            oDoc.write(`<div style="margin-right: 20px">`);
            oDoc.write(`<div><img src=${qr}></div>`);
            oDoc.write(`</div>`);
          }
          if (!badge[i + 1].qr) {
            oDoc.write(`<div style="margin-right: 20px">`);
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${badge[i + 1].size}px;text-transform: uppercase">${
                badge[i + 1].name
              }</p>`
            );
            oDoc.write(`</div>`);
          } else {
            oDoc.write(`<div style="margin-right: 20px">`);
            oDoc.write(`<div><img src=${qr}></div>`);
            oDoc.write(`</div>`);
          }
          oDoc.write(`</div>`);
          i = i + 2;
        } else {
          oDoc.write(`<div style="display: flex">`);
          oDoc.write(`<div style="margin-right: 20px">`);
          if (!badge[i].qr) {
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${badge[i].name}]}</p>`
            );
          } else {
            oDoc.write(`<div><img src=${qr}></div>`);
          }
          oDoc.write(`</div>`);
          oDoc.write(`</div>`);
          i++;
        }
      }
    }
    oDoc.close();
  };
  const saveBadge = async (values) => {
    console.log('🚀 ~ file: index.jsx ~ line 189 ~ saveBadge ~ values', values);

    // if (event) {
    //   const data = {
    //     fields_id: event._id,
    //     BadgeFields: [],
    //   };
    //   badge.map((item) => {
    //     return data.BadgeFields.push(item);
    //   });

    //   try {
    //     const resp = await BadgeApi.create(data);

    //     if (resp._id) {
    //       message.success('Badge Guardada');
    //     } else {
    //       message.warning('Ocurrio algo');
    //     }
    //   } catch (err) {
    //     console.log(err.response);
    //     message.error('Error al guardar', err.response);
    //   }
    // }
  };
  const addField = () => {
    badge.push({ edit: true, id_properties: '', size: 18 });
  };
  const removeField = (field) => {
    console.log('🚀 ~ file: index.jsx ~ line 223 ~ removeField ~ key', field);
    //if (badge[key].qr) setQrExist(true);
    setExtraFields([...extraFields, field.id_properties]);
    let badgeFilter = badge.filter((item) => item.id_properties != field.id_properties);
    setBadge(badgeFilter);
  };

  const columns = [
    {
      title: 'Propiedad',
      dataIndex: 'id_properties',
      key: 'id_properties',
      render: (_, record) => <Text>{record.id_properties.label}</Text>,
    },
    {
      title: 'Tamaño',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: <Button onClick={() => setIsVisible(!isVisible)} icon={<PlusOutlined />} />,

      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button icon={<EditOutlined />}>Editar</Button>
          <Button onClick={() => removeField(_)} icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Header
        title={'Configuración de escarapelas'}
        description={
          ' Acontinuación podrás crear la escarapela para tu evento. Agrega los Campos o QR, edita el tamaño de letra de los campos o del QR'
        }
      />

      <Row justify='center' wrap gutter={[8, 8]}>
        <Col span={12}>
          <Space style={{ marginBottom: 8 }}>
            <Button type='primary' onClick={addField} block>
              Guardar
            </Button>

            {!qrExist && <Button onClick={addQR}>Agregar QR</Button>}
            <Button type='primary' onClick={printPreview}>
              Imprimir
            </Button>
          </Space>
          <Table columns={columns} dataSource={badge} />
        </Col>

        <Col span={12}>
          <div
            style={{
              marginTop: '1rem',
              border: '1px solid rgb(211, 211, 211)',
              borderRadius: '5px',
              padding: '10px',
            }}>
            {renderPrint()}
          </div>
        </Col>
      </Row>
      <Modal title='Agregar parametro' visible={isVisible} onOk={addField}>
        <Form>
          <Form.Item label='Campo' name='id_properties'>
            <Select placeholder='Selecciona un campo'>
              {extraFields.map((option, index) => (
                <Option key={index + option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Tamaño' name='size'>
            <Select placeholder='Selecciona un tamaño'>
              {fontSize.map((size, index) => (
                <Option key={index} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <iframe title={'Print User'} ref={ifrmPrint} style={{ opacity: 0, display: 'none' }} />
    </>
  );
}

// import { Component } from 'react';
// import QRCode from 'qrcode.react';
// import { BadgeApi } from '../../helpers/request';

// import { FormattedMessage } from 'react-intl';

// class Badge extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       badge: [],
//       qrExist: false,
//       extraFields: [],
//       fontSize: [18, 22, 36, 44],
//       qrSize: [32, 64, 128],
//       newField: false,
//     };
//     this.saveBadge = this.saveBadge.bind(this);
//   }

//   async componentDidMount() {
//     const { event } = this.props;
//     const properties = event.user_properties;
//     const resp = await BadgeApi.get(event._id);
//     let { extraFields, badge, showPrev } = this.state;
//     //Manejo adecuado de campos, no se neceista toda la información
//     properties.map((prop) => {
//       return extraFields.push({ value: prop.name, label: prop.name });
//     });
//     //Si hay escarapela se muestra el preview y se setean los datos
//     if (resp._id) {
//       badge = resp.BadgeFields.filter((i) => i.qr || (!i.qr && i.id_properties));
//       showPrev = true;
//     }
//     this.setState({ extraFields, badge, showPrev });
//   }

//   //FN para agregar campo a la escarapela
//   addField = () => {
//     const { badge } = this.state;
//     badge.push({ edit: true, line: true, id_properties: '', size: 18 });
//     this.setState({ badge, newField: true });
//   };

//   //FN para agregar QR a la escarapela
//   addQR = () => {
//     const { badge } = this.state;
//     badge.push({ edit: true, line: true, qr: true });
//     this.setState({ badge, qrExist: true, newField: true, size: '64' });
//   };

//   //FN manejo en el cambio de las opciones (tamaño)
//   handleChange = (e, key) => {
//     const { value, name } = e.target;
//     const { badge, extraFields } = this.state;
//     let field = value;
//     if (name === 'id_properties') {
//       const pos = extraFields
//         .map((field) => {
//           return field.value;
//         })
//         .indexOf(value);
//       field = extraFields[pos];
//     } else {
//       field = parseInt(field, 10);
//     }
//     badge[key][name] = field;
//     this.setState({ badge });
//   };

//   //FN manejo en el cambio de la posición del campo
//   toggleSwitch = (key) => {
//     const { badge } = this.state;
//     badge[key].line = !badge[key].line;
//     this.setState({ badge });
//   };

//   //FNs para guardar, editar y eliminar un campo
//   saveField = (key) => {
//     const { badge, extraFields } = this.state;
//     if (badge[key].id_properties) {
//       const pos = extraFields
//         .map((field) => {
//           return field.value;
//         })
//         .indexOf(badge[key].id_properties.value);
//       extraFields.splice(pos, 1);
//     }
//     badge[key].edit = !badge[key].edit;
//     this.setState({ badge, extraFields, newField: false, showPrev: true });
//   };

//   editField = (key) => {
//     const { badge } = this.state;
//     badge[key].edit = !badge[key].edit;
//     this.setState({ badge, newField: true });
//   };

//   removeField = (key) => {
//     const { badge, extraFields } = this.state;
//     if (badge[key].qr) this.setState({ qrExist: false });
//     extraFields.push(badge[key].id_properties);
//     badge.splice(key, 1);
//     this.setState({ badge, extraFields });
//   };

//   //FN para realizar el preview
//   renderPrint = () => {
//     const badge = [...this.state.badge];
//     let items = [];
//     let i = 0;
//     //Se itera sobre cada campo
//     for (; i < badge.length; ) {
//       let item;
//       //Si el campo es line ocupa una fila completa
//       if (badge[i].line) {
//         //Si es QR muestro un QR de ejemplo, sino muestro el nombre del campo
//         item = badge[i].qr ? (
//           <QRCode value={'alejomg27@gmail.com'} size={64} />
//         ) : (
//           <div>
//             <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
//           </div>
//         );
//         items.push(item);
//         i++;
//       } else {
//         //Sino es line, ocupa la mitad de una columna siempre y cuando el campo siguiente tampoco sea line
//         if (badge[i + 1] && !badge[i + 1].line) {
//           item = (
//             <div style={{ display: 'flex' }}>
//               {!badge[i].qr ? (
//                 <div style={{ marginRight: '20px' }}>
//                   <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
//                 </div>
//               ) : (
//                 <div style={{ marginRight: '20px' }}>
//                   <QRCode value={'evius.co'} size={badge[i].size} />
//                 </div>
//               )}
//               {!badge[i + 1].qr ? (
//                 <div style={{ marginRight: '20px' }}>
//                   <p style={{ fontSize: `${badge[i + 1].size}px` }}>{badge[i + 1].id_properties.label}</p>
//                 </div>
//               ) : (
//                 <div>
//                   <QRCode value={'evius.co'} size={badge[i + 1].size} />
//                 </div>
//               )}
//             </div>
//           );
//           items.push(item);
//           i = i + 2;
//         } else {
//           item = (
//             <div style={{ display: 'flex' }}>
//               <div style={{ marginRight: '20px' }}>
//                 {!badge[i].qr ? (
//                   <p style={{ fontSize: `${badge[i].size}px` }}>{badge[i].id_properties.label}</p>
//                 ) : (
//                   <QRCode value={'evius.co'} size={badge[i].size} />
//                 )}
//               </div>
//             </div>
//           );
//           items.push(item);
//           i++;
//         }
//       }
//     }
//     return items.map((item, key) => {
//       return <React.Fragment key={key}>{item}</React.Fragment>;
//     });
//   };

//   async saveBadge() {
//     const { event } = this.props;
//     const { badge } = this.state;
//     const data = {
//       fields_id: event._id,
//       BadgeFields: [],
//     };
//     badge.map((item) => {
//       return data.BadgeFields.push(item);
//     });
//     console.log(data);
//     try {
//       const resp = await BadgeApi.create(data);
//       console.log(resp);
//       if (resp._id) {
//         // toast.success('Badge Guardada');
//       } else {
//         //  toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Sry :(' />);
//       }
//     } catch (err) {
//       console.log(err.response);
//       //  toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
//     }
//   }

//   //FN para imprimir el preview
//   printPreview = () => {
//     //Para el preview se crea un iframe con el contenido, se usa la misma logica de iteración que renderPrint
//     const canvas = document.getElementsByTagName('CANVAS')[0];
//     const { badge } = this.state;
//     let qr = canvas ? canvas.toDataURL() : '';
//     let oIframe = this.refs.ifrmPrint;
//     let oDoc = oIframe.contentWindow || oIframe.contentDocument;
//     if (oDoc.document) {
//       oDoc = oDoc.document;
//     }
//     // Head
//     oDoc.write('<head><title>Escarapela</title>');
//     // body, se ejcuta la función de imprimir
//     oDoc.write('<body onload="window.print()"><div>');
//     // Datos
//     let i = 0;
//     for (; i < badge.length; ) {
//       if (badge[i].line) {
//         if (badge[i].qr) oDoc.write(`<div><img src=${qr}></div>`);
//         else
//           oDoc.write(
//             `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${badge[i].id_properties.value}</p>`
//           );
//         i++;
//       } else {
//         if (badge[i + 1] && !badge[i + 1].line) {
//           oDoc.write(`<div style="display: flex">`);
//           if (!badge[i].qr) {
//             oDoc.write(`<div style="margin-right: 20px">`);
//             oDoc.write(
//               `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${
//                 badge[i + 1].name
//               }</p>`
//             );
//             oDoc.write(`</div>`);
//           } else {
//             oDoc.write(`<div style="margin-right: 20px">`);
//             oDoc.write(`<div><img src=${qr}></div>`);
//             oDoc.write(`</div>`);
//           }
//           if (!badge[i + 1].qr) {
//             oDoc.write(`<div style="margin-right: 20px">`);
//             oDoc.write(
//               `<p style="font-family: Lato, sans-serif;font-size: ${badge[i + 1].size}px;text-transform: uppercase">${
//                 badge[i + 1].name
//               }</p>`
//             );
//             oDoc.write(`</div>`);
//           } else {
//             oDoc.write(`<div style="margin-right: 20px">`);
//             oDoc.write(`<div><img src=${qr}></div>`);
//             oDoc.write(`</div>`);
//           }
//           oDoc.write(`</div>`);
//           i = i + 2;
//         } else {
//           oDoc.write(`<div style="display: flex">`);
//           oDoc.write(`<div style="margin-right: 20px">`);
//           if (!badge[i].qr) {
//             oDoc.write(
//               `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${badge[i].name}]}</p>`
//             );
//           } else {
//             oDoc.write(`<div><img src=${qr}></div>`);
//           }
//           oDoc.write(`</div>`);
//           oDoc.write(`</div>`);
//           i++;
//         }
//       }
//     }
//     oDoc.close();
//   };

//   render() {
//     const { badge, qrExist, extraFields, newField, showPrev, fontSize, qrSize } = this.state;
//     return (
//       <React.Fragment>
//         <p>
//           Acontinuación podrás crear la escarapela para tu evento. Agrega los Campos o QR, edita el tamaño de letra de
//           los campos o del QR
//         </p>
//         <p>Visualiza el resultado e imprime para realizar una prueba!! </p>
//         <div className='columns'>
//           <div className='column is-4'>
//             <div className='field is-grouped'>
//               <label className='label'>Agregar:</label>
//               <p className='control'>
//                 <button className='button' onClick={this.addField} disabled={newField}>
//                   Campo
//                 </button>
//               </p>
//               {!qrExist && (
//                 <p className='control'>
//                   <button className='button' onClick={this.addQR} disabled={newField}>
//                     QR
//                   </button>
//                 </p>
//               )}
//             </div>
//             {badge.map((item, key) => {
//               return (
//                 <article key={key} className='media'>
//                   {item.edit ? (
//                     <div className='media-content'>
//                       {!item.qr ? (
//                         <React.Fragment>
//                           <div className='field'>
//                             <label className='label'>Campo</label>
//                             <div className='control'>
//                               <div className='select'>
//                                 <select
//                                   onChange={(e) => {
//                                     this.handleChange(e, key);
//                                   }}
//                                   name={'id_properties'}
//                                   value={item.id_properties.value}>
//                                   <option value={''}>Seleccione...</option>
//                                   {extraFields.map((field, key) => {
//                                     return (
//                                       <option value={field.value} key={key} className='is-capitalized'>
//                                         {field.label}
//                                       </option>
//                                     );
//                                   })}
//                                 </select>
//                               </div>
//                             </div>
//                           </div>
//                           <div className='field'>
//                             <label className='label'>Tamaño</label>
//                             <div className='control'>
//                               <div className='select'>
//                                 <select
//                                   onChange={(e) => {
//                                     this.handleChange(e, key);
//                                   }}
//                                   name={'size'}
//                                   value={item.size}>
//                                   <option value={''}>Seleccione...</option>
//                                   {fontSize.map((field, key) => {
//                                     return (
//                                       <option value={field} key={key}>
//                                         {field}
//                                       </option>
//                                     );
//                                   })}
//                                 </select>
//                               </div>
//                             </div>
//                           </div>
//                           <div className='field'>
//                             <input
//                               id={`switch_${key}`}
//                               type='checkbox'
//                               name={`switch_${key}`}
//                               className='switch'
//                               checked={item.line}
//                               onChange={(e) => {
//                                 this.toggleSwitch(key);
//                               }}
//                             />
//                             <label htmlFor={`switch_${key}`}>Line</label>
//                           </div>
//                         </React.Fragment>
//                       ) : (
//                         <div className='content'>
//                           <p>
//                             <strong>QR</strong>
//                           </p>
//                           <div className='field'>
//                             <input
//                               id={`switch_${key}`}
//                               type='checkbox'
//                               name={`switch_${key}`}
//                               className='switch'
//                               checked={item.line}
//                               onChange={(e) => {
//                                 this.toggleSwitch(key);
//                               }}
//                             />
//                             <label htmlFor={`switch_${key}`}>Line</label>
//                           </div>
//                           <div className='field'>
//                             <label className='label'>Tamaño</label>
//                             <div className='control'>
//                               <div className='select'>
//                                 <select
//                                   onChange={(e) => {
//                                     this.handleChange(e, key);
//                                   }}
//                                   name={'size'}
//                                   value={item.size}>
//                                   <option value={''}>Seleccione...</option>
//                                   {qrSize.map((field, key) => {
//                                     return (
//                                       <option value={field} key={key}>
//                                         {field}
//                                       </option>
//                                     );
//                                   })}
//                                 </select>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       <nav className='level'>
//                         <div className='level-left'>
//                           <div className='level-item'>
//                             <button
//                               className='button is-info is-small is-outlined'
//                               onClick={(e) => {
//                                 this.saveField(key);
//                               }}>
//                               Agregar
//                             </button>
//                           </div>
//                         </div>
//                       </nav>
//                     </div>
//                   ) : (
//                     <React.Fragment>
//                       <div className='media-content'>
//                         <div className='content'>
//                           <p>{item.qr ? 'Código QR' : item.id_properties.label}</p>
//                         </div>
//                       </div>
//                       <div className='media-right'>
//                         <div>
//                           <button
//                             className='delete'
//                             onClick={(e) => {
//                               this.removeField(key);
//                             }}
//                           />
//                         </div>
//                         <div>
//                           <button className='button is-small'>
//                             <span
//                               className='icon is-small'
//                               onClick={(e) => {
//                                 this.editField(key);
//                               }}>
//                               <i className='fas fa-edit' />
//                             </span>
//                           </button>
//                         </div>
//                       </div>
//                     </React.Fragment>
//                   )}
//                 </article>
//               );
//             })}
//           </div>
//           <div className='column'>
//             <h1>Preview</h1>
//             <div className='column is-half'>
//               <div className='card'>
//                 <div style={{ padding: '1.5rem' }}>{showPrev && this.renderPrint()}</div>
//               </div>
//             </div>
//             <button className='button is-info is-outlined' onClick={this.saveBadge} disabled={badge.length <= 0}>
//               Guardar
//             </button>
//             <button className='button is-text is-outlined' onClick={this.printPreview} disabled={badge.length <= 0}>
//               Imprimir
//             </button>
//           </div>
//         </div>
//         <iframe title={'Print User'} ref='ifrmPrint' style={{ opacity: 0, display: 'none' }} />
//       </React.Fragment>
//     );
//   }
// }

// export default Badge;
