import { Component, Fragment } from 'react';
import { AgendaApi } from '../../../helpers/request';
import { Typography, Select, Form, Table, Button, InputNumber, notification, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalEdit from './modalEdit';
import { firestore } from '../../../helpers/firebase';

const { Title } = Typography;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ActividadLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: {},
      related_meetings: [],
      visible: false,
    };
    this.onFinish = this.onFinish.bind(this);
    this.deleteObject = this.deleteObject.bind(this);
    this.onFinishModal = this.onFinishModal.bind(this);
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { eventId, activityId } = this.props;
    let related_meetings = await firestore
      .collection('languageState')
      .doc(activityId)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          return doc.data().related_meetings;
        } else {
          notification.open({
            message: 'No hay información guardada',
          });
        }
      })
      .catch(function() {
        //
        notification.open({
          message: 'Hubo un error, intente mas tarde',
        });
      });
    const info = await AgendaApi.getOne(activityId, eventId);
    this.setState({ activity: info, related_meetings });
  }

  async onFinish(related_meetings_selected) {
    const { eventId, activityId } = this.props;
    let related_meetings = this.state.related_meetings ? this.state.related_meetings : [];
    related_meetings.push(related_meetings_selected);

    let info = { event_id: eventId, activity_id: activityId, related_meetings: related_meetings };
    try {
      await firestore
        .collection('languageState')
        .doc(activityId)
        .set(info);
      notification.open({
        message: 'Información Guardada',
      });
    } catch (e) {
      //
      notification.open({
        message: 'Hubo un error',
        description: 'No se ha logrado crear la información, intente mas tarde',
      });
    }
    this.loadData();
  }

  async deleteObject(object) {
    const { eventId, activityId } = this.props;
    let dataToFilter = this.state.related_meetings;

    dataToFilter = dataToFilter.filter(function(i) {
      return i !== object;
    });

    let related_meetings = dataToFilter;

    this.setState({ related_meetings });
    try {
      await firestore
        .collection('languageState')
        .doc(activityId)
        .update({ event_id: eventId, activity_id: activityId, related_meetings });
      notification.open({
        message: 'Dato eliminado',
      });
    } catch (e) {
      //
      notification.open({
        message: 'Hubo un error',
        description: 'No se ha logrado eliminar la información, intente mas tarde',
      });
    }
    this.loadData();
  }

  async editObject(object) {
    this.setState({ dataToEdit: { ...object }, visible: true });
  }

  async onFinishModal(related_meetings_selected) {
    const { eventId, activityId } = this.props;
    let related_meetings_original = this.state.related_meetings;

    for (let i = 0; i < related_meetings_original.length; i++) {
      if (related_meetings_original[i].meeting_id) {
        if (related_meetings_selected.meeting_id !== 0) {
          if (related_meetings_original[i].meeting_id.toString() === related_meetings_selected.meeting_id.toString()) {
            related_meetings_original[i].language = related_meetings_selected.language;
            related_meetings_original[i].state = related_meetings_selected.state;
            related_meetings_original[i].informative_text = related_meetings_selected.informative_text;
          }
        }
      }

      if (related_meetings_original[i].vimeo_id) {
        if (related_meetings_original[i].vimeo_id.toString() === related_meetings_selected.vimeo_id.toString()) {
          if (related_meetings_selected.vimeo_id !== 0) {
            related_meetings_original[i].language = related_meetings_selected.language;
            related_meetings_original[i].state = related_meetings_selected.state;
            related_meetings_original[i].informative_text = related_meetings_selected.informative_text;
          }
        }
      }
    }

    let related_meetings = related_meetings_original;

    try {
      await firestore
        .collection('languageState')
        .doc(activityId)
        .update({ event_id: eventId, activity_id: activityId, related_meetings });
      notification.open({
        message: 'Dato actualizado',
      });
    } catch (e) {
      //
      notification.open({
        message: 'Hubo un error',
        description: 'No se ha logrado actualizar la información, intente mas tarde',
      });
    }

    this.setState({ visible: false });

    this.loadData();
  }
  render() {
    const { activity, related_meetings, dataToEdit, visible } = this.state;
    const { platform } = this.props;
    const columns = [
      {
        title: 'Lenguaje',
        dataIndex: 'language',
        key: 'language',
      },
      {
        title: 'Id de conferencia',
        render: (value, row) => {
          if (row.vimeo_id !== undefined) {
            return <p>{value.vimeo_id}</p>;
          } else if (row.meeting_id !== undefined) {
            return <p>{value.meeting_id}</p>;
          } else if (row.bigmarker_id !== undefined) {
            return <p>{value.bigmarker_id}</p>;
          }
        },
        key: 'meeting_id',
      },
      {
        title: 'Estado',
        dataIndex: 'state',
        render: (value) => {
          if (value === 'open_meeting_room') {
            return <p>Conferencia abierta</p>;
          } else if (value === 'closed_meeting_room') {
            return <p>Conferencia no Iniciada</p>;
          } else if (value === 'ended_meeting_room') {
            return <p>Conferencia terminada</p>;
          }
        },
        key: 'state',
      },
      {
        title: 'Plataforma',
        render: (row) => {
          if (row.vimeo_id !== undefined) {
            return <p>vimeo</p>;
          } else if (row.meeting_id !== undefined) {
            return <p>zoom</p>;
          } else if (row.bigmarker_id !== undefined) {
            return <p>BigMarker</p>;
          }
        },
      },
      {
        title: 'Texto informativo',
        dataIndex: 'informative_text',
        key: 'informative_text',
      },
      {
        title: 'Action',
        render: (record) => (
          <>
            <div>
              <DeleteOutlined onClick={() => this.deleteObject(record)} />
            </div>
            <div>
              <EditOutlined onClick={() => this.editObject(record)} />
            </div>
          </>
        ),
      },
    ];
    return (
      <>
        <Fragment>
          <Title>Lenguaje para {activity.name}</Title>
          <Form onFinish={this.onFinish} {...formLayout}>
            <Form.Item
              label='Lenguaje'
              name='language'
              rules={[{ required: true, message: 'Por favor seleccione un idioma' }]}>
              <Select>
                <Option value='Ingles'>Ingles</Option>
                <Option value='Español'>Español</Option>
                <Option value='Frances'>Frances</Option>
                <Option value='Portugués'>Portugués</Option>
                <Option value='Aleman'> Aleman</Option>
              </Select>
            </Form.Item>
            {platform === 'zoom' && (
              <Form.Item
                label='Id de conferencia'
                name='meeting_id'
                rules={[{ required: true, message: 'Por favor ingrese un id' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            )}
            {platform === 'vimeo' && (
              <Form.Item
                label='Id de conferencia'
                name='vimeo_id'
                rules={[{ required: true, message: 'Por favor ingrese un id' }]}>
                <InputNumber style={{ display: 'block' }} />
              </Form.Item>
            )}

            <Form.Item
              label='estado'
              name='state'
              rules={[{ required: true, message: 'Por favor seleccione un estado' }]}>
              <Select>
                <Option value='open_meeting_room'>Conferencia abierta</Option>
                <Option value='closed_meeting_room'>Conferencia no Iniciada</Option>
                <Option value='ended_meeting_room'>Conferencia terminada</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Texto informativo '
              name='informative_text'
              rules={[{ required: true, message: 'Por favor seleccione un idioma' }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Guardar
              </Button>
            </Form.Item>
          </Form>
          {related_meetings && <Table dataSource={related_meetings} columns={columns} />}

          <ModalEdit onFinish={this.onFinishModal} visible={visible} data={dataToEdit} />
        </Fragment>
      </>
    );
  }
}

export default ActividadLanguage;
