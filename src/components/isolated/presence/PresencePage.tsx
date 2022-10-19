import Presence from '@components/presence/Presence';
import Logger from '@Utilities/logger';
import { fireRealtime } from '@helpers/firebase';

type Data = {
  userId: string;
  organizationId: string;
};

export interface IPresencePageProps {
}

const { LOG, ERROR } = Logger('presence');
const { LOG: GLOG, ERROR: GERROR } = Logger('presence-global');

export function PresencePage (props: IPresencePageProps) {
  const data: Data = {
    userId: 'paco',
    organizationId: 'orgx2',
  }  

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
      <Presence<Data>
        global
        data={data}
        // userId='paco'
        // organizationId='org'
        debuglog={GLOG}
        errorlog={GERROR}
        realtimeDB={fireRealtime}
        collectionId={'paco'}
      />
    </div>
  );
}
