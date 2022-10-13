import Presence from '@components/presence/Presence';
import Logger from '@Utilities/logger';
import { fireRealtime, firestore } from '@helpers/firebase';

export interface IPresencePageProps {
}

const { LOG, ERROR } = Logger('presence');

export function PresencePage (props: IPresencePageProps) {
  

  return (
    <div>
      ok
      <Presence
        userId='paco'
        organizationId='org'
        debuglog={LOG}
        errorlog={ERROR} 
        realtimeDB={fireRealtime}
        firestoreDB={firestore}
      />
    </div>
  );
}
