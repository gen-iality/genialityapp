import { EventsApi } from '@/helpers/request';
import DragIcon from '@2fd/ant-design-icons/lib/DragVertical';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { isNumber } from 'ramda-adjunct';

export const messageDinamic = (type) => {
  switch (type) {
    case 'image':
      return 'imagen';
    case 'text':
      return 'texto';
    case 'video':
      return 'video';

    default:
      break;
  }
};

export const editItem = (item, setItem, setType) => {
  setItem(item);
  setType(item.type);
};

export const DragHandle = SortableHandle(() => (
  <DragIcon
    style={{
      cursor: 'move',
      color: '#999999',
      fontSize: '28px',
    }}
  />
));

export const styleCardButton = {
  height: '130px',
  width: '110px',
  display: 'grid',
  placeContent: 'center',
  borderRadius: '8px',
};

export const SortableItem = SortableElement((props) => <tr {...props} />);
export const SortableBody = SortableContainer((props) => <tbody {...props} />);

export const openNotification = () => {
  notification.info({
    message: 'No hay más cambios que guardar',
    placement: 'bottomRight',
  });
};

//GUARDAR SECCIONES DESCRIPCIPON
export const saveOrder = async (dataSource, setIsOrderUpdate, setLoading) => {
  const newList = updateIndexTotal(dataSource);
  setLoading(true);
  await Promise.all(
    newList.map(async (item) => {
      const updateIndexSections = await EventsApi.updateSectionOne(item._id, item);
    })
  );
  setIsOrderUpdate(false);
  setLoading(false);
};

//PERMITE ACTUALIZAR LOS INDICES
export const updateIndexTotal = (lista) => {
  let newList = lista.sort((a, b) => a.index > b.index);
  newList = lista.map((data, index) => {
    return { ...data, index: index };
  });
  return newList;
};

// PERMITE ELIMINAR UN ITEM
export const deleteItem = async (item, dataSource, setDataSource) => {
  let newList = dataSource.filter((data) => data._id !== item._id);
  const resp = await EventsApi.deleteSections(item._id);
  newList = updateIndexTotal(newList);
  await Promise.all(
    newList.map(async (item) => {
      const updateIndexSections = await EventsApi.updateSectionOne(item._id, item);
    })
  );
  setDataSource(newList);
};

export const obtenerIndex = (dataSource) => {
  let data = dataSource?.sort((a, b) => a.index > b.index);
  return data?.length + 1;
};

export const saveItem = async (item, setLoading, dataSource, setItem, cEvent, setDataSource) => {
  setLoading(true);
  let newList = [];
  let resp;
  if (item && !isNumber(item.index)) {
    const itemIndex = { ...item, index: obtenerIndex(dataSource) };
    newList = [...dataSource, itemIndex];
    resp = await addSectionToDescription(itemIndex, cEvent);
  } else {
    resp = updateItem(item, dataSource);
  }
  if (resp) {
    setTimeout(async () => {
      await obtenerDescriptionSections(setLoading, cEvent, setDataSource);
      setLoading(false);
    }, 800);
    setItem(null);
  } else {
    message.error('Error al guardar la sección');
  }
};

export const addSectionToDescription = async (section, cEvent) => {
  const sectionEvent = { ...section, event_id: cEvent.value._id };
  const saveSection = await EventsApi.saveSections(sectionEvent);
  if (saveSection?._id) {
    return true;
  }
  return false;
};

export const updateItem = async (item, dataSource) => {
  const newList = dataSource.map((data) => {
    if (data.index == item?.index) {
      return item;
    } else {
      return data;
    }
  });
  const sectionUpdate = await EventsApi.updateSectionOne(item._id, item);
  return newList;
};

export const obtenerDescriptionSections = async (setLoading, cEvent, setDataSource) => {
  setLoading(true);
  const sections = await EventsApi.getSectionsDescriptions(cEvent.value._id);
  let dataOrder = sections.data.sort((a, b) => a.index - b.index);
  setDataSource(dataOrder || []);
  setLoading(false);
};
