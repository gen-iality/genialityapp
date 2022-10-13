import Presence from '@components/presence/Presence';

export interface IPresencePageProps {
}

export function PresencePage (props: IPresencePageProps) {
  

  return (
    <div>
      ok
      <Presence.Local userId='paco' organizationId='org'/>
    </div>
  );
}
