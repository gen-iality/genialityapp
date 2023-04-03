export interface IRequestCard {
  received : boolean;
  data: any;
  fetching: boolean;
  setFetching: (param: boolean) => void;
  notificacion: any;
  setSendRespuesta: (param: boolean) => void;
}
