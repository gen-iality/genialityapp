import { useState, useEffect, useContext, useRef, type FunctionComponent } from 'react';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import AgendaContext from '@context/AgendaContext';
import HeaderColumnswithContext from '../HeaderColumns';

export interface HtmlActivityProps {};

const HtmlActivity: FunctionComponent<HtmlActivityProps> = () => {
  const [activityState, setActivityState] = useState<any>();
  const [htmlData, setHtmlData] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);
  const cAgenda = useContext(AgendaContext);

  useEffect(() => {
    setActivityState(cAgenda);
    console.log('currentActivity', cAgenda);
  }, [cAgenda]);
  
  useEffect(() => {
    if (!activityState) return;
    setHtmlData(activityState.meeting_id || '<em>Contenido no <b>establecido</b></em>.');
  }, [activityState?.meeting_id]);

  useEffect(() => {
    if (!ref.current) return;
    if (!htmlData.trim()) return;
    if (htmlData !== ref.current.innerHTML) {
      console.debug('Update innerHTML');
      ref.current.innerHTML = htmlData;
    }
  }, [ref.current, htmlData]);

  return (
    <>
      <HeaderColumnswithContext isVisible={true} activityState={activityState} />
      <div ref={ref} style={{ width: '100%' }} />
    </>
  );
};

export default HtmlActivity;
