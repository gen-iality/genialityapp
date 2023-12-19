import { useCallback, useEffect, useState } from 'react';
import { MenuBase, MenuItem, MenuLandingProps } from '../interfaces/menuLandingProps';
import defaultMenu from '../utils/defaultMenu';
import { DefaultMenu, MenuKeys } from '../interfaces/menuDefault';
import { eventService } from '@/services';
import { DispatchMessageService } from '@/context/MessageService';
import { orderByChecked, sortByPosition } from '../utils/reorderListMenu';
import { convertArrayToObject } from '../utils';
import { organizationService } from '@/services/organization.service';

const IS_ORGANIZATION_CMS = 1;
export const useMenuLanding = (props: MenuLandingProps) => {
  const [menuListToTable, setMenuListToTable] = useState<MenuItem[]>([]);
  const [isLoadingMenuTable, setIsLoadingMenuTable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getListMenu = useCallback(async () => {
    setIsLoadingMenuTable(true);
    let menuItems: Partial<DefaultMenu> = {};
    if (props.organization === IS_ORGANIZATION_CMS) {
      menuItems = props.organizationObj.itemsMenu;
    } else {
      const { data, error } = await eventService.getById(props.event._id);

      if (error) {
        setMenuListToTable([]);
        DispatchMessageService({
          type: 'error',
          action: 'show',
          msj: 'No se pudo cargar la lista de menus',
        });
        setIsLoadingMenuTable(false);
        return;
      }

      menuItems = data.itemsMenu;
    }
    const menuList: Partial<DefaultMenu> = menuItems ?? ({} as Partial<DefaultMenu>);

    const tableListMenu: MenuItem[] = Object.keys(defaultMenu).map((menuKey) => {
      if (menuList[menuKey as MenuKeys]) {
        return menuList[menuKey as MenuKeys] as MenuItem;
      }

      return {
        ...defaultMenu[menuKey as MenuKeys],
        checked: false,
      };
    });

    setMenuListToTable(sortByPosition(tableListMenu));
    setIsLoadingMenuTable(false);
    return tableListMenu;
  }, [props]);

  const checkedMenu = (checked: boolean, menuName: string) => {
    setMenuListToTable((currentMenuList) => {
      let updatedMenuList = currentMenuList.map((menuItem) => {
        if (menuItem.name === menuName) {
          return {
            ...menuItem,
            checked,
          };
        }
        return menuItem;
      });
      updatedMenuList = orderByChecked(updatedMenuList);
      return updatedMenuList;
    });
  };

  const editMenu = (newMenu: MenuItem) => {
    const newMenuList = menuListToTable.map((menuItem) => {
      if (menuItem.name === newMenu.name) {
        return newMenu;
      }
      return menuItem;
    });
    setMenuListToTable(newMenuList);
    checkedMenu(newMenu.checked, newMenu.name);
  };

  const savedMenuList = async () => {
    setIsSaving(true);
    const menuListToSave = menuListToTable
      .filter((menuItem) => menuItem.checked)
      .map((menuItem, index) => ({
        ...menuItem,
        position: index + 1,
      }));
    if (menuListToSave.length === 0) {
      setIsSaving(false);
      return DispatchMessageService({
        action: 'show',
        type: 'info',
        msj: 'Debe habilitar por lo menos un menu',
      });
    }
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });

    let newMenu: MenuBase = convertArrayToObject(menuListToSave, 'section');

    if (props.organization === IS_ORGANIZATION_CMS) {
      const { error } = await organizationService.editOrganization(props.organizationObj._id, { itemsMenu: newMenu });
      if (error) {
        DispatchMessageService({
          type: 'error',
          msj: 'Hubo un error al guardar la información',
          action: 'show',
        });
      }

      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente',
        action: 'show',
      });
    } else {
      const { error } = await eventService.editEvent(props.event._id, { itemsMenu: newMenu });
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      if (error) {
        DispatchMessageService({
          type: 'error',
          msj: 'Hubo un error al guardar la información',
          action: 'show',
        });
      }

      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente',
        action: 'show',
      });
    }

    setIsSaving(false);
  };

  const handleDragEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex && menuListToTable[oldIndex].checked) {
      const enabledItems = menuListToTable.filter((item) => item?.checked);
      const disabledItems = menuListToTable.filter((item) => !item.checked);
      const movedItem = enabledItems.splice(oldIndex, 1)[0];
      enabledItems.splice(newIndex, 0, movedItem);

      const updatedData = [...enabledItems, ...disabledItems];
      const updatedDataWithPositions: MenuItem[] = updatedData.map((item, index) => {
        return {
          checked: item.checked,
          icon: item.icon,
          name: item.name,
          label: item.label ?? '',
          section: item.section,
          permissions: item.permissions,
          position: item.position,
        };
      });
      setMenuListToTable(updatedDataWithPositions);
    }
  };

  useEffect(() => {
    getListMenu();
  }, [getListMenu]);

  return {
    menuListToTable,
    isLoadingMenuTable,
    checkedMenu,
    editMenu,
    savedMenuList,
    isSaving,
    handleDragEnd,
  };
};
