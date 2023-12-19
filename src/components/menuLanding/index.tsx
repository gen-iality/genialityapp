import { Spin, Form, Table } from 'antd';
import Header from '@/antdComponents/Header';
import BackTop from '@/antdComponents/BackTop';
import { MenuItem, MenuLandingProps } from './interfaces/menuLandingProps';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import EditMenuItem from './components/ModalEdit';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { columnsMenuItems } from './utils';
import { useMenuLanding } from './hooks/useMenuLanding';
import { useModalLogic } from '@/hooks/useModalLogic';

export default function MenuLanding(props: MenuLandingProps) {
  const {
    isLoadingMenuTable,
    menuListToTable,
    checkedMenu,
    editMenu,
    savedMenuList,
    isSaving,
    handleDragEnd,
  } = useMenuLanding(props);
  const { closeModal, openModal, isOpenModal, handledSelectedItem, selectedItem } = useModalLogic<MenuItem>();

  const handledOpenDrawer = (menuItem: MenuItem) => {
    handledSelectedItem(menuItem);
    openModal();
  };

  const SortableItem: any = SortableElement((props: any) => <tr {...props} />);
  const SortableBody: any = SortableContainer((props: any) => <tbody {...props} />);

  return (
    <Form onFinish={savedMenuList}>
      <Header title={'Habilitar secciones del evento'} save form loadingSave={isSaving} />
      {isOpenModal && selectedItem && (
        <EditMenuItem menuItem={selectedItem} closeDrawer={closeModal} isOpenDrawer={isOpenModal} editMenu={editMenu} />
      )}

      <Spin tip='Cargando...' size='large' spinning={isLoadingMenuTable}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='menu'>
            {(provided: any) => (
              <Table
                ref={provided.innerRef}
                tableLayout='auto'
                style={{ padding: '30px 0', cursor: 'pointer' }}
                // dataSource={[...menuChecked, ...menuNoChecked]}
                dataSource={menuListToTable}
                columns={columnsMenuItems(checkedMenu, handledOpenDrawer)}
                pagination={false}
                bordered={false}
                size='small'
                components={{
                  body: {
                    wrapper: (props: any) => (
                      <SortableBody {...props} useDragHandle helperClass='row-dragging' onSortEnd={handleDragEnd} />
                    ),
                    row: (props: any) => <SortableItem index={props['data-row-key']} {...props} />,
                  },
                }}
                //@ts-ignore
                onRow={(record: any, index: number | undefined) => ({
                  index,
                  'data-row-key': record.key,
                })}
                rowKey='key'
              />
            )}
          </Droppable>
        </DragDropContext>
      </Spin>
      <BackTop />
    </Form>
  );
}
