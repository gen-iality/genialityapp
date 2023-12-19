import { MenuItem } from '../interfaces/menuLandingProps';

export const sortByPosition = (menuItems: MenuItem[]): MenuItem[] => {
  return menuItems.sort((a, b) => {
    if (a.position === b.position) {
      // En caso de empate, comparar por nombre (opcional)
      return a.name.localeCompare(b.name);
    }
    return a.position - b.position;
  });
};

export const orderByChecked = (array: MenuItem[]) => {
  const checkedTrue = array.filter((item) => item.checked);
  const checkedFalse = array.filter((item) => !item.checked);

  return checkedTrue.concat(checkedFalse);
};
