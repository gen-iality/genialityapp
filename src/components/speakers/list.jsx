import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { Table, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Header from '../../antdComponents/Header';
import { columns } from './columns';

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const { confirm } = Modal;

function SpeakersList(props) {
   const [searchText, setSearchText] = useState('');
   const [searchedColumn, setSearchedColumn] = useState('');

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

   function remove(info) {
      //Se coloco la constante "eventId" porque se perdia al momento de hacer la llamada al momento de eliminar
      const eventId = props.eventID;
      confirm({
         title: `¿Está seguro de eliminar a ${info.name}?`,
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

   //FN para búsqueda en la tabla 2/3
   function handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
   }

   //FN para búsqueda en la tabla 3/3
   function handleReset(clearFilters) {
      clearFilters();
      setSearchText('');
   }

   //FN para el draggable 1/3
   function onSortEnd({ oldIndex, newIndex }) {
      if (oldIndex !== newIndex) {
         let newData = arrayMove([].concat(sortAndIndexSpeakers()), oldIndex, newIndex).filter((el) => !!el);
         if (newData) {
            newData = newData.map((speaker, key) => {
               return { ...speaker, index: key };
            });
         }
         updateOrDeleteSpeakers.mutateAsync({ newData, state: 'update' });
      }
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

   //FN para el draggable 2/3
   const DraggableContainer = (props) => (
      <SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
   );

   //FN para el draggable 3/3
   const DraggableBodyRow = ({ className, style, ...restProps }) => {
      const index = sortAndIndexSpeakers()?.findIndex((x) => x.index === restProps['data-row-key']);
      return <SortableItem index={index} {...restProps} />;
   };

   const columnsData = {
      data: props,
      searchedColumn: searchedColumn,
      handleSearch,
      handleReset,
      remove,
      searchText: searchText,
   };

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
            columns={columns(columnsData)}
            dataSource={sortAndIndexSpeakers()}
            size='small'
            rowKey='index'
            loading={isLoading}
            hasData={sortAndIndexSpeakers()}
            components={{
               body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
               },
            }}
            pagination={false}
         />
      </div>
   );
}

export default withRouter(SpeakersList);
