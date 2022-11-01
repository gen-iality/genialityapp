import { Tabs } from 'antd';
import GeneralConfiguration from './GeneralConfiguration';
import AppearanceSettings from './AppearanceSettings';
import PlayMillonaire from './PlayMillonaire';
export default function UpdateMillonaire() {
  return (
    <Tabs>
      <Tabs.TabPane tab='Configuracion general' key='1'>
        <GeneralConfiguration />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Personalización' key='2'>
        <AppearanceSettings />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Jugar' key='3'>
        <PlayMillonaire />
      </Tabs.TabPane>
    </Tabs>
  );
}
