export interface GroupEvent {
  name: string;
  accest_to_all_organization: boolean;
}

export interface GroupEventMongo extends OptionType {
  item: {
    _id: string;
    name: string;
    organization_id: string;
    updated_at: string;
    created_at: string;
    amount_events: number;
    accest_to_all_organization: boolean;
  };
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}
