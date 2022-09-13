import { Divider, List, Typography, Button, Avatar } from 'antd';
import { ReadFilled } from '@ant-design/icons';

const data = [
  {
    title: 'Nombre Colaborador',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const HostList = () => {
  return (
    <List
      size='small'
      header={<h3>COLABORADORES</h3>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          {' '}
          <List.Item.Meta
            avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
            // title={<a href='https://ant.design'>{item.title}</a>}
            description={
              <>
                <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.title}</p>
                <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>Profesor</p>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};
export default HostList;
