import { useEffect, useState } from 'react';
import menu from '../utils/defaultMenu.json';
import { Actions, OrganizationApi } from '@/helpers/request';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';
import { DispatchMessageService } from '@/context/MessageService';
import { MenuBase, MenuItem, MenuLandingProps } from '../interfaces/menuLandingProps';

export default function useMenuLanding(props: MenuLandingProps) {
  /* This code is defining a custom React hook called `useMenuLanding` that takes in a `MenuLandingProps`
object as its argument. The hook initializes state variables `itemsMenu`, `keySelect`, and
`isLoading` using the `useState` hook. */
  const { organizationObj, organization, event } = props;
  const [itemsMenu, setItemsMenu] = useState<Record<string, MenuItem>>(menu || {});
  const [keySelect, setKeySelect] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* The `ORGANIZATION_VALUE` constant is being assigned the value of `1`. It is likely being used as a
comparison value later in the code to determine if the `organization` prop passed to the
`useMenuLanding` hook is equal to `1`. */

  const ORGANIZATION_VALUE = 1;
  /**
   * This function updates the state of a menu item's checked status based on a given key.
   * @param {string} key - The `key` parameter is a string that represents the unique identifier of an
   * item in a menu. It is used to update the `checked` property of the corresponding item in the
   * `itemsMenu` object.
   */

  const mapActiveItemsToAvailable = (key: string) => {
    const menuBase: MenuBase = { ...menu };
    const itemsMenuDB = { ...itemsMenu };
    itemsMenuDB[key].checked = !itemsMenuDB[key].checked;
    if (itemsMenuDB[key].checked) {
      itemsMenuDB[key] = menuBase[key];
      itemsMenuDB[key].name = menuBase[key].name;
    }
    setItemsMenu(itemsMenuDB);
  };

  /* The `componentDidMount` function is an asynchronous function that is called when the component
 using the `useMenuLanding` hook mounts. It first initializes a variable `menuLanding` to `null`. If
 the `organization` prop passed to the hook is not equal to `ORGANIZATION_VALUE` (which is `1`), it
 calls the `GetTokenUserFirebase` function to get a token, and then uses that token to make a GET
 request to the `/api/events/${event?._id}` endpoint using the `Actions.getAll` function. The
 response is then assigned to the `menuLanding` variable. If the `organization` prop is equal to
 `ORGANIZATION_VALUE`, it sets the `itemsMenu` state variable to the `itemsMenu` property of the
 `organizationObj` prop passed to the hook. */
  async function componentDidMount() {
    let menuLanding: { itemsMenu: MenuBase } | null = null;
    if (organization !== ORGANIZATION_VALUE) {
      let token = await GetTokenUserFirebase();
      menuLanding = await Actions.getAll(`/api/events/${event?._id}?token=${token}`);
    } else {
      setItemsMenu(organizationObj.itemsMenu || []);
    }

    if (menuLanding) {
      for (const prop in menuLanding.itemsMenu) {
        const { name, position, markup, permissions } = menuLanding.itemsMenu[prop];
        mapActiveItemsToAvailable(prop);
        updateValue(prop, markup, 'markup');
        updateValue(prop, name, 'name');
        updateValue(prop, position, 'position');
        updateValue(prop, permissions, 'permissions');
      }
    }
    setIsLoading(false);
  }
  /* The `useEffect` hook is being used to call the `componentDidMount` function when the component using
the `useMenuLanding` hook mounts. The empty array `[]` passed as the second argument to `useEffect`
ensures that the effect only runs once, when the component mounts. */
  useEffect(() => {
    componentDidMount();
  }, []);

  /**
   * This function updates a value in a menu item object and sets the state of the menu items.
   * @param {string} key - a string representing the key of an object in the itemsMenu variable.
   * @param {string | number | boolean} value - The value parameter is a variable that can hold a string,
   * number, or boolean value. It is used to update the value of a specific property in the MenuItem
   * object.
   * @param {string} index - The `index` parameter is a string that represents the specific property of a
   * `MenuItem` object that needs to be updated. It is used to access and modify the corresponding value
   * of the `key` property in the `itemsMenu` object. If the `index` parameter is equal to `'permissions
   */
  function updateValue(key: string, value: string | number | boolean, index: string) {
    let itemsMenuDB: Record<string, MenuItem> = Object.assign({}, itemsMenu);
    !!value && itemsMenuDB[key] && (itemsMenuDB[key][index] = value);
    setItemsMenu(itemsMenuDB);
    index === 'permissions' && setKeySelect(Date.now());
  }

  /**
   * This function updates the position of an item in a menu based on a given key and order.
   * @param {string} key - a string representing the key of an item in a menu
   * @param {string | number} order - The order parameter is a string or number that represents the
   * position of an item in a menu. It is used to update the position property of an item in the
   * itemsMenu object. If the order parameter is an empty string, the position property of the item is
   * set to 0.
   */
  function orderPosition(key: string, order: string | number): void {
    let itemsMenuToOrder = Object.assign({}, itemsMenu);
    itemsMenuToOrder[key].position = order !== '' ? parseInt(String(order)) : 0;
    itemsMenu[key].position = itemsMenuToOrder[key].position;
    setItemsMenu(itemsMenuToOrder);
  }

  /**
   * The function filters a menu object based on the checked property of its items and returns a new
   * object with only the checked items.
   * @param menu - The `menu` parameter is an object of type `Record<string, MenuItem>`. This means that
   * it is an object with string keys and values of type `MenuItem`. The `MenuItem` type is not defined
   * in the code snippet, but it can be assumed that it represents some kind of menu item
   * @returns The function `filterMenu` returns a filtered version of the `menu` object, containing only
   * the items that have the `checked` property set to `true`. The filtered object is assigned to the
   * `menuFilter` variable and then returned.
   */
  const filterMenu = (menu: Record<string, MenuItem>) => {
    let menuFilter: Record<string, MenuItem> = {};
    for (let key in menu) {
      if (menu[key].checked) {
        menuFilter[key] = menu[key];
      }
    }
    return menuFilter;
  };

  /**
   * This function submits a menu order and updates it in the database, displaying loading and success
   * messages through a message service.
   */
  async function submit() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });
    let menu = orderItemsMenu();

    let newMenu = { itemsMenu: filterMenu(menu) };
    if (organization !== 1) {
      let token = await GetTokenUserFirebase();
      await Actions.put(`api/events/${event._id}?token=${token}`, newMenu);
    } else {
      let updateOrganization: { _id: string; itemsMenu: Record<string, MenuItem> } = {
        ...organizationObj,
        itemsMenu: { ...menu },
      };
      await OrganizationApi.editMenu({ itemsMenu: menu }, updateOrganization._id);
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

  /**
   * This function orders menu items based on their position and returns a copy of the ordered menu.
   * @returns a copy of the `itemsMenuData` object, which is a sorted version of the `itemsMenu` object.
   * The `itemsMenuData` object is created by iterating through the `items` array, sorting it based on
   * the `position` property of each `MenuItem` object, and then adding each `MenuItem` object to the
   * `itemsMenuData` object with its
   */
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

  /* The `titleheader` constant is being assigned a string value based on a conditional statement. If the
`organization` prop passed to the `useMenuLanding` hook is not equal to `ORGANIZATION_VALUE` (which
is `1`), then the value of `titleheader` is `'Habilitar secciones del evento'`. Otherwise, if the
`organization` prop is equal to `ORGANIZATION_VALUE`, the value of `titleheader` is `'Secciones a
habilitar para cada evento'`. This constant is likely being used to display a header title in the UI
based on the value of the `organization` prop. */

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
