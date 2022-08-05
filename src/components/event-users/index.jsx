import { Component } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from 'react-intl';
import { firestore } from '../../helpers/firebase';
import { BadgeApi, EventsApi, RolAttApi } from '../../helpers/request';
import UserModal from '../modal/modalUser';
import ErrorServe from '../modal/serverError';
import { utils, writeFileXLSX } from 'xlsx';
import { fieldNameEmailFirst, handleRequestError, parseData2Excel, sweetAlert } from '../../helpers/utils';
import Moment from 'moment';
import { Button, Card, Col, Drawer, Image, Row, Statistic, Typography, Tag, Input, Space, Tooltip, Select } from 'antd';

import updateAttendees from './eventUserRealTime';
import { Link } from 'react-router-dom';
import {
  EditOutlined,
  FullscreenOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  StarOutlined,
} from '@ant-design/icons';
import QrModal from './qrModal';

import Header from '../../antdComponents/Header';
import TableA from '../../antdComponents/Table';
import Highlighter from 'react-highlight-words';
import { DispatchMessageService } from '../../context/MessageService';
import Loading from '../profile/loading';
import moment from 'moment';
import AttendeeCheckInCheckbox from '../checkIn/AttendeeCheckInCheckbox';
import { HelperContext } from '@/context/helperContext/helperContext';
import AttendeeCheckInButton from '../checkIn/AttendeeCheckInButton';

const { Title } = Typography;
const { Option } = Select;

class ListEventUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      columns: null,
      usersReq: [],
      pageOfItems: [],
      listTickets: [],
      usersRef: firestore.collection(
        `${props.match.params.id ? props.match.params.id : props.event._id}_event_attendees`
      ),
      pilaRef: firestore.collection('pila'),
      total: 0,
      totalCheckedIn: 0,
      totalCheckedInWithWeight: 0,
      extraFields: [],
      spacesEvents: [],
      addUser: false,
      editUser: false,
      deleteUser: false,
      loading: true,
      importUser: false,
      modalPoints: false,
      pages: null,
      message: { class: '', content: '' },
      sorted: [],
      rolesList: [],
      facingMode: 'user',
      qrData: {},
      clearSearch: false,
      changeItem: false,
      errorData: {},
      badgeEvent: {},
      serverError: false,
      stage: '',
      ticket: '',
      tabActive: 'camera',
      ticketsOptions: [],
      scanner: 'first',
      localChanges: null,
      quantityUsersSync: 0,
      lastUpdate: new Date(),
      disabledPersistence: false,
      percent_checked: 0,
      percent_unchecked: 0,
      totalPesoVoto: 0,
      configfast: {},
      isModalVisible: false,
      fieldsForm: [],
      typeScanner: 'CheckIn options',
      nameActivity: props.location.state?.item?.name || '',
      qrModalOpen: false,
    };
  }
  static contextType = HelperContext;

  // eslint-disable-next-line no-unused-vars
  editcomponent = (text, item, index) => {
    const { eventIsActive } = this.context;
    return (
      <Tooltip placement='topLeft' title='Editar'>
        <Button
          type={'primary'}
          icon={<EditOutlined />}
          size='small'
          onClick={() => this.openEditModalUser(item)}
          disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
        />
      </Tooltip>
    );
  };

  // eslint-disable-next-line no-unused-vars
  created_at_component = (text, item, index) => {
    if (item.created_at !== null) {
      const createdAt = typeof item?.created_at === 'object' ? item?.created_at?.toDate() : item?.created_at;

      return <>{createdAt ? <p>{Moment(createdAt).format('D/MMM/YY h:mm:ss A ')}</p> : ''}</>;
    } else {
      return '';
    }
  };

  rol_component = (text, item, index) => {
    if (this.state.rolesList) {
      for (let role of this.state.rolesList) {
        if (item.rol_id == role._id) {
          return <p>{role.name}</p>;
        }
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  updated_at_component = (text, item, index) => {
    if (item.updated_at !== null) {
      const updatedAt = typeof item?.created_at === 'object' ? item?.updated_at?.toDate() : item?.updated_at;

      return <>{updatedAt ? <p>{Moment(updatedAt).format('D/MMM/YY h:mm:ss A ')}</p> : ''}</>;
    } else {
      return '';
    }
  };

  // eslint-disable-next-line no-unused-vars
  checkedincomponent = (text, item, index) => {
    return <AttendeeCheckInCheckbox attendee={item} />;
  };

  physicalCheckInComponent = (text, item, index) => {
    return <AttendeeCheckInButton attendee={item} />;
  };

  checkInTypeComponent = (text, item, index) => {
    return <>{item?.checkedin_type ? <b>{item?.checkedin_type}</b> : <b>Ninguno</b>}</>;
  };

  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field['label'] = field['label'] ? field['label'] : field['name'];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };
  /** Sorting to show users with checkIn first in descending order, and users who do not have checkIn as last  */
  sortUsersArray = async (users) => {
    const sortedResult = users.sort((itemA, itemB) => {
      let aParameter = '';
      let bParameter = '';

      try {
        aParameter = itemA?.checkedin_at?.toDate();
        bParameter = itemB?.checkedin_at?.toDate();
      } catch (error) {}

      if (!aParameter) return 1;
      if (!bParameter) return -1;
      if (moment(aParameter) === moment(bParameter)) return 0;
      return moment(aParameter) > moment(bParameter) ? -1 : 1;
    });

    return sortedResult;
  };

  getAttendes = async () => {
    let self = this;

    this.checkFirebasePersistence();
    try {
      const event = await EventsApi.getOne(this.props.event._id);

      const properties = event.user_properties;
      const rolesList = await RolAttApi.byEventRolsGeneral();
      const badgeEvent = await BadgeApi.get(this.props.event._id);

      let extraFields = fieldNameEmailFirst(properties);

      extraFields = this.addDefaultLabels(extraFields);
      extraFields = this.orderFieldsByWeight(extraFields);
      let fieldsForm = Array.from(extraFields);
      // AGREGAR EXTRAFIELDS DE ROL Y CHECKIN
      let rolesOptions = rolesList.map((rol) => {
        return {
          label: rol.name,
          value: rol._id,
        };
      });
      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Rol',
        mandatory: true,
        name: 'rol_id',
        organizer: null,
        tickets: [],
        type: 'list',
        fields_conditions: [],
        unique: false,
        options: rolesOptions,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac1' },
      });

      fieldsForm.push({
        author: null,
        categories: [],
        label: 'Checkin',
        mandatory: false,
        name: 'checked_in',
        organizer: null,
        tickets: [],
        type: 'boolean',
        fields_conditions: [],
        unique: false,
        visibleByAdmin: false,
        visibleByContacts: 'public',
        _id: { $oid: '614260d226e7862220497eac2' },
      });

      let columns = [];
      let checkInColumn = {
        title: 'Ingreso',
        dataIndex: 'checkedin_at',
        key: 'checkedin_at',
        width: '120px',
        ellipsis: true,
        sorter: (a, b) => a.checkedin_at - b.checkedin_at,
        ...self.getColumnSearchProps('checkedin_at'),
        render: self.checkedincomponent,
      };

      let checkInType = {
        title: 'Tipo de checkIn',
        dataIndex: 'checkedin_type',
        key: 'checkedin_type',
        width: '120px',
        ellipsis: true,
        ...self.getColumnSearchProps('checkedin_type'),
        render: self.checkInTypeComponent,
      };

      let physicalCheckIn = {
        title: 'Registrar checkIn físico',
        dataIndex: 'physicalCheckIn',
        key: 'physicalCheckIn',
        width: '120px',
        ellipsis: true,
        render: self.physicalCheckInComponent,
      };

      let editColumn = {
        title: 'Editar',
        key: 'edit',
        fixed: 'right',
        width: 60,
        render: self.editcomponent,
      };
      /* columns.push(editColumn); */
      /** Additional columns for hybrid events */
      if (self.props.event?.type_event === 'hybridEvent') columns.push(checkInType, physicalCheckIn);

      columns.push(checkInColumn);

      let extraColumns = extraFields
        .filter((item) => {
          return item.type !== 'tituloseccion' && item.type !== 'password';
        })
        .map((item) => {
          return {
            title: item.label,
            dataIndex: item.name,
            key: item.name,
            ellipsis: true,
            sorter: (a, b) => a[item.name]?.length - b[item.name]?.length,
            ...self.getColumnSearchProps(item.name),
            render: (record, key) => {
              switch (item.type) {
                /** When using the ant datePicker it saves the date with the time, therefore, since only the date is needed, the following split is performed */
                case 'date':
                  const date = key[item.name];
                  const dateSplit = date ? date?.split('T') : '';
                  return dateSplit[0];

                case 'file':
                  return (
                    <a target='__blank' download={item?.name} href={key[item?.name]}>
                      {this.obtenerName(key[item?.name])}
                    </a>
                  );

                case 'avatar':
                  return <Image width={40} height={40} src={key?.user?.picture} />;

                default:
                  return key[item.name];
              }
            },
          };
        });
      columns = [...columns, ...extraColumns];
      let rol = {
        title: 'Rol',
        dataIndex: 'rol_id',
        key: 'rol_id',
        ellipsis: true,
        sorter: (a, b) => a.rol_id.length - b.rol_id.length,
        ...self.getColumnSearchProps('rol_id'),
        render: self.rol_component,
      };

      let created_at = {
        title: 'Creado',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '140px',
        ellipsis: true,
        sorter: (a, b) => a.created_at - b.created_at,
        ...self.getColumnSearchProps('created_at'),
        render: self.created_at_component,
      };
      let updated_at = {
        title: 'Actualizado',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: '140px',
        ellipsis: true,
        sorter: (a, b) => a.updated_at - b.updated_at,
        ...self.getColumnSearchProps('updated_at'),
        render: self.updated_at_component,
      };
      columns.push(rol);
      columns.push(created_at);
      columns.push(updated_at);
      columns.push(editColumn);

      this.setState({ columns: columns });

      this.setState({ extraFields, rolesList, badgeEvent, fieldsForm });
      const { usersRef } = this.state;

      firestore
        .collection(`event_config`)
        .doc(event._id)
        .onSnapshot((doc) => {
          this.setState({ ...this.state, configfast: doc.data() });
        });

      usersRef.orderBy('updated_at', 'desc').onSnapshot(
        {
          // Listen for document metadata changes
          //includeMetadataChanges: true
        },
        async (snapshot) => {
          let currentAttendees = [...this.state.usersReq];
          let updatedAttendees = updateAttendees(currentAttendees, snapshot);

          let totalCheckedIn = updatedAttendees.reduce((acc, item) => acc + (item.checkedin_at ? 1 : 0), 0);

          let totalCheckedInWithWeight =
            Math.round(
              updatedAttendees.reduce(
                (acc, item) => acc + (item.checkedin_at ? parseFloat(item.pesovoto ? item.pesovoto : 1) : 0),
                0
              ) * 100
            ) / 100;
          //total de pesos
          let totalWithWeight =
            Math.round(
              updatedAttendees.reduce((acc, item) => acc + parseFloat(item.pesovoto ? item.pesovoto : 1), 0) * 100
            ) / 100;
          this.setState({
            totalCheckedIn: totalCheckedIn,
            totalCheckedInWithWeight: totalCheckedInWithWeight,
            totalWithWeight,
          });

          //console.log("ATTENDESS==>",updatedAttendees)
          //console.log("ATTENDESSFIND==>",updatedAttendees.filter((at)=>at.email=='nieblesrafael@yahoo.com'))

          for (let i = 0; i < updatedAttendees.length; i++) {
            // Arreglo temporal para que se muestre el listado de usuarios sin romperse
            // algunos campos no son string y no se manejan bien
            //console.log("FIELDS==>",extraFields)
            extraFields.forEach(function(key) {
              if (
                !(
                  (updatedAttendees[i][key.name] && updatedAttendees[i][key.name].getMonth) ||
                  typeof updatedAttendees[i][key.name] == 'string' ||
                  typeof updatedAttendees[i][key.name] == 'boolean' ||
                  typeof updatedAttendees[i][key.name] == 'number' ||
                  Number(updatedAttendees[i][key.name]) ||
                  updatedAttendees[i][key.name] === null ||
                  updatedAttendees[i][key.name] === undefined
                )
              ) {
                {
                  console.log('entro', updatedAttendees[i].user ? updatedAttendees[i].user[key.name] : '');
                }
                updatedAttendees[i]['properties'][key.name] =
                  updatedAttendees[i].user[key.name] || JSON.stringify(updatedAttendees[i][key.name]);
              }
              if (extraFields) {
                let codearea = extraFields?.filter((field) => field.type == 'codearea');
                if (
                  codearea[0] &&
                  updatedAttendees[i] &&
                  Object.keys(updatedAttendees[i]).includes(codearea[0].name) &&
                  key.name == codearea[0].name
                ) {
                  updatedAttendees[i][codearea[0].name] = updatedAttendees[i]['code']
                    ? '(+' + updatedAttendees[i]['code'] + ')' + updatedAttendees[i].properties[codearea[0].name]
                    : updatedAttendees[i].properties[codearea[0].name];
                } else {
                  //console.log("KEY==>",updatedAttendees[i]['properties'][key.name])
                  if (updatedAttendees[i][key.name]) {
                    updatedAttendees[i][key.name] = Array.isArray(updatedAttendees[i]['properties'][key.name])
                      ? updatedAttendees[i]['properties'][key.name][0]
                      : updatedAttendees[i]['properties'][key.name];
                    updatedAttendees[i]['textodeautorizacionparaimplementarenelmeetupfenalcoycolsubsidio'] =
                      self.props.event._id == '60c8affc0b4f4b417d252b29' ? 'SI' : '';
                  }
                }
              }
            });

            if (updatedAttendees[i].payment) {
              updatedAttendees[i].payment =
                'Status: ' +
                updatedAttendees[i].payment.status +
                ' Fecha de transaccion: ' +
                updatedAttendees[i].payment.date +
                ' Referencia PayU: ' +
                updatedAttendees[i].payment.payuReference +
                ' Transaccion #: ' +
                updatedAttendees[i].payment.transactionID;
            } else {
              updatedAttendees[i].payment = 'No se ha registrado el pago';
            }
          }
          const sortedUsers = await this.sortUsersArray(updatedAttendees);

          this.setState({
            users: sortedUsers,
            usersReq: sortedUsers,
            auxArr: sortedUsers,
            loading: false,
          });
        },
        () => {
          //this.setState({ timeout: true, errorData: { message: error, status: 708 } });
        }
      );
    } catch (error) {
      const errorData = handleRequestError(error);
      this.setState({ timeout: true, errorData });
    }
  };

  async componentDidMount() {
    this.getAttendes();
  }

  obtenerName = (fileUrl) => {
    if (typeof fileUrl == 'string') {
      let splitUrl = fileUrl?.split('/');
      return splitUrl[splitUrl.length - 1];
    } else {
      return null;
    }
  };

  exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const attendees = [...this.state.users].sort((a, b) => b.created_at - a.created_at);

    const data = await parseData2Excel(attendees, this.state.extraFields, this.state.rolesList);
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Asistentes');
    writeFileXLSX(wb, `asistentes_${this.props.event.name}.xls`);
  };

  addUser = () => {
    this.setState({ edit: false }, () => {
      this.setState((prevState) => {
        return { editUser: !prevState.editUser, selectedUser: null };
      });
    });
  };

  modalUser = () => {
    this.setState((prevState) => {
      return { editUser: !prevState.editUser, edit: undefined };
    });
  };

  checkModal = () => {
    // this.setState((prevState) => {
    //   return { qrModal: !prevState.qrModal };
    // });
    this.setState((prevState) => {
      return { qrModalOpen: !prevState.qrModalOpen };
    });
  };
  closeQRModal = () => {
    this.setState((prevState) => {
      return { qrModalOpen: !prevState.qrModalOpen };
    });
  };

  checkIn = async (id, item) => {
    let checkInStatus = null;
    const { qrData } = this.state;
    const { event } = this.props;
    qrData.another = true;
    /*  try {
      let resp = await TicketsApi.checkInAttendee(event._id, id);
      //message.success('Usuario Chequeado');
    } catch (e) {
      message.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
    } */
    //return;
    let eventIdSearch = this.props.match.params.id ? this.props.match.params.id : this.props.event._id;

    let userRef = null;
    try {
      userRef = firestore.collection(`${eventIdSearch}_event_attendees`).doc(id);
    } catch (error) {
      checkInStatus = false;
      return;
    }

    // Actualiza el usuario en la base de datos

    await userRef
      .update({
        ...item,
        updated_at: new Date(),
        checkedin_at: new Date(),
        checked_in: true,
      })
      .then(() => {
        DispatchMessageService({
          type: 'success',
          msj: 'Usuario chequeado exitosamente...',
          action: 'show',
        });
        checkInStatus = true;
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        if (this.props.intl) {
          DispatchMessageService({
            type: 'error',
            msj: this.props.intl.formatMessage({ id: 'toast.error', defaultMessage: 'Sry :(' }),
            action: 'show',
          });
        } else {
          DispatchMessageService({
            type: 'error',
            msj: 'Algo salió mal. Intentalo de nuevo',
            action: 'show',
          });
        }
        checkInStatus = false;
      });
    return checkInStatus;
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  // Funcion para disminuir el contador y pasarlo como prop al modalUser
  substractSyncQuantity = () => {
    this.setState((prevState) => ({ quantityUsersSync: prevState.quantityUsersSync - 1 }));
    this.setState({ lastUpdate: new Date() });
  };

  showMetaData = (value) => {
    let content = '';
    Object.keys(value).map((key) => (content += `<p><b>${key}:</b> ${value[key]}</p>`));
    sweetAlert.simple('Información', content, 'Cerrar', '#1CDCB7', () => {});
  };

  // Function to check the firebase persistence and load page if this return false
  checkFirebasePersistence = () => {
    let { disabledPersistence } = this.state;

    disabledPersistence = window.eviusFailedPersistenceEnabling;
    this.setState({ disabledPersistence });
  };

  openEditModalUser = (item) => {
    item = {
      ...item,
      checked_in: item.checked_in,
      checkedin_at: item.checkedin_at,
    };
    this.setState({ editUser: true, selectedUser: item, edit: true });
  };

  changeStage = (e) => {
    const { value } = e.target;
    const {
      event: { tickets },
    } = this.props;
    if (value === '') {
      let check = 0,
        acompanates = 0;
      this.setState({ checkIn: 0, total: 0 }, () => {
        const list = this.state.usersReq;
        list.forEach((user) => {
          if (user.checked_in) check += 1;
          if (user.properties.acompanates && /^\d+$/.test(user.properties.acompanates))
            acompanates += parseInt(user.properties.acompanates, 10);
        });
        this.setState((state) => {
          return {
            users: state.auxArr.slice(0, 50),
            ticket: '',
            stage: value,
            total: list.length + acompanates,
            checkIn: check,
          };
        });
      });
    } else {
      const options = tickets.filter((ticket) => ticket.stage_id === value);
      this.setState({ stage: value, ticketsOptions: options });
    }
  };

  changeTicket = (e) => {
    const { value } = e.target;
    let check = 0,
      acompanates = 0;
    this.setState({ checkIn: 0, total: 0 }, () => {
      const list =
        value === '' ? this.state.usersReq : [...this.state.usersReq].filter((user) => user.ticket_id === value);
      list.forEach((user) => {
        if (user.checked_in) check += 1;
        if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/))
          acompanates += parseInt(user.properties.acompanates, 10);
      });
      const users = value === '' ? [...this.state.auxArr].slice(0, 50) : list;

      this.setState({ users, ticket: value, checkIn: check, total: list.length + acompanates });
    });
  };

  //Search records at third column
  searchResult = (data) => {
    !data ? this.setState({ users: [] }) : this.setState({ users: data });
  };

  handleChange = (e) => {
    /* console.log(e); */
    this.setState({ typeScanner: e });
    this.checkModal();
  };

  // Set options in dropdown list
  clearOption = () => {
    this.setState({ typeScanner: 'CheckIn options' });
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const {
      timeout,
      usersReq,
      users,
      totalCheckedIn,
      totalCheckedInWithWeight,
      extraFields,
      spacesEvent,
      editUser,
      stage,
      ticket,
      ticketsOptions,
      localChanges,
      quantityUsersSync,
      lastUpdate,
      disabledPersistence,
      nameActivity,
      columns,
      fieldsForm,
    } = this.state;

    const { type, loading, componentKey } = this.props;
    const { eventIsActive } = this.context;

    const inscritos =
      this.state.configfast && this.state.configfast.totalAttendees
        ? this.state.configfast.totalAttendees
        : usersReq.length;

    const participantes = Math.round((totalCheckedIn / inscritos) * 100);
    const asistenciaCoeficientes = Math.round((totalCheckedInWithWeight / 100) * 100);

    return (
      <React.Fragment>
        <Header title={type == 'activity' ? 'Check-in de ' + nameActivity : 'Check-in de evento'} />

        {disabledPersistence && (
          <div style={{ margin: '5%', textAlign: 'center' }}>
            <label>
              El almacenamiento local de lso datos esta deshabilitado. Cierre otras pestañanas de la plataforma para
              pode habilitar el almacenamiento local
            </label>
          </div>
        )}

        {// localChanges &&
        quantityUsersSync > 0 && localChanges === 'Local' && (
          <Row gutter={8}>
            <Col>
              <p>
                <small>Cambios sin sincronizar : {quantityUsersSync < 0 ? 0 : quantityUsersSync}</small>
              </p>
            </Col>
          </Row>
        )}

        {this.state.qrModalOpen && (
          <QrModal
            fields={fieldsForm}
            typeScanner={this.state.typeScanner}
            clearOption={this.clearOption}
            closeModal={this.closeQRModal}
            openModal={this.state.qrModalOpen}
          />
        )}

        {/* {users.length > 0 && this.state.columns ? ( */}
        <TableA
          list={users.length > 0 && users}
          header={this.state.columns}
          takeOriginalHeader
          scroll={{ x: 'max-content' }} //auto funciona de la misma forma, para ajustar el contenido
          loading={this.state.loading}
          footer={
            <div
              style={{
                background: '#D3D3D3',
                paddingRight: '20px',
                textAlign: 'end',
                borderRadius: '3px',
              }}>
              <strong> Última Sincronización: </strong> <FormattedDate value={lastUpdate} />{' '}
              <FormattedTime value={lastUpdate} />
            </div>
          }
          titleTable={
            <Row gutter={[6, 6]}>
              <Col>
                <Tag
                  style={{ color: 'black', fontSize: '13px', borderRadius: '4px' }}
                  color='lightgrey'
                  icon={<UsergroupAddOutlined />}>
                  <strong>Inscritos: </strong>
                  <span style={{ fontSize: '13px' }}>{inscritos}</span>
                </Tag>
              </Col>
              <Col>
                <Tag
                  style={{ color: 'black', fontSize: '13px', borderRadius: '4px' }}
                  color='lightgrey'
                  icon={<StarOutlined />}>
                  <strong>Participantes: </strong>
                  <span style={{ fontSize: '13px' }}>
                    {totalCheckedIn + '/' + inscritos + ' (' + participantes + '%)'}{' '}
                  </span>
                </Tag>
              </Col>
              <Col>
                {extraFields.reduce((acc, item) => acc || item.name === 'pesovoto', false) && (
                  <>
                    <Tag>
                      <small>
                        Asistencia por Coeficientes:
                        {totalCheckedInWithWeight + '/100' + ' (' + asistenciaCoeficientes + '%)'}
                      </small>
                    </Tag>
                  </>
                )}
              </Col>
              <Col>
                <Button type='ghost' icon={<FullscreenOutlined />} onClick={this.showModal}>
                  Expandir
                </Button>
              </Col>
              <Col>
                <Select
                  name={'type-scanner'}
                  value={this.state.typeScanner}
                  defaultValue={this.state.typeScanner}
                  onChange={(e) => this.handleChange(e)}
                  style={{ width: 220 }}>
                  <Option value='scanner-qr'>Escanear QR</Option>
                  {fieldsForm.map((item) => {
                    if (item.type === 'checkInField')
                      return <Option value='scanner-document'>Escanear {item.label}</Option>;
                  })}
                </Select>
              </Col>
              <Col>
                {usersReq.length > 0 && (
                  <Button type='primary' icon={<DownloadOutlined />} onClick={this.exportFile}>
                    Exportar
                  </Button>
                )}
              </Col>
              <Col>
                <Link
                  to={
                    !eventIsActive && window.location.toString().includes('eventadmin')
                      ? ''
                      : `/eventAdmin/${this.props.event._id}/invitados/importar-excel`
                  }>
                  <Button
                    type='primary'
                    icon={<UploadOutlined />}
                    disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                    Importar usuarios
                  </Button>
                </Link>
              </Col>
              <Col>
                <Button
                  type='primary'
                  icon={<PlusCircleOutlined />}
                  size='middle'
                  onClick={this.addUser}
                  disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                  {'Agregar Usuario'}
                </Button>
              </Col>
            </Row>
          }
        />

        {/* ) : (
          <Loading />
        )} */}

        {!loading && editUser && (
          <UserModal
            handleModal={this.modalUser}
            modal={editUser}
            ticket={ticket}
            tickets={this.state.listTickets}
            rolesList={this.state.rolesList}
            value={this.state.selectedUser}
            checkIn={this.checkIn}
            badgeEvent={this.state.badgeEvent}
            extraFields={fieldsForm}
            spacesEvent={spacesEvent}
            edit={this.state.edit}
            substractSyncQuantity={this.substractSyncQuantity}
            componentKey={componentKey}
          />
        )}

        {timeout && <ErrorServe errorData={this.state.errorData} />}

        <Drawer
          title={
            <>
              <Title level={3}>Estadísticas</Title>
              {this.props.event.name ? <Title level={5}>{this.props.event.name}</Title> : ''}
            </>
          }
          visible={this.state.isModalVisible}
          closable={false}
          footer={[
            <Button style={{ float: 'right' }} type='primary' size='large' onClick={this.hideModal} key='close'>
              Cerrar
            </Button>,
            <div key='fecha' style={{ float: 'left' }}>
              <Title level={5}>
                Última Sincronización : <FormattedDate value={lastUpdate} /> <FormattedTime value={lastUpdate} />
              </Title>
            </div>,
          ]}
          style={{ top: 0, textAlign: 'center' }}
          width='100vw'>
          <Row align='middle' justify='center' style={{ width: '80vw' }}>
            <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
              <Row align='middle'>
                <Card
                  bodyStyle={{ paddingLeft: '0px', paddingRight: '0px' }}
                  cover={
                    this.props.event.styles.event_image ? (
                      <img
                        style={{ objectFit: 'cover', width: '96vw' }}
                        src={this.props.event.styles.event_image}
                        alt='Logo evento'
                      />
                    ) : (
                      ''
                    )
                  }></Card>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={20} xl={20} xxl={20}>
              <Row align='middle'>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title level={2} style={{ textAlign: 'center', color: '#b5b5b5' }}>
                          Inscritos
                        </Title>
                      }
                      value={inscritos || 0}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title level={2} style={{ textAlign: 'center', color: '#b5b5b5' }}>
                          Participantes
                        </Title>
                      }
                      value={totalCheckedIn + '/' + inscritos + ' (' + participantes + '%)'}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Card bodyStyle={{}} style={{}} bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '80px', textAlign: 'center' }}
                      title={
                        <Title level={2} style={{ textAlign: 'center', color: '#b5b5b5' }}>
                          Asistencia por Coeficientes
                        </Title>
                      }
                      value={
                        totalCheckedInWithWeight +
                        '/' +
                        this.state.totalWithWeight +
                        ' (' +
                        Math.round((totalCheckedInWithWeight / this.state.totalWithWeight) * 100) +
                        '%)'
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ListEventUser;
