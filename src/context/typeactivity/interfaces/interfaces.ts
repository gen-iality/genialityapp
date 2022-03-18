export interface ProviderOptions {
  key: string;
  title: string;
  description: string;
  image: string;
}
export interface TypeOptions {
  key: string;
  title: string;
  description: string;
  image: string;
  providerOptions?: ProviderOptions[];
}

export interface TypeActivity {
  id: string;
  nextView: string;
  prevView: string;
  MainTitle: string;
  typeOptions: TypeOptions[];
}

export interface TypeActivityState {
  openModal: boolean;
  activityOptions: TypeActivity | any;
}

// export interface TypeActivityData {
//   [key: string]: TypeActivity;
// }
