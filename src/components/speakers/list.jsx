import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { Table, Modal, notification, message } from 'antd';
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
            // save={saveOrder}
         />

         <Table
            columns={columns(columnsData)}
            dataSource={sortAndIndexSpeakers()}
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
