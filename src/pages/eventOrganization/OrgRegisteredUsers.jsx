/** React's libraries */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** Antd imports */
import { DatePicker, Form, Input, InputNumber, Select, Switch, Table, Modal } from 'antd';

/** Components */
import Header from '@antdComponents/Header';
import { columns } from './tableColums/registeredTableColumns';

/** Helpers and utils */
import { OrganizationApi, CerticationsApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

/** Context */
import withContext from '@context/withContext';

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

  useEffect(() => {
    getRegisteredUsers();
  }, [isSubmiting]);

  function formattedRealDate(timestamp) {
    const segundos = timestamp?.seconds;
    const formattedDate = dayjs.unix(segundos).format('YYYY-MM-DD');
    return formattedDate;
  }

  const getRegisteredUsers = async () => {
    const { data: orgEvents } = await OrganizationApi.events(organizationId);
    console.log('orgEvents', orgEvents);

    const totalRegistered = (
      await Promise.all(
        orgEvents.map(async (orgEvent) => {
          const asistentes = firestore.collection(`${orgEvent._id}_event_attendees`);
          const querySnapshot = await asistentes.get();
          console.log('querySnapshot', querySnapshot);

          const certificationsByEvent = await CerticationsApi.getByUserAndEvent(null, orgEvent._id);
          console.log('1. certificationsByEvent', certificationsByEvent);

          const registeredByEvent = querySnapshot.docs.map((doc) => {
            const infoEventUser = doc.data();
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
            };

            const userCertification = certificationsByEvent.find(
              (certificationByEvent) => certificationByEvent.user_id === infoEventUser?.account_id,
            );
            console.log('1. certification', userCertification);
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
      {console.log('usersSuscribedData', usersSuscribedData)}
      <Table
        columns={columns(columnsData, addNewCertificationModal)}
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
