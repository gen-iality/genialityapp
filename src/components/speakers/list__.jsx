import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { Modal, message, Row, Col, Popover, Image, Empty, Avatar, Switch } from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
/* import { columns } from './columns'; */
import CMS from '../newComponent/CMS';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';
import { getColumnSearchProps } from './getColumnSearch';

const { confirm } = Modal;

function SpeakersList(props) {
  let [columnsData, setColumnsData] = useState({});
  const columns = [
   {
      title: 'Imagen',
      dataIndex: 'image',
      render(val, item) {
         /*
          * Dentro de la imagen se realizó al momento de mostrar en la tabla un Avatar, para darle mejor apariencia.
          * Para ver más amplia la imagen se realizó un popover con la etiqueta de "Image" que permite ver mejor la imagen
          */
         return (
            <Row gutter={8}>
               <Col>
                  <Popover
                     placement='top'
                     content={() => (
                        <>
                           {item.image ? (
                              <Image key={'img' + item._id} width={200} height={200} src={item.image} />
                           ) : (
                              <Empty description='Imagen no encontrada' />
                           )}
                        </>
                     )}>
                     {item.image ? (
                        <Avatar key={'img' + item._id} src={item.image} />
                     ) : (
                        <Avatar icon={<UserOutlined />} />
                     )}
                  </Popover>
               </Col>
            </Row>
         );
      },
   },
   {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name', columnsData),
   },
   {
      title: 'Profesión',
      dataIndex: 'profession',
      ...getColumnSearchProps('profession', columnsData),
   },
   {
      title: 'Visible',
      dataIndex: 'published',
      render(val, item) {
         const [publish, setPublish] = useState(item.published);
         const update = async (checked) => {
            item.published = checked;
            const res = await SpeakersApi.editOne(item, item._id, item.event_id);
            if (res) setPublish(res.published);
         };
         return <Switch checkedChildren='Sí' unCheckedChildren='No' onChange={update} checked={publish} id={`editSwitch${item.index}`} />;
      },
   }
  ];

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery('getSpeakersByEvent', () => SpeakersApi.byEvent(props.eventID));

   function sortAndIndexSpeakers() {
      let list = [];
      if (data) {
         list = data.sort((a, b) => (a.sort && b.sort ? a.sort - b.sort : true));
         list = list.map((speaker, index) => {
            return { ...speaker, index: speaker.sort == index ? speaker.sort : index };
         });
         list = list.sort((a, b) => a.index - b.index);

         return list;
      }
   }

   function remove(id) {
      //Se coloco la constante "eventId" porque se perdia al momento de hacer la llamada al momento de eliminar
      const eventId = props.eventID;
      confirm({
         title: `¿Está seguro de eliminar la información?`,
         icon: <ExclamationCircleOutlined />,
         content: 'Una vez eliminado, no lo podrá recuperar',
         okText: 'Borrar',
         okType: 'danger',
         cancelText: 'Cancelar',
         onOk() {
            const onHandlerRemoveSpeaker = () => {
               updateOrDeleteSpeakers.mutateAsync({ speakerData: info, eventId });
            };
            onHandlerRemoveSpeaker();
         },
      });
   }

   const updateOrDeleteSpeakers = useMutation(
      'getSpeakersByEvent',
      (queryData) => {
         if (queryData.state === 'update') {
            queryData.newData.map((speaker, index) => {
               let speakerChange = { ...speaker, order: index + 1 };
               SpeakersApi.editOne(speakerChange, speaker._id, props.eventId);
            });
         } else {
            SpeakersApi.deleteOne(queryData.speakerData._id, queryData.eventId);
         }
      },
      {
         // Optimistically update the cache value on mutate, but store
         // the old value and return it so that it's accessible in case of
         // an error
         onMutate: async () => {
            //
            await queryClient.cancelQueries('getSpeakersByEvent');
            const previousValue = queryClient.getQueryData('getSpeakersByEvent');
            return previousValue;
         },
         // On failure, roll back to the previous value
         onError: (err, queryData, previousValue) => {
            if (queryData.state === 'update') {
               queryClient.setQueryData('getSpeakersByEvent', () => previousValue);
               message.open({
                  type: 'error',
                  content: <> Hubo un error al guardar la posición del speaker!</>,
               });
            } else {
               message.open({
                  type: 'error',
                  content: `Hubo un error intentando borrar a ${queryData.speakerData.name}`,
               });
            }
         },
         // After success , refetch the query
         onSuccess: (data, queryData, previousValue) => {
            if (queryData.state === 'update') {
               queryClient.setQueryData('getSpeakersByEvent', queryData.newData);
               message.open({
                  type: 'success',
                  content: <> Posición del speaker guardada correctamente!</>,
               });
            } else {
               queryClient.fetchQuery('getSpeakersByEvent', SpeakersApi.byEvent(queryData.eventId), {
                  staleTime: 500,
               });
               message.open({
                  type: 'success',
                  content: `Se eliminó a ${queryData.speakerData.name}`
               });
            }
         },
      }
   );

   const changeToUpdate = (newData) => {
      console.log(newData, 'aaaaaa');
      updateOrDeleteSpeakers.mutate({newData, state: 'update'})
   }

   return (
      <div>
         <Header
            title={'Conferencistas'}
            titleTooltip={'Agregue o edite las personas que son conferencistas'}
            addUrl={{
               pathname: `${props.matchUrl}/speaker`,
               state: { new: true },
            }}
         />

         <Table
            header={columns}
            list={sortAndIndexSpeakers()}
            key='index'
            loading={isLoading}
            search
            setColumnsData={setColumnsData}
            draggable
            actions
            editPath={`${props.matchUrl}/speaker`}
            setList={changeToUpdate}
            remove={remove}
            pagination={false}
         />
      </div>
   );
}

export default withRouter(SpeakersList);
