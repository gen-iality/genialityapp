import { GroupEvent, OptionType } from '../interface/group.interfaces';

export const getGroupsToSelect = (groupEvent: GroupEvent[]): OptionType[] => {
  const optionGroupSelect = groupEvent.map((option) => ({ label: option.name, value: option._id }));
  
  return optionGroupSelect;
};
