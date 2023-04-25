/** React's libraries */
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { DatePicker, Form, Input, InputNumber, Select, Switch, Table, Modal, Button, Spin } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, CerticationsApi, EventsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';
import { DownloadOutlined } from '@ant-design/icons';

/** export Excel */
import { utils, writeFileXLSX } from 'xlsx';
import PositionCertificationFileUploader from './PositionCertificationFileUploader';

const { TextArea } = Input;

function OrgRegisteredUsers(props) {
  const { _id: organizationId } = props.org;

  const [usersSuscribedData, setUsersSuscribedData] = useState([]);
  //const [orgEventsList, setOrgEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrgMember, setSelectedOrgMember] = useState({});
  const [isModalOpened, setIsModalOpened] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const [form] = Form.useForm();
  const [isSettingFormValues, setIsSettingFormValues] = useState(false);

  const [extraFields, setExtraFields] = useState([]);

  const [filtersToDataSource, setFiltersToDataSource] = useState({});

  useEffect(() => {
    getRegisteredUsers();
    setExtraFields(props.org.user_properties.filter((item) => !['email', 'names'].includes(item.name)));
  }, [isSubmiting]);

  function formattedRealDate(timestamp) {
    const segundos = timestamp?.seconds;
    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    return formattedDate;
  }

  const exportXLSX = useCallback(() => {
    console.log('exporting to XLSX....')
    const ws = utils.json_to_sheet(usersSuscribedData.map((item) => {
      return {
        ...(Object.fromEntries(Object.entries(item).map((pair) => {
          const [key, value] = pair
          if (typeof value === 'undefined') {
            return [key, 'N/A']
          }
          if (typeof value === 'boolean') {
            return [key, value ? 'Sí' : 'No']
          }
          return [key, value]
        }))),
        position: item.position ?? 'Sin cargo'
      }
    }).filter((user) => {
      // Before we send the user data, we have to check if its dataIndex
      // contains a filtered value to remove this value
      return Object.entries(filtersToDataSource)
        .every(([key, value]) => {
          if (typeof user[key] === 'undefined' || user[key] === undefined) return true
          return (user[key] === value)
        })
    }).map((user) => {
      delete user._id;
      delete user.created_at;
      delete user.updated_at;
      delete user.position;
      delete user.position_id;
      delete user.rol_id;
      delete user.stats;
      delete user.picture;
      // What else?
      // More sht
      delete user.approved_until_date;
      delete user.approved_from_date;
      delete user.event_id;
      delete user.validity_date
      delete user.account_id;
      const { eventUser_email, eventUser_name, event_name, password } = user;
      if (password) {
        user['documento de identidad'] = password
        delete user.password
      }
      if (eventUser_email) {
        user.email = eventUser_email
        delete user.eventUser_email
      }
      if (eventUser_name) {
        user.name = eventUser_name
        delete user.eventUser_name
      }
      if (event_name) {
        user.event = event_name
        delete user.event_name
      }
      return user
    }).filter((user) => user.checkedin_at !== 'Sin registro'));

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Registered');
    writeFileXLSX(wb, `Inscritos_${dayjs().format('l')}.xlsx`);
  }, [usersSuscribedData])

  const getRegisteredUsers = async () => {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    // con//sole.log('orgEvents', orgEvents);
    const { data: orgUsers } = await OrganizationApi.getUsers(organizationId);
    // con//sole.log('orgUsers', orgUsers)

    const totalRegistered = (
      await Promise.all(
        orgEvents.map(async (orgEvent) => {
          const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
          const querySnapshot = await asistentes.get();
          // con//sole.log('querySnapshot', querySnapshot);

          const certificationsByEvent = await CerticationsApi.getByUserAndEvent(null, orgEvent._id);
          // con//sole.log('1. certificationsByEvent', certificationsByEvent);

          const registeredByEvent = querySnapshot.docs.map((doc) => {
            const infoEventUser = doc.data();
            // con//sole.log('infoEventUser', infoEventUser)
            const properties = {
              checkedin_at: infoEventUser?.checkedin_at
                ? formattedRealDate(infoEventUser?.checkedin_at)
                : 'Sin registro',
              account_id: infoEventUser?.account_id,
              eventUser_name: infoEventUser?.properties?.names,
              eventUser_email: infoEventUser?.properties?.email,
              validity_date: null,
              event_id: orgEvent._id,
              event_name: orgEvent.name,
              created_at: orgEvent.created_at,
              // Why "organiser"? anyway...
            };

            const userId = infoEventUser.account_id;
            const orgMember = orgUsers.find((member) => member.account_id === userId);

            // Inject the dynamic field
            const filteredDynamicField = (orgEvent.organiser.user_properties || []).filter(
              (data) => !['email', 'names'].includes(data.name),
            );
            if (orgMember) {
              filteredDynamicField.forEach((field) => {
                properties[field.name] = orgMember.properties[field.name];
              });
              properties['Documento de identidad'] = orgMember.properties.password
            } else return properties;

            // Inject the position
            properties.position = orgMember.position?.position_name;

            const userCertification = certificationsByEvent.find(
              (certificationByEvent) => certificationByEvent.user_id === infoEventUser?.account_id,
            );
            if (userCertification?.approved_until_date) {
              properties.validity_date = dayjs(userCertification.approved_until_date);
              properties.approved_until_date = dayjs(userCertification.approved_until_date);
              properties.approved_from_date = dayjs(userCertification.approved_from_date);
            } else {
              properties.validity_date = null;
              properties.approved_until_date = null;
              properties.approved_from_date = null;
            }

            return properties;
          });

          return registeredByEvent;
        }),
      )
    ).flat();

    console.log('totalRegistered', totalRegistered);
    setUsersSuscribedData(totalRegistered);
    setIsLoading(false);
  };

  function thisDataIndexWasFiltered(currentDataIndex, filterValue) {
    console.info('this dataIndex was filtered', currentDataIndex, filterValue)

    setFiltersToDataSource((previous) => {
      const clone = {...previous}
      if (typeof filterValue === 'undefined' || filterValue === undefined) {
        // Remove this dataIndex if the value is undefined only
        delete clone[currentDataIndex]
      } else {
        // Update the new value
        clone[currentDataIndex] = filterValue
      }
      return clone
    })
  }

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
    thisDataIndexWasFiltered,
  };

  const addNewCertificationModal = (item) => {
    console.log('item', item);
    openModal();
    setIsSettingFormValues(true);
    EventsApi.getOne(item.event_id).then((eventData) => {
      /**
       * Take the event data and set the default value for description,
       * entity and hours to create a new certification.
       */
      if (eventData) {
        form.setFieldsValue({
          description: eventData.default_certification_description,
          entity: eventData.default_certification_entity,
          hours: eventData.default_certification_hours ?? 1,
        })
      }
    }).finally(() => setIsSettingFormValues(false))
    setSelectedOrgMember(item);
  };

  const onFormFinish = (values) => {
    console.log('Se ejecuta OnFinish');
    console.log('values', values);
    console.log('selectedOrgMember', selectedOrgMember);

    values = { ...values, user_id: selectedOrgMember.account_id, event_id: selectedOrgMember.event_id };
    console.log('New values', values);

    setIsSubmiting(true);
    CerticationsApi.create(values).finally(() => {
      alert('Certificación guardada');
      setIsSubmiting(false);
      setIsLoading(true);
      closeModal();
      //loadData().finally(() => setIsLoading(false));
    });
  };

  const openModal = () => setIsModalOpened(true);
  const closeModal = () => setIsModalOpened(false);

  return (
    <>
      <Header title="Inscritos" description="Se muestran los usuarios inscritos a los cursos de la organización" />

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => exportXLSX()}
      >
        Exportar
      </Button>
      <Table
        columns={columns(columnsData, extraFields, addNewCertificationModal)}
        dataSource={usersSuscribedData}
        size="small"
        rowKey="index"
        pagination={false}
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />

      <Modal
        visible={isModalOpened}
        title={`Agrega una certificación a usuario: ${selectedOrgMember?.eventUser_name}`}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => closeModal()}
      >
        {isSettingFormValues ? (
          <>
          Cargando datos por defecto... <Spin />
          </>
        ) : undefined}
        <Form form={form} onFinish={onFormFinish} layout="vertical">
          {/* <Form.Item name="event_id" label="Curso a dar certificación" rules={[{ required: true, message: 'Esto' }]}>
            <Select //options={allEvents.map((event) => ({ label: event.name, value: event._id }))}
            />
          </Form.Item> */}
          <Form.Item name="success" label="Exitoso" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true, message: 'Agrega la descripción' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="hours" label="Horas" rules={[{ required: true, message: 'Agrega el número de horas' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="entity" label="Entidad">
            <Input />
          </Form.Item>
          <Form.Item
            name="approved_from_date"
            label="Fecha de aprobación"
            rules={[{ required: true, message: 'Agrega la fecha' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="approved_until_date"
            label="Fecha de vencimiento"
            rules={[{ required: true, message: 'Agrega la fecha' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="file_url"
            label="Archivo externo"
          >
            <PositionCertificationFileUploader path="positions" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default withContext(OrgRegisteredUsers);
