import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { CertsApi, RolAttApi } from '@helpers/request';
import { useHistory } from 'react-router-dom';
import { handleRequestError } from '@helpers/utils';
import { Row, Col, Form, Input, Modal, Select, Button, Upload, Image, Typography, List, Card, InputNumber, Divider } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined, ExclamationOutlined, CloseCircleOutlined, PlusCircleFilled, DeleteFilled, LoadingOutlined } from '@ant-design/icons';
import Header from '@antdComponents/Header';
import BackTop from '@antdComponents/BackTop';
import dayjs from 'dayjs';
import { firestore } from '@helpers/firebase';
import { withRouter } from 'react-router-dom';
import { DispatchMessageService } from '@context/MessageService';
import { Html2PdfCerts } from 'html2pdf-certs'
import 'html2pdf-certs/dist/styles.css'
import { CertRow, Html2PdfCertsRef } from 'html2pdf-certs/dist/types/components/html2pdf-certs/types';
import CertificateRows from './CertificateRows';

const { confirm } = Modal;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const defaultCertRows: CertRow[] = [
  {type: 'break', times: 19},
  {type: 'h3', content: 'Certificamos que'},
  {type: 'break', times: 2},
  {type: 'h4', content: '[user.names]'},
  {type: 'break', times: 3},
  {type: 'h3', content: 'participo con éxito el curso'},
  {type: 'break'},
  {type: 'h2', content: '[event.name]'},
  {type: 'break', times: 1},
  {type: 'h4', content: 'realizado del [event.start] al [event.end]'},
]

const initContent: string = JSON.stringify(defaultCertRows)

const defaultCertificateBackground = 'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2FGEN.iality-cert.jpeg?alt=media&token=008d4828-a64e-4218-ad2d-02ec11d7cd96';

type CertificateData = {
  name: string,
  content: string,
  background: string,
  event_id: string,
  rol?: { _id: string, [key: string]: any },
  cert_width?: number,
  cert_height?: number,
}

