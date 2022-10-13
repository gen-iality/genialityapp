import PresenceLocal from '@components/presence/PresenceLocal';

export interface IPresencePageProps {
}

export function PresencePage (props: IPresencePageProps) {
  

  return (
    <div>
      ok
      <PresenceLocal userId='paco' organizationId='org'/>
    </div>
  );
}
