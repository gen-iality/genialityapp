import Presence from '@components/presence/Presence';
import Logger from '@Utilities/logger';
import { fireRealtime } from '@helpers/firebase';

export interface IPresencePageProps {
}

const { LOG, ERROR } = Logger('presence');
const { LOG: GLOG, ERROR: GERROR } = Logger('presence-global');

export function PresencePage (props: IPresencePageProps) {
  

  return (
    <div>
      ok
      {/* <Presence
        userId='paco'
        organizationId='org'
        debuglog={LOG}
        errorlog={ERROR} 
        realtimeDB={fireRealtime}
        collectionNameCreator={() => ({ collectionName: 'local', childName: 'paco'})}
      /> */}
      <Presence
        global
        userId='paco'
        organizationId='org'
        debuglog={GLOG}
        errorlog={GERROR}
        realtimeDB={fireRealtime}
        collectionNameCreator={() => ({ collectionName: 'global', childName: 'paco'})}
      />
    </div>
  );
}
