import categories from './categories/reducers';
import types from './types/reducers';
import rols from './rols/reducers';
import user from './user/reducers';
import event from './event/reducers';
import permissions from './permissions/reducers';
import stage from './stage/reducers';
import survey from './survey/reducers';
import notifications from './notifications/reducers';
import tabs from './tabs/reducers';
import notificationsNetReducer from './notifyNetworking/reducers';
import topBannerReducer from './topBanner/reducers';
import virtualConferenceReducer from './virtualconference/reducers';
import viewPerfilReducer from './viewPerfil/reducers';
import spaceNetworkingReducer from './networking/reducers'

export default {
  categories,
  types,
  user,
  rols,
  permissions,
  event,
  stage,
  survey,
  notifications,
  tabs,
  notificationsNetReducer,
  topBannerReducer,
  virtualConferenceReducer,
  viewPerfilReducer,
  spaceNetworkingReducer
};
