import { useState, useEffect, useRef, type FunctionComponent } from 'react';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import HeaderColumnswithContext from '../HeaderColumns';

export interface HtmlActivityProps {};

const HtmlActivity: FunctionComponent<HtmlActivityProps> = () => {
  const { currentActivity } = useHelper();

  const [activityState, setActivityState] = useState<any>();
  const [htmlData, setHtmlData] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivityState(currentActivity);
  }, [currentActivity]);
  
  useEffect(() => {
    if (!activityState) return;
    setHtmlData(activityState.meeting_id || '<em>Contenido no <b>establecido</b></em>.');
  }, [activityState]);

  useEffect(() => {
    if (!ref.current) return;
    if (!htmlData.trim()) return;
    if (htmlData !== ref.current.innerHTML) {
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
