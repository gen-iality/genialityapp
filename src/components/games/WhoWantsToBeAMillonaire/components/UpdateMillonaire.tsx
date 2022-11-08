import { Tabs } from 'antd';
import GeneralConfiguration from './GeneralConfiguration';
import AppearanceSettings from './AppearanceSettings';
import PlayMillonaire from './PlayMillonaire';
import QuestionBank from './QuestionBank';
export default function UpdateMillonaire() {
  return (
    <Tabs>
      <Tabs.TabPane tab='Configuracion general' key='1'>
        <GeneralConfiguration />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Personalización' key='2'>
        <AppearanceSettings />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Banco de preguntas' key='3'>
        <QuestionBank />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Jugar' key='4'>
        <PlayMillonaire />
      </Tabs.TabPane>
    </Tabs>
  );
}
