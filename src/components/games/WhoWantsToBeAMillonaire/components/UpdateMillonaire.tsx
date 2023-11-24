import { Tabs } from 'antd';
import GeneralConfiguration from './GeneralConfiguration';
import AppearanceSettings from './AppearanceSettings';
import QuestionBank from './QuestionBank';
import PlayMillonaireCMS from './PlayMillonaireCMS';
import GeneratedData from './GeneratedData';
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
        <PlayMillonaireCMS />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Datos generados' key='5'>
        <GeneratedData />
      </Tabs.TabPane>
    </Tabs>
  );
}