const CertificateEditor: FunctionComponent<any> = (props) => {
  const locationState = props.location?.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [certificateData, setCertificateData] = useState<CertificateData>({
    content: initContent,
    background: defaultCertificateBackground,
    event_id: '',
    name: '',
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [noFinalCertRows, setNoFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent));
  const [backUpNoFinalCertRows] = useState<CertRow[]>(JSON.parse(initContent));
  const [readyCertToGenerate, setReadyCertToGenerate] = useState<CertRow[] | undefined>();


  const pdfGeneratorRef = useRef<Html2PdfCertsRef>(null)

  const tags = [
    { tag: 'event.name', label: 'Nombre del curso', value: 'name' },
    { tag: 'event.start', label: 'Fecha inicio del curso', value: 'datetime_from' },
    { tag: 'event.end', label: 'Fecha fin del curso', value: 'datetime_to' },
    { tag: 'event.venue', label: 'Lugar del curso', value: 'venue' },
    { tag: 'event.address', label: 'Dirección del curso', value: 'location.FormattedAddress' },
    { tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names' },
    { tag: 'user.email', label: 'Correo de asistente', value: 'email' },
    { tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title' },
    { tag: 'rol.name', label: 'Nombre del Rol' },
  ];

  const requestCertificateDataFromID = async (id: string) => {
    const data = await CertsApi.getOne(id);
    if (!data.content) {
      if (data.content.trim() === '[]')
        setCertificateData({ ...data, content: initContent });
      if (Array.isArray(data.content) && data.content.length === 0)
        setCertificateData({ ...data, content: initContent });
    }

    setCertificateData({ ...data });
  };

  const onSubmit = async (values: any) => {
    if (certificateData.name) {
      // && certificado.rol
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (locationState.edit) {
          const data = {
            name: certificateData.name,
            rol_id: certificateData.rol?._id,
            event_id: props.event._id,
            background: certificateData.background,
            rol: certificateData.rol,
            content: certificateData.content,
          };
          await CertsApi.editOne(data, locationState.edit);
          /* console.log(data) */
        } else {
          const data = {
            name: certificateData.name,
            rol_id: certificateData.rol?._id,
            content: certificateData.content,
            event_id: props.event._id,
            background: certificateData.image?.data || certificateData.image,
            rol: certificateData?.rol,
          };
          await CertsApi.create(data);
        }

        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });

        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });

        history.push(`${props.matchUrl}`);
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });

        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
      }
    } else {
      // y el rol son
      DispatchMessageService({
        type: 'error',
        msj: 'El nombre es requerido',
        action: 'show',
      });
    }
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
            await CertsApi.deleteOne(locationState.edit);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            history.push(`${props.matchUrl}`);
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        },
      });
    }
  };

  const requestRoles = async () => {
    const data = await RolAttApi.byEvent(props.event._id);
    setRoles(data);
  };

  const handleImage = (e: any) => {
    const file = e.file;
    if (file) {
      // Create URL from image to show it
      const imageURL = window.URL.createObjectURL(file.originFileObj)
      setCertificateData({ ...certificateData, background: imageURL });
      // An image is created to convert it to base64 and get its type and format

      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => {
        const imageData = {
          data: reader.result,
          full: file.type,
          type: file.type.split('/')[1],
        };
        setCertificateData({
          ...certificateData,
          // imageData: imageData,
          // imageFile: imageData,
          // image: imageData,
        });
      };
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Solo se permiten imágenes. Intentalo de nuevo',
        action: 'show',
      });
    }
  };

  const generatePDF = async () => {
    props.event.datetime_from = dayjs(props.event.datetime_from).format('DD-MM-YYYY');
    props.event.datetime_to = dayjs(props.event.datetime_to).format('DD-MM-YYYY');

    setIsGenerating(true);

    const userRef = firestore.collection(`${props.event._id}_event_attendees`);

    // Copy the object
    let newNoFinalCertRows: CertRow[] = JSON.parse(JSON.stringify(noFinalCertRows))

    let oneUser: any = null;
    try {
      oneUser = await new Promise((resolve, reject) => {
      userRef
        .orderBy('updated_at', 'desc')
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) reject()
          else resolve(querySnapshot.docs[0].data())
        })
      })
    } catch (err) {
      console.error('Cannot generate the certificate', err)
      setIsGenerating(false);
      return
    }

    // Replace tags
    tags.map((item) => {
      let value;
      if (item.tag.includes('event.')) value = props.event[item.value || ''];
      else if (item.tag.includes('ticket.')) value = oneUser.ticket ? oneUser.ticket.title : 'Sin tiquete';
      else if (item.tag.includes('rol.')) {
        const rols = roles.find((currentRol) => currentRol._id === oneUser.rol_id);
        const rolName = rols ? rols.name.toUpperCase() : 'Sin rol';
        value = rolName;
      } else {
        value = oneUser.properties[item.value || ''];
      }
      
      if (item.tag) {
        const wantedTag = item.tag;
        const wishedValue = value;

        // Replace in all rows
        newNoFinalCertRows = newNoFinalCertRows.map((row) => {
          if (row.content) {
            if (typeof row.content === 'string') {
              row.content = row.content.replace(`[${wantedTag}]`, wishedValue);
            }
          }
          return row
        })
      }
    });

    setNoFinalCertRows(newNoFinalCertRows);
    setReadyCertToGenerate(newNoFinalCertRows);

    setIsGenerating(false);
  };

  useEffect(() => {
    // If the component is rendered to edit, then we have to get the data
    if (locationState.edit) {
      requestCertificateDataFromID(locationState.edit);
    }

    // Get all roles
    requestRoles();
  }, [locationState.edit]);

  // Watch and generate the PDF
  useEffect(() => {
    if (!pdfGeneratorRef.current) {
      console.debug('ref to Html2PdfCerts is undefined');
      return
    }
    if (readyCertToGenerate !== undefined) {
      console.log('start generating the certificate')
      pdfGeneratorRef.current.generatePdf()
      setReadyCertToGenerate(undefined)
    }
  }, [readyCertToGenerate, pdfGeneratorRef.current])

  return (
    <Form
    {...formLayout}
    onFinish={(values) => {
      console.log('upload', values)
    }}
    >
      <Header
        title="Certificado"
        description={
          <>
            <ExclamationOutlined
              style={{ color: 'orange' }}
              className="animate__animated animate__pulse animate__infinite"
            />
            {'Para tener una vista más exacta del certificado por favor presione el botón de generar'}
          </>
        }
        back
        save
        form
        remove={onRemoveId}
        edit={locationState.edit}
        extra={
          <Form.Item>
            <Row wrap gutter={[16, 8]}>
              <Col>
                <Upload
                  type="select"
                  accept="image/*"
                  showUploadList={false}
                  onChange={(e) => handleImage(e)}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
                    Imagen de Fondo
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={isGenerating ? <LoadingOutlined /> : undefined}
                  onClick={() => generatePDF()}
                >
                  Generar
                </Button>
              </Col>
            </Row>
          </Form.Item>
        }
      />

      <Row wrap gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nombre del certificado"
            rules={[{required: true, message: 'Necesario'}]}
          >
            <Input placeholder="Nombre del certificado" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Rol"
          >
            <Select
              placeholder="Seleccione un rol"
              options={roles.map((role) => ({
                label: role.name,
                value: role._id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row wrap gutter={[16, 16]}>
        <Col>
          <Form.Item
            name="cert_width"
            label="Dimensione ancho (opcional)"
          >
            <InputNumber placeholder="Ancho" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="cert_height"
            label="Dimensione alto (opcional)"
          >
            <InputNumber placeholder="Altura" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Form.Item label="Etiquetas disponibles">
            <Row wrap gutter={[18, 8]}>
              {tags.map((tag, index) => (
                <Col key={index}>
                  <code>{tag.tag}</code>
                  <p>{tag.label}</p>
                </Col>
              ))}
            </Row>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Imagen de fondo"
            extra={(
              <Button
                danger
                onClick={() =>
                  setCertificateData({
                    ...certificateData,
                    background: defaultCertificateBackground,
                  })
                }
                icon={<CloseCircleOutlined />}
              >
                Cambiar a Imagen original
              </Button>
            )}
          >
            <Image
              src={certificateData.background}
              alt="Imagen certificado"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="certRows"
            label="Filas"
            initialValue={noFinalCertRows}
          >
            <CertificateRows onChange={setNoFinalCertRows} />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <Html2PdfCerts
        handler={pdfGeneratorRef}
        rows={noFinalCertRows}
        imageUrl={ certificateData.background ?? defaultCertificateBackground}
        backgroundColor='#005882'
        enableLinks={true}
        filename="certificate-test.pdf"
        format={[1280, 720]}
        sizeStyle={{height: 720, width: 1280}}
        transformationScale={0.5}
        unit="px"
        orientation="landscape"
        onEndGenerate={() => {
          setNoFinalCertRows(backUpNoFinalCertRows)
          setIsGenerating(false)
        }}
      />

      <BackTop />
    </Form>
  )

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title="Certificado"
        description={
          <>
            <ExclamationOutlined
              style={{ color: 'orange' }}
              className="animate__animated animate__pulse animate__infinite"
            />
            {'Para tener una vista más exacta del certificado por favor presione el botón de generar'}
            <br />
            <br />
          </>
        }
        back
        save
        form
        remove={onRemoveId}
        edit={locationState.edit}
        extra={
          <Form.Item>
            <Row wrap gutter={[16, 8]}>
              <Col>
                <Upload type="file" accept="image/*" showUploadList={false} onChange={(e) => handleImage(e)}>
                  <Button type="primary" icon={<UploadOutlined />}>
                    Imagen de Fondo
                  </Button>
                </Upload>
              </Col>
              <Col>
                <Button type="primary" onClick={generatePDF}>
                  Generar
                </Button>
              </Col>
            </Row>
          </Form.Item>
        }
      />

      <Row justify="center" wrap gutter={12}>
        <Col span={20}>
          <Row wrap gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label={
                  <label style={{ marginTop: '2%' }} className="label">
                    Nombre <label style={{ color: 'red' }}>*</label>
                  </label>
                }
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input
                  value={certificateData.name}
                  name="name"
                  placeholder="Nombre del certificado"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Rol"
                /* label={
                  <label style={{ marginTop: '2%' }} className="label">
                    Rol <label style={{ color: 'red' }}>*</label>
                  </label>
                }
                rules={[{ required: true, message: 'El rol es requerido' }]} */
              >
                <Select
                  name="rol"
                  onChange={(e) => {
                    onChangeRol(e);
                  }}
                  placeholder="Seleccione rol"
                  value={certificateData.rol?._id || role?._id}
                >
                  {roles.map((rol) => (
                    <Option key={rol?._id} value={rol?._id}>
                      {rol.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item label="Etiquetas disponibles">
                <p>Use etiquetas para ingresar información referente al curso o los asistentes</p>
                <Row wrap gutter={[18, 8]}>
                  {tags.map((item, key) => (
                    <Col key={key}>
                      <code>{item.tag}</code>
                      <p>{item.label}</p>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Imagen de Fondo"
                tooltip={
                  <>
                    {'Si desea volver a tener la imagen anterior presione el siguiente botón'}
                    <Button
                      type="primary"
                      onClick={() =>
                        setCertificateData({ ...certificateData, imageFile: defaultCertificateBackground, imageData: defaultCertificateBackground, image: defaultCertificateBackground })
                      }
                    >
                      Cambiar a Imagen original
                    </Button>
                  </>
                }
              />
              <Image
                src={certificateData.imageFile?.data ? certificateData.imageFile?.data : certificateData.imageFile || defaultCertificateBackground}
                alt="Imagen certificado"
                preview={previewCert}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
};

export default withRouter(CertificateEditor);
