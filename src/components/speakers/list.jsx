import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
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
   const [loading, setLoading] = useState(true);
   const [speakersList, setSpeakersList] = useState([]);
   const [searchText, setSearchText] = useState('');
   const [searchedColumn, setSearchedColumn] = useState('');
   const [change, setChange] = useState(false);
   const [lists, setLists] = useState([]);

   useEffect(() => {
      fetchSpeakers();
   }, []);

   async function fetchSpeakers() {
      const data = await SpeakersApi.byEvent(props.eventID);

      let list = [];
      if (data) {
         list = data.sort((a, b) => (a.sort && b.sort ? a.sort - b.sort : true));
         list = list.map((speaker, index) => {
            return { ...speaker, index: speaker.sort == index ? speaker.sort : index };
         });
         list = list.sort((a, b) => a.index - b.index);
         setLoading(false);
         setSpeakersList(list);
         setLists(data);
      }
   }

   function remove(info) {
      const loading = message.open({
         key: 'loading',
         type: 'loading',
         content: <> Por favor espere miestras borra la información..</>,
       });
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
            const onHandlerRemoveSpeaker = async () => {
               try {
                  await SpeakersApi.deleteOne(info._id, eventId);
                  fetchSpeakers();
                  message.destroy(loading.key);
                  message.open({
                     type: 'success',
                     content: <> Se eliminó al conferencista correctamente!</>,
                  });
               } catch (e) {
                  message.destroy(loading.key);
                  message.open({
                    type: 'error',
                    content: handleRequestError(e).message,
                  });
               }
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
         let newData = arrayMove([].concat(speakersList), oldIndex, newIndex).filter((el) => !!el);
         if (newData) {
            newData = newData.map((speaker, key) => {
               return { ...speaker, index: key };
            });
         }
         setSpeakersList(newData);
      }
   }

   //FN para el draggable 2/3
   const DraggableContainer = (props) => (
      <SortableContainer useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
   );

   //FN para el draggable 3/3
   const DraggableBodyRow = ({ className, style, ...restProps }) => {
      const index = speakersList.findIndex((x) => x.index === restProps['data-row-key']);
      return <SortableItem index={index} {...restProps} />;
   };

   async function saveOrder() {
      const loadingSave = message.open({
         key: 'loading',
         type: 'loading',
         content: <> Por favor espere mientras se guarda la configuración..</>,
      });
      if (speakersList) {
         await Promise.all(
            speakersList.map(async (speaker, index) => {
               let speakerChange = { ...speaker, order: index + 1 };
               await SpeakersApi.editOne(speakerChange, speaker._id, props.eventId);
            })
         );
      }
      message.destroy(loadingSave.key);
      message.open({
         type: 'success',
         content: <> Configuración guardada correctamente!</>,
      });
      setChange(false);
      fetchSpeakers();
   }

   function onMove () {
      setChange(JSON.stringify(lists) !== JSON.stringify(speakersList));
   }

   const columsData = {
      data: props,
      searchedColumn: searchedColumn,
      handleSearch,
      handleReset,
      remove,
      searchText: searchText,
      move: onMove
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
            save={saveOrder}
            pendingChanges={change}
         />

         {/* En esta tabla en particular viene por defecto el paginamiento, por lo que no necesita llamar a algún otro método para su funcionamiento (se tuvo que colocar false para no venir la paginación) */}
         <Table
            columns={columns(columsData)}
            dataSource={speakersList}
            size='small'
            rowKey='index'
            loading={loading}
            hasData={speakersList.length > 0}
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
