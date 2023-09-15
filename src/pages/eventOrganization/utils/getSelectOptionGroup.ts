import { GroupEventMongo } from '../interface/group.interfaces';

export const getSelectOptionGroups = (groupEvens: GroupEventMongo[]) => {
  return groupEvens.map(({ item, label, value }) => ({
    item,
    label: label + ` (${item.amount_events})`,
    value,
    disabled: item.amount_events === 0,
  }));
};
