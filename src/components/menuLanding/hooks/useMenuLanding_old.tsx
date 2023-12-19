import { useEffect, useState } from 'react';
// import menu from '../utils/defaultMenu.json';
import menu from '../utils/defaultMenu';
import { Actions, OrganizationApi } from '@/helpers/request';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import { DispatchMessageService } from '@/context/MessageService';
import { Menu, MenuBase, MenuItem, MenuLandingProps } from '../interfaces/menuLandingProps';
import { convertArrayToObject, deepCopy } from '../utils/functions';
import debounce from 'lodash/debounce';

export default function useMenuLanding_old(props: MenuLandingProps) {
  const { organizationObj, organization, event } = props;
  const [itemsMenu, setItemsMenu] = useState<Record<string, MenuItem>>(deepCopy(menu));
  const [keySelect, setKeySelect] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Menu[]>([]);

  const debouncedSubmit = debounce(submit, 500);
  const ORGANIZATION_VALUE = 1;

  const checkedItem = (key: string, value: boolean) => {
    const menuBase: MenuBase = { ...menu };
    const itemsMenuDB = { ...itemsMenu };
    const enabledItems = data.filter((item) => item.checked);
    if (value) {
      const firstPosition = enabledItems.length === 0;
      const position = firstPosition ? 1 : enabledItems[enabledItems.length - 1].position;
      itemsMenuDB[key].checked = value;
      itemsMenuDB[key].position = firstPosition ? position : position + 1;
    } else {
        itemsMenuDB[key].checked = value;
        itemsMenuDB[key].name = menuBase[key].name;
        itemsMenuDB[key].position = menuBase[key].position;
    }
      setIsLoading(true);
      setItemsMenu(itemsMenuDB);
      debouncedSubmit();

  };

  async function componentDidMount() {
    let menuLanding: { itemsMenu: MenuBase } | null = null;
    if (organization !== ORGANIZATION_VALUE) {
      let token = await GetTokenUserFirebase();
      menuLanding = await Actions.getAll(`/api/events/${event?._id}?token=${token}`);
    } else {
      menuLanding = { itemsMenu: organizationObj.itemsMenu || [] };
    }

    if (menuLanding) {
      const menuCopy = { ...itemsMenu };
      for (const key in menuLanding.itemsMenu) {
        if (menuCopy[key]) menuCopy[key] = { ...menuLanding.itemsMenu[key] };
      }
      setItemsMenu(menuCopy);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  function updateValue(key: string, value: string | number | boolean, property: string) {
    let itemsMenuDB = { ...itemsMenu };
    if (value && itemsMenuDB[key]) itemsMenuDB[key][property] = value;
    setItemsMenu(itemsMenuDB);
    debouncedSubmit();
    if (property === 'permissions') setKeySelect(Date.now());
  }

  function orderPosition(key: string, order: string | number): void {
    let itemsMenuToOrder = Object.assign({}, itemsMenu);
    itemsMenuToOrder[key].position = order !== '' ? parseInt(String(order)) : 0;
    setItemsMenu(itemsMenuToOrder);
  }

  const filterMenu = (menu: Record<string, MenuItem>) => {
    let menuFilter: Record<string, MenuItem> = {};
    for (let key in menu) {
      if (menu[key].checked) {
        menuFilter[key] = menu[key];
      }
    }
    return menuFilter;
  };
  const handleDragEnd = ({ oldIndex, newIndex }: any) => {

    if (oldIndex !== newIndex && data[oldIndex].checked) {
      const enabledItems = data.filter((item) => item?.checked);
      const disabledItems = data.filter((item) => !item.checked);
      

      const movedItem = enabledItems.splice(oldIndex, 1)[0];
      enabledItems.splice(newIndex, 0, movedItem);

      const updatedData = [...enabledItems, ...disabledItems];

      const updatedDataWithPositions: MenuItem[] = updatedData.map((item, index) => ({
        checked: item.checked,
        icon: item.icon,
        name: item.name,
        label: item.label ?? '',
        section: item.key,
        permissions: item.permissions,
        position: item.checked ? enabledItems.findIndex((enabledItem) => enabledItem === item) + 1 : item.position,
      }));
      const newMenu = convertArrayToObject<MenuItem>(updatedDataWithPositions, 'section');
      setItemsMenu(newMenu);
    }
  };

  async function submit() {
    setIsLoading(true);
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });
    let menuToSubmit = orderItemsMenu();

    let newMenu = { itemsMenu: filterMenu(menuToSubmit) };

    if (organization !== 1) {
      let token = await GetTokenUserFirebase();
      await Actions.put(`api/events/${event._id}?token=${token}`, newMenu);
    } else {
      let updateOrganization: { _id: string; itemsMenu: Record<string, MenuItem> } = {
        ...organizationObj,
        itemsMenu: newMenu.itemsMenu,
      };
      await OrganizationApi.editMenu({ itemsMenu: newMenu.itemsMenu }, updateOrganization._id);
    }
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Información guardada correctamente',
      action: 'show',
    });
    setIsLoading(false);
  }

  function orderItemsMenu() {
    let itemsMenuData: MenuBase = {};
    let itemsMenuToSave: MenuBase = {};
    let items: MenuItem[] = Object.values(itemsMenu);

    items.sort(function(a: MenuItem, b: MenuItem) {
      return a.position - b.position;
    });

    for (let item of items) {
      itemsMenuData[item.section] = item;
    }

    itemsMenuToSave = { ...itemsMenuData };

    return itemsMenuToSave;
  }

  const titleheader =
    organization !== ORGANIZATION_VALUE ? 'Habilitar secciones del evento' : 'Secciones a habilitar para cada evento';

  return {
    menu: itemsMenu,
    keySelect,
    isLoading,
    titleheader,
    data,
    setData,
    updateValue,
    handleDragEnd,
    submit,
    setItemsMenu,
    // validation,
    checkedItem,
  };
}
