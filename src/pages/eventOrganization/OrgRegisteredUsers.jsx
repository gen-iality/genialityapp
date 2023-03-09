/** React's libraries */
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { DatePicker, Form, Input, InputNumber, Select, Switch, Table, Modal, Button } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, CerticationsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';
import { DownloadOutlined } from '@ant-design/icons';

/** export Excel */
import { utils, writeFileXLSX } from 'xlsx';

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

  const [extraFields, setExtraFields] = useState([]);

  useEffect(() => {
    getRegisteredUsers();
    setExtraFields(props.org.user_properties.filter((item) => !['email', 'names'].includes(item.name)));
  }, [isSubmiting]);

  function formattedRealDate(timestamp) {
    const segundos = timestamp?.seconds;
    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    return formattedDate;
  }

  const exportPDF = useCallback(() => {
    console.log('exporting to PDF....')
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
    }));
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
            }

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

  const columnsData = {
    searchedColumn,
    setSearchedColumn,
    searchText,
    setSearchText,
  };

  const addNewCertificationModal = (item) => {
    console.log('item', item);
    openModal();
    setSelectedOrgMember(item);
    //setEditMember(true);
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
        onClick={() => exportPDF()}
      >
        Exportar PDF
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
      {console.log('selectedOrgMember', selectedOrgMember)}
      {console.log('selectedOrgMember?.eventUser_name', selectedOrgMember?.eventUser_name)}

      <Modal
        visible={isModalOpened}
        title={`Agrega una certificación a usuario: ${selectedOrgMember?.eventUser_name}`}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={onFormFinish}>
          {/* <Form.Item name="event_id" label="Curso a dar certificación" rules={[{ required: true, message: 'Esto' }]}>
            <Select //options={allEvents.map((event) => ({ label: event.name, value: event._id }))}
            />
          </Form.Item> */}
          <Form.Item name="success" label="Exitoso">
            <Switch />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true, message: 'Ah!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hours" label="Horas" rules={[{ required: true, message: 'Ah!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="entity" label="Entidad" rules={[{ required: true, message: 'Ah!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="approved_from_date"
            label="Fecha de aprobación"
            rules={[{ required: true, message: 'Cuándo!' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="approved_until_date"
            label="Fecha de vencimiento"
            rules={[{ required: true, message: 'Cuándo!' }]}
            initialValue={dayjs(Date.now())}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default withContext(OrgRegisteredUsers);
