import { useEffect, useState } from 'react';
import menu from '../utils/defaultMenu.json';
import { Actions, OrganizationApi } from '@/helpers/request';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import { DispatchMessageService } from '@/context/MessageService';
import { MenuBase, MenuItem, MenuLandingProps } from '../interfaces/menuLandingProps';
import { deepCopy } from '../utils/functions';

export default function useMenuLanding(props: MenuLandingProps) {
  const menuBase = deepCopy(menu)
  const { organizationObj, organization, event } = props;
  const [itemsMenu, setItemsMenu] = useState<Record<string, MenuItem>>({...menu});
  const [keySelect, setKeySelect] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ORGANIZATION_VALUE = 1;

  const mapActiveItemsToAvailable = (key: string, value: boolean) => {
    const itemsMenuDB = { ...itemsMenu };
    itemsMenuDB[key].checked = value;
    if (!value) {
      itemsMenuDB[key] = menuBase[key];
      itemsMenuDB[key].name = menuBase[key].name;
    }
    setItemsMenu(itemsMenuDB);
  };

  async function componentDidMount() {
    let menuLanding: { itemsMenu: MenuBase } | null = null   
    if (organization !== ORGANIZATION_VALUE) {
      let token = await GetTokenUserFirebase();
      menuLanding = await Actions.getAll(`/api/events/${event?._id}?token=${token}`);
    } else {
      setItemsMenu(organizationObj.itemsMenu || []);
    }
    if (menuLanding) {
      for (const prop in menuLanding.itemsMenu) {
        const { name, position, markup, permissions, checked } = menuLanding.itemsMenu[prop];
        mapActiveItemsToAvailable(prop, checked);
        updateValue(prop, markup, 'markup');
        updateValue(prop, name, 'name');
        updateValue(prop, position, 'position');
        updateValue(prop, permissions, 'permissions');
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    componentDidMount();
  }, []);


  function updateValue(key: string, value: string | number | boolean, index: string) {
    let itemsMenuDB: Record<string, MenuItem> = Object.assign({}, itemsMenu);
    !!value && itemsMenuDB[key] && (itemsMenuDB[key][index] = value);
    setItemsMenu(itemsMenuDB);
    index === 'permissions' && setKeySelect(Date.now());
  }


  function orderPosition(key: string, order: string | number): void {
    let itemsMenuToOrder = Object.assign({}, itemsMenu);
    itemsMenuToOrder[key].position = order !== '' ? parseInt(String(order)) : 0;
    itemsMenu[key].position = itemsMenuToOrder[key].position;
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

  async function submit() {
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
        itemsMenu: { ...menuToSubmit },
      };
      await OrganizationApi.editMenu({ itemsMenu: menuToSubmit }, updateOrganization._id);
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
  }

  function orderItemsMenu() {
    let itemsMenuData: MenuBase = {};
    let itemsMenuToSave: MenuBase = {};
    let items: MenuItem[] = Object.values(itemsMenu);

    items.sort(function(a: MenuItem, b: MenuItem) {
      if (a.position && b.position) {
        return a.position - b.position;
      } else {
        return 0;
      }
    });

    for (let item of items) {
      itemsMenuData[item.section] = item;
    }

    itemsMenuToSave = { ...itemsMenuData };

    return itemsMenuToSave;
  }

  /*   const validation = (key: string): boolean => {
    return (
      (menu[key].section === 'networking' ||
        menu[key].section === 'interviews' ||
        menu[key].section === 'my_sessions') &&
      event?.visibility === 'ANONYMOUS'
    );
  }; */

  const titleheader =
    organization !== ORGANIZATION_VALUE ? 'Habilitar secciones del evento' : 'Secciones a habilitar para cada evento';

  return {
    menu: itemsMenu,
    keySelect,
    isLoading,
    titleheader,
    updateValue,
    orderPosition,
    submit,
    // validation,
    mapActiveItemsToAvailable,
  };
}
