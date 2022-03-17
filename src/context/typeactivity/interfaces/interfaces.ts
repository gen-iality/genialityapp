export interface TypeActivity {
  id: string;
  MainTitle: string;
  title: string;
  description: string;
  image: string;
  nextView: string;
}

export interface typeActivityState {
  openModal: boolean;
  activityOptions: TypeActivity[];
}
