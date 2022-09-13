import { Divider, List, Typography, Button } from 'antd';
import { ReadFilled } from '@ant-design/icons';

const data = [
  <div>
    <ReadFilled className='list-icon' />
    <span>Racing car sprays burning fuel into crowd.</span>
  </div>,
  'JAPANESE PRICESS MARRIED WITH COMMOONER',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const ActivitiesList = () => {
  return (
    <List
      size='small'
      header={<h2>LECCIONES DEL CURSO</h2>}
      bordered
      dataSource={data}
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
};
export default ActivitiesList;
